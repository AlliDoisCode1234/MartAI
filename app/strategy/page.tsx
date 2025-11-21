'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container, VStack, Heading, Text, Box, Button, HStack, Grid, GridItem, Card, CardBody, Badge, Alert, AlertIcon, Spinner, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter, useDisclosure, FormControl, FormLabel, Input, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Select, Checkbox } from '@chakra-ui/react';
import { useAuth } from '@/lib/useAuth';

type KeywordCluster = {
  _id?: string;
  id?: string;
  clusterName: string;
  keywords: string[];
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  difficulty: number;
  volumeRange: { min: number; max: number };
  impactScore: number;
  topSerpUrls: string[];
  status: 'active' | 'hidden' | 'favorite';
  reasoning?: string;
};

function StrategyContent() {
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const [clusters, setClusters] = useState<KeywordCluster[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [rerankWeights, setRerankWeights] = useState({
    volumeWeight: 0.4,
    intentWeight: 0.3,
    difficultyWeight: 0.3,
  });
  const [importFromGSC, setImportFromGSC] = useState(true);

  useEffect(() => {
    const storedProject = localStorage.getItem('currentProjectId');
    if (storedProject) {
      setProjectId(storedProject);
      loadClusters(storedProject);
    }
  }, []);

  const loadClusters = async (pid: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/clusters?projectId=${pid}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setClusters(data.clusters || []);
      }
    } catch (error) {
      console.error('Error loading clusters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateClusters = async () => {
    if (!projectId) {
      alert('Please complete onboarding first');
      return;
    }

    setGenerating(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/clusters/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId,
          keywords: [], // Can be enhanced to let user input keywords
          importFromGSC,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setClusters(data.clusters || []);
        alert(`Generated ${data.count} keyword clusters!`);
      } else {
        alert(data.error || 'Failed to generate clusters');
      }
    } catch (error) {
      console.error('Error generating clusters:', error);
      alert('Failed to generate clusters');
    } finally {
      setGenerating(false);
    }
  };

  const handleRerank = async () => {
    if (!projectId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/clusters/rerank', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId,
          ...rerankWeights,
        }),
      });

      if (response.ok) {
        await loadClusters(projectId);
        onClose();
      }
    } catch (error) {
      console.error('Error reranking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (clusterId: string, status: 'active' | 'hidden' | 'favorite') => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/clusters/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ clusterId, status }),
      });

      if (response.ok && projectId) {
        await loadClusters(projectId);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'transactional': return 'red';
      case 'commercial': return 'orange';
      case 'informational': return 'blue';
      case 'navigational': return 'gray';
      default: return 'gray';
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return 'green';
    if (difficulty < 70) return 'yellow';
    return 'red';
  };

  if (!isAuthenticated) {
    return (
      <Box minH="calc(100vh - 64px)" bg="brand.light" display="flex" alignItems="center" justifyContent="center">
        <Alert status="warning" maxW="md">
          <AlertIcon />
          Please sign in to view keyword clusters
        </Alert>
      </Box>
    );
  }

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container maxW="container.xl" py={{ base: 8, md: 12 }} px={{ base: 4, sm: 6, md: 8, lg: 12 }}>
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between">
            <Heading size="2xl" fontWeight="bold" fontFamily="heading" color="gray.800">
              Keyword Clusters
            </Heading>
            <HStack>
              <Button
                onClick={onOpen}
                variant="outline"
                isDisabled={clusters.length === 0}
              >
                Re-rank Clusters
              </Button>
              <Button
                bg="brand.orange"
                color="white"
                _hover={{ bg: '#E8851A' }}
                onClick={handleGenerateClusters}
                isLoading={generating}
                loadingText="Generating..."
              >
                Generate Clusters
              </Button>
            </HStack>
          </HStack>

          <Text color="gray.600">
            AI-powered keyword clustering groups related keywords by intent, topic, and user journey stage.
            Impact score combines volume, intent, and difficulty to prioritize high-value opportunities.
          </Text>

          {clusters.length === 0 && !loading && (
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <VStack align="start" spacing={2}>
                <Text fontWeight="semibold">No keyword clusters yet</Text>
                <Text fontSize="sm">
                  Click &quot;Generate Clusters&quot; to analyze your keywords and create strategic clusters.
                  {importFromGSC && ' We will import top queries from Google Search Console if connected.'}
                </Text>
              </VStack>
            </Alert>
          )}

          {loading && clusters.length === 0 ? (
            <Box display="flex" justifyContent="center" py={12}>
              <Spinner size="xl" color="brand.orange" />
            </Box>
          ) : (
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
              {clusters.map((cluster, index) => (
                <GridItem key={cluster._id || cluster.id || index}>
                  <Card>
                    <CardBody>
                      <VStack align="stretch" spacing={3}>
                        <HStack justify="space-between">
                          <Heading size="sm" noOfLines={2}>
                            {cluster.clusterName}
                          </Heading>
                          <Badge colorScheme={cluster.status === 'favorite' ? 'yellow' : 'gray'}>
                            {cluster.status}
                          </Badge>
                        </HStack>

                        <HStack spacing={2} flexWrap="wrap">
                          <Badge colorScheme={getIntentColor(cluster.intent)}>
                            {cluster.intent}
                          </Badge>
                          <Badge colorScheme={getDifficultyColor(cluster.difficulty)}>
                            Difficulty: {cluster.difficulty}
                          </Badge>
                          <Badge variant="outline">
                            Impact: {cluster.impactScore.toFixed(2)}
                          </Badge>
                        </HStack>

                        <Box>
                          <Text fontSize="xs" color="gray.500" mb={1}>
                            Volume: {cluster.volumeRange.min.toLocaleString()} - {cluster.volumeRange.max.toLocaleString()}/mo
                          </Text>
                          <Text fontSize="sm" color="gray.700" noOfLines={3}>
                            {cluster.keywords.slice(0, 5).join(', ')}
                            {cluster.keywords.length > 5 && ` +${cluster.keywords.length - 5} more`}
                          </Text>
                        </Box>

                        {cluster.reasoning && (
                          <Text fontSize="xs" color="gray.600" fontStyle="italic">
                            {cluster.reasoning}
                          </Text>
                        )}

                        <HStack spacing={2}>
                          <Button
                            size="sm"
                            variant={cluster.status === 'favorite' ? 'solid' : 'outline'}
                            colorScheme="yellow"
                            onClick={() => handleUpdateStatus(cluster._id || cluster.id || '', 'favorite')}
                          >
                            {cluster.status === 'favorite' ? '★ Favorited' : '☆ Favorite'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(cluster._id || cluster.id || '', 'hidden')}
                          >
                            Hide
                          </Button>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>
              ))}
            </Grid>
          )}

          {/* Re-rank Modal */}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Re-rank Clusters by Impact</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing={4} align="stretch">
                  <Text fontSize="sm" color="gray.600">
                    Adjust weights for impact calculation: Impact = volume_weight × volume + intent_weight × intent - difficulty_weight × difficulty
                  </Text>
                  <FormControl>
                    <FormLabel>Volume Weight</FormLabel>
                    <NumberInput
                      value={rerankWeights.volumeWeight}
                      min={0}
                      max={1}
                      step={0.1}
                      onChange={(_, val) => setRerankWeights({ ...rerankWeights, volumeWeight: val })}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Intent Weight</FormLabel>
                    <NumberInput
                      value={rerankWeights.intentWeight}
                      min={0}
                      max={1}
                      step={0.1}
                      onChange={(_, val) => setRerankWeights({ ...rerankWeights, intentWeight: val })}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Difficulty Weight</FormLabel>
                    <NumberInput
                      value={rerankWeights.difficultyWeight}
                      min={0}
                      max={1}
                      step={0.1}
                      onChange={(_, val) => setRerankWeights({ ...rerankWeights, difficultyWeight: val })}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button bg="brand.orange" color="white" onClick={handleRerank} isLoading={loading}>
                  Re-rank
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </VStack>
      </Container>
    </Box>
  );
}

export default function StrategyPage() {
  return (
    <Suspense fallback={
      <Box minH="calc(100vh - 64px)" bg="brand.light" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="brand.orange" />
      </Box>
    }>
      <StrategyContent />
    </Suspense>
  );
}
