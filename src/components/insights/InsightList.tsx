'use client';

import {
  Box,
  VStack,
  HStack,
  Text,
  SimpleGrid,
  Skeleton,
  Icon,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { InsightCard, InsightData } from './InsightCard';
import { FiInbox } from 'react-icons/fi';

const MotionBox = motion(Box);

interface InsightListProps {
  projectId: Id<'projects'>;
  type?: string;
  title?: string;
  maxItems?: number;
  columns?: number;
}

export function InsightList({
  projectId,
  type,
  title,
  maxItems = 6,
  columns = 2,
}: InsightListProps) {
  const insights = useQuery(api.analytics.analytics.getInsights, {
    projectId,
    type,
  });

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');

  const isLoading = insights === undefined;
  const displayInsights = (insights || []).slice(0, maxItems) as InsightData[];
  const activeCount = displayInsights.filter((i) => i.status === 'active').length;

  if (isLoading) {
    return (
      <VStack align="stretch" spacing={4}>
        {title && (
          <HStack justify="space-between">
            <Skeleton height="24px" width="150px" />
            <Skeleton height="20px" width="60px" borderRadius="full" />
          </HStack>
        )}
        <SimpleGrid columns={{ base: 1, md: columns }} spacing={4}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height="180px" borderRadius="xl" />
          ))}
        </SimpleGrid>
      </VStack>
    );
  }

  if (displayInsights.length === 0) {
    return (
      <MotionBox
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="xl"
        p={8}
        textAlign="center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <VStack spacing={4}>
          <Icon as={FiInbox} boxSize={10} color="gray.400" />
          <Text color="gray.500">No {type?.replace('_', ' ') || 'insights'} yet</Text>
          <Text fontSize="sm" color="gray.400">
            Insights will appear after syncing analytics data
          </Text>
        </VStack>
      </MotionBox>
    );
  }

  return (
    <VStack align="stretch" spacing={4}>
      {title && (
        <HStack justify="space-between">
          <Text fontSize="lg" fontWeight="bold">
            {title}
          </Text>
          {activeCount > 0 && (
            <Badge colorScheme="brand" borderRadius="full" px={3} py={1}>
              {activeCount} active
            </Badge>
          )}
        </HStack>
      )}
      <SimpleGrid columns={{ base: 1, md: columns }} spacing={4}>
        {displayInsights.map((insight, i) => (
          <InsightCard key={insight._id} insight={insight} delay={i * 0.1} />
        ))}
      </SimpleGrid>
    </VStack>
  );
}
