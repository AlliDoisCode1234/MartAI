'use client';

import { useState, useMemo, Suspense } from 'react';
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
  Spinner,
  Grid,
  Select,
  Flex,
  useToast,
  Collapse,
} from '@chakra-ui/react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '@/lib/useAuth';
import {
  formatDate,
  getCurrentDate,
  getStartOfDay,
  getEndOfDay,
  subtractDays,
} from '@/lib/dateUtils';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

import AdhocAnalyzer from '@/src/components/analytics/AdhocAnalyzer';
import InsightsList from '@/src/components/analytics/InsightsList';
import { KPI_CONFIG, ANALYTICS_TIME_RANGE_OPTIONS } from '@/src/constants/analyticsConstants';
import { formatNumber, getChangeColor } from '@/src/utils/analyticsUtils';

import { TrendingUpIcon } from '@/src/icons/TrendingUpIcon';
import { TrendingDownIcon } from '@/src/icons/TrendingDownIcon';

function AnalyticsPageContent() {
  const searchParams = useSearchParams();
  // const { user } = useAuth();
  const toast = useToast();
  const [syncing, setSyncing] = useState(false);
  // View State
  const [selectedViewId, setSelectedViewId] = useState<string>('main'); // 'main' or competitor _id
  const [showAdhoc, setShowAdhoc] = useState(false);
  const [timeRange, setTimeRange] = useState('30');

  const projectId = searchParams?.get('projectId') || localStorage.getItem('projectId');

  const days = parseInt(timeRange);
  const endDate = useMemo(() => getEndOfDay(getCurrentDate()).getTime(), []);
  const startDate = useMemo(
    () => getStartOfDay(subtractDays(getCurrentDate(), days)).getTime(),
    [days]
  );

  const kpisData = useQuery(
    api.analytics.analytics.getDashboardKPIs,
    projectId ? { projectId: projectId as any, startDate, endDate } : 'skip'
  );

  const rawChartData = useQuery(
    api.analytics.analytics.getAnalyticsData,
    projectId ? { projectId: projectId as any, startDate, endDate } : 'skip'
  );

  const insights = useQuery(
    api.analytics.analytics.getInsights,
    projectId ? { projectId: projectId as any } : 'skip'
  );

  const competitorHistory = useQuery(api.analytics.adhoc.getCompetitorHistory);

  const applyInsightMutation = useMutation(api.analytics.analytics.applyInsight);

  const loading =
    !kpisData || !rawChartData || !insights || (selectedViewId !== 'main' && !competitorHistory);

  const chartData = useMemo(() => {
    if (!rawChartData || selectedViewId !== 'main') return [];

    const grouped = rawChartData.reduce((acc: any, d: any) => {
      const dateKey = formatDate(d.date, 'MMM dd');
      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey, sessions: 0, clicks: 0, impressions: 0, leads: 0 };
      }
      acc[dateKey].sessions += d.sessions || 0;
      acc[dateKey].clicks += d.clicks || 0;
      acc[dateKey].impressions += d.impressions || 0;
      acc[dateKey].leads += d.leads || 0;
      return acc;
    }, {});

    return Object.values(grouped).sort((a: any, b: any) => a.date.localeCompare(b.date));
  }, [rawChartData, selectedViewId]);

  const handleSync = async () => {
    if (!projectId) return;

    setSyncing(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/analytics/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId,
          days: parseInt(timeRange),
        }),
      });

      if (response.ok) {
        toast({ title: 'Sync complete', status: 'success' });
      } else {
        throw new Error('Sync failed');
      }
    } catch (error) {
      console.error('Error syncing:', error);
      toast({ title: 'Sync failed', status: 'error' });
    } finally {
      setSyncing(false);
    }
  };

  const handleApplyInsight = async (insightId: string) => {
    try {
      await applyInsightMutation({ insightId: insightId as any });
      toast({ title: 'Insight applied! Unplanned Brief Created.', status: 'success' });
    } catch (error) {
      console.error('Error applying insight:', error);
      toast({ title: 'Failed to apply insight', status: 'error' });
    }
  };

  const currentKPIs = useMemo(() => {
    if (selectedViewId === 'main') {
      if (!kpisData) return [];
      return KPI_CONFIG.map((config) => {
        const validKey = config.key as keyof typeof kpisData;
        const kpi = kpisData[validKey] as { value: number; change: number };
        return {
          ...config,
          value: kpi?.value || 0,
          change: kpi?.change || 0,
        };
      });
    } else {
      // Competitor KPI Mapping
      const record = competitorHistory?.find((h: any) => h._id === selectedViewId);
      if (!record) return [];

      const m = record.metrics;
      // Map available competitor metrics to KPI cards
      // Traffic -> Sessions
      // Keywords -> Clicks (proxy for visibility)
      // DA -> Avg Position (proxy)
      return [
        {
          ...KPI_CONFIG[0], // Sessions
          value: m.traffic || 0,
          change: 0, // No history tracking yet
          label: 'Est. Traffic',
          description: 'Monthly Visits',
        },
        {
          key: 'keywords',
          label: 'Keywords',
          value: m.keywords || 0,
          change: 0,
          icon: '🔑',
          color: 'white',
          bgGradient: KPI_CONFIG[1].bgGradient,
          borderColor: KPI_CONFIG[1].borderColor,
          description: 'Ranked Keywords',
        },
        {
          key: 'da',
          label: 'Domain Authority',
          value: m.domainAuthority || 0,
          change: 0,
          icon: '🏆',
          color: 'white',
          bgGradient: KPI_CONFIG[3].bgGradient,
          borderColor: KPI_CONFIG[3].borderColor,
          description: 'MOZ DA Score',
        },
      ];
    }
  }, [selectedViewId, kpisData, competitorHistory]);

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light" py={8}>
      <Container maxW="7xl">
        <VStack spacing={6} align="stretch">
          {/* Header - Vibrant */}
          <Card bgGradient="linear(135deg, #F7941E 0%, #40DEC7 100%)" shadow="xl" border="none">
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
                    value={selectedViewId}
                    onChange={(e) => {
                      setSelectedViewId(e.target.value);
                      setShowAdhoc(false);
                    }}
                    w="250px"
                    bg="white"
                    size="md"
                    fontWeight="bold"
                    color="brand.dark"
                  >
                    <option value="main">🚀 Main Project (Live)</option>
                    <option disabled>──────────</option>
                    {competitorHistory?.map((h: any) => (
                      <option key={h._id} value={h._id}>
                        🔍 {h.url} ({new Date(h.createdAt).toLocaleDateString()})
                      </option>
                    ))}
                  </Select>

                  {selectedViewId === 'main' && (
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
                      {ANALYTICS_TIME_RANGE_OPTIONS.map((days) => (
                        <option key={days} value={days}>
                          Last {days} days
                        </option>
                      ))}
                    </Select>
                  )}

                  <Button
                    onClick={() => setShowAdhoc(!showAdhoc)}
                    leftIcon={<Text>➕</Text>}
                    size="md"
                    colorScheme="blue"
                    variant="solid"
                  >
                    Analyze New URL
                  </Button>

                  {selectedViewId === 'main' && (
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
                      {syncing ? '' : '🔄'}
                    </Button>
                  )}
                </HStack>
              </HStack>
            </CardBody>
          </Card>

          {/* Ad-hoc Analysis Section - Collapsible */}
          <Collapse in={showAdhoc} animateOpacity>
            <AdhocAnalyzer />
          </Collapse>

          {loading ? (
            <Flex justify="center" py={20}>
              <Spinner size="xl" color="brand.orange" />
            </Flex>
          ) : (
            <>
              {/* KPI Cards - Vibrant & User-Friendly */}
              <Grid
                templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                gap={6}
              >
                {currentKPIs.map((kpi, i) => (
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
                            <Text
                              fontSize="xs"
                              fontWeight="bold"
                              color="white"
                              opacity={0.9}
                              textTransform="uppercase"
                              letterSpacing="wide"
                            >
                              {kpi.label}
                            </Text>
                            {kpi.description && (
                              <Text fontSize="xs" color="white" opacity={0.7}>
                                {kpi.description}
                              </Text>
                            )}
                          </VStack>
                          <Box bg="white" opacity="0.2" borderRadius="full" p={3} fontSize="2xl">
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
                              {kpi.change > 0 ? '+' : ''}
                              {kpi.change.toFixed(1)}%
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

              {/* Charts & Insights - Only for Main Project */}
              {selectedViewId === 'main' && (
                <>
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
                              <LineChart
                                data={chartData}
                                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                              >
                                <defs>
                                  <linearGradient id="sessionsGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#F7941E" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#F7941E" stopOpacity={0} />
                                  </linearGradient>
                                  <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#40DEC7" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#40DEC7" stopOpacity={0} />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="#e2e8f0"
                                  opacity={0.5}
                                />
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
                                <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="line" />
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
                                  <Text fontWeight="semibold" color="gray.700">
                                    No data available
                                  </Text>
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
                              <BarChart
                                data={chartData}
                                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                              >
                                <defs>
                                  <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#40DEC7" stopOpacity={1} />
                                    <stop offset="95%" stopColor="#38B2AC" stopOpacity={1} />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="#e2e8f0"
                                  opacity={0.5}
                                />
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
                                  <Text fontWeight="semibold" color="gray.700">
                                    No leads data
                                  </Text>
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

                  {/* Insights Section */}
                  <InsightsList
                    insights={insights || []}
                    onApplyInsight={handleApplyInsight}
                    onSync={handleSync}
                  />
                </>
              )}
            </>
          )}
        </VStack>
      </Container>
    </Box>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense
      fallback={
        <Box
          minH="calc(100vh - 64px)"
          bg="brand.light"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner size="xl" color="brand.orange" />
        </Box>
      }
    >
      <AnalyticsPageContent />
    </Suspense>
  );
}
