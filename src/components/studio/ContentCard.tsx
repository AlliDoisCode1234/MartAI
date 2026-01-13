'use client';

/**
 * ContentCard
 *
 * Component Hierarchy:
 * App → StudioLayout → ContentLibrary → ContentCard
 *
 * Glassmorphism card for displaying content piece in library view.
 * Features MoreVert menu with Delete, Duplicate, Quick Publish actions.
 */

import {
  Box,
  Text,
  Badge,
  HStack,
  VStack,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { FiClock, FiMoreVertical, FiTrash2, FiCopy, FiSend } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { getSeoGrade } from '@/lib/utils/grading';
import { getStatusHex } from '@/lib/constants/statusColors';
import { formatRelativeTime } from '@/lib/dateUtils';
import type { Id } from '@/convex/_generated/dataModel';

interface Props {
  contentPiece: {
    _id: string;
    title: string;
    contentType: string;
    status: string;
    wordCount?: number;
    seoScore?: number;
    updatedAt: number;
    projectId?: string;
  };
  onDeleted?: () => void;
}

export function ContentCard({ contentPiece, onDeleted }: Props) {
  const { grade, color: gradeColor } = getSeoGrade(contentPiece.seoScore);
  const statusColor = getStatusHex(contentPiece.status);
  const router = useRouter();
  const toast = useToast();

  // Mutations
  const deleteContent = useMutation(api.contentPieces.remove);
  const duplicateContent = useMutation(api.contentPieces.duplicate);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`Delete "${contentPiece.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteContent({
        contentPieceId: contentPiece._id as Id<'contentPieces'>,
      });
      toast({
        title: 'Content deleted',
        status: 'success',
        duration: 2000,
      });
      onDeleted?.();
    } catch (error) {
      toast({
        title: 'Failed to delete',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const newId = await duplicateContent({
        contentPieceId: contentPiece._id as Id<'contentPieces'>,
      });
      toast({
        title: 'Content duplicated',
        description: 'Opening new copy...',
        status: 'success',
        duration: 2000,
      });
      router.push(`/studio/${newId}`);
    } catch (error) {
      toast({
        title: 'Failed to duplicate',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleQuickPublish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Navigate to detail page with publish intent
    router.push(`/studio/${contentPiece._id}?action=publish`);
  };

  return (
    <Box position="relative">
      <Link href={`/studio/${contentPiece._id}`} style={{ textDecoration: 'none' }}>
        <Box
          bg="rgba(255, 255, 255, 0.03)"
          border="1px solid rgba(255, 255, 255, 0.08)"
          borderRadius="16px"
          p={5}
          cursor="pointer"
          transition="all 0.2s ease"
          _hover={{
            bg: 'rgba(255, 255, 255, 0.06)',
            borderColor: 'rgba(255, 157, 0, 0.3)',
            boxShadow: '0 0 30px rgba(255, 157, 0, 0.1)',
            transform: 'translateY(-2px)',
          }}
        >
          <VStack align="stretch" spacing={4}>
            {/* Header with type badge and MoreVert */}
            <HStack justify="space-between">
              <Badge
                bg="rgba(255, 255, 255, 0.1)"
                color="gray.300"
                px={2}
                py={1}
                borderRadius="6px"
                fontSize="xs"
                textTransform="capitalize"
              >
                {contentPiece.contentType}
              </Badge>
              {/* Placeholder for spacing - actual menu is positioned absolute */}
              <Box w={6} h={6} />
            </HStack>

            {/* Title */}
            <Text fontSize="md" fontWeight="semibold" color="white" noOfLines={2} lineHeight="1.4">
              {contentPiece.title}
            </Text>

            {/* Word count */}
            {contentPiece.wordCount && (
              <Text fontSize="sm" color="gray.500">
                {contentPiece.wordCount.toLocaleString()} words
              </Text>
            )}

            {/* Footer with score and status */}
            <HStack justify="space-between" align="center">
              {/* SEO Score */}
              <Box
                bg={`${gradeColor}20`}
                color={gradeColor}
                px={3}
                py={1}
                borderRadius="8px"
                fontWeight="bold"
                fontSize="lg"
                textShadow={`0 0 10px ${gradeColor}`}
              >
                {grade}
              </Box>

              {/* Status and time */}
              <VStack align="end" spacing={0}>
                <Badge
                  bg={`${statusColor}20`}
                  color={statusColor}
                  px={2}
                  py={0.5}
                  borderRadius="4px"
                  fontSize="xs"
                  textTransform="capitalize"
                >
                  {contentPiece.status}
                </Badge>
                <HStack spacing={1} color="gray.500" fontSize="xs">
                  <Icon as={FiClock} boxSize={3} />
                  <Text>{formatRelativeTime(contentPiece.updatedAt)}</Text>
                </HStack>
              </VStack>
            </HStack>
          </VStack>
        </Box>
      </Link>

      {/* MoreVert Menu - positioned absolute in top-right corner */}
      <Box position="absolute" top={3} right={3} zIndex={10}>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Content actions"
            icon={<FiMoreVertical />}
            variant="ghost"
            size="sm"
            color="gray.400"
            _hover={{ color: 'white', bg: 'rgba(255, 255, 255, 0.1)' }}
            onClick={(e) => e.preventDefault()}
          />
          <MenuList
            bg="#1A1A1A"
            borderColor="rgba(255, 255, 255, 0.1)"
            boxShadow="0 8px 32px rgba(0, 0, 0, 0.4)"
          >
            <MenuItem
              icon={<FiCopy />}
              onClick={handleDuplicate}
              bg="transparent"
              _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
            >
              Duplicate
            </MenuItem>
            <MenuItem
              icon={<FiSend />}
              onClick={handleQuickPublish}
              bg="transparent"
              _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
              isDisabled={contentPiece.status === 'generating'}
            >
              Quick Publish
            </MenuItem>
            <MenuDivider borderColor="rgba(255, 255, 255, 0.1)" />
            <MenuItem
              icon={<FiTrash2 />}
              onClick={handleDelete}
              color="red.400"
              bg="transparent"
              _hover={{ bg: 'rgba(255, 0, 0, 0.1)' }}
            >
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Box>
  );
}
