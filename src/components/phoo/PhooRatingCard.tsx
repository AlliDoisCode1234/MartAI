/**
 * PhooRatingCard - Display Phoo Rating for a project
 *
 * Component Hierarchy:
 * src/components/phoo/PhooRatingCard.tsx (this file)
 * ├── Shows circular progress gauge
 * ├── Shows status (Needs Work → Excellent)
 * ├── Shows breakdown by component
 * └── Shows top opportunity
 */

'use client';

import {
  Box,
  Card,
  CardBody,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Heading,
  HStack,
  Icon,
  Progress,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import {
  FiActivity,
  FiCheckCircle,
  FiAlertCircle,
  FiTrendingUp,
  FiTarget,
  FiFileText,
  FiSearch,
} from 'react-icons/fi';

interface Props {
  projectId: Id<'projects'>;
}

const COMPONENT_ICONS: Record<string, React.ElementType> = {
  'SEO Health': FiActivity,
  'Keyword Strategy': FiSearch,
  'Content Clusters': FiTarget,
  'Content Execution': FiFileText,
  'GEO Readiness': FiTrendingUp, // Using TrendingUp to represent AI optimization
};

const STATUS_COLORS: Record<string, string> = {
  'Needs Work': 'red',
  Fair: 'orange',
  Good: 'yellow',
  Great: 'green',
  Excellent: 'teal',
};

export default function PhooRatingCard({ projectId }: Props) {
  const rating = useQuery(api.phoo.lib.rating.getPhooRating, { projectId });

  if (!rating) {
    return (
      <Card bg="white" borderRadius="xl" boxShadow="lg">
        <CardBody>
          <VStack spacing={4}>
            <Skeleton height="120px" width="120px" borderRadius="full" />
            <Skeleton height="20px" width="100px" />
            <Skeleton height="40px" width="100%" />
          </VStack>
        </CardBody>
      </Card>
    );
  }

  const colorScheme = STATUS_COLORS[rating.status] || 'gray';

  return (
    <Card bg="white" borderRadius="xl" boxShadow="lg" overflow="hidden">
      <CardBody>
        <VStack spacing={6} align="stretch">
          {/* Header with Circular Progress */}
          <Flex direction="column" align="center" gap={3}>
            <CircularProgress
              value={rating.rating}
              size="120px"
              thickness="8px"
              color={`${colorScheme}.500`}
              trackColor="gray.100"
            >
              <CircularProgressLabel>
                <VStack spacing={0}>
                  <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                    {rating.rating}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    / 100
                  </Text>
                </VStack>
              </CircularProgressLabel>
            </CircularProgress>

            <HStack>
              <Icon
                as={rating.rating >= 50 ? FiCheckCircle : FiAlertCircle}
                color={`${colorScheme}.500`}
              />
              <Text fontSize="lg" fontWeight="semibold" color={`${colorScheme}.600`}>
                {rating.status}
              </Text>
            </HStack>
          </Flex>

          {/* Breakdown */}
          <VStack align="stretch" spacing={3}>
            <Heading size="sm" color="gray.700">
              Score Breakdown
            </Heading>
            {rating.breakdown.map(
              (item: {
                component: string;
                score: number;
                weight: number;
                weighted: number;
                details: string;
              }) => {
                const ComponentIcon = COMPONENT_ICONS[item.component] || FiActivity;
                return (
                  <Box key={item.component}>
                    <HStack justify="space-between" mb={1}>
                      <HStack spacing={2}>
                        <Icon as={ComponentIcon} color="gray.500" boxSize={4} />
                        <Text fontSize="sm" color="gray.600">
                          {item.component}
                        </Text>
                      </HStack>
                      <Text fontSize="sm" fontWeight="medium" color="gray.800">
                        {item.score}
                      </Text>
                    </HStack>
                    <Progress
                      value={item.score}
                      size="sm"
                      borderRadius="full"
                      colorScheme={item.score >= 70 ? 'green' : item.score >= 40 ? 'yellow' : 'red'}
                      bg="gray.100"
                    />
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      {item.details}
                    </Text>
                  </Box>
                );
              }
            )}
          </VStack>

          {/* Top Opportunity */}
          <Box
            bg={`${colorScheme}.50`}
            borderRadius="lg"
            p={4}
            borderLeft="3px solid"
            borderColor={`${colorScheme}.500`}
          >
            <HStack spacing={2} mb={2}>
              <Icon as={FiTrendingUp} color={`${colorScheme}.500`} />
              <Text fontSize="sm" fontWeight="semibold" color={`${colorScheme}.600`}>
                Top Opportunity
              </Text>
            </HStack>
            <Text fontSize="sm" color="gray.700">
              {rating.topOpportunity}
            </Text>
          </Box>

          {/* Insights */}
          {rating.insights.length > 0 && (
            <VStack align="stretch" spacing={2}>
              <Text fontSize="xs" fontWeight="medium" color="gray.500" textTransform="uppercase">
                Insights
              </Text>
              {rating.insights.map((insight: string, index: number) => (
                <HStack key={index} align="start" spacing={2}>
                  <Box w="4px" h="4px" bg="gray.400" borderRadius="full" mt={2} />
                  <Text fontSize="sm" color="gray.600">
                    {insight}
                  </Text>
                </HStack>
              ))}
            </VStack>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}
