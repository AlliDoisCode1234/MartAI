'use client';

/**
 * Content Editor Page
 *
 * Component Hierarchy:
 * App → StudioLayout → ContentEditorPage
 *
 * Full editor with content editing, SEO score sidebar, and scheduling.
 */

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Icon,
  Skeleton,
  Badge,
  Textarea,
  useToast,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  useDisclosure,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { StudioLayout, SEOScorePanel, MarkdownPreview } from '@/src/components/studio';
import { IntegrationsPanel } from '@/src/components/content';
import {
  FiArrowLeft,
  FiSave,
  FiRefreshCw,
  FiCheck,
  FiCalendar,
  FiClock,
  FiEye,
  FiEdit3,
  FiExternalLink,
} from 'react-icons/fi';
import { FaWordpress } from 'react-icons/fa';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Id } from '@/convex/_generated/dataModel';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  scoreContentRealTime,
  countWords,
  countH2s,
  countLinks,
  countKeywordsUsed,
} from '@/lib/seoScoring';
import type { SEOScoreResult } from '@/lib/seoScoring';

export default function ContentEditorPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const contentId = params.contentId as string;

  // Fetch content piece
  const contentPiece = useQuery(api.contentPieces.getById, {
    contentPieceId: contentId as Id<'contentPieces'>,
  });

  // Check for CMS connections (Wave 3: CMS capability flags)
  const connections = useQuery(
    api.integrations.platformConnections.listConnections,
    contentPiece?.projectId ? { projectId: contentPiece.projectId } : 'skip'
  );
  const hasCmsConnection = (connections?.length ?? 0) > 0; // Reserved for future CMS gate

  const updateMutation = useMutation(api.contentPieces.update);
  const scheduleMutation = useMutation(api.contentPieces.schedule);
  const unscheduleMutation = useMutation(api.contentPieces.unschedule);

  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [isScheduling, setIsScheduling] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [liveScore, setLiveScore] = useState<SEOScoreResult | null>(null);

  // Timer constants (ms)
  const SCORE_DEBOUNCE_MS = 300;
  const AUTO_SAVE_DEBOUNCE_MS = 2000;
  const SAVED_INDICATOR_MS = 3000;
  const TARGET_WORD_COUNT = 1200;
  // Dynamic target: how many keywords the user provided (not a hardcoded number)

  // Refs for debounce timers
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scoreTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedIndicatorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasHydratedRef = useRef(false);
  const isSavingRef = useRef(false);
  const latestContentRef = useRef('');

  // WordPress publishing
  const { isOpen: isWpModalOpen, onOpen: onWpModalOpen, onClose: onWpModalClose } = useDisclosure();
  const [isPublishingToWp, setIsPublishingToWp] = useState(false);
  const [wpPublishResult, setWpPublishResult] = useState<{
    success: boolean;
    postUrl?: string;
    error?: string;
  } | null>(null);

  // Get WordPress connection specifically
  const wpConnection = useQuery(
    api.integrations.platformConnections.getConnection,
    contentPiece?.projectId
      ? { projectId: contentPiece.projectId, platform: 'wordpress' as const }
      : 'skip'
  );
  const hasWordPress = wpConnection?.isValid ?? false;

  // WordPress publish action
  const publishToWordPress = useAction(
    api.publishing.wordpressActions.publishContentPieceToWordPress
  );

  // Sync content from query — initial load ONLY
  // After hydration, local state owns content to prevent auto-save race condition.
  // See: Sprint 1 Remediation LDD, Fix #1
  useEffect(() => {
    if (contentPiece?.content && !hasHydratedRef.current) {
      setContent(contentPiece.content);
      hasHydratedRef.current = true;
    }
  }, [contentPiece?.content]);

  // ── Real-Time SEO Scoring (300ms debounce) ───────────────────────
  const scoringInput = useMemo(
    () => ({
      outline: contentPiece?.h2Outline || [],
      keywords: contentPiece?.keywords || [],
      targetWordCount: TARGET_WORD_COUNT,
    }),
    [contentPiece?.h2Outline, contentPiece?.keywords]
  );

  useEffect(() => {
    if (!content) {
      setLiveScore(null);
      return;
    }
    if (scoreTimerRef.current) clearTimeout(scoreTimerRef.current);
    scoreTimerRef.current = setTimeout(() => {
      const result = scoreContentRealTime({
        content,
        ...scoringInput,
      });
      setLiveScore(result);
    }, SCORE_DEBOUNCE_MS);
    return () => {
      if (scoreTimerRef.current) clearTimeout(scoreTimerRef.current);
    };
  }, [content, scoringInput]);

  // ── Auto-Save (2s debounce) ──────────────────────────────────────
  const performSave = useCallback(
    async (contentToSave: string, silent = false) => {
      if (!contentPiece) return;
      if (isSavingRef.current) {
        if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = setTimeout(() => performSave(contentToSave, silent), 1000);
        return;
      }
      isSavingRef.current = true;
      const saving = !silent;
      if (saving) setIsSaving(true);
      setSaveStatus('saving');
      try {
        await updateMutation({
          contentPieceId: contentPiece._id,
          content: contentToSave,
          wordCount: countWords(contentToSave),
        });
        if (latestContentRef.current === contentToSave) {
          setHasChanges(false);
        }
        setSaveStatus('saved');
        // Clear "saved" indicator after 3s
        if (savedIndicatorTimerRef.current) clearTimeout(savedIndicatorTimerRef.current);
        savedIndicatorTimerRef.current = setTimeout(
          () => setSaveStatus('idle'),
          SAVED_INDICATOR_MS
        );
        if (!silent) {
          toast({ title: 'Content saved', status: 'success', duration: 2000 });
        }
      } catch (e) {
        setSaveStatus('idle');
        if (!silent) {
          toast({ title: 'Save failed', status: 'error', duration: 3000 });
        }
      }
      isSavingRef.current = false;
      if (saving) setIsSaving(false);
    },
    [contentPiece, updateMutation, toast]
  );

  const handleContentChange = (value: string) => {
    setContent(value);
    latestContentRef.current = value;
    setHasChanges(true);
    setSaveStatus('idle');
    // Schedule auto-save
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      performSave(value, true); // silent auto-save
    }, AUTO_SAVE_DEBOUNCE_MS);
  };

  // Manual save
  const handleSave = () => performSave(content, false);

  // ── Unsaved Changes Protection ───────────────────────────────────
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      if (scoreTimerRef.current) clearTimeout(scoreTimerRef.current);
      if (savedIndicatorTimerRef.current) clearTimeout(savedIndicatorTimerRef.current);
    };
  }, []);

  const handleMarkPublished = async () => {
    if (!contentPiece) return;
    try {
      await updateMutation({
        contentPieceId: contentPiece._id,
        status: 'published',
      });
      toast({
        title: 'Content marked as published',
        description: 'Visible in your published library',
        status: 'success',
        duration: 3000,
      });
      router.push('/studio/library');
    } catch (e) {
      toast({
        title: 'Publish failed',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handlePublishToWordPress = async () => {
    console.log('[WP UI] handlePublishToWordPress called');
    if (!contentPiece) {
      console.log('[WP UI] ABORT: No content piece');
      return;
    }

    console.log('[WP UI] Starting publish:', {
      contentPieceId: contentPiece._id,
      projectId: contentPiece.projectId,
      title: contentPiece.title,
    });

    setIsPublishingToWp(true);
    setWpPublishResult(null);

    try {
      console.log('[WP UI] Calling publishToWordPress action...');
      const result = await publishToWordPress({
        contentPieceId: contentPiece._id,
        projectId: contentPiece.projectId,
        options: {
          status: 'publish',
        },
      });

      console.log('[WP UI] Action returned:', result);
      setWpPublishResult(result);

      if (result.success) {
        console.log('[WP UI] SUCCESS:', result.postUrl);
        toast({
          title: 'Published to WordPress!',
          description: 'Your content is now live.',
          status: 'success',
          duration: 5000,
        });
      } else {
        console.log('[WP UI] FAILED:', result.error);
        toast({
          title: 'WordPress publish failed',
          description: result.error,
          status: 'error',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('[WP UI] EXCEPTION:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      setWpPublishResult({ success: false, error: message });
      toast({
        title: 'WordPress publish failed',
        description: message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      console.log('[WP UI] Publish flow complete');
      setIsPublishingToWp(false);
    }
  };

  const handleSchedule = async () => {
    if (!contentPiece || !scheduleDate) return;
    setIsScheduling(true);
    try {
      const dateTime = new Date(`${scheduleDate}T${scheduleTime}`);
      await scheduleMutation({
        contentPieceId: contentPiece._id,
        publishDate: dateTime.getTime(),
      });
      toast({
        title: 'Content scheduled',
        description: `Will publish on ${dateTime.toLocaleDateString()} at ${dateTime.toLocaleTimeString()}`,
        status: 'success',
        duration: 4000,
      });
      onClose();
    } catch (e: unknown) {
      toast({
        title: 'Schedule failed',
        description: 'An error occurred while scheduling. Please try again.',
        status: 'error',
        duration: 3000,
      });
    }
    setIsScheduling(false);
  };

  const handleUnschedule = async () => {
    if (!contentPiece) return;
    try {
      await unscheduleMutation({
        contentPieceId: contentPiece._id,
      });
      toast({
        title: 'Schedule cancelled',
        description: 'Reverted to draft status',
        status: 'info',
        duration: 3000,
      });
    } catch (e) {
      toast({
        title: 'Failed to unschedule',
        status: 'error',
        duration: 3000,
      });
    }
  };

  // Set default schedule date to tomorrow
  useEffect(() => {
    if (!scheduleDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setScheduleDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [scheduleDate]);

  // Loading state
  if (contentPiece === undefined) {
    return (
      <StudioLayout>
        <VStack align="stretch" spacing={6}>
          <Skeleton height="40px" width="300px" />
          <HStack align="start" spacing={6}>
            <Skeleton height="500px" flex={1} />
            <Skeleton height="400px" width="280px" />
          </HStack>
        </VStack>
      </StudioLayout>
    );
  }

  // Not found state
  if (contentPiece === null) {
    return (
      <StudioLayout>
        <VStack spacing={8} py={20} textAlign="center">
          <Heading size="lg" color="white">
            Content Not Found
          </Heading>
          <Text color="gray.500">This content piece may have been deleted or moved.</Text>
          <Link href="/studio/library">
            <Button
              variant="ghost"
              color="gray.400"
              leftIcon={<Icon as={FiArrowLeft} />}
              _hover={{ color: 'white' }}
            >
              Back to Library
            </Button>
          </Link>
        </VStack>
      </StudioLayout>
    );
  }

  // Generating state
  if (contentPiece.status === 'generating') {
    return (
      <StudioLayout>
        <VStack spacing={8} py={20} textAlign="center">
          <Box bg="rgba(255, 157, 0, 0.1)" borderRadius="full" p={6} animation="pulse 2s infinite">
            <Icon as={FiRefreshCw} boxSize={12} color="#FF9D00" />
          </Box>
          <Heading size="lg" color="white">
            Generating Content...
          </Heading>
          <Text color="gray.500">{contentPiece.title}</Text>
          <Text color="gray.600" fontSize="sm">
            This may take a minute. Refresh the page to check progress.
          </Text>
        </VStack>
      </StudioLayout>
    );
  }

  // Calculate metrics from content (using shared utilities)
  const wordCount = countWords(content);
  const h2Count = countH2s(content);
  const linkCount = countLinks(content);

  // Effective SEO score: live score (real-time) or stored score (fallback)
  const effectiveSeoScore = liveScore?.score ?? contentPiece.seoScore ?? 0;

  return (
    <StudioLayout>
      <VStack align="stretch" spacing={6}>
        {/* Header */}
        <HStack justify="space-between" flexWrap="wrap" gap={4}>
          <HStack spacing={4}>
            <Link href="/studio/library">
              <Button
                variant="ghost"
                size="sm"
                color="gray.400"
                leftIcon={<Icon as={FiArrowLeft} />}
                _hover={{ color: 'white' }}
              >
                Library
              </Button>
            </Link>
            <Box>
              <HStack spacing={2}>
                <Heading size="md" color="white" noOfLines={1}>
                  {contentPiece.title}
                </Heading>
                <Badge bg="rgba(255, 157, 0, 0.1)" color="#FF9D00" textTransform="capitalize">
                  {contentPiece.contentType}
                </Badge>
                <Badge
                  bg={
                    contentPiece.status === 'published'
                      ? 'rgba(34, 197, 94, 0.2)'
                      : contentPiece.status === 'approved'
                        ? 'rgba(59, 130, 246, 0.2)'
                        : contentPiece.status === 'scheduled'
                          ? 'rgba(139, 92, 246, 0.2)'
                          : 'rgba(255, 255, 255, 0.1)'
                  }
                  color={
                    contentPiece.status === 'published'
                      ? '#22C55E'
                      : contentPiece.status === 'approved'
                        ? '#3B82F6'
                        : contentPiece.status === 'scheduled'
                          ? '#8B5CF6'
                          : 'gray.400'
                  }
                  textTransform="capitalize"
                >
                  {contentPiece.status}
                </Badge>
              </HStack>
              <Text color="gray.500" fontSize="sm">
                {wordCount.toLocaleString()} words
                {saveStatus === 'saving' && (
                  <Text as="span" color="#FF9D00" ml={1}>
                    • Saving...
                  </Text>
                )}
                {saveStatus === 'saved' && (
                  <Text as="span" color="#22C55E" ml={1}>
                    • Saved
                  </Text>
                )}
                {hasChanges && saveStatus === 'idle' && (
                  <Text as="span" color="gray.400" ml={1}>
                    • Unsaved changes
                  </Text>
                )}
                {contentPiece.publishDate && contentPiece.status === 'scheduled' && (
                  <>
                    {' • '}
                    <Icon as={FiClock} boxSize={3} />
                    {' ' + new Date(contentPiece.publishDate).toLocaleDateString()}
                  </>
                )}
              </Text>
            </Box>
          </HStack>
          <HStack spacing={2}>
            <Button
              variant="ghost"
              color="gray.400"
              leftIcon={<Icon as={FiSave} />}
              isLoading={isSaving}
              onClick={handleSave}
              isDisabled={!hasChanges}
            >
              Save
            </Button>
            {contentPiece.status === 'scheduled' ? (
              <Button
                variant="outline"
                borderColor="gray.500"
                color="gray.400"
                leftIcon={<Icon as={FiCalendar} />}
                onClick={handleUnschedule}
              >
                Unschedule
              </Button>
            ) : contentPiece.status !== 'published' ? (
              <>
                <Button
                  variant="outline"
                  borderColor="#8B5CF6"
                  color="#8B5CF6"
                  leftIcon={<Icon as={FiCalendar} />}
                  _hover={{ bg: 'rgba(139, 92, 246, 0.1)' }}
                  onClick={onOpen}
                >
                  Schedule
                </Button>
                {hasWordPress ? (
                  <Button
                    bg="linear-gradient(135deg, #21759b, #1a5a7a)"
                    color="white"
                    leftIcon={<Icon as={FaWordpress} />}
                    _hover={{ opacity: 0.9 }}
                    onClick={onWpModalOpen}
                  >
                    Publish
                  </Button>
                ) : (
                  <Button
                    bg="linear-gradient(135deg, #22C55E, #16A34A)"
                    color="white"
                    leftIcon={<Icon as={FiCheck} />}
                    _hover={{ opacity: 0.9 }}
                    onClick={handleMarkPublished}
                  >
                    Mark Published
                  </Button>
                )}
              </>
            ) : (
              /* Already published: allow re-push to CMS if connected */
              hasWordPress && (
                <Button
                  variant="outline"
                  borderColor="#21759b"
                  color="#21759b"
                  leftIcon={<Icon as={FaWordpress} />}
                  _hover={{ bg: 'rgba(33, 117, 155, 0.1)' }}
                  onClick={onWpModalOpen}
                >
                  Re-publish to CMS
                </Button>
              )
            )}
          </HStack>
        </HStack>

        {/* Editor + SEO Panel */}
        <HStack align="start" spacing={6}>
          {/* Editor */}
          <Box
            bg="rgba(255, 255, 255, 0.03)"
            border="1px solid rgba(255, 255, 255, 0.08)"
            borderRadius="16px"
            flex={1}
            minH="600px"
            display="flex"
            flexDirection="column"
          >
            <Box p={4} borderBottom="1px solid rgba(255, 255, 255, 0.08)">
              <HStack spacing={2} justify="space-between">
                <HStack spacing={2}>
                  <Badge bg="rgba(255, 255, 255, 0.1)" color="gray.400">
                    Markdown
                  </Badge>
                  <Divider orientation="vertical" h={4} />
                  <Text color="gray.500" fontSize="sm">
                    {h2Count} sections
                  </Text>
                </HStack>
                <HStack spacing={1}>
                  <Button
                    size="sm"
                    variant={!showPreview ? 'solid' : 'ghost'}
                    bg={!showPreview ? 'rgba(255, 157, 0, 0.2)' : 'transparent'}
                    color={!showPreview ? '#FF9D00' : 'gray.500'}
                    leftIcon={<Icon as={FiEdit3} />}
                    onClick={() => setShowPreview(false)}
                    _hover={{ bg: 'rgba(255, 157, 0, 0.15)' }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant={showPreview ? 'solid' : 'ghost'}
                    bg={showPreview ? 'rgba(139, 92, 246, 0.2)' : 'transparent'}
                    color={showPreview ? '#8B5CF6' : 'gray.500'}
                    leftIcon={<Icon as={FiEye} />}
                    onClick={() => setShowPreview(true)}
                    _hover={{ bg: 'rgba(139, 92, 246, 0.15)' }}
                  >
                    Preview
                  </Button>
                </HStack>
              </HStack>
            </Box>
            {showPreview ? (
              <Box flex={1} overflow="auto" minH="550px">
                <MarkdownPreview content={content} />
              </Box>
            ) : (
              <Textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Start writing your content here..."
                bg="transparent"
                border="none"
                _focus={{ boxShadow: 'none' }}
                color="gray.200"
                fontSize="md"
                lineHeight="1.8"
                minH="550px"
                flex={1}
                p={6}
                resize="none"
                _placeholder={{ color: 'gray.600' }}
              />
            )}
          </Box>

          {/* Sidebar */}
          <VStack align="stretch" spacing={4} w="280px">
            {/* SEO Score Panel — live-updated as user types */}
            <SEOScorePanel
              seoScore={effectiveSeoScore}
              wordCount={wordCount}
              targetWordCount={TARGET_WORD_COUNT}
              h2Count={h2Count}
              keywordCount={countKeywordsUsed(content, contentPiece.keywords)}
              targetKeywords={contentPiece.keywords?.length ?? 0}
              internalLinkCount={linkCount}
              qualityMetrics={liveScore?.metrics ?? contentPiece.qualityMetrics}
            />

            {/* Integrations Panel */}
            <IntegrationsPanel
              projectId={contentPiece.projectId}
              onPublish={(platform) => {
                toast({
                  title: `Publishing to ${platform}...`,
                  status: 'info',
                  duration: 2000,
                });
              }}
            />
          </VStack>
        </HStack>
      </VStack>

      {/* Schedule Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="rgba(0, 0, 0, 0.8)" backdropFilter="blur(4px)" />
        <ModalContent bg="#1A1A1A" border="1px solid rgba(255, 255, 255, 0.1)" borderRadius="16px">
          <ModalHeader color="white">Schedule Content</ModalHeader>
          <ModalCloseButton color="gray.400" />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel color="gray.300">Publish Date</FormLabel>
                <Input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  bg="rgba(255, 255, 255, 0.05)"
                  border="1px solid rgba(255, 255, 255, 0.1)"
                  color="white"
                  _focus={{ borderColor: '#8B5CF6', boxShadow: '0 0 0 1px #8B5CF6' }}
                />
              </FormControl>
              <FormControl>
                <FormLabel color="gray.300">Time</FormLabel>
                <Input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  bg="rgba(255, 255, 255, 0.05)"
                  border="1px solid rgba(255, 255, 255, 0.1)"
                  color="white"
                  _focus={{ borderColor: '#8B5CF6', boxShadow: '0 0 0 1px #8B5CF6' }}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" color="gray.400" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              bg="linear-gradient(135deg, #8B5CF6, #6D28D9)"
              color="white"
              leftIcon={<Icon as={FiCalendar} />}
              onClick={handleSchedule}
              isLoading={isScheduling}
              _hover={{ opacity: 0.9 }}
            >
              Schedule
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* WordPress Publish Modal */}
      <Modal isOpen={isWpModalOpen} onClose={onWpModalClose} isCentered size="md">
        <ModalOverlay bg="rgba(0, 0, 0, 0.8)" backdropFilter="blur(4px)" />
        <ModalContent bg="#1A1A1A" border="1px solid rgba(255, 255, 255, 0.1)" borderRadius="16px">
          <ModalHeader color="white">
            <HStack spacing={2}>
              <Icon as={FaWordpress} color="#21759b" />
              <Text>Publish to WordPress</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="gray.400" />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              {!wpPublishResult ? (
                <>
                  <Box
                    bg="rgba(33, 117, 155, 0.1)"
                    border="1px solid rgba(33, 117, 155, 0.3)"
                    borderRadius="md"
                    p={4}
                  >
                    <VStack spacing={2} align="start">
                      <Text color="gray.300" fontSize="sm">
                        Publishing to:
                      </Text>
                      <Text color="white" fontWeight="medium">
                        {wpConnection?.siteName || wpConnection?.siteUrl}
                      </Text>
                    </VStack>
                  </Box>
                  <Box
                    bg="rgba(255, 255, 255, 0.03)"
                    border="1px solid rgba(255, 255, 255, 0.1)"
                    borderRadius="md"
                    p={4}
                  >
                    <VStack spacing={2} align="start">
                      <Text color="gray.400" fontSize="sm">
                        Content:
                      </Text>
                      <Text color="white" fontWeight="medium" noOfLines={2}>
                        {contentPiece?.title}
                      </Text>
                      <Badge bg="rgba(255, 157, 0, 0.1)" color="#FF9D00">
                        {wordCount.toLocaleString()} words
                      </Badge>
                    </VStack>
                  </Box>
                  <Text color="gray.500" fontSize="sm">
                    This will publish your content directly to WordPress as a live post/page.
                  </Text>
                </>
              ) : wpPublishResult.success ? (
                <VStack spacing={4} py={4}>
                  <Box bg="rgba(34, 197, 94, 0.1)" borderRadius="full" p={4}>
                    <Icon as={FiCheck} boxSize={8} color="green.400" />
                  </Box>
                  <Text color="white" fontWeight="medium">
                    Published Successfully!
                  </Text>
                  <Button
                    as="a"
                    href={wpPublishResult.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    borderColor="#21759b"
                    color="#21759b"
                    leftIcon={<Icon as={FiExternalLink} />}
                    _hover={{ bg: 'rgba(33, 117, 155, 0.1)' }}
                  >
                    View on WordPress
                  </Button>
                </VStack>
              ) : (
                <VStack spacing={4} py={4}>
                  <Box bg="rgba(239, 68, 68, 0.1)" borderRadius="full" p={4}>
                    <Icon as={FiRefreshCw} boxSize={8} color="red.400" />
                  </Box>
                  <Text color="white" fontWeight="medium">
                    Publish Failed
                  </Text>
                  <Text color="gray.400" fontSize="sm" textAlign="center">
                    {wpPublishResult.error}
                  </Text>
                </VStack>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            {!wpPublishResult ? (
              <>
                <Button variant="ghost" color="gray.400" mr={3} onClick={onWpModalClose}>
                  Cancel
                </Button>
                <Button
                  bg="linear-gradient(135deg, #21759b, #1a5a7a)"
                  color="white"
                  leftIcon={<Icon as={FaWordpress} />}
                  onClick={handlePublishToWordPress}
                  isLoading={isPublishingToWp}
                  loadingText="Publishing..."
                  _hover={{ opacity: 0.9 }}
                >
                  Publish Now
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                color="gray.400"
                onClick={() => {
                  onWpModalClose();
                  if (wpPublishResult.success) {
                    router.push('/studio/library');
                  }
                  setWpPublishResult(null);
                }}
              >
                {wpPublishResult.success ? 'Done' : 'Close'}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </StudioLayout>
  );
}
