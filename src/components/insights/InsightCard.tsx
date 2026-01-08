'use client';

/**
 * InsightCard
 * ├── src/components/insights/
 * │   └── InsightCard.tsx (this file)
 */

import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Icon,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FiTrendingUp,
  FiTarget,
  FiZap,
  FiLayers,
  FiFileText,
  FiArrowRight,
  FiCheckCircle,
} from 'react-icons/fi';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useState } from 'react';

const MotionBox = motion(Box);

// Type config for different insight types
const INSIGHT_TYPE_CONFIG: Record<
  string,
  { icon: typeof FiZap; color: string; label: string; bgGradient: string }
> = {
  quick_win: {
    icon: FiZap,
    color: 'yellow.500',
    label: 'Quick Win',
    bgGradient: 'linear(to-br, yellow.400, orange.400)',
  },
  semantic_opportunity: {
    icon: FiTarget,
    color: 'purple.500',
    label: 'Opportunity',
    bgGradient: 'linear(to-br, purple.400, pink.400)',
  },
  content_gap: {
    icon: FiTrendingUp,
    color: 'blue.500',
    label: 'Content Gap',
    bgGradient: 'linear(to-br, blue.400, cyan.400)',
  },
  cluster_suggestion: {
    icon: FiLayers,
    color: 'green.500',
    label: 'Cluster',
    bgGradient: 'linear(to-br, green.400, teal.400)',
  },
  brief_suggestion: {
    icon: FiFileText,
    color: 'orange.500',
    label: 'Brief Idea',
    bgGradient: 'linear(to-br, orange.400, red.400)',
  },
};

export type InsightData = {
  _id: Id<'insights'>;
  type: string;
  title: string;
  description: string;
  priority?: 'high' | 'medium' | 'low';
  metadata?: Record<string, unknown>;
  status: string;
};

type Props = {
  insight: InsightData;
  delay?: number;
  onApplied?: () => void;
};

export function InsightCard({ insight, delay = 0, onApplied }: Props) {
  const [isApplying, setIsApplying] = useState(false);
  const applyInsight = useMutation(api.analytics.analytics.applyInsight);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const textMuted = useColorModeValue('gray.600', 'gray.400');

  const config = INSIGHT_TYPE_CONFIG[insight.type] || INSIGHT_TYPE_CONFIG.quick_win;
  const IconComponent = config.icon;

  const handleApply = async () => {
    setIsApplying(true);
    try {
      await applyInsight({ insightId: insight._id });
      onApplied?.();
    } catch (e) {
      console.error('Failed to apply insight:', e);
    } finally {
      setIsApplying(false);
    }
  };

  const priorityColors = {
    high: 'red',
    medium: 'yellow',
    low: 'green',
  };

  return (
    <MotionBox
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      p={5}
      boxShadow="sm"
      _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
      style={{ transition: 'all 0.2s' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <VStack align="stretch" spacing={4}>
        {/* Header */}
        <HStack justify="space-between">
          <HStack spacing={3}>
            <Box p={2} borderRadius="lg" bgGradient={config.bgGradient} color="white">
              <Icon as={IconComponent} boxSize={5} />
            </Box>
            <VStack align="start" spacing={0}>
              <Badge
                colorScheme={config.color.split('.')[0]}
                fontSize="xs"
                textTransform="uppercase"
                borderRadius="full"
              >
                {config.label}
              </Badge>
              {insight.priority && (
                <Badge
                  colorScheme={priorityColors[insight.priority]}
                  variant="subtle"
                  fontSize="2xs"
                  mt={1}
                >
                  {insight.priority} priority
                </Badge>
              )}
            </VStack>
          </HStack>

          {insight.status === 'applied' && (
            <Icon as={FiCheckCircle} color="green.500" boxSize={5} />
          )}
        </HStack>

        {/* Content */}
        <VStack align="stretch" spacing={2}>
          <Text fontWeight="semibold" fontSize="md" noOfLines={2}>
            {insight.title}
          </Text>
          <Text fontSize="sm" color={textMuted} noOfLines={3}>
            {insight.description}
          </Text>
        </VStack>

        {/* Action */}
        {insight.status !== 'applied' && (
          <Tooltip label="Create a brief from this insight" hasArrow>
            <Button
              size="sm"
              colorScheme="brand"
              rightIcon={<FiArrowRight />}
              onClick={handleApply}
              isLoading={isApplying}
              loadingText="Applying..."
            >
              Apply Insight
            </Button>
          </Tooltip>
        )}
      </VStack>
    </MotionBox>
  );
}
