'use client';

/**
 * ClustersPage
 *
 * Component Hierarchy:
 * App -> Keywords -> KeywordsLayout -> ClustersPage (this file)
 *
 * Matches keyword library style with a cluster table showing:
 * Cluster Name, Keywords Count, Intent, Difficulty, Volume Range,
 * Impact Score, Status, and a "Create Content" CTA per cluster.
 */

import { useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  HStack,
  VStack,
  Badge,
  Button,
  Icon,
  Tooltip,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useProject } from '@/lib/hooks';
import { useConvexAuth } from 'convex/react';
import { FiLayers, FiPlus, FiEdit3, FiZap, FiTrendingUp } from 'react-icons/fi';
import { Id } from '@/convex/_generated/dataModel';
import { IntentBadge } from '@/src/components/keywords/IntentBadge';

const thStyle = {
  color: 'gray.500',
  borderColor: 'rgba(255,255,255,0.06)',
  fontSize: '10px',
  fontWeight: 'bold',
  textTransform: 'uppercase' as const,
  letterSpacing: 'wider',
  py: 3,
};

export default function ClustersPage() {
  const { projectId } = useProject(null, { autoSelect: true });
  const { isLoading: authLoading } = useConvexAuth();
  const toast = useToast();

  const clusters = useQuery(
    api.seo.keywordClusters.getClustersByProject,
    projectId ? { projectId: projectId as Id<'projects'> } : 'skip'
  );

  const generateContent = useAction(api.contentGeneration.generateContent);
  const [generatingClusterId, setGeneratingClusterId] = useState<string | null>(null);

  const handleCreateContent = async (cluster: NonNullable<typeof clusters>[number]) => {
    if (!projectId) return;
    setGeneratingClusterId(cluster._id);
    try {
      await generateContent({
        projectId: projectId as Id<'projects'>,
        contentType: 'blog',
        title: cluster.clusterName,
        keywords: cluster.keywords,
        clusterId: cluster._id as Id<'keywordClusters'>,
      });
      toast({
        title: 'Content created',
        description: `Draft generated for "${cluster.clusterName}"`,
        status: 'success',
        duration: 4000,
      });
    } catch (error) {
      toast({
        title: 'Generation failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setGeneratingClusterId(null);
    }
  };

  if (authLoading || !clusters) {
    return (
      <VStack py={16} spacing={4}>
        <Spinner color="#F99F2A" size="lg" />
        <Text color="gray.500" fontSize="sm">
          Loading clusters...
        </Text>
      </VStack>
    );
  }

  if (clusters.length === 0) {
    return (
      <VStack spacing={6} py={16} align="center">
        <Icon as={FiLayers} boxSize={12} color="#F99F2A" opacity={0.5} />
        <VStack spacing={2}>
          <Text color="white" fontSize="xl" fontWeight="bold">
            No Clusters Yet
          </Text>
          <Text color="gray.400" fontSize="sm" maxW="420px" textAlign="center">
            Group related keywords into topic clusters to plan content strategy and maximize topical
            authority. Use AI to auto-generate clusters or click &quot;+ Cluster&quot; on any
            keyword.
          </Text>
        </VStack>
      </VStack>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Header row */}
      <HStack justify="space-between">
        <HStack spacing={2}>
          <Icon as={FiLayers} color="#F99F2A" boxSize={5} />
          <Text color="white" fontSize="lg" fontWeight="bold">
            {clusters.length} Cluster{clusters.length !== 1 ? 's' : ''}
          </Text>
        </HStack>
      </HStack>

      {/* Table */}
      <Box
        bg="#1a1230"
        borderRadius="xl"
        border="1px solid rgba(255,255,255,0.06)"
        overflowX="auto"
      >
        <Table variant="unstyled" size="sm">
          <Thead>
            <Tr borderBottom="1px solid rgba(255,255,255,0.06)">
              <Th {...thStyle}>Cluster</Th>
              <Th {...thStyle} isNumeric>
                Keywords
              </Th>
              <Th {...thStyle}>Intent</Th>
              <Th {...thStyle} isNumeric>
                Difficulty
              </Th>
              <Th {...thStyle} isNumeric>
                Volume Range
              </Th>
              <Th {...thStyle} isNumeric>
                Impact
              </Th>
              <Th {...thStyle}>Status</Th>
              <Th {...thStyle} />
            </Tr>
          </Thead>
          <Tbody>
            {clusters.map((cluster) => {
              const isGenerating = generatingClusterId === cluster._id;
              return (
                <Tr
                  key={cluster._id}
                  borderBottom="1px solid rgba(255,255,255,0.04)"
                  _hover={{ bg: 'rgba(255,255,255,0.03)' }}
                  transition="background 0.15s"
                >
                  {/* Cluster Name */}
                  <Td borderColor="transparent" py={3} maxW="240px">
                    <VStack align="start" spacing={0.5}>
                      <Text color="white" fontSize="sm" fontWeight="medium" noOfLines={1}>
                        {cluster.clusterName}
                      </Text>
                      <Text color="gray.600" fontSize="xs" noOfLines={1}>
                        {cluster.keywords.slice(0, 3).join(', ')}
                        {cluster.keywords.length > 3 && ` +${cluster.keywords.length - 3}`}
                      </Text>
                    </VStack>
                  </Td>

                  {/* Keywords Count */}
                  <Td borderColor="transparent" py={3} isNumeric>
                    <Badge
                      bg="rgba(96,165,250,0.2)"
                      color="#60a5fa"
                      fontSize="xs"
                      fontWeight="bold"
                      px={2}
                      py={0.5}
                      borderRadius="4px"
                    >
                      {cluster.keywords.length}
                    </Badge>
                  </Td>

                  {/* Intent */}
                  <Td borderColor="transparent" py={3}>
                    <IntentBadge intent={cluster.intent} />
                  </Td>

                  {/* Difficulty */}
                  <Td borderColor="transparent" py={3} isNumeric>
                    <Text
                      color={getDifficultyColor(cluster.difficulty)}
                      fontSize="sm"
                      fontWeight="medium"
                    >
                      {cluster.difficulty}/100
                    </Text>
                  </Td>

                  {/* Volume Range */}
                  <Td borderColor="transparent" py={3} isNumeric>
                    <Text color="gray.300" fontSize="sm">
                      {cluster.volumeRange.min.toLocaleString()} -{' '}
                      {cluster.volumeRange.max.toLocaleString()}
                    </Text>
                  </Td>

                  {/* Impact Score */}
                  <Td borderColor="transparent" py={3} isNumeric>
                    <HStack spacing={1} justify="flex-end">
                      <Icon
                        as={FiTrendingUp}
                        color={getImpactColor(cluster.impactScore)}
                        boxSize={3}
                      />
                      <Text
                        color={getImpactColor(cluster.impactScore)}
                        fontSize="sm"
                        fontWeight="bold"
                      >
                        {cluster.impactScore}
                      </Text>
                    </HStack>
                  </Td>

                  {/* Status */}
                  <Td borderColor="transparent" py={3}>
                    <StatusBadge status={cluster.status} />
                  </Td>

                  {/* Create Content CTA */}
                  <Td borderColor="transparent" py={3}>
                    <Tooltip
                      label="Generate a blog post from this cluster's keywords"
                      hasArrow
                      bg="gray.800"
                      color="gray.200"
                      fontSize="xs"
                    >
                      <Button
                        size="xs"
                        leftIcon={isGenerating ? <Spinner size="xs" /> : <FiEdit3 />}
                        bg="rgba(249,159,42,0.15)"
                        color="#F99F2A"
                        border="1px solid rgba(249,159,42,0.3)"
                        _hover={{ bg: 'rgba(249,159,42,0.25)' }}
                        borderRadius="md"
                        fontSize="xs"
                        fontWeight="semibold"
                        isDisabled={isGenerating}
                        onClick={() => handleCreateContent(cluster)}
                      >
                        {isGenerating ? 'Generating...' : 'Create Content'}
                      </Button>
                    </Tooltip>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </VStack>
  );
}

function getDifficultyColor(d: number): string {
  if (d <= 30) return '#34d399';
  if (d <= 60) return '#F99F2A';
  return '#ef4444';
}

function getImpactColor(score: number): string {
  if (score >= 70) return '#34d399';
  if (score >= 40) return '#F99F2A';
  return '#ef4444';
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    active: { bg: 'rgba(52,211,153,0.2)', color: '#34d399', label: 'Active' },
    favorite: { bg: 'rgba(249,159,42,0.2)', color: '#F99F2A', label: 'Favorite' },
    hidden: { bg: 'rgba(148,163,184,0.15)', color: '#94a3b8', label: 'Hidden' },
  };
  const s = styles[status] ?? styles.active;
  return (
    <Badge
      bg={s.bg}
      color={s.color}
      fontSize="9px"
      fontWeight="bold"
      px={2}
      py={0.5}
      borderRadius="4px"
      textTransform="capitalize"
    >
      {s.label}
    </Badge>
  );
}
