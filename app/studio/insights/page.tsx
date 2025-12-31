'use client';

/**
 * Insights Page - Content Performance Analytics
 *
 * Component Hierarchy:
 * App → StudioLayout → InsightsPage
 *
 * Displays content performance metrics, SEO health trends,
 * and generation analytics.
 */

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  Divider,
  Badge,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { StudioLayout } from '@/src/components/studio';
import {
  FiBarChart2,
  FiTrendingUp,
  FiFileText,
  FiEye,
  FiClock,
  FiTarget,
  FiZap,
  FiActivity,
} from 'react-icons/fi';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useProject } from '@/lib/hooks';

const MotionCard = motion(Card);

// Glass card styles
const glassCard = {
  bg: 'rgba(30, 30, 30, 0.6)',
  backdropFilter: 'blur(10px)',
  borderWidth: '1px',
  borderColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: 'xl',
};

interface MetricCardProps {
  icon: typeof FiBarChart2;
  label: string;
  value: string | number;
  change?: number;
  color: string;
  delay?: number;
}

function MetricCard({ icon, label, value, change, color, delay = 0 }: MetricCardProps) {
  return (
    <MotionCard
      {...glassCard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <CardBody>
        <HStack spacing={4}>
          <Box p={3} borderRadius="lg" bg={`${color}.900`} color={`${color}.400`}>
            <Icon as={icon} boxSize={6} />
          </Box>
          <Stat>
            <StatLabel color="gray.400" fontSize="sm">
              {label}
            </StatLabel>
            <StatNumber color="white" fontSize="2xl">
              {value}
            </StatNumber>
            {change !== undefined && (
              <StatHelpText mb={0}>
                <StatArrow type={change >= 0 ? 'increase' : 'decrease'} />
                {Math.abs(change)}% vs last month
              </StatHelpText>
            )}
          </Stat>
        </HStack>
      </CardBody>
    </MotionCard>
  );
}

interface PerformanceRowProps {
  title: string;
  value: number;
  max?: number;
  color: string;
}

function PerformanceRow({ title, value, max = 100, color }: PerformanceRowProps) {
  const percentage = Math.round((value / max) * 100);
  return (
    <Box>
      <Flex mb={2}>
        <Text color="gray.300" fontSize="sm">
          {title}
        </Text>
        <Spacer />
        <Text color="white" fontWeight="bold" fontSize="sm">
          {value}
        </Text>
      </Flex>
      <Progress
        value={percentage}
        colorScheme={color}
        bg="rgba(255, 255, 255, 0.1)"
        borderRadius="full"
        size="sm"
      />
    </Box>
  );
}

export default function InsightsPage() {
  const { projectId, project, isLoading: projectLoading } = useProject(null, { autoSelect: true });
  const strategyData = useQuery(api.strategy.getFullStrategy, projectId ? { projectId } : 'skip');
  const mrScore = useQuery(api.scores.getProjectScore, projectId ? { projectId } : 'skip');

  // Show loading state
  if (projectLoading || strategyData === undefined) {
    return (
      <StudioLayout>
        <VStack spacing={8} align="stretch">
          <Box>
            <HStack mb={2}>
              <Icon as={FiBarChart2} color="orange.400" boxSize={6} />
              <Heading size="lg" color="white">
                Insights
              </Heading>
            </HStack>
            <Text color="gray.400">Loading your analytics...</Text>
          </Box>
          <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={4}>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} {...glassCard}>
                <CardBody>
                  <VStack align="start" spacing={3}>
                    <Box w="40px" h="40px" borderRadius="lg" bg="gray.700" />
                    <Box w="80%" h="20px" borderRadius="md" bg="gray.700" />
                    <Box w="50%" h="16px" borderRadius="md" bg="gray.700" />
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </StudioLayout>
    );
  }

  // Show empty state if no project
  if (!project || !projectId) {
    return (
      <StudioLayout>
        <VStack spacing={8} py={20} textAlign="center">
          <Box bg="rgba(255, 157, 0, 0.1)" borderRadius="full" p={6}>
            <Icon as={FiBarChart2} boxSize={12} color="#FF9D00" />
          </Box>
          <Heading size="lg" color="white">
            No Project Selected
          </Heading>
          <Text color="gray.500" maxW="400px">
            Create a project to start tracking your content performance and SEO health.
          </Text>
        </VStack>
      </StudioLayout>
    );
  }

  // Mock data for demonstration (replace with real queries)
  const stats = {
    totalContent: strategyData?.stats?.briefCount ?? 0,
    publishedContent: Math.floor((strategyData?.stats?.briefCount ?? 0) * 0.7),
    avgReadTime: '4.2 min',
    engagementRate: '12.4%',
    organicTraffic: 2847,
    trafficChange: 23,
    keywordsRanking: strategyData?.stats?.keywordCount ?? 0,
    topPositions: Math.floor((strategyData?.stats?.keywordCount ?? 0) * 0.3),
  };

  const contentByStatus = [
    { status: 'Published', count: stats.publishedContent, color: 'green' },
    { status: 'Draft', count: Math.floor(stats.totalContent * 0.2), color: 'yellow' },
    { status: 'In Review', count: Math.floor(stats.totalContent * 0.1), color: 'orange' },
  ];

  return (
    <StudioLayout>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <HStack mb={2}>
            <Icon as={FiBarChart2} color="orange.400" boxSize={6} />
            <Heading size="lg" color="white">
              Insights
            </Heading>
            <Badge colorScheme="green" ml={2}>
              Live
            </Badge>
          </HStack>
          <Text color="gray.400">Track your content performance and SEO health</Text>
        </Box>

        {/* Top Metrics */}
        <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={4}>
          <MetricCard
            icon={FiFileText}
            label="Total Content"
            value={stats.totalContent}
            color="blue"
            delay={0.1}
          />
          <MetricCard
            icon={FiEye}
            label="Organic Traffic"
            value={stats.organicTraffic.toLocaleString()}
            change={stats.trafficChange}
            color="green"
            delay={0.2}
          />
          <MetricCard
            icon={FiTarget}
            label="Keywords Ranking"
            value={stats.keywordsRanking}
            color="purple"
            delay={0.3}
          />
          <MetricCard
            icon={FiZap}
            label="Top 10 Positions"
            value={stats.topPositions}
            color="orange"
            delay={0.4}
          />
        </SimpleGrid>

        {/* Two Column Layout */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {/* Content Performance */}
          <MotionCard
            {...glassCard}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <CardBody>
              <HStack mb={6}>
                <Icon as={FiActivity} color="blue.400" />
                <Heading size="md" color="white">
                  Content Performance
                </Heading>
              </HStack>
              <VStack spacing={6} align="stretch">
                <PerformanceRow
                  title="Published Articles"
                  value={stats.publishedContent}
                  max={stats.totalContent || 1}
                  color="green"
                />
                <PerformanceRow title="Avg. Read Time" value={4.2} max={10} color="blue" />
                <PerformanceRow title="Engagement Rate" value={12.4} max={25} color="purple" />
                <PerformanceRow
                  title="SEO Score"
                  value={mrScore?.overall ?? 0}
                  max={100}
                  color="orange"
                />
              </VStack>
            </CardBody>
          </MotionCard>

          {/* Content by Status */}
          <MotionCard
            {...glassCard}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <CardBody>
              <HStack mb={6}>
                <Icon as={FiFileText} color="purple.400" />
                <Heading size="md" color="white">
                  Content by Status
                </Heading>
              </HStack>
              <VStack spacing={4} align="stretch">
                {contentByStatus.map((item) => (
                  <Flex
                    key={item.status}
                    p={4}
                    borderRadius="lg"
                    bg="rgba(255, 255, 255, 0.05)"
                    align="center"
                  >
                    <Box w={3} h={3} borderRadius="full" bg={`${item.color}.400`} mr={3} />
                    <Text color="gray.300">{item.status}</Text>
                    <Spacer />
                    <Text color="white" fontWeight="bold">
                      {item.count}
                    </Text>
                  </Flex>
                ))}
              </VStack>
              <Divider my={4} borderColor="rgba(255, 255, 255, 0.1)" />
              <Flex>
                <Text color="gray.400" fontSize="sm">
                  Total Pieces
                </Text>
                <Spacer />
                <Text color="white" fontWeight="bold">
                  {stats.totalContent}
                </Text>
              </Flex>
            </CardBody>
          </MotionCard>
        </SimpleGrid>

        {/* SEO Health Trend */}
        <MotionCard
          {...glassCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <CardBody>
            <HStack mb={6}>
              <Icon as={FiTrendingUp} color="green.400" />
              <Heading size="md" color="white">
                SEO Health Trend
              </Heading>
              <Spacer />
              <Badge colorScheme="green">
                {mrScore?.tier === 'excellent'
                  ? 'Excellent'
                  : mrScore?.tier === 'good'
                    ? 'Good'
                    : mrScore?.tier === 'moderate'
                      ? 'Moderate'
                      : 'Needs Work'}
              </Badge>
            </HStack>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              <Box p={4} borderRadius="lg" bg="rgba(255, 255, 255, 0.05)">
                <Text color="gray.400" fontSize="sm">
                  Visibility
                </Text>
                <Text color="white" fontSize="2xl" fontWeight="bold">
                  {mrScore?.visibility ?? 0}
                </Text>
              </Box>
              <Box p={4} borderRadius="lg" bg="rgba(255, 255, 255, 0.05)">
                <Text color="gray.400" fontSize="sm">
                  Traffic Health
                </Text>
                <Text color="white" fontSize="2xl" fontWeight="bold">
                  {mrScore?.trafficHealth ?? 0}
                </Text>
              </Box>
              <Box p={4} borderRadius="lg" bg="rgba(255, 255, 255, 0.05)">
                <Text color="gray.400" fontSize="sm">
                  CTR Performance
                </Text>
                <Text color="white" fontSize="2xl" fontWeight="bold">
                  {mrScore?.ctrPerformance ?? 0}
                </Text>
              </Box>
              <Box p={4} borderRadius="lg" bg="rgba(255, 255, 255, 0.05)">
                <Text color="gray.400" fontSize="sm">
                  Quick Win Potential
                </Text>
                <Text color="white" fontSize="2xl" fontWeight="bold">
                  {mrScore?.quickWinPotential ?? 0}
                </Text>
              </Box>
            </SimpleGrid>
          </CardBody>
        </MotionCard>

        {/* Recent Activity - Placeholder */}
        <MotionCard
          {...glassCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <CardBody>
            <HStack mb={4}>
              <Icon as={FiClock} color="yellow.400" />
              <Heading size="md" color="white">
                Recent Activity
              </Heading>
            </HStack>
            <VStack spacing={3} align="stretch">
              {[
                { action: 'Published', item: 'SEO Best Practices for 2025', time: '2 hours ago' },
                {
                  action: 'Generated',
                  item: 'Content brief for Keyword Research',
                  time: '4 hours ago',
                },
                { action: 'Updated', item: 'Content strategy for Q1', time: '1 day ago' },
              ].map((activity, idx) => (
                <Flex
                  key={idx}
                  p={3}
                  borderRadius="lg"
                  bg="rgba(255, 255, 255, 0.03)"
                  align="center"
                >
                  <Badge
                    colorScheme={
                      activity.action === 'Published'
                        ? 'green'
                        : activity.action === 'Generated'
                          ? 'blue'
                          : 'purple'
                    }
                    mr={3}
                  >
                    {activity.action}
                  </Badge>
                  <Text color="gray.300" fontSize="sm" flex={1}>
                    {activity.item}
                  </Text>
                  <Text color="gray.500" fontSize="xs">
                    {activity.time}
                  </Text>
                </Flex>
              ))}
            </VStack>
          </CardBody>
        </MotionCard>
      </VStack>
    </StudioLayout>
  );
}
