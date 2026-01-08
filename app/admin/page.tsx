'use client';

/**
 * Admin Dashboard Page
 *
 * Component Hierarchy:
 * App → Admin → Dashboard (this file)
 *
 * Overview with:
 * - Revenue metrics (MRR, Subscribers)
 * - User metrics (Total, Active, New)
 * - Event trends chart
 * - Recent activity feed
 */

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardBody,
  CardHeader,
  HStack,
  VStack,
  Avatar,
  Icon,
  Skeleton,
} from '@chakra-ui/react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  FiDollarSign,
  FiUsers,
  FiActivity,
  FiTrendingUp,
  FiUserPlus,
  FiPercent,
} from 'react-icons/fi';
import { TrendChart } from '@/src/components/admin/TrendChart';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/lib/useAuth';

type RecentUser = {
  _id: string;
  name: string;
  email?: string;
  createdAt?: number;
};

type RecentEvent = {
  _id: string;
  event: string;
  timestamp: number;
  url?: string;
};

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';

  const dashboardMetrics = useQuery(api.admin.dashboard.getAdminDashboardMetrics);
  const subscriptionMetrics = useQuery(
    api.subscriptions.subscriptionMetrics.getSubscriptionMetrics,
    isSuperAdmin ? {} : 'skip'
  );

  if (!dashboardMetrics) {
    return (
      <Container maxW="container.xl">
        <Box mb={8}>
          <Skeleton height="40px" width="250px" mb={2} />
          <Skeleton height="20px" width="350px" />
        </Box>
        <SimpleGrid columns={{ base: 1, md: 4 }} gap={6} mb={8}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height="100px" borderRadius="lg" />
          ))}
        </SimpleGrid>
        <Skeleton height="200px" borderRadius="lg" />
      </Container>
    );
  }

  return (
    <Container maxW="container.xl">
      <Box mb={8}>
        <Heading size="lg">Admin Dashboard</Heading>
        <Text color="gray.600">MartAI CRM & Intelligence Portal</Text>
      </Box>

      {/* Revenue Metrics (super_admin only) */}
      {isSuperAdmin && subscriptionMetrics && (
        <SimpleGrid columns={{ base: 1, md: 4 }} gap={6} mb={6}>
          <Card bg="green.50" borderColor="green.200" borderWidth="1px">
            <CardBody>
              <Stat>
                <StatLabel>
                  <HStack>
                    <Icon as={FiDollarSign} color="green.500" />
                    <Text>MRR</Text>
                  </HStack>
                </StatLabel>
                <StatNumber color="green.600">{subscriptionMetrics.mrrFormatted}</StatNumber>
                <StatHelpText>
                  <StatArrow type={subscriptionMetrics.growthRate > 0 ? 'increase' : 'decrease'} />
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
                    <Icon as={FiUsers} color="blue.500" />
                    <Text>Subscribers</Text>
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
                    <Icon
                      as={FiPercent}
                      color={subscriptionMetrics.churnRate > 5 ? 'red.500' : 'green.500'}
                    />
                    <Text>Churn Rate</Text>
                  </HStack>
                </StatLabel>
                <StatNumber color={subscriptionMetrics.churnRate > 5 ? 'red.500' : 'green.500'}>
                  {subscriptionMetrics.churnRate}%
                </StatNumber>
                <StatHelpText>{subscriptionMetrics.churnedThisMonth} cancelled</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>
                  <HStack>
                    <Icon as={FiTrendingUp} color="green.500" />
                    <Text>Est. LTV</Text>
                  </HStack>
                </StatLabel>
                <StatNumber>{subscriptionMetrics.ltvFormatted}</StatNumber>
                <StatHelpText>12-month average</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>
      )}

      {/* User Metrics */}
      <SimpleGrid columns={{ base: 1, md: 4 }} gap={6} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={FiUsers} color="purple.500" />
                  <Text>Total Users</Text>
                </HStack>
              </StatLabel>
              <StatNumber>{dashboardMetrics.totalUsers}</StatNumber>
              <StatHelpText>All registered accounts</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={FiUserPlus} color="orange.500" />
                  <Text>New (7d)</Text>
                </HStack>
              </StatLabel>
              <StatNumber color="orange.500">+{dashboardMetrics.newUsersThisWeek}</StatNumber>
              <StatHelpText>This week</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={FiActivity} color="green.500" />
                  <Text>Active (30d)</Text>
                </HStack>
              </StatLabel>
              <StatNumber>{dashboardMetrics.activeUsers}</StatNumber>
              <StatHelpText>
                {dashboardMetrics.totalUsers > 0
                  ? `${Math.round((dashboardMetrics.activeUsers / dashboardMetrics.totalUsers) * 100)}% of total`
                  : '0%'}
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={FiTrendingUp} color="blue.500" />
                  <Text>Subscribed</Text>
                </HStack>
              </StatLabel>
              <StatNumber>{dashboardMetrics.activeSubscriptions}</StatNumber>
              <StatHelpText>Active subscriptions</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Trend Chart */}
      {dashboardMetrics.userTrend.length > 0 && (
        <Card mb={8}>
          <CardHeader>
            <Heading size="md">New User Trend</Heading>
            <Text fontSize="sm" color="gray.600">
              Daily signups over the last 7 days
            </Text>
          </CardHeader>
          <CardBody>
            <TrendChart data={dashboardMetrics.userTrend} height={120} barColor="orange.400" />
          </CardBody>
        </Card>
      )}

      {/* Recent Activity */}
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <Heading size="md">Recent Signups</Heading>
          </CardHeader>
          <CardBody>
            {dashboardMetrics.recentUsers.length === 0 ? (
              <Text color="gray.500">No recent signups.</Text>
            ) : (
              <VStack spacing={3} align="stretch">
                {dashboardMetrics.recentUsers.map((user: RecentUser) => (
                  <HStack key={user._id} justify="space-between">
                    <HStack>
                      <Avatar size="sm" name={user.name} />
                      <Box>
                        <Text fontWeight="medium" fontSize="sm">
                          {user.name}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {user.email}
                        </Text>
                      </Box>
                    </HStack>
                    <Text fontSize="xs" color="gray.400">
                      {user.createdAt
                        ? formatDistanceToNow(user.createdAt, { addSuffix: true })
                        : 'N/A'}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            )}
          </CardBody>
        </Card>

        {/* Recent Activity Feed */}
        <Card>
          <CardHeader>
            <Heading size="md">Recent Activity</Heading>
          </CardHeader>
          <CardBody>
            {dashboardMetrics.recentActivity.length === 0 ? (
              <Text color="gray.500">No recent activity.</Text>
            ) : (
              <VStack spacing={2} align="stretch" maxH="300px" overflowY="auto">
                {dashboardMetrics.recentActivity.map((event: RecentEvent) => (
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
                      {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            )}
          </CardBody>
        </Card>
      </Grid>
    </Container>
  );
}
