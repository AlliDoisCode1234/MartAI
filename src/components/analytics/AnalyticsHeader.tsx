'use client';

/**
 * AnalyticsHeader Component
 *
 * Component Hierarchy:
 * App → Analytics → AnalyticsHeader (this file)
 *
 * Gradient header with view selector and time range.
 */

import { Card, CardBody, HStack, VStack, Heading, Text, Select, Button } from '@chakra-ui/react';
import { ANALYTICS_TIME_RANGE_OPTIONS } from '@/src/constants/analyticsConstants';
import { formatShortDate } from '@/lib/dateUtils';

type CompetitorHistory = Array<{ _id: string; url: string; createdAt: number }>;

type Props = {
  selectedViewId: string;
  onViewChange: (viewId: string) => void;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  onAnalyzeClick: () => void;
  onSyncClick: () => void;
  syncing: boolean;
  competitorHistory?: CompetitorHistory;
};

export function AnalyticsHeader({
  selectedViewId,
  onViewChange,
  timeRange,
  onTimeRangeChange,
  onAnalyzeClick,
  onSyncClick,
  syncing,
  competitorHistory,
}: Props) {
  return (
    <Card bgGradient="linear(135deg, #F7941E 0%, #40DEC7 100%)" shadow="xl" border="none">
      <CardBody>
        <HStack justify="space-between" flexWrap="wrap" gap={4}>
          <VStack align="start" spacing={2}>
            <HStack spacing={3}>
              <Text fontSize="3xl" color="brand.orange">
                ●
              </Text>
              <VStack align="start" spacing={0}>
                <Heading size="2xl" fontWeight="bold" fontFamily="heading" color="white">
                  Analytics Dashboard
                </Heading>
                <Text color="white" opacity={0.9} fontSize="sm">
                  Track your SEO performance and growth in real-time
                </Text>
              </VStack>
            </HStack>
          </VStack>
          <HStack spacing={3}>
            <Select
              value={selectedViewId}
              onChange={(e) => onViewChange(e.target.value)}
              w="250px"
              bg="white"
              size="md"
              fontWeight="bold"
              color="brand.dark"
            >
              <option value="main">▶ Main Project (Live)</option>
              <option disabled>──────────</option>
              {competitorHistory?.map((h) => (
                <option key={h._id} value={h._id}>
                  → {h.url} ({formatShortDate(h.createdAt)})
                </option>
              ))}
            </Select>
            {selectedViewId === 'main' && (
              <Select
                value={timeRange}
                onChange={(e) => onTimeRangeChange(e.target.value)}
                w="auto"
                bg="white"
                size="md"
                fontWeight="semibold"
              >
                {ANALYTICS_TIME_RANGE_OPTIONS.map((days) => (
                  <option key={days} value={days}>
                    Last {days} days
                  </option>
                ))}
              </Select>
            )}
            <Button
              onClick={onAnalyzeClick}
              leftIcon={<Text>+</Text>}
              size="md"
              colorScheme="blue"
              variant="solid"
            >
              Analyze New URL
            </Button>
            {selectedViewId === 'main' && (
              <Button
                onClick={onSyncClick}
                isLoading={syncing}
                loadingText="Syncing..."
                bg="white"
                color="brand.orange"
                _hover={{ bg: 'gray.50' }}
                size="md"
                fontWeight="bold"
                shadow="lg"
              >
                {syncing ? '' : '↻'}
              </Button>
            )}
          </HStack>
        </HStack>
      </CardBody>
    </Card>
  );
}
