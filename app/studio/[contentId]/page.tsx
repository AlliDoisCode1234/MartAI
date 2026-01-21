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
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { StudioLayout, SEOScorePanel, MarkdownPreview } from '@/src/components/studio';
import { IntegrationsPanel } from '@/src/components/content';
import {
  FiArrowLeft,
  FiSave,
  FiSend,
  FiRefreshCw,
  FiCheck,
  FiCalendar,
  FiClock,
  FiEye,
  FiEdit3,
} from 'react-icons/fi';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Id } from '@/convex/_generated/dataModel';
import { useState, useEffect } from 'react';

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

  const updateMutation = useMutation(api.contentPieces.update);
  const scheduleMutation = useMutation(api.contentPieces.schedule);
  const unscheduleMutation = useMutation(api.contentPieces.unschedule);

  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [isScheduling, setIsScheduling] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Sync content from query
  useEffect(() => {
    if (contentPiece?.content) {
      setContent(contentPiece.content);
    }
  }, [contentPiece?.content]);

  const handleContentChange = (value: string) => {
    setContent(value);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!contentPiece) return;
    setIsSaving(true);
    try {
      await updateMutation({
        contentPieceId: contentPiece._id,
        content,
        wordCount: content.split(/\s+/).filter((w) => w.length > 0).length,
      });
      setHasChanges(false);
      toast({
        title: 'Content saved',
        status: 'success',
        duration: 2000,
      });
    } catch (e) {
      toast({
        title: 'Save failed',
        status: 'error',
        duration: 3000,
      });
    }
    setIsSaving(false);
  };

  const handleApprove = async () => {
    if (!contentPiece) return;
    try {
      await updateMutation({
        contentPieceId: contentPiece._id,
        status: 'approved',
      });
      toast({
        title: 'Content approved',
        description: 'Ready for publishing or scheduling',
        status: 'success',
        duration: 3000,
      });
    } catch (e) {
      toast({
        title: 'Approval failed',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handlePublish = async () => {
    if (!contentPiece) return;
    try {
      await updateMutation({
        contentPieceId: contentPiece._id,
        status: 'published',
      });
      toast({
        title: 'Content published',
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
    } catch (e: any) {
      toast({
        title: 'Schedule failed',
        description: e?.message || 'Unknown error',
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

  // Calculate metrics from content
  const wordCount = content.split(/\s+/).filter((w) => w.length > 0).length;
  const h2Count = (content.match(/^## /gm) || []).length;
  const linkCount = (content.match(/\[.*?\]\(.*?\)/g) || []).length;

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
                {hasChanges && ' • Unsaved changes'}
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
            {contentPiece.status === 'draft' && (
              <Button
                variant="outline"
                borderColor="#FF9D00"
                color="#FF9D00"
                leftIcon={<Icon as={FiCheck} />}
                _hover={{ bg: 'rgba(255, 157, 0, 0.1)' }}
                onClick={handleApprove}
              >
                Approve
              </Button>
            )}
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
            ) : (
              (contentPiece.status === 'approved' || contentPiece.status === 'draft') && (
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
                  <Button
                    bg="linear-gradient(135deg, #FF9D00, #FF6B00)"
                    color="white"
                    leftIcon={<Icon as={FiSend} />}
                    _hover={{ opacity: 0.9 }}
                    onClick={handlePublish}
                  >
                    Publish
                  </Button>
                </>
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
            {/* SEO Score Panel */}
            <SEOScorePanel
              seoScore={contentPiece.seoScore ?? 0}
              wordCount={wordCount}
              targetWordCount={1200}
              h2Count={h2Count}
              keywordCount={10}
              targetKeywords={12}
              internalLinkCount={linkCount}
              qualityMetrics={contentPiece.qualityMetrics}
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
    </StudioLayout>
  );
}
