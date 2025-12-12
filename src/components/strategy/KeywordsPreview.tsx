/**
 * KeywordsPreview Component
 *
 * Component Hierarchy:
 * App → StrategyPage → KeywordsPreview
 *
 * Expandable section showing user's keywords with basic info.
 * Provides visibility/trust that keywords were actually added.
 */

'use client';

import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  Collapse,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Skeleton,
  Tooltip,
} from '@chakra-ui/react';
import { FiChevronDown, FiChevronUp, FiSearch, FiTrendingUp } from 'react-icons/fi';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { getDifficultyLabel, getIntentLabel } from '@/src/lib/copyStrings';

interface Props {
  projectId: Id<'projects'>;
  maxPreview?: number;
}

export function KeywordsPreview({ projectId, maxPreview = 20 }: Props) {
  const [isOpen, setIsOpen] = useState(false); // Collapsed by default for cleaner view
  const keywords = useQuery(api.seo.keywords.getKeywordsByProject, { projectId });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('gray.50', 'gray.700');

  const isLoading = keywords === undefined;
  const keywordCount = keywords?.length || 0;
  type KeywordDoc = NonNullable<typeof keywords>[number];
  const displayKeywords: KeywordDoc[] = keywords?.slice(0, maxPreview) || [];
  const hasMore = keywordCount > maxPreview;

  if (isLoading) {
    return (
      <Box
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        overflow="hidden"
      >
        <HStack p={4} justify="space-between">
          <Skeleton h={5} w="150px" />
          <Skeleton h={5} w="80px" />
        </HStack>
      </Box>
    );
  }

  if (keywordCount === 0) {
    return null; // Don't show if no keywords
  }

  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
    >
      {/* Header - Always visible, prominent */}
      <HStack
        p={5}
        justify="space-between"
        cursor="pointer"
        onClick={() => setIsOpen(!isOpen)}
        _hover={{ bg: headerBg }}
        transition="background 0.2s"
        bg={isOpen ? undefined : headerBg}
      >
        <HStack spacing={3}>
          <Box p={2} borderRadius="md" bg="brand.orange" color="white">
            <Icon as={FiSearch} boxSize={4} />
          </Box>
          <Text fontWeight="bold" fontSize="lg">
            Your Keywords
          </Text>
          <Badge
            colorScheme="green"
            variant="solid"
            fontSize="md"
            px={3}
            py={1}
            borderRadius="full"
          >
            {keywordCount}
          </Badge>
        </HStack>
        <HStack spacing={2}>
          <Text fontSize="sm" color="gray.500" fontWeight="medium">
            {isOpen ? 'Hide details' : 'Show details'}
          </Text>
          <Icon as={isOpen ? FiChevronUp : FiChevronDown} color="gray.500" boxSize={5} />
        </HStack>
      </HStack>

      {/* Expandable content */}
      <Collapse in={isOpen} animateOpacity>
        <Box borderTopWidth="1px" borderColor={borderColor}>
          <Table size="sm">
            <Thead bg={headerBg}>
              <Tr>
                <Th>Keyword</Th>
                <Th isNumeric>
                  <Tooltip
                    label="Monthly searches for this keyword. Capture just 10% to drive meaningful traffic growth."
                    hasArrow
                    placement="top"
                  >
                    <Text as="span" cursor="help" borderBottom="1px dotted">
                      Volume
                    </Text>
                  </Tooltip>
                </Th>
                <Th>
                  <Tooltip
                    label="How hard to rank for this keyword (1-100). Lower = easier."
                    hasArrow
                    placement="top"
                  >
                    <Text as="span" cursor="help" borderBottom="1px dotted">
                      Difficulty
                    </Text>
                  </Tooltip>
                </Th>
                <Th>
                  <Tooltip
                    label="Searcher's goal: Informational (learn), Commercial (compare), Transactional (buy)"
                    hasArrow
                    placement="top"
                  >
                    <Text as="span" cursor="help" borderBottom="1px dotted">
                      Intent
                    </Text>
                  </Tooltip>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {displayKeywords.map((kw) => {
                const diffLabel = kw.difficulty ? getDifficultyLabel(kw.difficulty) : null;
                const intentLabel = kw.intent ? getIntentLabel(kw.intent) : null;

                return (
                  <Tr key={kw._id}>
                    <Td>
                      <Text fontSize="sm" fontWeight="medium">
                        {kw.keyword}
                      </Text>
                    </Td>
                    <Td isNumeric>
                      <Text fontSize="sm" color="gray.600">
                        {kw.searchVolume?.toLocaleString() || '—'}
                      </Text>
                    </Td>
                    <Td>
                      {diffLabel ? (
                        <Badge colorScheme={diffLabel.color} size="sm">
                          {diffLabel.label}
                        </Badge>
                      ) : (
                        <Text fontSize="sm" color="gray.400">
                          —
                        </Text>
                      )}
                    </Td>
                    <Td>
                      {intentLabel ? (
                        <Badge colorScheme={intentLabel.color} size="sm">
                          {intentLabel.label}
                        </Badge>
                      ) : (
                        <Text fontSize="sm" color="gray.400">
                          —
                        </Text>
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>

          {hasMore && (
            <HStack p={3} justify="center" bg={headerBg}>
              <Text fontSize="sm" color="gray.500">
                Showing {maxPreview} of {keywordCount} keywords
              </Text>
            </HStack>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}
