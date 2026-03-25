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
  Progress,
} from '@chakra-ui/react';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { StudioLayout, SEOScorePanel, MarkdownPreview, ContentSuggestionsPanel } from '@/src/components/studio';
import { CoachTrainingOverlay } from '@/src/components/studio/CoachTrainingOverlay';
import { RevisionReviewBanner } from '@/src/components/studio/RevisionReviewBanner';
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
  FiZap,
} from 'react-icons/fi';
import { FaWordpress } from 'react-icons/fa';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Id } from '@/convex/_generated/dataModel';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { LexicalEditorComponent, type LexicalEditor } from '@/src/components/LexicalEditor';
import { $getRoot } from 'lexical';
import { $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import {
  scoreContentRealTime,
  countWords,
  countH2s,
  countLinks,
  countKeywordsUsed,
} from '@/lib/seoScoring';
import type { SEOScoreResult } from '@/lib/seoScoring';
import { enhanceInstruction } from '@/lib/instructionEnhancer';

/** Format a timestamp as relative time (e.g. "2 min ago", "3 hours ago") */
function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
import { useProject } from '@/lib/hooks';

// Feedback type for persona learning
type FeedbackType = 'suggestion_accepted' | 'suggestion_dismissed' | 'custom';

export default function ContentEditorPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const contentId = params.contentId as string;

  // Fetch content piece early so we can derive the canonical projectId
  const contentPiece = useQuery(api.contentPieces.getById, {
    contentPieceId: contentId as Id<'contentPieces'>,
  });

  // SEC-001-C: Use the content piece's owning projectId — NOT autoSelect.
  // autoSelect picks from localStorage which may be a different project.
  const { project, projectId } = useProject(contentPiece?.projectId ?? null);

  // Phase 3: Feedback mutation for persona learning
  const submitFeedbackMutation = useMutation(api.contentFeedback.submitFeedback);
  // Phase 3: Secure AI revision action for Phoo Coach custom input
  const reviseWithPersonaAction = useAction(api.contentRevision.reviseWithPersona);

  const handleSuggestionFeedback = useCallback(
    (suggestionId: string | null, feedbackType: FeedbackType, customNote?: string) => {
      if (!projectId) return;
      submitFeedbackMutation({
        projectId: projectId as Id<'projects'>,
        contentPieceId: contentId as Id<'contentPieces'>,
        feedbackType,
        ...(suggestionId ? { suggestionId } : {}),
        ...(customNote ? { customNote } : {}),
      }).catch((err) => {
        // Log failures (e.g., rate limits or RLS blocks) for observability
        console.warn('Failed to submit suggestion feedback:', err);
      });
    },
    [projectId, contentId, submitFeedbackMutation]
  );


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
  const lexicalEditorRef = useRef<LexicalEditor | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [isScheduling, setIsScheduling] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [liveScore, setLiveScore] = useState<SEOScoreResult | null>(null);
  const [pendingRevision, setPendingRevision] = useState<{
    revisedContent: string;
    previousContent: string;
    suggestionTitle: string;
  } | null>(null);

  // COACH-H-004: Snapshot scores before AI revision for implicit signal tracking
  const [preRevisionSnapshot, setPreRevisionSnapshot] = useState<{
    readabilityScore: number;
    wordCount: number;
  } | null>(null);

  // FIX-002: Confirmation modal before accepting AI revision
  const [showAcceptConfirm, setShowAcceptConfirm] = useState(false);

  // Mutation for implicit edit delta tracking
  const recordImplicitSignalMutation = useMutation(api.contentFeedback.recordImplicitSignal);

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

  // ── SEO Scoring Input (hoisted above useCallbacks that depend on it) ──
  const scoringInput = useMemo(
    () => ({
      outline: contentPiece?.h2Outline || [],
      keywords: contentPiece?.keywords || [],
      targetWordCount: TARGET_WORD_COUNT,
      industry: project?.industry,
    }),
    [contentPiece?.h2Outline, contentPiece?.keywords, project?.industry]
  );

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

  // Phase 3: Secure AI-powered content revision (Phoo Coach custom input)
  // Uses Lexical's editor.update() for programmatic content insertion,
  // which feeds through HistoryPlugin giving free Ctrl+Z undo.
  const handleCustomRevision = useCallback(
    async (
      instruction: string,
      options?: { isPreEnhanced?: boolean }
    ): Promise<{ revisedContent: string; previousContent: string } | null> => {
      if (!projectId) return null;
      // Guard: prevent double-submit while a revision is already pending
      if (pendingRevision) return null;
      const previousContent = content;

      // COACH-H-004: Snapshot current scores before AI revision
      setPreRevisionSnapshot({
        readabilityScore: liveScore?.metrics?.readabilityScore ?? 0,
        wordCount: content.split(/\s+/).filter(Boolean).length,
      });

      try {
        // FIX-001: If the instruction is a pre-enhanced fixInstruction from the
        // suggestion panel, skip enhanceInstruction — it's already a precise,
        // crafted prompt with hard numeric targets. Running it through the
        // enhancer would reclassify it (e.g., EXPAND) and replace the "YOU MUST"
        // language with weaker "approximately" language.
        const finalInstruction = options?.isPreEnhanced
          ? instruction
          : enhanceInstruction(instruction, {
              seoScore: liveScore,
              wordCount: content.split(/\s+/).filter(Boolean).length,
              targetWordCount: TARGET_WORD_COUNT,
              keywords: contentPiece?.keywords || [],
              content,
              industry: project?.industry,
            });
        console.log(`[PhooCoach] Instruction (preEnhanced=${!!options?.isPreEnhanced}):`, finalInstruction.slice(0, 200));
        const result = await reviseWithPersonaAction({
          projectId: projectId as Id<'projects'>,
          contentPieceId: contentId as Id<'contentPieces'>,
          instruction: finalInstruction,
          currentContent: content,
          // Pass metadata for GENERATE mode (when editor is empty/minimal)
          title: contentPiece?.title,
          keywords: contentPiece?.keywords,
          contentType: contentPiece?.contentType,
        });
        console.log('[PhooCoach] Action result:', JSON.stringify(result)?.slice(0, 200));
        if (result?.revisedContent) {
          // Store as pending revision for user review instead of auto-applying
          setPendingRevision({
            revisedContent: result.revisedContent,
            previousContent,
            suggestionTitle: instruction.slice(0, 60),
          });
          return { revisedContent: result.revisedContent, previousContent };
        }
        console.warn('[PhooCoach] Action returned no revisedContent:', result);
        return null;
      } catch (err) {
        console.warn('[PhooCoach] Revision action failed:', err);
        throw err;
      }
    },
    [projectId, contentId, content, liveScore, pendingRevision, reviseWithPersonaAction, contentPiece?.title, contentPiece?.keywords, contentPiece?.contentType, project?.industry]
  );

  // Accept a pending AI revision — apply to Lexical editor
  const handleAcceptRevision = useCallback(() => {
    if (!pendingRevision) return;
    if (lexicalEditorRef.current) {
      lexicalEditorRef.current.update(() => {
        $getRoot().clear();
        $convertFromMarkdownString(pendingRevision.revisedContent, TRANSFORMERS);
      });
    } else {
      setContent(pendingRevision.revisedContent);
    }
    setHasChanges(true);

    // COACH-H-004: Record implicit signal with before/after edit deltas
    // Compute afterScore synchronously rather than reading stale liveScore
    // (liveScore updates via 300ms debounce — it hasn't processed the new content yet)
    if (preRevisionSnapshot && projectId) {
      const newWordCount = pendingRevision.revisedContent.split(/\s+/).filter(Boolean).length;
      const afterScore = scoreContentRealTime({
        content: pendingRevision.revisedContent,
        ...scoringInput,
      });
      recordImplicitSignalMutation({
        projectId: projectId as Id<'projects'>,
        contentPieceId: contentId as Id<'contentPieces'>,
        feedbackType: 'suggestion_accepted' as const,
        editDelta: {
          readabilityBefore: preRevisionSnapshot.readabilityScore,
          readabilityAfter: afterScore.metrics.readabilityScore,
          wordCountBefore: preRevisionSnapshot.wordCount,
          wordCountAfter: newWordCount,
        },
      }).catch((err) => {
        console.warn('[PhooCoach] Failed to record implicit signal:', err);
      });
      setPreRevisionSnapshot(null);
    }

    setPendingRevision(null);
  }, [pendingRevision, preRevisionSnapshot, projectId, contentId, scoringInput, recordImplicitSignalMutation]);

  // Reject a pending AI revision — discard + record dismissal
  const handleRejectRevision = useCallback(() => {
    // COACH-H-004: Record suggestion_dismissed feedback
    if (projectId) {
      handleSuggestionFeedback(null, 'suggestion_dismissed');
    }
    setPreRevisionSnapshot(null);
    setPendingRevision(null);
  }, [projectId, handleSuggestionFeedback]);

  // Undo handler: restore content to a previous snapshot
  const handleRestoreContent = useCallback(
    (previousContent: string) => {
      setContent(previousContent);
      setHasChanges(true);
      toast({
        title: 'Content restored',
        description: 'Your previous content has been restored.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    },
    [toast]
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
          <Heading size="lg" color="gray.800">
            Content Not Found
          </Heading>
          <Text color="gray.500">This content piece may have been deleted or moved.</Text>
          <Link href="/studio/library">
            <Button
              variant="ghost"
              color="gray.500"
              leftIcon={<Icon as={FiArrowLeft} />}
              _hover={{ color: 'gray.800' }}
            >
              Back to Library
            </Button>
          </Link>
        </VStack>
      </StudioLayout>
    );
  }

  // Generating state — Render the Coach Training Overlay for live AI steering
  if (contentPiece.status === 'generating') {
    return (
      <StudioLayout>
        <CoachTrainingOverlay contentTitle={contentPiece.title} />
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
                color="gray.500"
                leftIcon={<Icon as={FiArrowLeft} />}
                _hover={{ color: 'gray.800' }}
              >
                Library
              </Button>
            </Link>
            <Box>
              <HStack spacing={2}>
                <Heading size="md" color="gray.800" noOfLines={1}>
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
                {contentPiece?.updatedAt && (
                  <Text as="span" color="gray.400" ml={1}>
                    • edited {formatRelativeTime(contentPiece.updatedAt)}
                  </Text>
                )}
                {saveStatus === 'saving' && (
                  <Text as="span" color="#FF9D00" ml={1}>
                    • Saving...
                  </Text>
                )}
                {saveStatus === 'saved' && (
                  <Text as="span" color="#16A34A" ml={1}>
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
              color="gray.500"
              leftIcon={<Icon as={FiSave} />}
              isLoading={isSaving}
              onClick={handleSave}
              isDisabled={!hasChanges}
              _hover={{ color: 'gray.800' }}
            >
              Save
            </Button>
            {contentPiece.status === 'scheduled' ? (
              <Button
                variant="outline"
                borderColor="gray.300"
                color="gray.600"
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

        {/* Editor + Sidebar — two-column layout */}
        <HStack align="start" spacing={6} flex={1} minH={0}>
          {/* Left Column: Editor + Review Banner + Phoo Coach */}
          <VStack flex={1} spacing={4} align="stretch" minH={0}>
            {/* Editor */}
            <Box
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="16px"
              boxShadow="0 2px 8px rgba(0, 0, 0, 0.06)"
              flex="0 0 auto"
              minH="400px"
              maxH="calc(100vh - 380px)"
              display="flex"
              flexDirection="column"
            >
              <Box p={4} borderBottom="1px solid" borderBottomColor="gray.200">
                <HStack spacing={2} justify="space-between">
                  <HStack spacing={2}>
                    <Badge bg="gray.100" color="gray.600">
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
                <Box flex={1} overflow="auto">
                  <MarkdownPreview content={content} />
                </Box>
              ) : (
                <Box flex={1} overflow="auto">
                  <LexicalEditorComponent
                    value={content}
                    onChange={handleContentChange}
                    placeholder="Start writing your content here..."
                    minHeight="350px"
                    onEditorReady={(editor) => {
                      lexicalEditorRef.current = editor;
                    }}
                  />
                </Box>
              )}
            </Box>

            {/* Revision Review Banner — same width as editor */}
            {pendingRevision && (
              <RevisionReviewBanner
                revisedContent={pendingRevision.revisedContent}
                previousContent={pendingRevision.previousContent}
                suggestionTitle={pendingRevision.suggestionTitle}
                onAccept={() => setShowAcceptConfirm(true)}
                onReject={handleRejectRevision}
              />
            )}

            {/* Phoo Coach — same width as editor, fills remaining space */}
            {!showPreview && (
              <Box flex="1 1 auto" minH="120px">
                <ContentSuggestionsPanel
                  liveScore={liveScore}
                  content={content}
                  keywords={contentPiece.keywords || []}
                  targetWordCount={TARGET_WORD_COUNT}
                  industry={project?.industry}
                  onFeedback={handleSuggestionFeedback}
                  onCustomRevision={handleCustomRevision}
                  onRestoreContent={handleRestoreContent}
                />
              </Box>
            )}
          </VStack>

          {/* Right Sidebar — full viewport height, sticky */}
          {!showPreview && (
            <VStack
              align="stretch"
              spacing={4}
              w="300px"
              flexShrink={0}
              position="sticky"
              top="80px"
              maxH="calc(100vh - 160px)"
              overflow="auto"
              sx={{
                '&::-webkit-scrollbar': { width: '4px' },
                '&::-webkit-scrollbar-thumb': { bg: 'gray.200', borderRadius: 'full' },
              }}
            >
              {/* SEO Score Panel */}
              <SEOScorePanel
                seoScore={effectiveSeoScore}
                wordCount={wordCount}
                targetWordCount={TARGET_WORD_COUNT}
                h2Count={h2Count}
                keywordCount={countKeywordsUsed(content, contentPiece.keywords)}
                targetKeywords={contentPiece.keywords?.length ?? 0}
                qualityMetrics={liveScore?.metrics ?? contentPiece.qualityMetrics}
              />

              {/* Content Health — new value section */}
              <Box
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="16px"
                p={4}
                boxShadow="0 2px 8px rgba(0, 0, 0, 0.04)"
              >
                <Text fontSize="xs" fontWeight="semibold" color="gray.500" textTransform="uppercase" mb={3}>
                  Content Health
                </Text>
                <VStack spacing={3} align="stretch">
                  {/* Readability */}
                  <Box>
                    <HStack justify="space-between" mb={1}>
                      <Text fontSize="xs" color="gray.600">Readability</Text>
                      <Text fontSize="xs" fontWeight="semibold" color={
                        (liveScore?.metrics?.readabilityScore ?? 0) >= 70 ? '#22C55E'
                          : (liveScore?.metrics?.readabilityScore ?? 0) >= 40 ? '#FF9D00' : '#EF4444'
                      }>
                        {liveScore?.metrics?.readabilityScore ?? 0}/100
                      </Text>
                    </HStack>
                    <Progress
                      value={liveScore?.metrics?.readabilityScore ?? 0}
                      size="xs"
                      borderRadius="full"
                      bg="gray.100"
                      colorScheme={
                        (liveScore?.metrics?.readabilityScore ?? 0) >= 70 ? 'green'
                          : (liveScore?.metrics?.readabilityScore ?? 0) >= 40 ? 'orange' : 'red'
                      }
                    />
                  </Box>

                  {/* Title Length */}
                  <HStack justify="space-between">
                    <Text fontSize="xs" color="gray.600">Title Length</Text>
                    <Text fontSize="xs" fontWeight="semibold" color={
                      (contentPiece.title?.length ?? 0) >= 30 && (contentPiece.title?.length ?? 0) <= 60
                        ? '#22C55E' : '#FF9D00'
                    }>
                      {contentPiece.title?.length ?? 0}/60
                    </Text>
                  </HStack>

                  {/* Content Type */}
                  <HStack justify="space-between">
                    <Text fontSize="xs" color="gray.600">Content Type</Text>
                    <Badge fontSize="2xs" colorScheme="purple" borderRadius="full">
                      {contentPiece.contentType ?? 'Blog'}
                    </Badge>
                  </HStack>

                  {/* Status */}
                  <HStack justify="space-between">
                    <Text fontSize="xs" color="gray.600">Status</Text>
                    <Badge
                      fontSize="2xs"
                      borderRadius="full"
                      bg={contentPiece.status === 'published' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(255, 157, 0, 0.12)'}
                      color={contentPiece.status === 'published' ? '#22C55E' : '#FF9D00'}
                    >
                      {contentPiece.status ?? 'draft'}
                    </Badge>
                  </HStack>

                  {/* Word Completion */}
                  <Box>
                    <HStack justify="space-between" mb={1}>
                      <Text fontSize="xs" color="gray.600">Word Target</Text>
                      <Text fontSize="xs" fontWeight="semibold" color={
                        wordCount >= TARGET_WORD_COUNT ? '#22C55E' : '#FF9D00'
                      }>
                        {Math.min(Math.round((wordCount / TARGET_WORD_COUNT) * 100), 100)}%
                      </Text>
                    </HStack>
                    <Progress
                      value={Math.min((wordCount / TARGET_WORD_COUNT) * 100, 100)}
                      size="xs"
                      borderRadius="full"
                      bg="gray.100"
                      colorScheme={wordCount >= TARGET_WORD_COUNT ? 'green' : 'orange'}
                    />
                  </Box>
                </VStack>
              </Box>

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
          )}
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
      {/* FIX-002: Accept Revision Confirmation Modal */}
      <Modal isOpen={showAcceptConfirm} onClose={() => setShowAcceptConfirm(false)} isCentered size="md">
        <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(4px)" />
        <ModalContent bg="white" borderRadius="16px" mx={4}>
          <ModalHeader pb={2}>
            <HStack spacing={3}>
              <Box bg="rgba(139, 92, 246, 0.1)" borderRadius="full" p={2}>
                <Icon as={FiZap} color="#8B5CF6" boxSize={4} />
              </Box>
              <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                Apply AI Revision?
              </Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={2}>
            <Text color="gray.600" fontSize="sm">
              This will replace your current content with the AI-generated version.
            </Text>
            <Text color="gray.400" fontSize="xs" mt={2}>
              You can undo this action with Ctrl+Z (Cmd+Z on Mac).
            </Text>
          </ModalBody>
          <ModalFooter pt={2} gap={2}>
            <Button
              variant="ghost"
              color="gray.500"
              onClick={() => setShowAcceptConfirm(false)}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              bg="linear-gradient(135deg, #8B5CF6, #7C3AED)"
              color="white"
              _hover={{ opacity: 0.9 }}
              size="sm"
              onClick={() => {
                setShowAcceptConfirm(false);
                handleAcceptRevision();
              }}
            >
              Apply Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </StudioLayout>
  );
}
