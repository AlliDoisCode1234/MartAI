'use client';

/**
 * HealthScoreCard Component
 *
 * Component Hierarchy:
 * App → Admin → Users → [id] → HealthScoreCard (this file)
 *
 * Displays user health score with factor breakdown for admins.
 */

import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  HStack,
  VStack,
  Badge,
  Progress,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';
import { HEALTH_TIER_COLORS } from '@/lib/constants/admin';
import { formatHealthTier } from '@/lib/utils/onboarding';
import type { HealthData } from '@/types/admin';

type Props = {
  health: HealthData | null;
};

export function HealthScoreCard({ health }: Props) {
  if (!health) {
    return (
      <Card>
        <CardHeader pb={0}>
          <Heading size="md">User Health</Heading>
        </CardHeader>
        <CardBody>
          <Text color="gray.500">Loading health score...</Text>
        </CardBody>
      </Card>
    );
  }

  const tierColor = HEALTH_TIER_COLORS[health.tier] || 'gray';
  const tierLabel = formatHealthTier(health.tier);

  return (
    <Card>
      <CardHeader pb={0}>
        <HStack justify="space-between">
          <Heading size="md">User Health</Heading>
          <Badge colorScheme={tierColor} fontSize="sm">
            {tierLabel}
          </Badge>
        </HStack>
      </CardHeader>
      <CardBody>
        <HStack spacing={6} align="start">
          <CircularProgress
            value={health.overall}
            size="100px"
            thickness="8px"
            color={`${tierColor}.400`}
          >
            <CircularProgressLabel fontWeight="bold" fontSize="xl">
              {health.overall}
            </CircularProgressLabel>
          </CircularProgress>
          <VStack align="start" spacing={2} flex={1}>
            <HStack justify="space-between" w="100%">
              <Text fontSize="sm" color="gray.600">
                Payment
              </Text>
              <Text fontWeight="medium">{health.factors?.payment || 0}</Text>
            </HStack>
            <Progress value={health.factors?.payment || 0} size="sm" colorScheme="blue" w="100%" />
            <HStack justify="space-between" w="100%">
              <Text fontSize="sm" color="gray.600">
                Engagement
              </Text>
              <Text fontWeight="medium">{health.factors?.engagement || 0}</Text>
            </HStack>
            <Progress
              value={health.factors?.engagement || 0}
              size="sm"
              colorScheme="green"
              w="100%"
            />
            <HStack justify="space-between" w="100%">
              <Text fontSize="sm" color="gray.600">
                Adoption
              </Text>
              <Text fontWeight="medium">{health.factors?.adoption || 0}</Text>
            </HStack>
            <Progress
              value={health.factors?.adoption || 0}
              size="sm"
              colorScheme="purple"
              w="100%"
            />
            <HStack justify="space-between" w="100%">
              <Text fontSize="sm" color="gray.600">
                Login
              </Text>
              <Text fontWeight="medium">{health.factors?.login || 0}</Text>
            </HStack>
            <Progress value={health.factors?.login || 0} size="sm" colorScheme="orange" w="100%" />
          </VStack>
        </HStack>
      </CardBody>
    </Card>
  );
}
