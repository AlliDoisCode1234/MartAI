'use client';

/**
 * RankedArticleTable
 *
 * Component Hierarchy:
 * App → StudioLayout → InsightsPage → RankedArticleTable
 *
 * Numbered article rows with rank badge, title, SEO metrics, and trend.
 * Supports two modes: "top" (performing) and "under" (underperforming).
 */

import { Box, Flex, HStack, Text, Badge, Icon } from '@chakra-ui/react';
import { FiTrendingUp, FiTrendingDown, FiZap } from 'react-icons/fi';
import { STUDIO_COLORS, getScoreColor } from '@/lib/constants/studioTokens';

interface ArticleRow {
  rank: number;
  title: string;
  seoScore?: number;
  wordCount?: number;
  keywordCount?: number;
  trend?: number;
  quickWin?: boolean;
}

interface Props {
  articles: ArticleRow[];
  variant?: 'top' | 'under';
}

function RankBadge({ rank, variant }: { rank: number; variant: 'top' | 'under' }) {
  const colors =
    variant === 'top' ? ['green', 'blue', 'purple', 'orange', 'gray'] : ['red', 'orange', 'yellow'];
  const colorScheme = colors[Math.min(rank - 1, colors.length - 1)] || 'gray';

  return (
    <Badge
      colorScheme={colorScheme}
      variant="subtle"
      borderRadius="md"
      minW="24px"
      textAlign="center"
      fontSize="xs"
    >
      {rank}
    </Badge>
  );
}

export function RankedArticleTable({ articles, variant = 'top' }: Props) {
  if (articles.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Text color={STUDIO_COLORS.textMuted} fontSize="sm">
          No articles yet
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      {/* Column Headers */}
      {variant === 'top' && (
        <Flex
          px={3}
          py={2}
          mb={1}
          justify="space-between"
          borderBottom="1px solid"
          borderColor="rgba(255, 255, 255, 0.06)"
        >
          <Text flex={1} fontSize="xs" color={STUDIO_COLORS.textMuted} fontWeight="medium">
            Article
          </Text>
          <HStack spacing={6}>
            <Text fontSize="xs" color={STUDIO_COLORS.textMuted} w="50px" textAlign="right">
              SEO
            </Text>
            <Text fontSize="xs" color={STUDIO_COLORS.textMuted} w="50px" textAlign="right">
              Words
            </Text>
            <Text fontSize="xs" color={STUDIO_COLORS.textMuted} w="50px" textAlign="right">
              Trend
            </Text>
          </HStack>
        </Flex>
      )}

      {articles.map((article) => (
        <Flex
          key={`${article.rank}-${article.title}`}
          px={3}
          py={2.5}
          align="center"
          borderRadius="lg"
          _hover={{ bg: 'rgba(255, 255, 255, 0.03)' }}
          transition="background 0.15s"
        >
          {/* Rank + Title */}
          <HStack flex={1} spacing={3} minW={0}>
            <RankBadge rank={article.rank} variant={variant} />
            <Text fontSize="sm" color="white" noOfLines={1} title={article.title}>
              {article.title}
            </Text>
          </HStack>

          {/* Metrics (top variant) */}
          {variant === 'top' && (
            <HStack spacing={6} flexShrink={0}>
              {article.seoScore !== undefined && (
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color={getScoreColor(article.seoScore)}
                  w="50px"
                  textAlign="right"
                >
                  {article.seoScore}
                </Text>
              )}
              {article.wordCount !== undefined && (
                <Text fontSize="sm" color={STUDIO_COLORS.textSecondary} w="50px" textAlign="right">
                  {article.wordCount.toLocaleString()}
                </Text>
              )}
              <Box w="50px" textAlign="right">
                {article.trend !== undefined && (
                  <HStack spacing={0.5} justify="flex-end">
                    <Icon
                      as={article.trend >= 0 ? FiTrendingUp : FiTrendingDown}
                      boxSize={3}
                      color={article.trend >= 0 ? STUDIO_COLORS.green : STUDIO_COLORS.coral}
                    />
                    <Text
                      fontSize="xs"
                      color={article.trend >= 0 ? STUDIO_COLORS.green : STUDIO_COLORS.coral}
                    >
                      {article.trend > 0 ? '+' : ''}
                      {article.trend}
                    </Text>
                  </HStack>
                )}
              </Box>
            </HStack>
          )}

          {/* Metrics (under variant) */}
          {variant === 'under' && (
            <HStack spacing={3} flexShrink={0}>
              {article.seoScore !== undefined && (
                <Text fontSize="sm" color={STUDIO_COLORS.textMuted}>
                  {article.seoScore}
                </Text>
              )}
              {article.quickWin && (
                <Badge
                  bg="rgba(255, 157, 0, 0.15)"
                  color={STUDIO_COLORS.amber}
                  fontSize="xs"
                  borderRadius="full"
                >
                  <HStack spacing={1}>
                    <Icon as={FiZap} boxSize={3} />
                    <Text>Quick Win</Text>
                  </HStack>
                </Badge>
              )}
            </HStack>
          )}
        </Flex>
      ))}
    </Box>
  );
}
