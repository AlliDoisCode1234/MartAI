'use client';

/**
 * IntelligenceCard Component
 *
 * Component Hierarchy:
 * App → Dashboard → IntelligenceCard (this file)
 *
 * MartAI Intelligence report summary card.
 */

import {
  Card,
  CardBody,
  Box,
  HStack,
  Heading,
  Text,
  Badge,
  Stack,
  Divider,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const MotionCard = motion(Card);

type AiReport = {
  status?: string;
  summary?: string;
  metrics?: {
    coverageScore?: number;
    organicKeywords?: number;
    trafficEstimate?: number;
  };
  confidence?: { score?: number };
  dataSources?: string[];
};

type Props = {
  report: AiReport | null;
};

export function IntelligenceCard({ report }: Props) {
  const router = useRouter();
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <MotionCard
      variant="outline"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      bg={cardBg}
      borderColor="gray.100"
      overflow="hidden"
      boxShadow="lg"
      borderRadius="xl"
    >
      <Box h="4px" bgGradient="linear(to-r, brand.orange, brand.teal)" />
      <CardBody>
        <HStack justify="space-between" mb={6} align="flex-start">
          <Box>
            <Heading size="md" mb={1}>
              MartAI Intelligence
            </Heading>
            <Text color="gray.500" fontSize="sm">
              Latest automated crawl & keyword intelligence for this project.
            </Text>
          </Box>
          <Badge
            colorScheme={report?.status === 'completed' ? 'green' : 'orange'}
            variant="subtle"
            borderRadius="full"
            px={3}
            py={1}
          >
            {report?.status ?? 'pending'}
          </Badge>
        </HStack>

        {report ? (
          <Stack spacing={6}>
            {report.summary && (
              <Text color="gray.700" fontSize="md" lineHeight="tall">
                {report.summary}
              </Text>
            )}
            <Divider />
            <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={6}>
              <Stat>
                <StatLabel color="gray.500">Coverage Score</StatLabel>
                <StatNumber fontSize="2xl" fontWeight="bold">
                  {report.metrics?.coverageScore ?? '—'}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel color="gray.500">Organic Keywords</StatLabel>
                <StatNumber fontSize="2xl" fontWeight="bold">
                  {report.metrics?.organicKeywords ?? '—'}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel color="gray.500">Traffic Estimate</StatLabel>
                <StatNumber fontSize="2xl" fontWeight="bold">
                  {report.metrics?.trafficEstimate
                    ? report.metrics.trafficEstimate.toLocaleString()
                    : '—'}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel color="gray.500">Confidence</StatLabel>
                <StatNumber fontSize="2xl" fontWeight="bold">
                  {report.confidence?.score ?? '—'}%
                </StatNumber>
              </Stat>
            </Grid>
            {report.dataSources?.length ? (
              <Text fontSize="xs" color="gray.400" mt={2}>
                Data sources: {report.dataSources.join(', ')}
              </Text>
            ) : null}
          </Stack>
        ) : (
          <Stack spacing={4} align="center" py={8} bg="gray.50" borderRadius="lg">
            <Text color="gray.500">
              No AI intelligence report yet. Run an analysis to populate insights.
            </Text>
            <Button
              size="sm"
              colorScheme="brand"
              variant="outline"
              onClick={() => router.push('/admin')}
            >
              Run Analysis
            </Button>
          </Stack>
        )}
      </CardBody>
    </MotionCard>
  );
}
