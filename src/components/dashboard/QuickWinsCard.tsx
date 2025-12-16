'use client';

/**
 * QuickWinsCard Component
 *
 * Component Hierarchy:
 * App → Dashboard → QuickWinsCard (this file)
 *
 * Displays top 5 low-hanging fruit keywords for quick content wins.
 */

import {
  Card,
  CardBody,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  Button,
  Icon,
  Box,
  Skeleton,
} from '@chakra-ui/react';
import { FiZap, FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

type Props = {
  projectId: Id<'projects'>;
};

function getDifficultyColor(difficulty: number): string {
  if (difficulty <= 15) return 'green';
  if (difficulty <= 25) return 'teal';
  return 'yellow';
}

function formatVolume(volume: number): string {
  if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
  return volume.toString();
}

type QuickWinItem = {
  _id: string;
  keyword: string;
  searchVolume?: number;
  difficulty?: number;
  intent?: string;
  opportunityScore: number;
};

export function QuickWinsCard({ projectId }: Props) {
  const router = useRouter();
  const quickWins = useQuery(api.content.quickWins.getQuickWins, { projectId, limit: 5 });

  const handleCreateBrief = (keyword: string) => {
    // Navigate to content editor with keyword pre-filled
    router.push(`/content?keyword=${encodeURIComponent(keyword)}`);
  };

  // Loading state
  if (quickWins === undefined) {
    return (
      <Card>
        <CardBody>
          <VStack align="stretch" spacing={4}>
            <HStack>
              <Icon as={FiZap} color="yellow.500" />
              <Heading size="md">Quick Wins</Heading>
            </HStack>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} height="60px" borderRadius="md" />
            ))}
          </VStack>
        </CardBody>
      </Card>
    );
  }

  // Empty state
  if (quickWins.length === 0) {
    return (
      <Card>
        <CardBody>
          <VStack align="stretch" spacing={4}>
            <HStack>
              <Icon as={FiZap} color="yellow.500" />
              <Heading size="md">Quick Wins</Heading>
            </HStack>
            <Box textAlign="center" py={6}>
              <Icon as={FiTrendingUp} boxSize={8} color="gray.300" mb={2} />
              <Text color="gray.500">Generate keywords from Strategy to discover quick wins</Text>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <HStack justify="space-between">
            <HStack>
              <Icon as={FiZap} color="yellow.500" />
              <Heading size="md">Quick Wins</Heading>
            </HStack>
            <Badge colorScheme="yellow">{quickWins.length} opportunities</Badge>
          </HStack>

          <Text fontSize="sm" color="gray.600">
            Low-difficulty keywords with good search volume – rank fast!
          </Text>

          <VStack align="stretch" spacing={2}>
            {(quickWins as QuickWinItem[]).map((win) => (
              <HStack
                key={win._id}
                p={3}
                bg="gray.50"
                borderRadius="md"
                justify="space-between"
                _hover={{ bg: 'gray.100' }}
              >
                <Box flex={1}>
                  <Text fontWeight="medium" noOfLines={1}>
                    {win.keyword}
                  </Text>
                  <HStack spacing={2} mt={1}>
                    <Badge size="sm" colorScheme={getDifficultyColor(win.difficulty ?? 0)}>
                      KD {win.difficulty ?? 0}
                    </Badge>
                    <Text fontSize="xs" color="gray.500">
                      {formatVolume(win.searchVolume ?? 0)}/mo
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      {win.intent || 'informational'}
                    </Text>
                  </HStack>
                </Box>
                <Button
                  size="sm"
                  colorScheme="orange"
                  variant="ghost"
                  rightIcon={<FiArrowRight />}
                  onClick={() => handleCreateBrief(win.keyword)}
                >
                  Write
                </Button>
              </HStack>
            ))}
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  );
}
