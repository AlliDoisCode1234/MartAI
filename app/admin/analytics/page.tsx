'use client';

/**
 * Admin Analytics Dashboard
 *
 * Component Hierarchy:
 * App → Admin → Analytics (this file)
 *
 * BI dashboard for super admins with:
 * - Funnel visualization
 * - Event trends
 * - Live event feed
 * - Top events
 *
 * ACCESS: super_admin only (RLS protected)
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  VStack,
  Heading,
  Text,
  Box,
  Grid,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Skeleton,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  FiTrendingUp,
  FiUsers,
  FiActivity,
  FiTarget,
  FiDollarSign,
  FiPercent,
} from 'react-icons/fi';
import { useAuth } from '@/lib/useAuth';
import { TrendChart } from '@/src/components/admin/TrendChart';

// Types
interface FunnelStep {
  step: string;
  label: string;
  count: number;
  uniqueUsers: number;
  conversionRate: number;
}

interface TopEvent {
  event: string;
  count: number;
}

interface RecentEvent {
  _id: string;
  event: string;
  url?: string;
  timestamp: number;
}

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [dateRange, setDateRange] = useState('30');
  const days = parseInt(dateRange);
  const startDate = Date.now() - days * 24 * 60 * 60 * 1000;

  // Route-level protection: super_admin only
  useEffect(() => {
    if (!authLoading && user && user.role !== 'super_admin') {
      router.replace('/admin');
    }
  }, [authLoading, user, router]);

  // Queries (will fail on backend too if not super_admin)
  // Only run queries when user is confirmed to be super_admin
  const isSuperAdmin = user && user.role === 'super_admin';

  const funnelData = useQuery(
    api.analytics.eventTracking.getFunnelMetrics,
    isSuperAdmin ? { startDate } : 'skip'
  );
  const topEvents = useQuery(
    api.analytics.eventTracking.getTopEvents,
    isSuperAdmin ? { days } : 'skip'
  );
  const recentEvents = useQuery(
    api.analytics.eventTracking.getRecentEvents,
    isSuperAdmin ? { limit: 20 } : 'skip'
  );
  const trendData = useQuery(
    api.analytics.eventTracking.getEventTrends,
    isSuperAdmin ? { days, groupBy: 'day' } : 'skip'
  );
  const subscriptionMetrics = useQuery(
    api.subscriptions.subscriptionMetrics.getSubscriptionMetrics,
    isSuperAdmin ? {} : 'skip'
  );

  // Access denied state
  if (!authLoading && user && user.role !== 'super_admin') {
    return (
      <Box minH="calc(100vh - 64px)" bg="gray.50" py={8}>
        <Container maxW="7xl">
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            Access denied. Super admin role required.
          </Alert>
        </Container>
      </Box>
    );
  }

  const isLoading = authLoading || !funnelData || !topEvents || !recentEvents;

  if (isLoading) {
    return (
      <Box minH="calc(100vh - 64px)" bg="gray.50" py={8}>
        <Container maxW="7xl">
          <VStack spacing={6} align="stretch">
            <Skeleton height="40px" width="300px" />
            <Grid templateColumns="repeat(4, 1fr)" gap={4}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} height="100px" borderRadius="lg" />
              ))}
            </Grid>
            <Skeleton height="300px" borderRadius="lg" />
          </VStack>
        </Container>
      </Box>
    );
  }

  // Calculate overview stats
  const totalEvents = funnelData.totalEvents;
  const activationRate =
    funnelData.funnel.length > 0
      ? ((funnelData.funnel[funnelData.funnel.length - 1]?.count || 0) /
          (funnelData.funnel[0]?.count || 1)) *
        100
      : 0;

  return (
    <Box minH="calc(100vh - 64px)" bg="gray.50" py={8}>
      <Container maxW="7xl">
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Heading size="lg">Analytics Dashboard</Heading>
              <Text color="gray.600">BI insights for product decisions</Text>
            </VStack>
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              maxW="150px"
              bg="white"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </Select>
          </HStack>

          {/* Overview Stats */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4}>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>
                    <HStack>
                      <FiActivity />
                      <Text>Total Events</Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber>{totalEvents.toLocaleString()}</StatNumber>
                  <StatHelpText>Last {days} days</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>
                    <HStack>
                      <FiTarget />
                      <Text>Activation Rate</Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber>{activationRate.toFixed(1)}%</StatNumber>
                  <StatHelpText>
                    <StatArrow type={activationRate > 5 ? 'increase' : 'decrease'} />
                    Signup to Publish
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>
                    <HStack>
                      <FiUsers />
                      <Text>Signups</Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber>
                    {funnelData.funnel.find((f: FunnelStep) => f.step === 'signup_completed')
                      ?.count || 0}
                  </StatNumber>
                  <StatHelpText>Completed signups</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>
                    <HStack>
                      <FiTrendingUp />
                      <Text>Published</Text>
                    </HStack>
                  </StatLabel>
                  <StatNumber>
                    {funnelData.funnel.find((f: FunnelStep) => f.step === 'content_published')
                      ?.count || 0}
                  </StatNumber>
                  <StatHelpText>Content published</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </Grid>

          {/* Revenue Metrics */}
          {subscriptionMetrics && (
            <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4}>
              <Card bg="green.50" borderColor="green.200" borderWidth="1px">
                <CardBody>
                  <Stat>
                    <StatLabel>
                      <HStack>
                        <FiDollarSign />
                        <Text>MRR</Text>
                      </HStack>
                    </StatLabel>
                    <StatNumber color="green.600">{subscriptionMetrics.mrrFormatted}</StatNumber>
                    <StatHelpText>
                      <StatArrow
                        type={subscriptionMetrics.growthRate > 0 ? 'increase' : 'decrease'}
                      />
                      {Math.abs(subscriptionMetrics.growthRate)}% vs last month
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>
                      <HStack>
                        <FiUsers />
                        <Text>Active Subscribers</Text>
                      </HStack>
                    </StatLabel>
                    <StatNumber>{subscriptionMetrics.activeCount}</StatNumber>
                    <StatHelpText>+{subscriptionMetrics.newThisMonth} this month</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>
                      <HStack>
                        <FiPercent />
                        <Text>Churn Rate</Text>
                      </HStack>
                    </StatLabel>
                    <StatNumber color={subscriptionMetrics.churnRate > 5 ? 'red.500' : 'green.500'}>
                      {subscriptionMetrics.churnRate}%
                    </StatNumber>
                    <StatHelpText>
                      {subscriptionMetrics.churnedThisMonth} cancelled this month
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>
                      <HStack>
                        <FiTrendingUp />
                        <Text>Est. LTV</Text>
                      </HStack>
                    </StatLabel>
                    <StatNumber>{subscriptionMetrics.ltvFormatted}</StatNumber>
                    <StatHelpText>12-month average</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </Grid>
          )}

          {/* Event Trends Chart */}
          {trendData && trendData.trend.length > 0 && (
            <Card>
              <CardHeader>
                <Heading size="md">Event Trends</Heading>
                <Text fontSize="sm" color="gray.600">
                  Daily event volume over {days} days
                </Text>
              </CardHeader>
              <CardBody>
                <TrendChart data={trendData.trend} height={150} />
              </CardBody>
            </Card>
          )}

          {/* Funnel Visualization */}
          <Card>
            <CardHeader>
              <Heading size="md">User Funnel</Heading>
              <Text fontSize="sm" color="gray.600">
                Conversion rates at each step
              </Text>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {funnelData.funnel.map((step: FunnelStep, index: number) => {
                  const maxCount = funnelData.funnel[0]?.count || 1;
                  const percentage = (step.count / maxCount) * 100;

                  return (
                    <Box key={step.step}>
                      <HStack justify="space-between" mb={1}>
                        <HStack>
                          <Badge colorScheme={index === 0 ? 'green' : 'gray'}>{index + 1}</Badge>
                          <Text fontWeight="medium">{step.label}</Text>
                        </HStack>
                        <HStack>
                          <Text fontWeight="bold">{step.count}</Text>
                          {index > 0 && (
                            <Badge
                              colorScheme={
                                step.conversionRate > 50
                                  ? 'green'
                                  : step.conversionRate > 20
                                    ? 'yellow'
                                    : 'red'
                              }
                            >
                              {step.conversionRate}% from prev
                            </Badge>
                          )}
                        </HStack>
                      </HStack>
                      <Progress
                        value={percentage}
                        colorScheme={percentage > 50 ? 'green' : percentage > 20 ? 'yellow' : 'red'}
                        size="sm"
                        borderRadius="full"
                      />
                    </Box>
                  );
                })}
              </VStack>
            </CardBody>
          </Card>

          {/* Top Events & Recent Events */}
          <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
            {/* Top Events */}
            <Card>
              <CardHeader>
                <Heading size="md">Top Events</Heading>
                <Text fontSize="sm" color="gray.600">
                  Most frequent events
                </Text>
              </CardHeader>
              <CardBody>
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>Event</Th>
                      <Th isNumeric>Count</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {topEvents.topEvents.map((event: TopEvent) => (
                      <Tr key={event.event}>
                        <Td>
                          <Text fontWeight="medium">{event.event.replace(/_/g, ' ')}</Text>
                        </Td>
                        <Td isNumeric>{event.count}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>

            {/* Recent Events */}
            <Card>
              <CardHeader>
                <Heading size="md">Live Feed</Heading>
                <Text fontSize="sm" color="gray.600">
                  Recent events
                </Text>
              </CardHeader>
              <CardBody maxH="400px" overflowY="auto">
                <VStack spacing={2} align="stretch">
                  {recentEvents.map((event: RecentEvent) => (
                    <HStack
                      key={event._id}
                      p={2}
                      bg="gray.50"
                      borderRadius="md"
                      justify="space-between"
                    >
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" fontWeight="medium">
                          {event.event.replace(/_/g, ' ')}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {event.url || 'No URL'}
                        </Text>
                      </VStack>
                      <Text fontSize="xs" color="gray.400">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}
