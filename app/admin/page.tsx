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
 * - System health indicators
 * - Quick actions
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
  Card,
  CardBody,
  CardHeader,
  HStack,
  VStack,
  Avatar,
  Icon,
  Skeleton,
  Select,
  Button,
  Badge,
  Flex,
  Progress,
  Tooltip,
} from '@chakra-ui/react';
import { useQuery } from 'convex/react';
import { useState } from 'react';
import { api } from '@/convex/_generated/api';
import {
  FiUsers,
  FiActivity,
  FiTrendingUp,
  FiUserPlus,
  FiExternalLink,
  FiCpu,
  FiCheckCircle,
  FiAlertCircle,
  FiDollarSign,
  FiFileText,
  FiZap,
  FiEye,
} from 'react-icons/fi';
import { TrendChart } from '@/src/components/admin/TrendChart';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

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
  const [trendDays, setTrendDays] = useState(7);

  // Dashboard metrics - all admins can see user/operational data
  // Revenue metrics (MRR, Churn, LTV) are on /admin/analytics (super_admin only)
  const dashboardMetrics = useQuery(api.admin.dashboard.getAdminDashboardMetrics);
  const aiHealth = useQuery(api.ai.health.circuitBreaker.getAllProviderHealth, {});

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

  // Calculate AI system health
  const healthyProviders = aiHealth?.filter((p) => p.health?.status === 'healthy').length ?? 0;
  const totalProviders = aiHealth?.length ?? 0;
  const systemHealthPercent =
    totalProviders > 0 ? Math.round((healthyProviders / totalProviders) * 100) : 100;

  return (
    <Container maxW="container.xl">
      {/* Header with Quick Actions */}
      <Flex justify="space-between" align="flex-start" mb={8}>
        <Box>
          <HStack spacing={3} mb={1}>
            <Heading size="lg">Admin Dashboard</Heading>
            <Badge colorScheme="purple" fontSize="xs">
              Live
            </Badge>
          </HStack>
          <Text color="gray.600">Phoo CRM & Intelligence Portal</Text>
        </Box>

        {/* Quick Actions */}
        <HStack spacing={3}>
          <Tooltip label="View AI Providers">
            <Button
              as={Link}
              href="/admin/ai-providers"
              size="sm"
              leftIcon={<Icon as={FiCpu} />}
              variant="outline"
              colorScheme="purple"
            >
              AI Health
            </Button>
          </Tooltip>
          <Tooltip label="View Analytics">
            <Button
              as={Link}
              href="/admin/analytics"
              size="sm"
              leftIcon={<Icon as={FiTrendingUp} />}
              variant="outline"
              colorScheme="blue"
            >
              Revenue
            </Button>
          </Tooltip>
        </HStack>
      </Flex>

      {/* System Health Banner */}
      <Card mb={6} bg="gray.50" borderColor="gray.200">
        <CardBody py={4}>
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <HStack spacing={6}>
              <HStack>
                <Icon
                  as={systemHealthPercent === 100 ? FiCheckCircle : FiAlertCircle}
                  color={systemHealthPercent === 100 ? 'green.500' : 'yellow.500'}
                  boxSize={5}
                />
                <VStack spacing={0} align="start">
                  <Text fontSize="sm" fontWeight="medium">
                    System Health
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {healthyProviders}/{totalProviders} AI providers online
                  </Text>
                </VStack>
              </HStack>
              <Box w="200px">
                <Progress
                  value={systemHealthPercent}
                  size="sm"
                  colorScheme={systemHealthPercent === 100 ? 'green' : 'yellow'}
                  borderRadius="full"
                />
              </Box>
            </HStack>

            <HStack spacing={4} fontSize="sm" color="gray.600">
              <HStack>
                <Icon as={FiZap} color="orange.400" />
                <Text>API: Active</Text>
              </HStack>
              <HStack>
                <Icon as={FiFileText} color="blue.400" />
                <Text>Content: Ready</Text>
              </HStack>
            </HStack>
          </Flex>
        </CardBody>
      </Card>

      {/* Primary Metrics - 4 Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} mb={8}>
        <Card bg="purple.50" borderColor="purple.200" borderWidth="1px">
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={FiUsers} color="purple.500" />
                  <Text color="purple.700">Total Users</Text>
                </HStack>
              </StatLabel>
              <StatNumber fontSize="3xl" color="purple.700">
                {dashboardMetrics.totalUsers}
              </StatNumber>
              <StatHelpText color="purple.600">All registered accounts</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg="orange.50" borderColor="orange.200" borderWidth="1px">
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={FiUserPlus} color="orange.500" />
                  <Text color="orange.700">New This Week</Text>
                </HStack>
              </StatLabel>
              <StatNumber fontSize="3xl" color="orange.700">
                +{dashboardMetrics.newUsersThisWeek}
              </StatNumber>
              <StatHelpText color="orange.600">Last 7 days</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg="green.50" borderColor="green.200" borderWidth="1px">
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={FiActivity} color="green.500" />
                  <Text color="green.700">Active Users</Text>
                </HStack>
              </StatLabel>
              <StatNumber fontSize="3xl" color="green.700">
                {dashboardMetrics.activeUsers}
              </StatNumber>
              <StatHelpText color="green.600">
                {dashboardMetrics.totalUsers > 0
                  ? `${Math.round((dashboardMetrics.activeUsers / dashboardMetrics.totalUsers) * 100)}% engagement`
                  : '0% engagement'}
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg="blue.50" borderColor="blue.200" borderWidth="1px">
          <CardBody>
            <Stat>
              <StatLabel>
                <HStack>
                  <Icon as={FiDollarSign} color="blue.500" />
                  <Text color="blue.700">Subscribers</Text>
                </HStack>
              </StatLabel>
              <StatNumber fontSize="3xl" color="blue.700">
                {dashboardMetrics.activeSubscriptions}
              </StatNumber>
              <StatHelpText color="blue.600">Active paid plans</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Trend Chart with Date Selector */}
      {dashboardMetrics.userTrend.length > 0 && (
        <Card mb={8}>
          <CardHeader>
            <HStack justify="space-between" align="center">
              <Box>
                <Heading size="md">Growth Trend</Heading>
                <Text fontSize="sm" color="gray.600">
                  Daily signups over the last {trendDays} days
                </Text>
              </Box>
              <Select
                value={trendDays}
                onChange={(e) => setTrendDays(Number(e.target.value))}
                w="150px"
                size="sm"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </Select>
            </HStack>
          </CardHeader>
          <CardBody>
            <TrendChart data={dashboardMetrics.userTrend} height={120} barColor="purple.400" />
          </CardBody>
        </Card>
      )}

      {/* Recent Activity */}
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <HStack justify="space-between">
              <Heading size="md">Recent Signups</Heading>
              <Button
                as={Link}
                href="/admin/users"
                size="xs"
                variant="ghost"
                rightIcon={<Icon as={FiExternalLink} />}
              >
                View All
              </Button>
            </HStack>
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
            <HStack justify="space-between">
              <Heading size="md">Recent Activity</Heading>
              <Badge colorScheme="green" variant="subtle" fontSize="xs">
                <HStack spacing={1}>
                  <Icon as={FiEye} />
                  <Text>Live</Text>
                </HStack>
              </Badge>
            </HStack>
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
                      <Text fontSize="xs" color="gray.500" noOfLines={1}>
                        {event.url || 'No URL'}
                      </Text>
                    </VStack>
                    <Text fontSize="xs" color="gray.400" whiteSpace="nowrap">
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
