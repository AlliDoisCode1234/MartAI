'use client';

/**
 * SEO Score Panel
 *
 * Component Hierarchy:
 * App → StudioLayout → ContentEditor → SEOScorePanel
 *
 * Real-time SEO scoring sidebar with metrics breakdown.
 */

import { Box, VStack, HStack, Text, Progress, Icon, Badge, Divider } from '@chakra-ui/react';
import {
  FiCheck,
  FiAlertCircle,
  FiFileText,
  FiHash,
  FiType,
  FiLink,
  FiEdit3,
} from 'react-icons/fi';
import { getSeoGrade, getSeoColorScheme } from '@/lib/utils/grading';

interface Props {
  seoScore?: number;
  wordCount?: number;
  targetWordCount?: number;
  h2Count?: number;
  keywordCount?: number;
  targetKeywords?: number;
  internalLinkCount?: number;
  qualityMetrics?: {
    wordCountScore: number;
    structureScore: number;
    keywordScore: number;
    readabilityScore: number;
  };
}

export function SEOScorePanel({
  seoScore = 0,
  wordCount = 0,
  targetWordCount = 1200,
  h2Count = 0,
  keywordCount = 0,
  targetKeywords = 10,
  internalLinkCount = 0,
  qualityMetrics,
}: Props) {
  const { grade, color } = getSeoGrade(seoScore);

  const metrics = [
    {
      label: 'Word Count',
      value: `${wordCount.toLocaleString()}/${targetWordCount.toLocaleString()}`,
      icon: FiFileText,
      passed: wordCount >= targetWordCount,
      score: qualityMetrics?.wordCountScore,
    },
    {
      label: 'H2 Sections',
      value: `${h2Count}/7`,
      icon: FiHash,
      passed: h2Count >= 7,
      score: qualityMetrics?.structureScore,
    },
    {
      label: 'Keywords Used',
      value: `${keywordCount}/${targetKeywords}`,
      icon: FiType,
      passed: keywordCount >= targetKeywords * 0.8,
      score: qualityMetrics?.keywordScore,
    },
    {
      label: 'Internal Links',
      value: `${internalLinkCount}/3`,
      icon: FiLink,
      passed: internalLinkCount >= 3,
    },
    {
      label: 'Readability',
      value: qualityMetrics?.readabilityScore ? `${qualityMetrics.readabilityScore}/100` : '—',
      icon: FiEdit3,
      passed: (qualityMetrics?.readabilityScore ?? 0) >= 60,
      score: qualityMetrics?.readabilityScore,
    },
  ];

  return (
    <Box
      bg="rgba(255, 255, 255, 0.03)"
      border="1px solid rgba(255, 255, 255, 0.08)"
      borderRadius="16px"
      p={6}
      minW="280px"
    >
      <VStack spacing={6} align="stretch">
        {/* Main Score */}
        <VStack spacing={2}>
          <Text color="gray.400" fontSize="sm" fontWeight="medium">
            SEO SCORE
          </Text>
          <Box
            bg={`${color}15`}
            border={`2px solid ${color}`}
            borderRadius="16px"
            p={4}
            textAlign="center"
            boxShadow={`0 0 30px ${color}20`}
          >
            <Text fontSize="4xl" fontWeight="bold" color={color}>
              {grade}
            </Text>
            <Text color="gray.400" fontSize="sm">
              {seoScore}/100
            </Text>
          </Box>
          <Progress
            value={seoScore}
            size="sm"
            colorScheme={seoScore >= 90 ? 'green' : seoScore >= 70 ? 'orange' : 'red'}
            borderRadius="full"
            bg="rgba(255, 255, 255, 0.1)"
            w="100%"
          />
        </VStack>

        <Divider borderColor="rgba(255, 255, 255, 0.08)" />

        {/* Metrics Breakdown */}
        <VStack spacing={3} align="stretch">
          <Text color="gray.400" fontSize="xs" fontWeight="medium" textTransform="uppercase">
            Metrics
          </Text>
          {metrics.map((metric) => (
            <HStack key={metric.label} justify="space-between">
              <HStack spacing={2}>
                <Icon
                  as={metric.passed ? FiCheck : FiAlertCircle}
                  color={metric.passed ? '#22C55E' : 'gray.500'}
                  boxSize={4}
                />
                <Text color="gray.300" fontSize="sm">
                  {metric.label}
                </Text>
              </HStack>
              <Text color={metric.passed ? 'white' : 'gray.500'} fontSize="sm" fontWeight="medium">
                {metric.value}
              </Text>
            </HStack>
          ))}
        </VStack>

        <Divider borderColor="rgba(255, 255, 255, 0.08)" />

        {/* Grade Legend */}
        <VStack spacing={2} align="stretch">
          <Text color="gray.400" fontSize="xs" fontWeight="medium" textTransform="uppercase">
            Grade Scale
          </Text>
          <HStack justify="space-between" fontSize="xs">
            <Badge bg="rgba(34, 197, 94, 0.2)" color="#22C55E">
              A+ 90+
            </Badge>
            <Badge bg="rgba(255, 157, 0, 0.2)" color="#FF9D00">
              B 70-89
            </Badge>
            <Badge bg="rgba(239, 68, 68, 0.2)" color="#EF4444">
              C &lt;70
            </Badge>
          </HStack>
        </VStack>
      </VStack>
    </Box>
  );
}
