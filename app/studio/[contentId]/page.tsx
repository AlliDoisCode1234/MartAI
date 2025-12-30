'use client';

/**
 * Content Editor Page
 *
 * Component Hierarchy:
 * App → StudioLayout → ContentEditorPage
 *
 * Full editor with content editing and SEO score sidebar.
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
} from '@chakra-ui/react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { StudioLayout, SEOScorePanel } from '@/src/components/studio';
import { FiArrowLeft, FiSave, FiSend, FiRefreshCw, FiCheck, FiClock } from 'react-icons/fi';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Id } from '@/convex/_generated/dataModel';
import { useState, useEffect } from 'react';

export default function ContentEditorPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const contentId = params.contentId as string;

  // Fetch content piece
  const contentPiece = useQuery(api.contentPieces.getById, {
    contentPieceId: contentId as Id<'contentPieces'>,
  });

  const updateMutation = useMutation(api.contentPieces.update);

  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

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
        description: 'Ready for publishing',
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
                        : 'rgba(255, 255, 255, 0.1)'
                  }
                  color={
                    contentPiece.status === 'published'
                      ? '#22C55E'
                      : contentPiece.status === 'approved'
                        ? '#3B82F6'
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
            {(contentPiece.status === 'approved' || contentPiece.status === 'draft') && (
              <Button
                bg="linear-gradient(135deg, #FF9D00, #FF6B00)"
                color="white"
                leftIcon={<Icon as={FiSend} />}
                _hover={{ opacity: 0.9 }}
                onClick={handlePublish}
              >
                Publish
              </Button>
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
          >
            <Box p={4} borderBottom="1px solid rgba(255, 255, 255, 0.08)">
              <HStack spacing={2}>
                <Badge bg="rgba(255, 255, 255, 0.1)" color="gray.400">
                  Markdown
                </Badge>
                <Divider orientation="vertical" h={4} />
                <Text color="gray.500" fontSize="sm">
                  {h2Count} sections
                </Text>
              </HStack>
            </Box>
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
              p={6}
              resize="none"
              _placeholder={{ color: 'gray.600' }}
            />
          </Box>

          {/* SEO Score Panel */}
          <SEOScorePanel
            seoScore={contentPiece.seoScore ?? 0}
            wordCount={wordCount}
            targetWordCount={1200}
            h2Count={h2Count}
            keywordCount={10} // TODO: Calculate from content
            targetKeywords={12}
            internalLinkCount={linkCount}
            qualityMetrics={contentPiece.qualityMetrics}
          />
        </HStack>
      </VStack>
    </StudioLayout>
  );
}
