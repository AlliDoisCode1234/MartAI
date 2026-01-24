'use client';

/**
 * Strategy Narrative Component
 *
 * Component Hierarchy:
 * App → StudioLayout → Strategy → StrategyNarrative (this file)
 *
 * Tells the story of what content was auto-created for the user and why.
 * Replaces the old "Stage X of 4" wizard approach.
 */

import { Box, VStack, HStack, Heading, Text, Icon, Badge } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiCheck, FiZap } from 'react-icons/fi';
import { CONTENT_TYPE_CONFIG, getContentTypesByCategory } from '@/lib/constants/contentTypes';

const MotionBox = motion(Box);

interface Props {
  projectName: string;
  industry: string;
  totalContent: number;
  contentByCategory: {
    'Core Pages': number;
    'Blog Content': number;
    Conversion: number;
    'Local/Geo': number;
    Specialty: number;
  };
  websiteUrl?: string;
}

export function StrategyNarrative({
  projectName,
  industry,
  totalContent,
  contentByCategory,
  websiteUrl,
}: Props) {
  // Calculate total word count target
  const categories = getContentTypesByCategory();
  const totalWordTarget = Object.entries(contentByCategory).reduce((total, [category, count]) => {
    const categoryTypes = categories[category as keyof typeof categories] || [];
    const avgWordCount =
      categoryTypes.reduce((sum, t) => sum + t.wordTarget, 0) / (categoryTypes.length || 1);
    return total + count * avgWordCount;
  }, 0);

  return (
    <MotionBox
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      bg="rgba(255, 255, 255, 0.02)"
      borderRadius="12px"
      border="1px solid rgba(255, 255, 255, 0.08)"
      p={4}
    >
      <VStack align="start" spacing={4}>
        {/* Main Narrative */}
        <VStack align="start" spacing={2}>
          <HStack>
            <Icon as={FiZap} color="#FF9D00" boxSize={6} />
            <Badge
              bg="rgba(255, 157, 0, 0.2)"
              color="#FF9D00"
              fontSize="xs"
              px={2}
              py={1}
              borderRadius="full"
            >
              AI-Powered Strategy
            </Badge>
          </HStack>
          <Heading size="md" color="white" lineHeight="1.3">
            We analyzed {websiteUrl || projectName} and created{' '}
            <Text as="span" color="#FF9D00">
              {totalContent} pieces
            </Text>{' '}
            for{' '}
            <Text as="span" color="#FF9D00">
              {industry || 'your'} industry
            </Text>
          </Heading>
          <Text color="gray.400" fontSize="md">
            Targeting approximately {Math.round(totalWordTarget).toLocaleString()} words of
            SEO-optimized content
          </Text>
        </VStack>

        {/* Category Breakdown */}
        <HStack spacing={4} flexWrap="wrap" pt={2}>
          {Object.entries(contentByCategory).map(([category, count]) => {
            if (count === 0) return null;
            return (
              <HStack
                key={category}
                bg="rgba(255, 255, 255, 0.05)"
                px={3}
                py={2}
                borderRadius="8px"
                spacing={2}
              >
                <Icon as={FiCheck} color="green.400" boxSize={4} />
                <Text color="white" fontSize="sm" fontWeight="medium">
                  {count} {category}
                </Text>
              </HStack>
            );
          })}
        </HStack>
      </VStack>
    </MotionBox>
  );
}
