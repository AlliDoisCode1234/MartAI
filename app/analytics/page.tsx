'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  VStack,
  Heading,
  Text,
  Box,
  Button,
  HStack,
  Card,
  CardBody,
  Badge,
  Alert,
  AlertIcon,
  Spinner,
  Grid,
  GridItem,
  Select,
  Progress,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/lib/useAuth';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

// Icons
const TrendingUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 15L15 5M15 5H9M15 5V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrendingDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 5L15 15M15 15H9M15 15V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function AnalyticsPageContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [timeRange, setTimeRange] = useState('30');
  const [kpis, setKpis] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);

  const projectId = searchParams?.get('projectId') || localStorage.getItem('projectId');



  const loadAnalytics = useCallback(async () => {
    if (!projectId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const days = parseInt(timeRange);
      const endDate = endOfDay(new Date()).getTime();
      const startDate = startOfDay(subDays(new Date(), days)).getTime();

      // Load KPIs
      const kpisResponse = await fetch(
        `/api/analytics/kpis?projectId=${projectId}&startDate=${startDate}&endDate=${endDate}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (kpisResponse.ok) {
        const kpisData = await kpisResponse.json();
        setKpis(kpisData.kpis);
      }

      // Load chart data
      const dataResponse = await fetch(
        `/api/analytics/data?projectId=${projectId}&startDate=${startDate}&endDate=${endDate}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (dataResponse.ok) {
        const data = await dataResponse.json();
        // Group by date and combine GA4/GSC
        const dataArray = Array.isArray(data.data) ? data.data : [];
        const grouped = dataArray.reduce((acc: any, d: any) => {
          const dateKey = format(new Date(d.date), 'MMM dd');
          if (!acc[dateKey]) {
            acc[dateKey] = { date: dateKey, sessions: 0, clicks: 0, impressions: 0, leads: 0 };
          }
          acc[dateKey].sessions += d.sessions || 0;
          acc[dateKey].clicks += d.clicks || 0;
          acc[dateKey].impressions += d.impressions || 0;
          acc[dateKey].leads += d.leads || 0;
          return acc;
        }, {});
        setChartData(Object.values(grouped).sort((a: any, b: any) => a.date.localeCompare(b.date)));
      }

      // Load insights
      const insightsResponse = await fetch(
        `/api/analytics/insights?projectId=${projectId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (insightsResponse.ok) {
        const insightsData = await insightsResponse.json();
        setInsights(insightsData.insights || []);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [projectId, timeRange]);

  useEffect(() => {
    if (projectId) {
      loadAnalytics();
    }
  }, [projectId, loadAnalytics]);

  const handleSync = async () => {
    if (!projectId) return;

    setSyncing(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/analytics/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId,
          days: parseInt(timeRange),
        }),
      });

      if (response.ok) {
        await loadAnalytics();
      }
    } catch (error) {
      console.error('Error syncing:', error);
    } finally {
      setSyncing(false);
    }
  };

  const handleApplyInsight = async (insightId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/analytics/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ insightId }),
      });

      if (response.ok) {
        await loadAnalytics();
      }
    } catch (error) {
      console.error('Error applying insight:', error);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toFixed(0);
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'green.500';
    if (change < 0) return 'red.500';
    return 'gray.500';
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'top_gainer':
        return {
          bg: 'linear(135deg, #48BB78 0%, #68D391 100%)',
          border: 'green.400',
          icon: '🚀',
          badgeColor: 'green',
          textColor: 'white',
        };
      case 'underperformer':
        return {
          bg: 'linear(135deg, #E0183C 0%, #FC8181 100%)',
          border: 'red.400',
          icon: '⚠️',
          badgeColor: 'red',
          textColor: 'white',
        };
      case 'quick_win':
        return {
          bg: 'linear(135deg, #F7941E 0%, #F6AD55 100%)',
          border: 'orange.400',
          icon: '⚡',
          badgeColor: 'orange',
          textColor: 'white',
        };
      default:
        return {
          bg: 'linear(135deg, #DEC1FF 0%, #E8D4FF 100%)',
          border: 'purple.400',
          icon: '💡',
          badgeColor: 'purple',
          textColor: 'white',
        };
    }
  };

  const kpiCards = [
    {
      label: 'Sessions',
      value: kpis?.sessions?.value || 0,
      change: kpis?.sessions?.change || 0,
      color: 'brand.orange',
      bgGradient: 'linear(135deg, #F7941E 0%, #FFB84D 100%)',
      borderColor: 'orange.300',
      icon: '👥',
      description: 'Organic traffic',
    },
    {
      label: 'Clicks',
      value: kpis?.clicks?.value || 0,
      change: kpis?.clicks?.change || 0,
      color: 'white',
      bgGradient: 'linear(135deg, #40DEC7 0%, #6EE8D4 100%)',
      borderColor: 'teal.300',
      icon: '🖱️',
      description: 'Search clicks',
    },
    {
      label: 'CTR',
      value: kpis?.ctr?.value || 0,
      change: kpis?.ctr?.change || 0,
      color: 'white',
      bgGradient: 'linear(135deg, #DEC1FF 0%, #E8D4FF 100%)',
      borderColor: 'purple.300',
      icon: '📊',
      suffix: '%',
      decimals: 1,
      description: 'Click-through rate',
    },
    {
      label: 'Avg Position',
      value: kpis?.avgPosition?.value || 0,
      change: kpis?.avgPosition?.change || 0,
      color: 'white',
      bgGradient: 'linear(135deg, #4299E1 0%, #63B3ED 100%)',
      borderColor: 'blue.300',
      icon: '📍',
      decimals: 1,
      description: 'Search ranking',
    },
    {
      label: 'Leads',
      value: kpis?.leads?.value || 0,
      change: kpis?.leads?.change || 0,
      color: 'white',
      bgGradient: 'linear(135deg, #48BB78 0%, #68D391 100%)',
      borderColor: 'green.300',
      icon: '🎯',
      description: 'Conversions',
    },
    {
      label: 'Est. Revenue',
      value: kpis?.revenue?.value || 0,
      change: kpis?.revenue?.change || 0,
      color: 'white',
      bgGradient: 'linear(135deg, #38B2AC 0%, #4FD1C7 100%)',
      borderColor: 'teal.400',
      icon: '💰',
      prefix: '$',
      decimals: 0,
      description: 'Monthly estimate',
    },
  ];

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light" py={8}>
      <Container maxW="7xl">
        <VStack spacing={6} align="stretch">
          {/* Header - Vibrant */}
          <Card
            bgGradient="linear(135deg, #F7941E 0%, #40DEC7 100%)"
            shadow="xl"
            border="none"
          >
            <CardBody>
              <HStack justify="space-between" flexWrap="wrap" gap={4}>
                <VStack align="start" spacing={2}>
                  <HStack spacing={3}>
                    <Text fontSize="3xl">📊</Text>
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
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    w="auto"
                    bg="white"
                    size="md"
                    fontWeight="semibold"
                    border="2px"
                    borderColor="white"
                    _hover={{ borderColor: 'white', bg: 'gray.50' }}
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                  </Select>
                  <Button
                    onClick={handleSync}
                    isLoading={syncing}
                    loadingText="Syncing..."
                    bg="white"
                    color="brand.orange"
                    _hover={{ bg: 'gray.50', transform: 'scale(1.05)' }}
                    size="md"
                    fontWeight="bold"
                    shadow="lg"
                    transition="all 0.2s"
                  >
                    {syncing ? 'Syncing...' : '🔄 Sync Data'}
                  </Button>
                </HStack>
              </HStack>
            </CardBody>
          </Card>

          {loading ? (
            <Flex justify="center" py={20}>
              <Spinner size="xl" color="brand.orange" />
            </Flex>
          ) : (
            <>
              {/* KPI Cards - Vibrant & User-Friendly */}
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
                {kpiCards.map((kpi, i) => (
                  <Card
                    key={i}
                    bgGradient={kpi.bgGradient}
                    border="2px"
                    borderColor={kpi.borderColor}
                    shadow="xl"
                    _hover={{ shadow: '2xl', transform: 'translateY(-4px) scale(1.02)' }}
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    overflow="hidden"
                    position="relative"
                  >
                    {/* Decorative corner */}
                    <Box
                      position="absolute"
                      top={0}
                      right={0}
                      w="100px"
                      h="100px"
                      bg="white"
                      opacity="0.1"
                      borderRadius="0 0 0 100%"
                    />
                    <CardBody position="relative" zIndex={1}>
                      <VStack align="start" spacing={3}>
                        <HStack justify="space-between" w="full">
                          <VStack align="start" spacing={0}>
                            <Text fontSize="xs" fontWeight="bold" color="white" opacity={0.9} textTransform="uppercase" letterSpacing="wide">
                              {kpi.label}
                            </Text>
                            {kpi.description && (
                              <Text fontSize="xs" color="white" opacity={0.7}>
                                {kpi.description}
                              </Text>
                            )}
                          </VStack>
                          <Box
                            bg="white"
                            opacity="0.2"
                            borderRadius="full"
                            p={3}
                            fontSize="2xl"
                          >
                            {kpi.icon}
                          </Box>
                        </HStack>
                        <Heading
                          size="3xl"
                          fontWeight="bold"
                          color={kpi.color}
                          fontFamily="heading"
                          lineHeight="1"
                        >
                          {kpi.prefix || ''}
                          {kpi.decimals !== undefined
                            ? kpi.value.toFixed(kpi.decimals)
                            : formatNumber(kpi.value)}
                          {kpi.suffix || ''}
                        </Heading>
                        {kpi.change !== undefined && (
                          <HStack
                            spacing={2}
                            bg="white"
                            opacity="0.25"
                            px={3}
                            py={1.5}
                            borderRadius="full"
                          >
                            {kpi.change > 0 ? (
                              <TrendingUpIcon />
                            ) : kpi.change < 0 ? (
                              <TrendingDownIcon />
                            ) : null}
                            <Text fontSize="sm" fontWeight="bold" color="white">
                              {kpi.change > 0 ? '+' : ''}{kpi.change.toFixed(1)}%
                            </Text>
                            <Text fontSize="xs" color="white" opacity={0.8}>
                              vs previous
                            </Text>
                          </HStack>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </Grid>

              {/* Charts - Vibrant Design */}
              <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
                {/* Traffic Growth */}
                <Card
                  shadow="xl"
                  bg="white"
                  border="1px"
                  borderColor="gray.200"
                  _hover={{ shadow: '2xl', borderColor: 'brand.orange' }}
                  transition="all 0.3s"
                >
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      <HStack justify="space-between">
                        <VStack align="start" spacing={1}>
                          <Heading size="md" fontFamily="heading" color="gray.800">
                            Traffic Growth
                          </Heading>
                          <Text fontSize="sm" color="gray.600">
                            Sessions & Clicks over time
                          </Text>
                        </VStack>
                        <Badge colorScheme="orange" fontSize="sm" px={3} py={1}>
                          Live
                        </Badge>
                      </HStack>
                      {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={320}>
                          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <defs>
                              <linearGradient id="sessionsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#F7941E" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#F7941E" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#40DEC7" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#40DEC7" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                            <XAxis
                              dataKey="date"
                              stroke="#718096"
                              fontSize={11}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              stroke="#718096"
                              fontSize={11}
                              tickLine={false}
                              axisLine={false}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'white',
                                border: '2px solid #F7941E',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                              }}
                              cursor={{ stroke: '#F7941E', strokeWidth: 2 }}
                            />
                            <Legend
                              wrapperStyle={{ paddingTop: '20px' }}
                              iconType="line"
                            />
                            <Line
                              type="monotone"
                              dataKey="sessions"
                              stroke="#F7941E"
                              strokeWidth={3}
                              dot={{ fill: '#F7941E', r: 5, strokeWidth: 2, stroke: 'white' }}
                              activeDot={{ r: 7 }}
                              name="Sessions"
                            />
                            <Line
                              type="monotone"
                              dataKey="clicks"
                              stroke="#40DEC7"
                              strokeWidth={3}
                              dot={{ fill: '#40DEC7', r: 5, strokeWidth: 2, stroke: 'white' }}
                              activeDot={{ r: 7 }}
                              name="Clicks"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <Box
                          h="320px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          bgGradient="linear(to-br, orange.50, teal.50)"
                          borderRadius="lg"
                          border="2px dashed"
                          borderColor="brand.orange"
                        >
                          <VStack spacing={4}>
                            <Text fontSize="4xl">📊</Text>
                            <VStack spacing={2}>
                              <Text fontWeight="semibold" color="gray.700">No data available</Text>
                              <Text fontSize="sm" color="gray.600" textAlign="center">
                                Sync your GA4 and GSC data to see traffic trends
                              </Text>
                            </VStack>
                            <Button
                              onClick={handleSync}
                              bg="brand.orange"
                              color="white"
                              _hover={{ bg: '#E8851A' }}
                              size="sm"
                            >
                              Sync Data
                            </Button>
                          </VStack>
                        </Box>
                      )}
                    </VStack>
                  </CardBody>
                </Card>

                {/* Leads Generated */}
                <Card
                  shadow="xl"
                  bg="white"
                  border="1px"
                  borderColor="gray.200"
                  _hover={{ shadow: '2xl', borderColor: 'brand.teal' }}
                  transition="all 0.3s"
                >
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      <HStack justify="space-between">
                        <VStack align="start" spacing={1}>
                          <Heading size="md" fontFamily="heading" color="gray.800">
                            Leads Generated
                          </Heading>
                          <Text fontSize="sm" color="gray.600">
                            Conversion tracking
                          </Text>
                        </VStack>
                        <Badge colorScheme="teal" fontSize="sm" px={3} py={1}>
                          🎯 Goals
                        </Badge>
                      </HStack>
                      {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={320}>
                          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <defs>
                              <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#40DEC7" stopOpacity={1}/>
                                <stop offset="95%" stopColor="#38B2AC" stopOpacity={1}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                            <XAxis
                              dataKey="date"
                              stroke="#718096"
                              fontSize={11}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              stroke="#718096"
                              fontSize={11}
                              tickLine={false}
                              axisLine={false}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'white',
                                border: '2px solid #40DEC7',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                              }}
                              cursor={{ fill: 'rgba(64, 222, 199, 0.1)' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar
                              dataKey="leads"
                              fill="url(#leadsGradient)"
                              name="Leads"
                              radius={[12, 12, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <Box
                          h="320px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          bgGradient="linear(to-br, teal.50, green.50)"
                          borderRadius="lg"
                          border="2px dashed"
                          borderColor="brand.teal"
                        >
                          <VStack spacing={4}>
                            <Text fontSize="4xl">🎯</Text>
                            <VStack spacing={2}>
                              <Text fontWeight="semibold" color="gray.700">No leads data</Text>
                              <Text fontSize="sm" color="gray.600" textAlign="center">
                                Connect GA4 to track conversions and revenue
                              </Text>
                            </VStack>
                            <Button
                              onClick={handleSync}
                              bg="brand.teal"
                              color="white"
                              _hover={{ bg: '#3AD4B8' }}
                              size="sm"
                            >
                              Sync Data
                            </Button>
                          </VStack>
                        </Box>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
              </Grid>

              {/* Insights - Vibrant Cards */}
              <Card
                shadow="xl"
                bg="white"
                border="1px"
                borderColor="gray.200"
              >
                <CardBody>
                  <VStack align="stretch" spacing={6}>
                    <HStack justify="space-between">
                      <VStack align="start" spacing={1}>
                        <Heading size="lg" fontFamily="heading" color="gray.800">
                          💡 Actionable Insights
                        </Heading>
                        <Text fontSize="sm" color="gray.600">
                          AI-powered recommendations to improve your SEO
                        </Text>
                      </VStack>
                      <Badge
                        colorScheme="orange"
                        fontSize="md"
                        px={4}
                        py={2}
                        borderRadius="full"
                        fontWeight="bold"
                      >
                        {insights.length} {insights.length === 1 ? 'insight' : 'insights'}
                      </Badge>
                    </HStack>
                    {insights.length === 0 ? (
                      <Box
                        bgGradient="linear(to-br, brand.lavender, brand.teal)"
                        p={8}
                        borderRadius="xl"
                        border="2px dashed"
                        borderColor="brand.orange"
                        textAlign="center"
                      >
                        <VStack spacing={4}>
                          <Text fontSize="5xl">✨</Text>
                          <VStack spacing={2}>
                            <Heading size="md" fontFamily="heading" color="gray.800">
                              No insights yet
                            </Heading>
                            <Text fontSize="sm" color="gray.600" maxW="md">
                              Sync your GA4 and GSC data to generate AI-powered actionable insights
                            </Text>
                          </VStack>
                          <Button
                            onClick={handleSync}
                            bg="brand.orange"
                            color="white"
                            _hover={{ bg: '#E8851A', transform: 'scale(1.05)' }}
                            size="md"
                            fontWeight="bold"
                            shadow="lg"
                          >
                            🚀 Sync Data Now
                          </Button>
                        </VStack>
                      </Box>
                    ) : (
                      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={5}>
                        {insights.map((insight, i) => {
                          const colors = getInsightColor(insight.type);
                          return (
                            <Card
                              key={i}
                              bgGradient={colors.bg}
                              border="2px"
                              borderColor={colors.border}
                              shadow="xl"
                              _hover={{ shadow: '2xl', transform: 'translateY(-4px) scale(1.02)' }}
                              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                              overflow="hidden"
                              position="relative"
                            >
                              {/* Decorative element */}
                              <Box
                                position="absolute"
                                top={-20}
                                right={-20}
                                w="100px"
                                h="100px"
                                bg="white"
                                opacity="0.1"
                                borderRadius="full"
                              />
                              <CardBody position="relative" zIndex={1}>
                                <VStack align="start" spacing={4}>
                                  <HStack justify="space-between" w="full">
                                    <Box
                                      bg="white"
                                      opacity="0.25"
                                      borderRadius="full"
                                      p={3}
                                      fontSize="2xl"
                                    >
                                      {colors.icon}
                                    </Box>
                                    <Badge
                                      colorScheme={colors.badgeColor}
                                      fontSize="xs"
                                      px={3}
                                      py={1}
                                      fontWeight="bold"
                                      textTransform="capitalize"
                                    >
                                      {insight.type.replace('_', ' ')}
                                    </Badge>
                                  </HStack>
                                  <Heading
                                    size="md"
                                    fontFamily="heading"
                                    color={colors.textColor}
                                    lineHeight="1.2"
                                  >
                                    {insight.title}
                                  </Heading>
                                  <Text
                                    fontSize="sm"
                                    color={colors.textColor}
                                    opacity={0.9}
                                    lineHeight="1.6"
                                  >
                                    {insight.description}
                                  </Text>
                                  <Button
                                    size="sm"
                                    onClick={() => handleApplyInsight(insight._id)}
                                    bg="white"
                                    color={colors.border}
                                    _hover={{ bg: 'gray.50', transform: 'scale(1.05)' }}
                                    w="full"
                                    fontWeight="bold"
                                    transition="all 0.2s"
                                  >
                                    Apply Suggestion →
                                  </Button>
                                </VStack>
                              </CardBody>
                            </Card>
                          );
                        })}
                      </Grid>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            </>
          )}
        </VStack>
      </Container>
    </Box>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={
      <Box minH="calc(100vh - 64px)" bg="brand.light" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="brand.orange" />
      </Box>
    }>
      <AnalyticsPageContent />
    </Suspense>
  );
}
