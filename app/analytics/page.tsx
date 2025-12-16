'use client';

/**
 * Analytics Page
 *
 * Component Hierarchy:
 * App → Analytics (this file)
 *
 * SEO performance dashboard with KPIs, charts, and insights.
 * Uses extracted components for modularity.
 */

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container, VStack, Box, Grid, Flex, useToast, Collapse } from '@chakra-ui/react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  formatDate,
  getCurrentDate,
  getStartOfDay,
  getEndOfDay,
  subtractDays,
} from '@/lib/dateUtils';
import { KPI_CONFIG } from '@/src/constants/analyticsConstants';

// Extracted components
import {
  AnalyticsHeader,
  KPICard,
  TrafficGrowthChart,
  LeadsGeneratedChart,
  AnalyticsSkeleton,
  InsightsList,
} from '@/src/components/analytics';
import AdhocAnalyzer from '@/src/components/analytics/AdhocAnalyzer';

function AnalyticsPageContent() {
  const searchParams = useSearchParams();
  const toast = useToast();
  const [syncing, setSyncing] = useState(false);
  const [selectedViewId, setSelectedViewId] = useState<string>('main');
  const [showAdhoc, setShowAdhoc] = useState(false);
  const [timeRange, setTimeRange] = useState('30');

  const projectId = searchParams?.get('projectId') || localStorage.getItem('projectId');
  const days = parseInt(timeRange);
  const endDate = useMemo(() => getEndOfDay(getCurrentDate()).getTime(), []);
  const startDate = useMemo(
    () => getStartOfDay(subtractDays(getCurrentDate(), days)).getTime(),
    [days]
  );

  // Queries
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

  // Chart data aggregation
  const chartData = useMemo(() => {
    if (!rawChartData || selectedViewId !== 'main') return [];
    const grouped = rawChartData.reduce((acc: any, d: any) => {
      const dateKey = formatDate(d.date, 'MMM dd');
      if (!acc[dateKey])
        acc[dateKey] = { date: dateKey, sessions: 0, clicks: 0, impressions: 0, leads: 0 };
      acc[dateKey].sessions += d.sessions || 0;
      acc[dateKey].clicks += d.clicks || 0;
      acc[dateKey].impressions += d.impressions || 0;
      acc[dateKey].leads += d.leads || 0;
      return acc;
    }, {});
    return Object.values(grouped).sort((a: any, b: any) => a.date.localeCompare(b.date));
  }, [rawChartData, selectedViewId]);

  // Handlers
  const handleSync = async () => {
    if (!projectId) return;
    setSyncing(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/analytics/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ projectId, days: parseInt(timeRange) }),
      });
      if (response.ok) toast({ title: 'Sync complete', status: 'success' });
      else throw new Error('Sync failed');
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

  // KPI data for current view
  const currentKPIs = useMemo(() => {
    if (selectedViewId === 'main') {
      if (!kpisData) return [];
      return KPI_CONFIG.map((config) => {
        const kpi = kpisData[config.key as keyof typeof kpisData] as {
          value: number;
          change: number;
        };
        return { ...config, value: kpi?.value || 0, change: kpi?.change || 0 };
      });
    } else {
      const record = competitorHistory?.find((h: any) => h._id === selectedViewId);
      if (!record) return [];
      const m = record.metrics;
      return [
        {
          ...KPI_CONFIG[0],
          value: m.traffic || 0,
          change: 0,
          label: 'Est. Traffic',
          description: 'Monthly Visits',
        },
        {
          key: 'keywords',
          label: 'Keywords',
          value: m.keywords || 0,
          change: 0,
          icon: '◆',
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
          icon: '★',
          color: 'white',
          bgGradient: KPI_CONFIG[3].bgGradient,
          borderColor: KPI_CONFIG[3].borderColor,
          description: 'MOZ DA Score',
        },
      ];
    }
  }, [selectedViewId, kpisData, competitorHistory]);

  if (loading) return <AnalyticsSkeleton />;

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light" py={8}>
      <Container maxW="7xl">
        <VStack spacing={6} align="stretch">
          <AnalyticsHeader
            selectedViewId={selectedViewId}
            onViewChange={(v) => {
              setSelectedViewId(v);
              setShowAdhoc(false);
            }}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            onAnalyzeClick={() => setShowAdhoc(!showAdhoc)}
            onSyncClick={handleSync}
            syncing={syncing}
            competitorHistory={competitorHistory}
          />

          <Collapse in={showAdhoc} animateOpacity>
            <AdhocAnalyzer />
          </Collapse>

          {/* KPI Cards */}
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
            gap={6}
          >
            {currentKPIs.map(({ key: kpiKey, ...kpiProps }) => (
              <KPICard key={kpiKey || kpiProps.label} {...kpiProps} />
            ))}
          </Grid>

          {/* Charts & Insights - Only for Main Project */}
          {selectedViewId === 'main' && (
            <>
              <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
                <TrafficGrowthChart data={chartData as any} onSync={handleSync} />
                <LeadsGeneratedChart data={chartData as any} onSync={handleSync} />
              </Grid>
              <InsightsList
                insights={insights || []}
                onApplyInsight={handleApplyInsight}
                onSync={handleSync}
              />
            </>
          )}
        </VStack>
      </Container>
    </Box>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<AnalyticsSkeleton />}>
      <AnalyticsPageContent />
    </Suspense>
  );
}
