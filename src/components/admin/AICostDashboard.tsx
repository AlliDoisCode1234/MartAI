'use client';

/**
 * Component Hierarchy:
 * app/admin/ai-providers/page.tsx
 * └── AICostDashboard (this file)
 */

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Box,
  Flex,
  Text,
  Heading,
  SimpleGrid,
  Progress,
  Skeleton,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import { FiDollarSign, FiCpu, FiActivity, FiTrendingUp } from 'react-icons/fi';

interface Props {
  budget?: number; // Optional monthly budget in USD
}

// Type for daily cost trend data
interface DayCost {
  date: string;
  cost: number;
}

// Type for provider cost breakdown
interface ProviderCost {
  provider: string;
  cost: number;
  tokens: number;
  requests: number;
}

export function AICostDashboard({ budget = 200 }: Props) {
  const monthlySummary = useQuery(api.ai.admin.usageTracking.getMonthlyUsageSummary, {});
  const dailyTrend = useQuery(api.ai.admin.usageTracking.getDailyCostTrend, { days: 7 }) as
    | DayCost[]
    | undefined;

  if (!monthlySummary) {
    return (
      <Box bg="gray.800" p={6} borderRadius="lg" mb={6}>
        <Skeleton height="120px" />
      </Box>
    );
  }

  const budgetPercent = Math.min((monthlySummary.totalCost / budget) * 100, 100);
  const budgetColor = budgetPercent > 80 ? 'red' : budgetPercent > 60 ? 'yellow' : 'green';

  // Get max cost for trend visual scaling
  const maxCost = dailyTrend ? Math.max(...dailyTrend.map((d: DayCost) => d.cost), 0.01) : 1;

  return (
    <Box
      bg="linear-gradient(135deg, rgba(30, 30, 40, 0.95) 0%, rgba(20, 20, 30, 0.95) 100%)"
      backdropFilter="blur(20px)"
      border="1px solid"
      borderColor="whiteAlpha.100"
      p={6}
      borderRadius="xl"
      mb={6}
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md" color="white">
          AI Cost This Month
        </Heading>
        <Badge colorScheme={budgetColor} fontSize="sm" px={3} py={1}>
          {budgetPercent.toFixed(0)}% of ${budget} budget
        </Badge>
      </Flex>

      {/* Budget Progress */}
      <Box mb={6}>
        <Progress
          value={budgetPercent}
          colorScheme={budgetColor}
          bg="whiteAlpha.100"
          borderRadius="full"
          size="lg"
          hasStripe
          isAnimated
        />
        <Flex justify="space-between" mt={2}>
          <Text color="gray.400" fontSize="sm">
            ${monthlySummary.totalCost.toFixed(2)} spent
          </Text>
          <Text color="gray.400" fontSize="sm">
            ${(budget - monthlySummary.totalCost).toFixed(2)} remaining
          </Text>
        </Flex>
      </Box>

      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
        <Stat>
          <StatLabel color="gray.400">
            <Flex align="center" gap={1}>
              <FiDollarSign /> Total Cost
            </Flex>
          </StatLabel>
          <StatNumber color="white" fontSize="2xl">
            ${monthlySummary.totalCost.toFixed(2)}
          </StatNumber>
          <StatHelpText color="gray.500">This month</StatHelpText>
        </Stat>

        <Stat>
          <StatLabel color="gray.400">
            <Flex align="center" gap={1}>
              <FiCpu /> Tokens
            </Flex>
          </StatLabel>
          <StatNumber color="white" fontSize="2xl">
            {(monthlySummary.totalTokens / 1000).toFixed(1)}K
          </StatNumber>
          <StatHelpText color="gray.500">Total tokens</StatHelpText>
        </Stat>

        <Stat>
          <StatLabel color="gray.400">
            <Flex align="center" gap={1}>
              <FiActivity /> Requests
            </Flex>
          </StatLabel>
          <StatNumber color="white" fontSize="2xl">
            {monthlySummary.totalRequests}
          </StatNumber>
          <StatHelpText color="gray.500">API calls</StatHelpText>
        </Stat>

        <Stat>
          <StatLabel color="gray.400">
            <Flex align="center" gap={1}>
              <FiTrendingUp /> Avg Cost
            </Flex>
          </StatLabel>
          <StatNumber color="white" fontSize="2xl">
            $
            {monthlySummary.totalRequests > 0
              ? (monthlySummary.totalCost / monthlySummary.totalRequests).toFixed(3)
              : '0.00'}
          </StatNumber>
          <StatHelpText color="gray.500">Per request</StatHelpText>
        </Stat>
      </SimpleGrid>

      {/* Cost by Provider */}
      <Box mb={4}>
        <Text color="gray.400" fontSize="sm" mb={2} fontWeight="medium">
          Cost by Provider
        </Text>
        <Flex gap={4} flexWrap="wrap">
          {monthlySummary.byProvider.map((p: ProviderCost) => (
            <Box
              key={p.provider}
              bg="whiteAlpha.50"
              px={4}
              py={2}
              borderRadius="lg"
              border="1px solid"
              borderColor="whiteAlpha.100"
            >
              <Text color="gray.300" fontSize="sm" textTransform="capitalize">
                {p.provider}
              </Text>
              <Text color="white" fontSize="lg" fontWeight="bold">
                ${p.cost.toFixed(2)}
              </Text>
              <Text color="gray.500" fontSize="xs">
                {p.requests} requests
              </Text>
            </Box>
          ))}
          {monthlySummary.byProvider.length === 0 && (
            <Text color="gray.500" fontSize="sm">
              No usage data yet
            </Text>
          )}
        </Flex>
      </Box>

      {/* 7-Day Trend */}
      {dailyTrend && dailyTrend.length > 0 && (
        <Box>
          <Text color="gray.400" fontSize="sm" mb={2} fontWeight="medium">
            7-Day Trend
          </Text>
          <Flex align="flex-end" gap={1} h="60px">
            {dailyTrend.map((day: DayCost) => (
              <Box
                key={day.date}
                flex={1}
                bg={day.cost > 0 ? 'blue.500' : 'whiteAlpha.100'}
                h={`${Math.max((day.cost / maxCost) * 100, 5)}%`}
                borderRadius="sm"
                title={`${day.date}: $${day.cost.toFixed(2)}`}
                transition="height 0.3s ease"
              />
            ))}
          </Flex>
          <Flex justify="space-between" mt={1}>
            <Text color="gray.500" fontSize="xs">
              {dailyTrend[0]?.date}
            </Text>
            <Text color="gray.500" fontSize="xs">
              {dailyTrend[dailyTrend.length - 1]?.date}
            </Text>
          </Flex>
        </Box>
      )}
    </Box>
  );
}
