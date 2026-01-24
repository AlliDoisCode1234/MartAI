'use client';

/**
 * Content Journey Component
 *
 * Component Hierarchy:
 * App → StudioLayout → Strategy → ContentJourney (this file)
 *
 * Shows content progress across awareness levels with user-friendly terminology.
 * Replaces technical "awareness levels" with simple language users understand.
 */

import { Box, VStack, HStack, Heading, Text, Progress, Icon, Tooltip } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiInfo, FiShoppingCart, FiSearch, FiBookOpen, FiEye, FiHelpCircle } from 'react-icons/fi';

const MotionBox = motion(Box);

// User-friendly mapping of awareness levels
const JOURNEY_STAGES = [
  {
    id: 'ready_to_buy',
    label: 'Ready to Buy',
    description: 'Demos, pricing, ROI calculators',
    icon: FiShoppingCart,
    color: 'green.400',
    technical: 'Most Aware',
  },
  {
    id: 'comparing_options',
    label: 'Comparing Options',
    description: 'Versus posts, reviews, case studies',
    icon: FiSearch,
    color: 'blue.400',
    technical: 'Product Aware',
  },
  {
    id: 'learning_solutions',
    label: 'Learning Solutions',
    description: 'How-to guides, educational content',
    icon: FiBookOpen,
    color: 'purple.400',
    technical: 'Solution Aware',
  },
  {
    id: 'discovering_needs',
    label: 'Discovering Needs',
    description: 'Blog posts addressing pain points',
    icon: FiEye,
    color: 'orange.400',
    technical: 'Problem Aware',
  },
  {
    id: 'building_awareness',
    label: 'Building Awareness',
    description: 'Broad educational content',
    icon: FiHelpCircle,
    color: 'gray.400',
    technical: 'Unaware',
  },
];

interface Props {
  contentByStage: {
    ready_to_buy: number;
    comparing_options: number;
    learning_solutions: number;
    discovering_needs: number;
    building_awareness: number;
  };
  totalContent: number;
}

export function ContentJourney({ contentByStage, totalContent }: Props) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      bg="rgba(255, 255, 255, 0.02)"
      borderRadius="12px"
      border="1px solid rgba(255, 255, 255, 0.08)"
      p={4}
    >
      <VStack align="stretch" spacing={5}>
        {/* Header */}
        <HStack justify="space-between">
          <VStack align="start" spacing={1}>
            <Heading size="md" color="white">
              Content Journey
            </Heading>
            <Text color="gray.500" fontSize="sm">
              How your content guides visitors from discovery to purchase
            </Text>
          </VStack>
          <Tooltip
            label="Content is mapped to customer journey stages. Start with 'Ready to Buy' for fastest results."
            placement="top"
            hasArrow
            bg="gray.700"
          >
            <Box>
              <Icon as={FiInfo} color="gray.500" cursor="help" />
            </Box>
          </Tooltip>
        </HStack>

        {/* Journey Stages */}
        <VStack spacing={4} align="stretch">
          {JOURNEY_STAGES.map((stage, index) => {
            const count = contentByStage[stage.id as keyof typeof contentByStage] || 0;
            const percentage = totalContent > 0 ? (count / totalContent) * 100 : 0;

            return (
              <MotionBox
                key={stage.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <HStack spacing={4}>
                  {/* Icon */}
                  <Box
                    bg={`${stage.color.replace('.400', '.900')}`}
                    p={2}
                    borderRadius="8px"
                    opacity={count > 0 ? 1 : 0.4}
                  >
                    <Icon as={stage.icon} color={stage.color} boxSize={5} />
                  </Box>

                  {/* Label and Progress */}
                  <VStack flex={1} align="stretch" spacing={1}>
                    <HStack justify="space-between">
                      <Text color="white" fontSize="sm" fontWeight="medium">
                        {stage.label}
                      </Text>
                      <Text color="gray.500" fontSize="xs">
                        {count} pieces
                      </Text>
                    </HStack>
                    <Progress
                      value={percentage}
                      size="sm"
                      borderRadius="full"
                      bg="rgba(255, 255, 255, 0.1)"
                      sx={{
                        '& > div': {
                          bg: stage.color,
                        },
                      }}
                    />
                    <Text color="gray.600" fontSize="xs">
                      {stage.description}
                    </Text>
                  </VStack>
                </HStack>
              </MotionBox>
            );
          })}
        </VStack>
      </VStack>
    </MotionBox>
  );
}

// Helper to map content types to journey stages
export function mapContentToJourneyStages(
  contentByType: Record<string, number>
): Props['contentByStage'] {
  const stages = {
    ready_to_buy: 0,
    comparing_options: 0,
    learning_solutions: 0,
    discovering_needs: 0,
    building_awareness: 0,
  };

  // Map content types to stages based on intent
  const typeToStage: Record<string, keyof typeof stages> = {
    // Ready to Buy (conversion-focused)
    landing: 'ready_to_buy',
    paidProduct: 'ready_to_buy',
    leadMagnet: 'ready_to_buy',

    // Comparing Options (evaluation-focused)
    blogVersus: 'comparing_options',
    service: 'comparing_options',

    // Learning Solutions (solution-focused)
    blog: 'learning_solutions',
    blogVideo: 'learning_solutions',
    contentRefresh: 'learning_solutions',

    // Discovering Needs (problem-focused)
    about: 'discovering_needs',
    homepage: 'discovering_needs',

    // Building Awareness (broad education)
    areasWeServe: 'building_awareness',
    employment: 'building_awareness',
    events: 'building_awareness',
    mentorship: 'building_awareness',
    donate: 'building_awareness',
    partner: 'building_awareness',
    program: 'building_awareness',
  };

  Object.entries(contentByType).forEach(([type, count]) => {
    const stage = typeToStage[type] || 'learning_solutions';
    stages[stage] += count;
  });

  return stages;
}
