'use client';

/**
 * KeywordDetailPage
 *
 * Component Hierarchy:
 * App -> Keywords -> [id] -> KeywordDetailPage (this file)
 *
 * Standalone keyword detail page showing comprehensive analysis with
 * live data from the enriched keyword query (cluster + siblings + aggregates).
 */

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import {
  Container,
  VStack,
  Heading,
  Text,
  Box,
  Badge,
  Grid,
  GridItem,
  Button,
  HStack,
  Skeleton,
  Icon,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import {
  FiArrowLeft,
  FiEdit3,
  FiRefreshCw,
  FiTarget,
  FiBarChart2,
  FiUsers,
  FiCheckCircle,
  FiZap,
  FiLayers,
  FiGlobe,
} from 'react-icons/fi';
import { useProject } from '@/lib/hooks';
import { AddToClusterModal } from '@/src/components/keywords/AddToClusterModal';

// ─── Helpers ─────────────────────────────────────────────────────────

function getLeadPotential(volume: number | null | undefined): { label: string; color: string } {
  if (!volume) return { label: 'Unknown', color: 'var(--phoo-text-muted)' };
  if (volume >= 500) return { label: 'High', color: 'var(--phoo-success)' };
  if (volume >= 100) return { label: 'Medium', color: 'var(--phoo-warning)' };
  return { label: 'Low', color: 'var(--phoo-error)' };
}

function getDifficultyLabel(d: number | null | undefined): { label: string; color: string } {
  if (d === null || d === undefined) return { label: 'Unknown', color: 'var(--phoo-text-muted)' };
  if (d <= 30) return { label: 'Easy', color: 'var(--phoo-success)' };
  if (d <= 60) return { label: 'Moderate', color: 'var(--phoo-warning)' };
  return { label: 'Hard', color: 'var(--phoo-error)' };
}

function getRankingLikelihood(difficulty: number | null | undefined): number {
  if (difficulty === null || difficulty === undefined) return 50;
  return Math.max(10, Math.min(95, 100 - difficulty));
}

function estimateLeads(
  volume: number | null | undefined,
  difficulty: number | null | undefined
): { min: number; max: number } {
  const v = volume ?? 0;
  const d = difficulty ?? 50;
  const ctr = Math.max(0.02, ((100 - d) / 100) * 0.15);
  const convRate = 0.03;
  const minLeads = Math.max(1, Math.round(v * ctr * convRate * 0.7));
  const maxLeads = Math.max(minLeads + 1, Math.round(v * ctr * convRate * 1.3));
  return { min: minLeads, max: maxLeads };
}

function extractDomain(url: string): string {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    return u.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

interface SerpDomainEntry {
  pos: number;
  site: string;
  url: string;
  title?: string;
  snippet?: string;
}

// ─── Card Component ──────────────────────────────────────────────────

function Card({
  children,
  highlight,
  glow,
  ...props
}: {
  children: React.ReactNode;
  highlight?: boolean;
  glow?: boolean;
  [key: string]: unknown;
}) {
  return (
    <Box
      bg="var(--phoo-bg-surface)"
      border="1px solid"
      borderColor={highlight ? 'rgba(245, 158, 11, 0.3)' : 'var(--phoo-border)'}
      borderRadius="var(--phoo-radius-md)"
      p={5}
      position="relative"
      overflow="hidden"
      boxShadow={glow ? '0 0 30px rgba(245, 158, 11, 0.08)' : 'var(--phoo-shadow-sm)'}
      _before={
        highlight
          ? {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              bgGradient: 'linear(to-r, var(--phoo-warning), transparent)',
            }
          : undefined
      }
      {...props}
    >
      {children}
    </Box>
  );
}

// ─── Page ────────────────────────────────────────────────────────────

export default function KeywordDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const keywordId = params.id as Id<'keywords'>;
  const enriched = useQuery(api.seo.keywords.getKeywordEnriched, { keywordId });
  const { projectId } = useProject(null, { autoSelect: true });
  const [showClusterModal, setShowClusterModal] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const runDeepDive = useAction(api.seo.serpAnalysis.analyzeSERP);

  // Loading state
  if (enriched === undefined) {
    return (
      <Box minH="calc(100vh - 64px)" bg="var(--phoo-bg-primary)">
        <Container maxW="container.xl" py={{ base: 6, md: 10 }}>
          <VStack spacing={6} align="stretch">
            <Skeleton
              height="24px"
              width="100px"
              borderRadius="md"
              startColor="var(--phoo-bg-surface)"
              endColor="var(--phoo-bg-elevated)"
            />
            <Skeleton
              height="40px"
              width="350px"
              borderRadius="md"
              startColor="var(--phoo-bg-surface)"
              endColor="var(--phoo-bg-elevated)"
            />
            <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={5}>
              {[1, 2, 3, 4].map((i) => (
                <GridItem key={i}>
                  <Skeleton
                    height="200px"
                    borderRadius="var(--phoo-radius-md)"
                    startColor="var(--phoo-bg-surface)"
                    endColor="var(--phoo-bg-elevated)"
                  />
                </GridItem>
              ))}
            </Grid>
            <Skeleton
              height="100px"
              borderRadius="var(--phoo-radius-md)"
              startColor="var(--phoo-bg-surface)"
              endColor="var(--phoo-bg-elevated)"
            />
          </VStack>
        </Container>
      </Box>
    );
  }

  // Not found
  if (enriched === null) {
    return (
      <Box minH="calc(100vh - 64px)" bg="var(--phoo-bg-primary)">
        <Container maxW="container.md" py={12}>
          <VStack spacing={4}>
            <Heading color="var(--phoo-text-primary)">Keyword Not Found</Heading>
            <Button
              as={NextLink}
              href="/keywords"
              variant="ghost"
              color="var(--phoo-warning)"
              leftIcon={<FiArrowLeft />}
            >
              Back to Keywords
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  // Destructure enriched data
  const keyword = enriched;
  const cluster = enriched.cluster;
  const siblings = enriched.siblingKeywords;
  const stats = enriched.aggregateStats;

  const lead = getLeadPotential(keyword.searchVolume);
  const diff = getDifficultyLabel(keyword.difficulty);
  const likelihood = getRankingLikelihood(keyword.difficulty);
  const leads = estimateLeads(stats.totalVolume || keyword.searchVolume, keyword.difficulty);
  const intentLabel = keyword.intent
    ? keyword.intent.charAt(0).toUpperCase() + keyword.intent.slice(1)
    : 'Unknown';

  // Build competitive landscape: prefer stored AI analysis, fall back to cluster topSerpUrls
  const serpAnalysis = enriched.serpAnalysis;
  const serpDomains: SerpDomainEntry[] = serpAnalysis
    ? serpAnalysis.results
        .slice(0, 10)
        .map(
          (r: {
            position: number;
            url: string;
            domain: string;
            title: string;
            snippet?: string;
          }) => ({
            pos: r.position,
            site: r.domain,
            url: r.url,
            title: r.title,
            snippet: r.snippet,
          })
        )
    : (cluster?.topSerpUrls ?? []).slice(0, 5).map((url: string, i: number) => ({
        pos: i + 1,
        site: extractDomain(url),
        url,
        title: undefined,
        snippet: undefined,
      }));

  const handleCreateArticle = () => {
    router.push(`/studio?keyword=${encodeURIComponent(keyword.keyword)}`);
  };

  const handleRunDeepDive = async () => {
    if (!projectId || isAnalyzing) return;
    setIsAnalyzing(true);
    try {
      const result = await runDeepDive({
        projectId: projectId as Id<'projects'>,
        keyword: keyword.keyword,
        searchVolume: keyword.searchVolume ?? undefined,
        difficulty: keyword.difficulty ?? undefined,
      });
      if (result.success) {
        toast({
          title: 'SERP Analysis Complete',
          description: `Found ${result.results?.length ?? 0} organic results for "${keyword.keyword}".`,
          status: 'success',
          duration: 4000,
        });
      } else if (result.limitReached) {
        toast({
          title: 'Limit Reached',
          description: result.error || 'SERP analysis limit reached. Upgrade to analyze more.',
          status: 'warning',
          duration: 5000,
        });
      } else {
        toast({
          title: 'Analysis Failed',
          description: result.error || 'Something went wrong. Please try again.',
          status: 'error',
          duration: 5000,
        });
      }
    } catch (err: unknown) {
      toast({
        title: 'Analysis Failed',
        description: err instanceof Error ? err.message : 'An unexpected error occurred.',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Box minH="calc(100vh - 64px)" bg="var(--phoo-bg-primary)">
      {/* Top gradient wash */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="300px"
        bg="var(--phoo-gradient-hero)"
        pointerEvents="none"
      />

      <Container maxW="container.xl" py={{ base: 6, md: 10 }} position="relative">
        <VStack spacing={7} align="stretch">
          {/* ─── Header ────────────────────────────────── */}
          <VStack align="start" spacing={3}>
            <Button
              as={NextLink}
              href="/keywords"
              variant="ghost"
              color="var(--phoo-text-muted)"
              _hover={{ color: 'var(--phoo-text-primary)', bg: 'var(--phoo-bg-hover)' }}
              leftIcon={<FiArrowLeft />}
              size="sm"
              px={0}
            >
              Back to List
            </Button>
            <HStack justify="space-between" w="full" flexWrap="wrap" gap={3}>
              <VStack align="start" spacing={1}>
                <Heading
                  size="xl"
                  color="var(--phoo-text-primary)"
                  fontWeight="bold"
                  fontFamily="var(--phoo-font-display)"
                >
                  {keyword.keyword}
                </Heading>
                <HStack spacing={2}>
                  <Badge
                    bg="var(--phoo-warning-muted)"
                    color="var(--phoo-warning)"
                    fontSize="10px"
                    fontWeight="bold"
                    px={2}
                    py={0.5}
                    borderRadius="var(--phoo-radius-sm)"
                    textTransform="uppercase"
                  >
                    {keyword.status}
                  </Badge>
                  <Badge
                    bg="var(--phoo-accent-muted)"
                    color="var(--phoo-accent)"
                    fontSize="10px"
                    fontWeight="bold"
                    px={2}
                    py={0.5}
                    borderRadius="var(--phoo-radius-sm)"
                    textTransform="uppercase"
                  >
                    {keyword.priority || 'medium'} priority
                  </Badge>
                  {cluster && (
                    <Badge
                      bg="var(--phoo-info-muted)"
                      color="var(--phoo-info)"
                      fontSize="10px"
                      fontWeight="bold"
                      px={2}
                      py={0.5}
                      borderRadius="var(--phoo-radius-sm)"
                      textTransform="uppercase"
                    >
                      {cluster.clusterName}
                    </Badge>
                  )}
                </HStack>
              </VStack>
              <HStack spacing={3}>
                <Button
                  bg="var(--phoo-warning)"
                  color="white"
                  size="sm"
                  _hover={{ bg: '#e08f06', transform: 'translateY(-1px)' }}
                  leftIcon={<FiEdit3 />}
                  fontWeight="bold"
                  borderRadius="var(--phoo-radius-sm)"
                  px={5}
                  transition="all 0.2s"
                  onClick={handleCreateArticle}
                >
                  Create Optimized Article
                </Button>
                <Button
                  variant="outline"
                  borderColor="var(--phoo-border-hover)"
                  color="var(--phoo-text-secondary)"
                  size="sm"
                  _hover={{ borderColor: 'var(--phoo-warning)', color: 'var(--phoo-warning)' }}
                  leftIcon={<FiRefreshCw />}
                  borderRadius="var(--phoo-radius-sm)"
                  transition="all 0.2s"
                  onClick={handleRunDeepDive}
                >
                  Run Deep Dive
                </Button>
              </HStack>
            </HStack>
          </VStack>

          {/* ─── Top 4 Cards ───────────────────────────── */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={5}>
            {/* Lead Potential */}
            <GridItem>
              <Card>
                <Text
                  fontSize="xs"
                  color="var(--phoo-text-muted)"
                  fontWeight="bold"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  mb={3}
                >
                  Lead Potential:{' '}
                  <Text as="span" color={lead.color}>
                    {lead.label}
                  </Text>
                </Text>
                <HStack spacing={2} mb={3}>
                  <Icon as={FiZap} color={lead.color} boxSize={5} />
                  <Text fontSize="3xl" fontWeight="bold" color={lead.color} lineHeight={1}>
                    {lead.label}
                  </Text>
                </HStack>
                <VStack align="start" spacing={1.5}>
                  <HStack spacing={2}>
                    <Text fontSize="sm" color="var(--phoo-text-primary)" fontWeight="semibold">
                      {keyword.searchVolume?.toLocaleString() || '—'}
                    </Text>
                    <Text fontSize="sm" color="var(--phoo-text-muted)">
                      Monthly Searches
                    </Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Badge
                      bg="var(--phoo-accent-muted)"
                      color="var(--phoo-accent)"
                      fontSize="9px"
                      px={1.5}
                      py={0}
                      borderRadius="3px"
                    >
                      {intentLabel}
                    </Badge>
                    <Text fontSize="sm" color="var(--phoo-text-muted)">
                      {intentLabel}
                    </Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Text fontSize="xs" color="var(--phoo-text-muted)">
                      CPC
                    </Text>
                    <Text fontSize="sm" color="var(--phoo-text-primary)" fontWeight="semibold">
                      {keyword.cpc != null ? `$${keyword.cpc.toFixed(2)}` : '—'}
                    </Text>
                  </HStack>
                </VStack>
                <Divider borderColor="var(--phoo-border)" my={3} />
                <Text fontSize="xs" color="var(--phoo-text-muted)" lineHeight="1.5">
                  {keyword.searchVolume && keyword.searchVolume >= 200
                    ? 'This keyword has strong buyer intent and commercial value.'
                    : 'Moderate search volume with growth potential.'}
                </Text>
              </Card>
            </GridItem>

            {/* Ranking Difficulty */}
            <GridItem>
              <Card>
                <Text
                  fontSize="xs"
                  color="var(--phoo-text-muted)"
                  fontWeight="bold"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  mb={3}
                >
                  Ranking Difficulty
                </Text>
                <Text fontSize="3xl" fontWeight="bold" color={diff.color} lineHeight={1} mb={1}>
                  {diff.label}
                </Text>
                <Text fontSize="sm" color="var(--phoo-text-secondary)" mb={4}>
                  {diff.label === 'Easy'
                    ? 'Low competition — rank quickly with quality content.'
                    : diff.label === 'Moderate'
                      ? 'New content can realistically rank within 3-6 months.'
                      : 'High competition — requires strong DA and backlinks.'}
                </Text>
                <Text fontSize="xs" color="var(--phoo-text-muted)" mb={1.5}>
                  Difficulty: {keyword.difficulty ?? '—'}/100
                </Text>
                <Box
                  position="relative"
                  h="8px"
                  bg="var(--phoo-bg-elevated)"
                  borderRadius="var(--phoo-radius-full)"
                  overflow="hidden"
                >
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    h="full"
                    w={`${keyword.difficulty ?? 0}%`}
                    bgGradient="linear(to-r, var(--phoo-success), var(--phoo-warning), var(--phoo-error))"
                    borderRadius="var(--phoo-radius-full)"
                    transition="width 0.6s ease"
                  />
                </Box>
              </Card>
            </GridItem>

            {/* Competitive Landscape — from cluster topSerpUrls or placeholder */}
            <GridItem>
              <Card>
                <Text
                  fontSize="xs"
                  color="var(--phoo-text-muted)"
                  fontWeight="bold"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  mb={3}
                >
                  Competitive Landscape
                </Text>
                {serpDomains.length > 0 ? (
                  <>
                    <HStack mb={3} spacing={2}>
                      <Badge
                        bg="var(--phoo-warning-muted)"
                        color="var(--phoo-warning)"
                        fontSize="10px"
                        px={1.5}
                        borderRadius="3px"
                      >
                        Top {serpDomains.length} SERP Results
                      </Badge>
                    </HStack>
                    <VStack spacing={1.5} align="stretch">
                      {serpDomains.slice(0, 5).map((c: SerpDomainEntry) => (
                        <HStack key={c.pos} spacing={2}>
                          <Text
                            fontSize="xs"
                            color="var(--phoo-text-muted)"
                            fontWeight="bold"
                            minW="24px"
                            whiteSpace="nowrap"
                          >
                            #{c.pos}
                          </Text>
                          <Text fontSize="sm" color="var(--phoo-text-secondary)" noOfLines={1}>
                            {c.site}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>
                  </>
                ) : (
                  <>
                    <HStack mb={3} spacing={2}>
                      <Badge
                        bg="var(--phoo-bg-elevated)"
                        color="var(--phoo-text-muted)"
                        fontSize="10px"
                        px={1.5}
                        borderRadius="3px"
                      >
                        No SERP data yet
                      </Badge>
                    </HStack>
                    <Text fontSize="xs" color="var(--phoo-text-muted)" mb={2}>
                      SERP competitor data populates when keywords are clustered via GSC import or
                      AI generation.
                    </Text>
                  </>
                )}
                <Divider borderColor="var(--phoo-border)" my={3} />
                <HStack spacing={1}>
                  {isAnalyzing ? (
                    <Spinner size="xs" color="var(--phoo-warning)" />
                  ) : (
                    <Icon as={FiRefreshCw} color="var(--phoo-text-muted)" boxSize={3} />
                  )}
                  <Text
                    fontSize="xs"
                    color={isAnalyzing ? 'var(--phoo-warning)' : 'var(--phoo-text-muted)'}
                    cursor={isAnalyzing ? 'default' : 'pointer'}
                    _hover={isAnalyzing ? {} : { color: 'var(--phoo-warning)' }}
                    onClick={handleRunDeepDive}
                  >
                    {isAnalyzing
                      ? 'Analyzing SERP...'
                      : serpAnalysis
                        ? 'Re-analyze SERP'
                        : 'Run Deep Dive for live data'}
                  </Text>
                </HStack>
              </Card>
            </GridItem>

            {/* Phoo Recommendation */}
            <GridItem>
              <Card highlight glow>
                <HStack spacing={2} mb={2}>
                  <Icon as={FiEdit3} color="var(--phoo-warning)" boxSize={4} />
                  <Text
                    fontSize="xs"
                    color="var(--phoo-text-muted)"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Phoo Recommendation
                  </Text>
                </HStack>
                <HStack spacing={2} mb={3}>
                  <Icon as={FiCheckCircle} color="var(--phoo-success)" boxSize={5} />
                  <Text fontSize="lg" fontWeight="bold" color="var(--phoo-success)">
                    Create New Article
                  </Text>
                </HStack>
                <VStack align="start" spacing={1.5} pl={1} mb={4}>
                  <HStack spacing={2}>
                    <Icon as={FiCheckCircle} color="var(--phoo-text-muted)" boxSize={3} />
                    <Text fontSize="xs" color="var(--phoo-text-secondary)">
                      Suggested length: ~
                      {(keyword.difficulty ?? 0) > 60
                        ? '2,000'
                        : (keyword.difficulty ?? 0) > 30
                          ? '1,500'
                          : '1,000'}
                      + words
                    </Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Icon as={FiCheckCircle} color="var(--phoo-text-muted)" boxSize={3} />
                    <Text fontSize="xs" color="var(--phoo-text-secondary)">
                      Target {intentLabel.toLowerCase()} search intent
                    </Text>
                  </HStack>
                  {cluster && (
                    <HStack spacing={2}>
                      <Icon as={FiCheckCircle} color="var(--phoo-text-muted)" boxSize={3} />
                      <Text fontSize="xs" color="var(--phoo-text-secondary)">
                        Cluster has {cluster.keywords.length} related terms
                      </Text>
                    </HStack>
                  )}
                  <HStack spacing={2}>
                    <Icon as={FiCheckCircle} color="var(--phoo-text-muted)" boxSize={3} />
                    <Text fontSize="xs" color="var(--phoo-text-secondary)">
                      Include FAQs for featured snippets
                    </Text>
                  </HStack>
                </VStack>
                <Text fontSize="xs" color="var(--phoo-text-muted)" mb={1}>
                  Potential Leads Per Month
                </Text>
                <HStack spacing={2}>
                  <Icon as={FiTarget} color="var(--phoo-warning)" boxSize={5} />
                  <Text fontSize="2xl" fontWeight="bold" color="var(--phoo-text-primary)">
                    {leads.min}–{leads.max}
                  </Text>
                </HStack>
              </Card>
            </GridItem>
          </Grid>

          {/* ─── Why This Keyword Matters ───────────────── */}
          <Card>
            <Heading
              size="md"
              color="var(--phoo-text-primary)"
              mb={3}
              fontFamily="var(--phoo-font-display)"
            >
              Why This Keyword Matters
            </Heading>
            <Text color="var(--phoo-text-secondary)" fontSize="sm" lineHeight="1.7">
              Ranking for &ldquo;{keyword.keyword}&rdquo; can position you as a trusted resource and
              drive targeted visitors interested in{' '}
              {keyword.intent === 'commercial' || keyword.intent === 'transactional'
                ? 'making purchase decisions'
                : keyword.intent === 'navigational'
                  ? 'finding specific solutions'
                  : 'learning and exploring topics'}
              . With {keyword.searchVolume?.toLocaleString() || 'unknown'} monthly searches and{' '}
              {diff.label.toLowerCase()} competition, this keyword represents a{' '}
              {lead.label.toLowerCase()} opportunity for organic growth.
              {cluster &&
                ` It belongs to the "${cluster.clusterName}" cluster with ${cluster.keywords.length} related keywords, giving you topical authority when covered comprehensively.`}
            </Text>
          </Card>

          {/* ─── Three Metric Cards ──────────────────────── */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={5}>
            {/* Market Demand */}
            <GridItem>
              <Card>
                <HStack justify="space-between" mb={4}>
                  <Text fontSize="md" fontWeight="bold" color="var(--phoo-text-primary)">
                    Market Demand
                  </Text>
                  <Icon as={FiBarChart2} color="var(--phoo-text-muted)" />
                </HStack>

                <Text fontSize="xs" color="var(--phoo-text-muted)" mb={1}>
                  Monthly Searches
                </Text>
                <Text fontSize="3xl" fontWeight="bold" color="var(--phoo-text-primary)" mb={1}>
                  {keyword.searchVolume?.toLocaleString() || '—'}
                </Text>

                {cluster && stats.totalVolume > 0 && (
                  <Text fontSize="xs" color="var(--phoo-text-muted)" mb={3}>
                    Cluster total: {stats.totalVolume.toLocaleString()} ({stats.keywordCount}{' '}
                    keywords)
                  </Text>
                )}

                {cluster?.volumeRange && (
                  <HStack justify="space-between" mb={3}>
                    <Text fontSize="xs" color="var(--phoo-text-muted)">
                      Cluster Range
                    </Text>
                    <Text fontSize="xs" color="var(--phoo-text-primary)" fontWeight="semibold">
                      {cluster.volumeRange.min.toLocaleString()} –{' '}
                      {cluster.volumeRange.max.toLocaleString()}
                    </Text>
                  </HStack>
                )}

                <Divider borderColor="var(--phoo-border)" mb={4} />

                <HStack justify="space-between" mb={2}>
                  <Text fontSize="xs" color="var(--phoo-text-muted)">
                    Likelihood of Ranking
                  </Text>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color={
                      likelihood >= 60
                        ? 'var(--phoo-success)'
                        : likelihood >= 40
                          ? 'var(--phoo-warning)'
                          : 'var(--phoo-error)'
                    }
                  >
                    {likelihood}%
                  </Text>
                </HStack>
                <Box
                  position="relative"
                  h="8px"
                  bg="var(--phoo-bg-elevated)"
                  borderRadius="var(--phoo-radius-full)"
                  overflow="hidden"
                >
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    h="full"
                    w={`${likelihood}%`}
                    bgGradient={`linear(to-r, ${likelihood >= 60 ? 'var(--phoo-success)' : likelihood >= 40 ? 'var(--phoo-warning)' : 'var(--phoo-error)'}, transparent)`}
                    borderRadius="var(--phoo-radius-full)"
                    transition="width 0.6s ease"
                  />
                </Box>
                <HStack justify="flex-end" mt={1}>
                  <Badge
                    bg={
                      likelihood >= 60
                        ? 'var(--phoo-success-muted)'
                        : likelihood >= 40
                          ? 'var(--phoo-warning-muted)'
                          : 'var(--phoo-error-muted)'
                    }
                    color={
                      likelihood >= 60
                        ? 'var(--phoo-success)'
                        : likelihood >= 40
                          ? 'var(--phoo-warning)'
                          : 'var(--phoo-error)'
                    }
                    fontSize="10px"
                    px={2}
                    borderRadius="var(--phoo-radius-sm)"
                  >
                    {likelihood >= 60 ? 'High' : likelihood >= 40 ? 'Medium' : 'Low'}
                  </Badge>
                </HStack>
              </Card>
            </GridItem>

            {/* Ranking Feasibility */}
            <GridItem>
              <Card>
                <HStack justify="space-between" mb={4}>
                  <Text fontSize="md" fontWeight="bold" color="var(--phoo-text-primary)">
                    Ranking Feasibility
                  </Text>
                  <Icon as={FiBarChart2} color="var(--phoo-text-muted)" />
                </HStack>

                <Text fontSize="xs" color="var(--phoo-text-muted)" mb={1}>
                  SEO Difficulty
                </Text>
                <HStack spacing={3} mb={1}>
                  <Text fontSize="3xl" fontWeight="bold" color="var(--phoo-text-primary)">
                    {keyword.difficulty ?? '—'}
                  </Text>
                  <Badge
                    bg={
                      diff.color === 'var(--phoo-success)'
                        ? 'var(--phoo-success-muted)'
                        : diff.color === 'var(--phoo-warning)'
                          ? 'var(--phoo-warning-muted)'
                          : 'var(--phoo-error-muted)'
                    }
                    color={diff.color}
                    fontSize="10px"
                    fontWeight="bold"
                    px={2}
                    py={0.5}
                    borderRadius="var(--phoo-radius-sm)"
                  >
                    {diff.label}
                  </Badge>
                </HStack>

                <Box
                  position="relative"
                  h="10px"
                  bg="var(--phoo-bg-elevated)"
                  borderRadius="var(--phoo-radius-full)"
                  overflow="hidden"
                  mb={4}
                >
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    h="full"
                    w={`${keyword.difficulty ?? 0}%`}
                    borderRadius="var(--phoo-radius-full)"
                    bgGradient="linear(to-r, var(--phoo-success), var(--phoo-warning), var(--phoo-error))"
                    transition="width 0.6s ease"
                  />
                </Box>

                <Divider borderColor="var(--phoo-border)" mb={4} />

                {stats.avgDifficulty !== null && (
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="xs" color="var(--phoo-text-secondary)">
                      Cluster Avg Difficulty
                    </Text>
                    <Text fontSize="xs" color="var(--phoo-text-primary)" fontWeight="semibold">
                      {stats.avgDifficulty}/100
                    </Text>
                  </HStack>
                )}
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="xs" color="var(--phoo-text-secondary)">
                    Est. Content Quality
                  </Text>
                  <Text fontSize="xs" color="var(--phoo-text-primary)" fontWeight="semibold">
                    {keyword.difficulty != null
                      ? keyword.difficulty > 60
                        ? 'Expert-level'
                        : keyword.difficulty > 30
                          ? 'Comprehensive'
                          : 'Standard'
                      : '—'}
                  </Text>
                </HStack>
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="xs" color="var(--phoo-text-secondary)">
                    Est. Time to Rank
                  </Text>
                  <Text fontSize="xs" color="var(--phoo-text-primary)" fontWeight="semibold">
                    {keyword.difficulty != null
                      ? keyword.difficulty > 60
                        ? '6-12 months'
                        : keyword.difficulty > 30
                          ? '3-6 months'
                          : '1-3 months'
                      : '—'}
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="xs" color="var(--phoo-text-secondary)">
                    Est. Backlinks Needed
                  </Text>
                  <Text fontSize="xs" color="var(--phoo-text-primary)" fontWeight="semibold">
                    {keyword.difficulty != null
                      ? keyword.difficulty > 60
                        ? '15+'
                        : keyword.difficulty > 30
                          ? '5-10'
                          : '0-5'
                      : '—'}
                  </Text>
                </HStack>
              </Card>
            </GridItem>

            {/* Business Impact Estimator */}
            <GridItem>
              <Card>
                <HStack justify="space-between" mb={4}>
                  <Text fontSize="md" fontWeight="bold" color="var(--phoo-text-primary)">
                    Business Impact
                  </Text>
                  <Icon as={FiUsers} color="var(--phoo-text-muted)" />
                </HStack>

                {/* If cluster has impact score, show it */}
                {cluster && (
                  <HStack justify="space-between" mb={3}>
                    <Text fontSize="xs" color="var(--phoo-text-muted)">
                      Cluster Impact Score
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color="var(--phoo-warning)">
                      {Math.round(cluster.impactScore * 100)}%
                    </Text>
                  </HStack>
                )}

                {stats.avgCpc !== null && (
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="xs" color="var(--phoo-text-muted)">
                      Avg CPC (cluster)
                    </Text>
                    <Text fontSize="sm" color="var(--phoo-text-primary)" fontWeight="semibold">
                      ${stats.avgCpc.toFixed(2)}
                    </Text>
                  </HStack>
                )}

                <HStack justify="space-between" mb={2}>
                  <Text fontSize="xs" color="var(--phoo-text-muted)">
                    Est. Monthly Visitors
                  </Text>
                  <Text fontSize="sm" color="var(--phoo-text-primary)" fontWeight="semibold">
                    {keyword.searchVolume
                      ? `${Math.round(keyword.searchVolume * (likelihood / 100) * 0.3).toLocaleString()}–${Math.round(keyword.searchVolume * (likelihood / 100) * 0.6).toLocaleString()}`
                      : '—'}
                  </Text>
                </HStack>

                <HStack justify="space-between" mb={2}>
                  <Text fontSize="xs" color="var(--phoo-text-muted)">
                    Potential Leads/Mo
                  </Text>
                  <Text fontSize="sm" color="var(--phoo-warning)" fontWeight="bold">
                    {leads.min}–{leads.max}
                  </Text>
                </HStack>

                <Divider borderColor="var(--phoo-border)" my={3} />

                <VStack spacing={2} align="stretch">
                  <Button
                    bg="var(--phoo-warning)"
                    color="white"
                    size="sm"
                    w="full"
                    _hover={{ bg: '#e08f06', transform: 'translateY(-1px)' }}
                    leftIcon={<FiEdit3 />}
                    fontWeight="bold"
                    borderRadius="var(--phoo-radius-sm)"
                    transition="all 0.2s"
                    onClick={handleCreateArticle}
                  >
                    Create Optimized Article
                  </Button>
                  <HStack spacing={2}>
                    <Button
                      variant="outline"
                      borderColor="var(--phoo-border)"
                      color="var(--phoo-text-secondary)"
                      size="xs"
                      flex={1}
                      _hover={{ borderColor: 'var(--phoo-warning)', color: 'var(--phoo-warning)' }}
                      leftIcon={isAnalyzing ? <Spinner size="xs" /> : <FiRefreshCw />}
                      transition="all 0.2s"
                      onClick={handleRunDeepDive}
                      isLoading={isAnalyzing}
                      loadingText="Analyzing"
                    >
                      Deep Dive
                    </Button>
                    <Button
                      variant="outline"
                      borderColor="var(--phoo-border)"
                      color="var(--phoo-text-secondary)"
                      size="xs"
                      flex={1}
                      _hover={{ borderColor: 'var(--phoo-warning)', color: 'var(--phoo-warning)' }}
                      leftIcon={<FiLayers />}
                      transition="all 0.2s"
                      onClick={() => setShowClusterModal(true)}
                    >
                      Add to Cluster
                    </Button>
                  </HStack>
                </VStack>
              </Card>
            </GridItem>
          </Grid>

          {/* ─── Cluster Keywords (Content Cluster Context) ─ */}
          {cluster && siblings.length > 0 && (
            <Card>
              <HStack justify="space-between" mb={4}>
                <Heading
                  size="md"
                  color="var(--phoo-text-primary)"
                  fontFamily="var(--phoo-font-display)"
                >
                  Content Cluster Context
                </Heading>
                <Badge
                  bg="var(--phoo-info-muted)"
                  color="var(--phoo-info)"
                  fontSize="10px"
                  px={2}
                  borderRadius="var(--phoo-radius-sm)"
                >
                  {cluster.clusterName}
                </Badge>
              </HStack>
              <Box overflowX="auto">
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th
                        borderColor="var(--phoo-border)"
                        color="var(--phoo-text-muted)"
                        fontSize="10px"
                        textTransform="uppercase"
                      >
                        Keyword
                      </Th>
                      <Th
                        borderColor="var(--phoo-border)"
                        color="var(--phoo-text-muted)"
                        fontSize="10px"
                        textTransform="uppercase"
                        isNumeric
                      >
                        Volume
                      </Th>
                      <Th
                        borderColor="var(--phoo-border)"
                        color="var(--phoo-text-muted)"
                        fontSize="10px"
                        textTransform="uppercase"
                        isNumeric
                      >
                        Difficulty
                      </Th>
                      <Th
                        borderColor="var(--phoo-border)"
                        color="var(--phoo-text-muted)"
                        fontSize="10px"
                        textTransform="uppercase"
                      >
                        Intent
                      </Th>
                      <Th
                        borderColor="var(--phoo-border)"
                        color="var(--phoo-text-muted)"
                        fontSize="10px"
                        textTransform="uppercase"
                        isNumeric
                      >
                        GSC Pos
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {siblings
                      .slice(0, 10)
                      .map(
                        (sib: {
                          _id: string;
                          keyword: string;
                          searchVolume?: number;
                          difficulty?: number;
                          intent?: string;
                          gscPosition?: number;
                        }) => {
                          const sibDiff = getDifficultyLabel(sib.difficulty);
                          return (
                            <Tr key={sib._id}>
                              <Td
                                borderColor="var(--phoo-border)"
                                color="var(--phoo-text-secondary)"
                                fontSize="sm"
                              >
                                {sib.keyword}
                              </Td>
                              <Td
                                borderColor="var(--phoo-border)"
                                color="var(--phoo-text-primary)"
                                fontSize="sm"
                                isNumeric
                              >
                                {sib.searchVolume?.toLocaleString() ?? '—'}
                              </Td>
                              <Td borderColor="var(--phoo-border)" isNumeric>
                                <Badge
                                  bg={
                                    sibDiff.color === 'var(--phoo-success)'
                                      ? 'var(--phoo-success-muted)'
                                      : sibDiff.color === 'var(--phoo-warning)'
                                        ? 'var(--phoo-warning-muted)'
                                        : 'var(--phoo-error-muted)'
                                  }
                                  color={sibDiff.color}
                                  fontSize="10px"
                                  px={2}
                                  borderRadius="var(--phoo-radius-sm)"
                                >
                                  {sib.difficulty ?? '—'}
                                </Badge>
                              </Td>
                              <Td
                                borderColor="var(--phoo-border)"
                                color="var(--phoo-text-muted)"
                                fontSize="xs"
                                textTransform="capitalize"
                              >
                                {sib.intent || '—'}
                              </Td>
                              <Td
                                borderColor="var(--phoo-border)"
                                color="var(--phoo-text-primary)"
                                fontSize="sm"
                                isNumeric
                              >
                                {sib.gscPosition ? Math.round(sib.gscPosition) : '—'}
                              </Td>
                            </Tr>
                          );
                        }
                      )}
                  </Tbody>
                </Table>
              </Box>
              {siblings.length > 10 && (
                <Text fontSize="xs" color="var(--phoo-text-muted)" mt={2}>
                  + {siblings.length - 10} more keywords in this cluster
                </Text>
              )}
            </Card>
          )}

          {/* ─── SERP Overview (from cluster topSerpUrls) ── */}
          {serpDomains.length > 0 && (
            <Card>
              <HStack justify="space-between" mb={4}>
                <Heading
                  size="md"
                  color="var(--phoo-text-primary)"
                  fontFamily="var(--phoo-font-display)"
                >
                  SERP Overview
                </Heading>
                {serpAnalysis && (
                  <Badge
                    bg="var(--phoo-success-muted)"
                    color="var(--phoo-success)"
                    fontSize="10px"
                    px={2}
                    borderRadius="var(--phoo-radius-sm)"
                  >
                    AI Analyzed {new Date(serpAnalysis.analyzedAt).toLocaleDateString()}
                  </Badge>
                )}
              </HStack>
              <Box overflowX="auto">
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th
                        borderColor="var(--phoo-border)"
                        color="var(--phoo-text-muted)"
                        fontSize="10px"
                        textTransform="uppercase"
                      >
                        Pos.
                      </Th>
                      <Th
                        borderColor="var(--phoo-border)"
                        color="var(--phoo-text-muted)"
                        fontSize="10px"
                        textTransform="uppercase"
                      >
                        Domain
                      </Th>
                      {serpAnalysis && (
                        <Th
                          borderColor="var(--phoo-border)"
                          color="var(--phoo-text-muted)"
                          fontSize="10px"
                          textTransform="uppercase"
                        >
                          Title
                        </Th>
                      )}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {serpDomains.map((row: SerpDomainEntry) => (
                      <Tr key={row.pos}>
                        <Td borderColor="var(--phoo-border)">
                          <Badge
                            bg={
                              row.pos <= 3 ? 'var(--phoo-warning-muted)' : 'var(--phoo-bg-elevated)'
                            }
                            color={row.pos <= 3 ? 'var(--phoo-warning)' : 'var(--phoo-text-muted)'}
                            fontSize="10px"
                            px={2}
                            borderRadius="var(--phoo-radius-sm)"
                          >
                            #{row.pos}
                          </Badge>
                        </Td>
                        <Td
                          borderColor="var(--phoo-border)"
                          color="var(--phoo-text-secondary)"
                          fontSize="sm"
                        >
                          <Tooltip
                            label={row.snippet || row.site}
                            hasArrow
                            bg="var(--phoo-bg-elevated)"
                            color="var(--phoo-text-primary)"
                            fontSize="xs"
                            maxW="320px"
                            placement="top"
                          >
                            <HStack spacing={2}>
                              <Icon as={FiGlobe} color="var(--phoo-text-muted)" boxSize={3} />
                              <Text>{row.site}</Text>
                            </HStack>
                          </Tooltip>
                        </Td>
                        {serpAnalysis && (
                          <Td
                            borderColor="var(--phoo-border)"
                            color="var(--phoo-text-muted)"
                            fontSize="xs"
                            maxW="300px"
                          >
                            <Text noOfLines={1}>{row.title || '—'}</Text>
                          </Td>
                        )}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </Card>
          )}

          {/* ─── GSC Performance (if data exists) ───────── */}
          {(keyword.gscPosition || keyword.gscClicks || keyword.gscImpressions) && (
            <Card>
              <Heading
                size="md"
                color="var(--phoo-text-primary)"
                mb={4}
                fontFamily="var(--phoo-font-display)"
              >
                GSC Performance
              </Heading>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={5}>
                <VStack align="start" spacing={0}>
                  <Text fontSize="xs" color="var(--phoo-text-muted)">
                    Position
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="var(--phoo-text-primary)">
                    {keyword.gscPosition ? Math.round(keyword.gscPosition) : '—'}
                  </Text>
                </VStack>
                <VStack align="start" spacing={0}>
                  <Text fontSize="xs" color="var(--phoo-text-muted)">
                    Clicks
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="var(--phoo-text-primary)">
                    {keyword.gscClicks?.toLocaleString() ?? '—'}
                  </Text>
                </VStack>
                <VStack align="start" spacing={0}>
                  <Text fontSize="xs" color="var(--phoo-text-muted)">
                    Impressions
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="var(--phoo-text-primary)">
                    {keyword.gscImpressions?.toLocaleString() ?? '—'}
                  </Text>
                </VStack>
                <VStack align="start" spacing={0}>
                  <Text fontSize="xs" color="var(--phoo-text-muted)">
                    CTR
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="var(--phoo-text-primary)">
                    {keyword.gscCtr ? `${(keyword.gscCtr * 100).toFixed(1)}%` : '—'}
                  </Text>
                </VStack>
              </Grid>
            </Card>
          )}
        </VStack>
      </Container>

      {/* Add to Cluster Modal */}
      {projectId && (
        <AddToClusterModal
          isOpen={showClusterModal}
          onClose={() => setShowClusterModal(false)}
          projectId={projectId as string}
          keywordId={keywordId}
          keywordText={keyword.keyword}
        />
      )}
    </Box>
  );
}
