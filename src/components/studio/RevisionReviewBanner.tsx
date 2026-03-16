'use client';

/**
 * RevisionReviewBanner
 *
 * Component Hierarchy:
 * App -> StudioLayout -> ContentEditorPage -> RevisionReviewBanner
 *
 * Shows a review interface when AI generates revised content.
 * Uses word-level diff highlighting to show exactly what changed:
 * - Green background = added text
 * - Red strikethrough = removed text
 * - No highlight = unchanged text
 */

import { useState, useMemo } from 'react';
import {
  Box,
  HStack,
  Text,
  Button,
  Icon,
  Badge,
  Collapse,
} from '@chakra-ui/react';
import {
  FiCheck,
  FiX,
  FiEye,
  FiChevronUp,
  FiZap,
} from 'react-icons/fi';
import { diffWords } from 'diff';

interface Props {
  readonly revisedContent: string;
  readonly previousContent: string;
  readonly suggestionTitle: string;
  readonly onAccept: () => void;
  readonly onReject: () => void;
}

/** Count words in a string */
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Render inline diff with green/red highlighting */
function InlineDiff({ oldText, newText }: { oldText: string; newText: string }) {
  const parts = useMemo(() => diffWords(oldText, newText), [oldText, newText]);

  return (
    <Box
      p={5}
      fontFamily="'Inter', sans-serif"
      fontSize="14px"
      lineHeight="1.8"
      color="gray.700"
      whiteSpace="pre-wrap"
      overflowWrap="break-word"
    >
      {parts.map((part, i) => {
        if (part.added) {
          return (
            <Box
              key={i}
              as="span"
              bg="rgba(34, 197, 94, 0.15)"
              color="#15803d"
              borderRadius="2px"
              px="2px"
              py="1px"
              fontWeight="500"
              border="1px solid rgba(34, 197, 94, 0.25)"
            >
              {part.value}
            </Box>
          );
        }
        if (part.removed) {
          return (
            <Box
              key={i}
              as="span"
              bg="rgba(239, 68, 68, 0.12)"
              color="#b91c1c"
              textDecoration="line-through"
              borderRadius="2px"
              px="2px"
              py="1px"
              opacity={0.7}
            >
              {part.value}
            </Box>
          );
        }
        return <span key={i}>{part.value}</span>;
      })}
    </Box>
  );
}

export function RevisionReviewBanner({
  revisedContent,
  previousContent,
  suggestionTitle,
  onAccept,
  onReject,
}: Props) {
  const [showDiff, setShowDiff] = useState(false);

  const stats = useMemo(() => {
    const oldWords = countWords(previousContent);
    const newWords = countWords(revisedContent);
    const wordDiff = newWords - oldWords;
    return { oldWords, newWords, wordDiff };
  }, [previousContent, revisedContent]);

  return (
    <Box
      bg="linear-gradient(135deg, rgba(255, 157, 0, 0.08), rgba(255, 157, 0, 0.03))"
      border="1px solid"
      borderColor="rgba(255, 157, 0, 0.3)"
      borderRadius="16px"
      overflow="hidden"
    >
      {/* Banner Header */}
      <HStack
        justify="space-between"
        p={4}
        borderBottom={showDiff ? '1px solid' : 'none'}
        borderBottomColor="rgba(255, 157, 0, 0.15)"
      >
        <HStack spacing={3}>
          <Box bg="rgba(255, 157, 0, 0.15)" borderRadius="full" p={2}>
            <Icon as={FiZap} color="#FF9D00" boxSize={4} />
          </Box>
          <Box>
            <HStack spacing={2}>
              <Text fontWeight="semibold" color="gray.800" fontSize="sm">
                Phoo revised your content
              </Text>
              <Badge
                bg={stats.wordDiff >= 0 ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)'}
                color={stats.wordDiff >= 0 ? '#16A34A' : '#EF4444'}
                fontSize="xs"
                borderRadius="full"
                px={2}
              >
                {stats.wordDiff >= 0 ? '+' : ''}{stats.wordDiff} words
              </Badge>
            </HStack>
            <Text color="gray.500" fontSize="xs" mt={0.5}>
              {stats.oldWords} → {stats.newWords} words · Review highlighted changes below
            </Text>
          </Box>
        </HStack>

        <HStack spacing={2}>
          <Button
            size="sm"
            variant="ghost"
            color="gray.600"
            leftIcon={<Icon as={showDiff ? FiChevronUp : FiEye} boxSize={4} />}
            onClick={() => setShowDiff(!showDiff)}
            _hover={{ bg: 'rgba(255, 157, 0, 0.1)' }}
          >
            {showDiff ? 'Hide' : 'View Changes'}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            color="#EF4444"
            leftIcon={<Icon as={FiX} boxSize={4} />}
            onClick={onReject}
            _hover={{ bg: 'rgba(239, 68, 68, 0.08)' }}
          >
            Reject
          </Button>
          <Button
            size="sm"
            bg="linear-gradient(135deg, #22C55E, #16A34A)"
            color="white"
            leftIcon={<Icon as={FiCheck} boxSize={4} />}
            onClick={onAccept}
            _hover={{ opacity: 0.9 }}
          >
            Accept
          </Button>
        </HStack>
      </HStack>

      {/* Inline Diff View */}
      <Collapse in={showDiff} animateOpacity>
        <Box maxH="500px" overflow="auto" bg="white">
          {/* Legend */}
          <HStack
            p={2}
            px={5}
            bg="gray.50"
            borderBottom="1px solid"
            borderBottomColor="gray.100"
            spacing={4}
            position="sticky"
            top={0}
            zIndex={1}
          >
            <HStack spacing={1.5}>
              <Box
                w={3}
                h={3}
                borderRadius="sm"
                bg="rgba(34, 197, 94, 0.15)"
                border="1px solid rgba(34, 197, 94, 0.25)"
              />
              <Text fontSize="xs" color="gray.600">Added</Text>
            </HStack>
            <HStack spacing={1.5}>
              <Box
                w={3}
                h={3}
                borderRadius="sm"
                bg="rgba(239, 68, 68, 0.12)"
                border="1px solid rgba(239, 68, 68, 0.2)"
              />
              <Text fontSize="xs" color="gray.600">Removed</Text>
            </HStack>
          </HStack>

          {/* Inline diff content — PERF-011: only compute when expanded */}
          {showDiff && (
            <InlineDiff oldText={previousContent} newText={revisedContent} />
          )}
        </Box>
      </Collapse>
    </Box>
  );
}
