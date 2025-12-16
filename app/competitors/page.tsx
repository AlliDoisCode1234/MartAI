'use client';

/**
 * Competitors Page
 *
 * Component Hierarchy:
 * App → CompetitorsPage → SerpAnalyzer
 *
 * Dedicated page for SERP analysis and competitor research.
 * Limit: 1 SERP per project (upsell for more).
 */

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  VStack,
  Heading,
  Text,
  Box,
  Alert,
  AlertIcon,
  HStack,
  Icon,
  SimpleGrid,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiUsers, FiSearch, FiTrendingUp, FiLock } from 'react-icons/fi';
import { useAuth } from '@/lib/useAuth';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { SerpAnalyzer } from '@/src/components/SerpAnalyzer';
import { useProject } from '@/lib/hooks';

// Extracted components
import { CompetitorStatsCard, UpsellCard, CompetitorsSkeleton } from '@/src/components/competitors';

const MotionBox = motion(Box);

function CompetitorsContent() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const cardBg = useColorModeValue('white', 'gray.800');

  // Use enhanced useProject hook with autoSelect
  const { projectId, isLoading: projectLoading } = useProject(null, { autoSelect: true });

  const typedProjectId = projectId as Id<'projects'> | null;
  const limitCheck = useQuery(
    api.seo.serpAnalysis.canAnalyze,
    typedProjectId ? { projectId: typedProjectId } : 'skip'
  );
  const existingAnalyses = useQuery(
    api.seo.serpAnalysis.getByProject,
    typedProjectId ? { projectId: typedProjectId } : 'skip'
  );

  if (projectLoading) return <CompetitorsSkeleton />;
  if (!projectId)
    return (
      <Container maxW="container.xl" py={12}>
        <VStack spacing={6}>
          <Heading size="xl">No project found</Heading>
          <Text>You need to create a project first.</Text>
          <Button bg="brand.orange" color="white" onClick={() => router.push('/onboarding')}>
            Create Project
          </Button>
        </VStack>
      </Container>
    );
  if (!isAuthenticated)
    return (
      <Box
        minH="calc(100vh - 64px)"
        bg="brand.light"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Alert status="warning" maxW="md">
          <AlertIcon />
          Please sign in to view competitors
        </Alert>
      </Box>
    );

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container
        maxW="container.xl"
        py={{ base: 8, md: 12 }}
        px={{ base: 4, sm: 6, md: 8, lg: 12 }}
      >
        <VStack spacing={8} align="stretch">
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <VStack align="start" spacing={1}>
              <HStack>
                <Icon as={FiUsers} boxSize={8} color="brand.orange" />
                <Heading size="2xl" fontWeight="bold" fontFamily="heading" color="gray.800">
                  Competitor Research
                </Heading>
              </HStack>
              <Text color="gray.600">Discover who's ranking for your target keywords</Text>
            </VStack>
          </MotionBox>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <CompetitorStatsCard
              icon={FiSearch}
              iconBg="blue.100"
              iconColor="blue.600"
              value={existingAnalyses?.length || 0}
              label="Keywords Analyzed"
              delay={0.1}
              cardBg={cardBg}
            />
            <CompetitorStatsCard
              icon={FiTrendingUp}
              iconBg="green.100"
              iconColor="green.600"
              value={existingAnalyses?.[0]?.results?.length || 0}
              label="Competitors Found"
              delay={0.2}
              cardBg={cardBg}
            />
            <CompetitorStatsCard
              icon={limitCheck?.canAnalyze ? FiSearch : FiLock}
              iconBg={limitCheck?.canAnalyze ? 'purple.100' : 'orange.100'}
              iconColor={limitCheck?.canAnalyze ? 'purple.600' : 'orange.600'}
              value={limitCheck?.remaining || 0}
              label="Analyses Remaining"
              delay={0.3}
              cardBg={cardBg}
            />
          </SimpleGrid>

          {typedProjectId && (
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <SerpAnalyzer projectId={typedProjectId} />
            </MotionBox>
          )}
          {limitCheck && !limitCheck.canAnalyze && (
            <UpsellCard onViewPlans={() => router.push('/pricing')} />
          )}
        </VStack>
      </Container>
    </Box>
  );
}

export default function CompetitorsPage() {
  return (
    <Suspense fallback={<CompetitorsSkeleton />}>
      <CompetitorsContent />
    </Suspense>
  );
}
