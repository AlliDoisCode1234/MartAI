/**
 * KeywordsPreview Component
 *
 * Component Hierarchy:
 * App → StrategyPage → KeywordsPreview
 *
 * Expandable section showing user's keywords with basic info.
 * Dark theme variant for Content Studio.
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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Skeleton,
  Tooltip,
} from '@chakra-ui/react';
import { FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { getDifficultyLabel, getIntentLabel } from '@/src/lib/copyStrings';
import { darkGlass, glassCardProps } from '@/src/theme/darkGlassTokens';

interface Props {
  projectId: Id<'projects'>;
  maxPreview?: number;
}

export function KeywordsPreview({ projectId, maxPreview = 20 }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const keywords = useQuery(api.seo.keywords.getKeywordsByProject, { projectId });

  const isLoading = keywords === undefined;
  const keywordCount = keywords?.length || 0;
  type KeywordDoc = NonNullable<typeof keywords>[number];
  const displayKeywords: KeywordDoc[] = keywords?.slice(0, maxPreview) || [];
  const hasMore = keywordCount > maxPreview;

  if (isLoading) {
    return (
      <Box {...glassCardProps} overflow="hidden">
        <HStack p={4} justify="space-between">
          <Skeleton h={5} w="150px" startColor="gray.700" endColor="gray.600" />
          <Skeleton h={5} w="80px" startColor="gray.700" endColor="gray.600" />
        </HStack>
      </Box>
    );
  }

  if (keywordCount === 0) {
    return null;
  }

  return (
    <Box {...glassCardProps} overflow="hidden">
      {/* Header - Always visible, prominent */}
      <HStack
        p={5}
        justify="space-between"
        cursor="pointer"
        onClick={() => setIsOpen(!isOpen)}
        _hover={{ bg: darkGlass.bgHover }}
        transition="background 0.2s"
        bg={isOpen ? undefined : 'rgba(255, 255, 255, 0.02)'}
      >
        <HStack spacing={3}>
          <Box p={2} borderRadius="md" bg={darkGlass.accentOrangeBg}>
            <Icon as={FiSearch} boxSize={4} color={darkGlass.accentOrange} />
          </Box>
          <Text fontWeight="bold" fontSize="lg" color={darkGlass.text}>
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
          <Text fontSize="sm" color={darkGlass.textSubtle} fontWeight="medium">
            {isOpen ? 'Hide details' : 'Show details'}
          </Text>
          <Icon
            as={isOpen ? FiChevronUp : FiChevronDown}
            color={darkGlass.textSubtle}
            boxSize={5}
          />
        </HStack>
      </HStack>

      {/* Expandable content */}
      <Collapse in={isOpen} animateOpacity>
        <Box borderTopWidth="1px" borderColor={darkGlass.border}>
          <Table size="sm">
            <Thead bg="rgba(255, 255, 255, 0.03)">
              <Tr>
                <Th color={darkGlass.textMuted} borderColor={darkGlass.border}>
                  Keyword
                </Th>
                <Th isNumeric color={darkGlass.textMuted} borderColor={darkGlass.border}>
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
                <Th color={darkGlass.textMuted} borderColor={darkGlass.border}>
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
                <Th color={darkGlass.textMuted} borderColor={darkGlass.border}>
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
                  <Tr key={kw._id} _hover={{ bg: darkGlass.bgHover }}>
                    <Td borderColor={darkGlass.border}>
                      <Text fontSize="sm" fontWeight="medium" color={darkGlass.text}>
                        {kw.keyword}
                      </Text>
                    </Td>
                    <Td isNumeric borderColor={darkGlass.border}>
                      <Text fontSize="sm" color={darkGlass.textMuted}>
                        {kw.searchVolume?.toLocaleString() || '—'}
                      </Text>
                    </Td>
                    <Td borderColor={darkGlass.border}>
                      {diffLabel ? (
                        <Badge colorScheme={diffLabel.color} size="sm">
                          {diffLabel.label}
                        </Badge>
                      ) : (
                        <Text fontSize="sm" color={darkGlass.textSubtle}>
                          —
                        </Text>
                      )}
                    </Td>
                    <Td borderColor={darkGlass.border}>
                      {intentLabel ? (
                        <Badge colorScheme={intentLabel.color} size="sm">
                          {intentLabel.label}
                        </Badge>
                      ) : (
                        <Text fontSize="sm" color={darkGlass.textSubtle}>
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
            <HStack p={3} justify="center" bg="rgba(255, 255, 255, 0.03)">
              <Text fontSize="sm" color={darkGlass.textSubtle}>
                Showing {maxPreview} of {keywordCount} keywords
              </Text>
            </HStack>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}
