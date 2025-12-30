'use client';

/**
 * Content Editor Page
 *
 * Component Hierarchy:
 * App → StudioLayout → ContentEditorPage
 *
 * Displays and edits a single content piece.
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
} from '@chakra-ui/react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { StudioLayout } from '@/src/components/studio';
import { FiArrowLeft, FiSave, FiSend } from 'react-icons/fi';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Id } from '@/convex/_generated/dataModel';

export default function ContentEditorPage() {
  const params = useParams();
  const contentId = params.contentId as string;

  // TODO: Fetch content piece
  const contentPiece = null as {
    _id: string;
    title: string;
    contentType: string;
    content?: string;
    status: string;
    seoScore?: number;
    wordCount?: number;
    updatedAt: number;
  } | null;

  const isLoading = false;

  if (isLoading) {
    return (
      <StudioLayout>
        <VStack align="stretch" spacing={6}>
          <Skeleton height="40px" width="300px" />
          <Skeleton height="400px" />
        </VStack>
      </StudioLayout>
    );
  }

  if (!contentPiece) {
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

  return (
    <StudioLayout>
      <VStack align="stretch" spacing={6}>
        {/* Header */}
        <HStack justify="space-between">
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
              <HStack>
                <Heading size="md" color="white">
                  {contentPiece.title}
                </Heading>
                <Badge bg="rgba(255, 157, 0, 0.1)" color="#FF9D00" textTransform="capitalize">
                  {contentPiece.contentType}
                </Badge>
              </HStack>
              <Text color="gray.500" fontSize="sm">
                {contentPiece.wordCount?.toLocaleString() ?? 0} words
              </Text>
            </Box>
          </HStack>
          <HStack>
            <Button variant="ghost" color="gray.400" leftIcon={<Icon as={FiSave} />}>
              Save
            </Button>
            <Button
              bg="linear-gradient(135deg, #FF9D00, #FF6B00)"
              color="white"
              leftIcon={<Icon as={FiSend} />}
              _hover={{ opacity: 0.9 }}
            >
              Publish
            </Button>
          </HStack>
        </HStack>

        {/* Editor Placeholder */}
        <Box
          bg="rgba(255, 255, 255, 0.03)"
          border="1px solid rgba(255, 255, 255, 0.08)"
          borderRadius="16px"
          p={8}
          minH="500px"
        >
          <Text color="gray.500">Editor coming soon. Content ID: {contentId}</Text>
        </Box>
      </VStack>
    </StudioLayout>
  );
}
