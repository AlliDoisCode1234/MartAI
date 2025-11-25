'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Container, VStack, Heading, Text, Box, Button, HStack, Grid, GridItem, Card, CardBody, Badge, Alert, AlertIcon, Spinner, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter, useDisclosure, FormControl, FormLabel, Input, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Select, Checkbox, Table, Thead, Tbody, Tr, Th, Td, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';
import { useAuth } from '@/lib/useAuth';
import type { KeywordCluster, Brief, QuarterlyPlan, PlanProps, ClusterProps, ProjectId } from '@/types';
import { DraggableBriefList } from '@/src/components/DraggableBriefList';
import { assertProjectId } from '@/lib/typeGuards';

function StrategyContent() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clusters, setClusters] = useState<KeywordCluster[]>([]);
  const [plan, setPlan] = useState<QuarterlyPlan | null>(null);
  
  // Pass whole objects to maintain type inference
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectsLoading, setProjectsLoading] = useState(true);
  
  // Modals
  const { isOpen: isClusterModalOpen, onOpen: onClusterModalOpen, onClose: onClusterModalClose } = useDisclosure();
  const { isOpen: isPlanModalOpen, onOpen: onPlanModalOpen, onClose: onPlanModalClose } = useDisclosure();
  
  const [planFormData, setPlanFormData] = useState({
    contentVelocity: 2,
    startDate: new Date().toISOString().split('T')[0],
    trafficGoal: '',
    leadsGoal: '',
  });

  useEffect(() => {
    // Wait for auth to finish loading before checking
    if (authLoading) {
      return;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.replace('/auth/login');
      return;
    }

    const loadUserProjects = async () => {
      const storedProject = localStorage.getItem('currentProjectId');
      
      // If we have a stored project, try to use it
      if (storedProject) {
        try {
          const validatedProjectId = assertProjectId(storedProject);
          setProjectId(storedProject);
          setProjectsLoading(false);
          loadClusters(storedProject);
          loadPlan(validatedProjectId);
          return;
        } catch (error) {
          console.error('Invalid stored project ID:', error);
          localStorage.removeItem('currentProjectId');
        }
      }

      // No valid project in localStorage, fetch user's projects
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          router.replace('/auth/login');
          return;
        }

        console.log('Fetching projects for user...');
        const response = await fetch('/api/projects', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          const projects = data.projects || [];
          console.log(`Found ${projects.length} project(s) for user`, projects);

          if (projects.length > 0) {
            // Use the first project
            const firstProject = projects[0];
            const projectIdStr = typeof firstProject._id === 'string' 
              ? firstProject._id 
              : firstProject._id.toString();
            console.log('Setting project ID:', projectIdStr);
            localStorage.setItem('currentProjectId', projectIdStr);
            setProjectId(projectIdStr);
            setProjectsLoading(false);
            loadClusters(projectIdStr);
            try {
              const validatedProjectId = assertProjectId(projectIdStr);
              loadPlan(validatedProjectId);
            } catch (error) {
              console.error('Invalid project ID:', error);
            }
          } else {
            // No projects - clear loading and show empty state (don't redirect)
            console.log('No projects found for user - showing empty state');
            setProjectsLoading(false);
          }
        } else {
          // Failed to fetch projects - clear loading and show error state
          const errorData = await response.json().catch(() => ({}));
          console.error('Failed to fetch projects:', response.status, errorData);
          setProjectsLoading(false);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
        setProjectsLoading(false);
        // Don't redirect - show error state instead
      }
    };

    loadUserProjects();
  }, [router, isAuthenticated, authLoading]);

  // Don't try to use projectId before it's loaded
  if (projectsLoading && !projectId) {
    return (
      <Box minH="calc(100vh - 64px)" bg="brand.light" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.orange" />
          <Text color="gray.600">Loading your projects...</Text>
        </VStack>
      </Box>
    );
  }

  if (!projectId) {
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
  }

  const loadClusters = async (pid: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/clusters?projectId=${pid}`, {
        headers: { 'Authorization': `Bearer ${token}` },
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

  const loadPlan = async (pid: ProjectId) => {
    try {
      const token = localStorage.getItem("auth_token");
      
      // Fetch the plan for the project
      const response = await fetch(`/api/plans?projectId=${pid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.ok) {
        const data = await response.json();
        setPlan(data.plan);
      } else {
        console.error("Error loading plan:", response.statusText);
      }
    } catch (error) {
      console.error("Error loading plan:", error);
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
        body: JSON.stringify({ projectId, keywords: [], importFromGSC: true }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setClusters(data.clusters || []);
        alert(`Generated ${data.count} keyword clusters!`);
      } else {
        alert(data.error || 'Failed to generate clusters');
      }
    } catch (error) {
      alert('Failed to generate clusters');
    } finally {
      setGenerating(false);
    }
  };

  const handleGeneratePlan = async () => {
    if (!projectId) {
      alert('Please complete onboarding first');
      return;
    }

    if (clusters.length === 0) {
      alert('Please generate keyword clusters first');
      return;
    }

    setGenerating(true);
    try {
      const token = localStorage.getItem('auth_token');
      const startDate = new Date(planFormData.startDate).getTime();
      
      const response = await fetch('/api/plans/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId,
          contentVelocity: planFormData.contentVelocity,
          startDate,
          goals: {
            traffic: planFormData.trafficGoal ? parseInt(planFormData.trafficGoal) : undefined,
            leads: planFormData.leadsGoal ? parseInt(planFormData.leadsGoal) : undefined,
          },
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setPlan(data.plan);
        if (projectId) {
          const validatedProjectId = assertProjectId(projectId);
          await loadPlan(validatedProjectId);
        }
        onPlanModalClose();
        alert(`Generated 12-week plan with ${data.count} content briefs!`);
      } else {
        alert(data.error || 'Failed to generate plan');
      }
    } catch (error) {
      alert('Failed to generate plan');
    } finally {
      setGenerating(false);
    }
  };

  const handleRescheduleBrief = async (briefId: string, newDate: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/briefs/reschedule', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ briefId, newDate }),
      });

      if (response.ok && projectId) {
        const validatedProjectId = assertProjectId(projectId);
        await loadPlan(validatedProjectId);
      }
    } catch (error) {
      console.error('Error rescheduling:', error);
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

  if (!isAuthenticated) {
    return (
      <Box minH="calc(100vh - 64px)" bg="brand.light" display="flex" alignItems="center" justifyContent="center">
        <Alert status="warning" maxW="md">
          <AlertIcon />
          Please sign in to view strategy
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
              SEO Strategy
            </Heading>
            <HStack>
              <Button onClick={onClusterModalOpen} variant="outline">
                Generate Clusters
              </Button>
              <Button
                bg="brand.orange"
                color="white"
                _hover={{ bg: '#E8851A' }}
                onClick={onPlanModalOpen}
                isDisabled={clusters.length === 0}
              >
                Generate Quarterly Plan
              </Button>
            </HStack>
          </HStack>

          {/* Plan Summary */}
          {plan && (
            <Card>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Heading size="md">Quarterly Plan Summary</Heading>
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                    <Stat>
                      <StatLabel>Content Velocity</StatLabel>
                      <StatNumber>{plan.contentVelocity} posts/week</StatNumber>
                      <StatHelpText>12 weeks = {plan.contentVelocity * 12} total posts</StatHelpText>
                    </Stat>
                    {plan.goals.traffic && (
                      <Stat>
                        <StatLabel>Traffic Goal</StatLabel>
                        <StatNumber>{plan.goals.traffic.toLocaleString()}</StatNumber>
                        <StatHelpText>Estimated visitors</StatHelpText>
                      </Stat>
                    )}
                    {plan.goals.leads && (
                      <Stat>
                        <StatLabel>Leads Goal</StatLabel>
                        <StatNumber>{plan.goals.leads.toLocaleString()}</StatNumber>
                        <StatHelpText>Estimated conversions</StatHelpText>
                      </Stat>
                    )}
                  </Grid>
                  {plan.assumptions && (
                    <Text fontSize="sm" color="gray.600" fontStyle="italic">
                      {plan.assumptions}
                    </Text>
                  )}
                </VStack>
              </CardBody>
            </Card>
          )}

          {/* Calendar View */}
          {plan && plan.briefs && plan.briefs.length > 0 && (
            <Card>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Heading size="md">12-Week Content Calendar</Heading>
                  <Box overflowX="auto">
                    <Table size="sm">
                      <Thead>
                        <Tr>
                          <Th>Week</Th>
                          <Th>Date</Th>
                          <Th>Brief Title</Th>
                          <Th>Status</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {plan.briefs.map((brief, index) => (
                          <Tr key={brief._id || index}>
                            <Td>{brief.week || Math.floor(index / plan.contentVelocity) + 1}</Td>
                            <Td>{new Date(brief.scheduledDate).toLocaleDateString()}</Td>
                            <Td>{brief.title}</Td>
                            <Td>
                              <Badge colorScheme={brief.status === 'published' ? 'green' : 'gray'}>
                                {brief.status}
                              </Badge>
                            </Td>
                            <Td>
                              <Button 
                                size="xs" 
                                variant="outline"
                                onClick={() => window.location.href = `/content?briefId=${brief._id}`}
                              >
                                Edit Brief
                              </Button>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          )}

          {/* Clusters Grid */}
          {clusters.length > 0 && (
            <>
              <Heading size="lg">Keyword Clusters</Heading>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
                {clusters.slice(0, 6).map((cluster, index) => (
                  <GridItem key={cluster._id || index}>
                    <Card>
                      <CardBody>
                        <VStack align="stretch" spacing={2}>
                          <HStack justify="space-between">
                            <Heading size="sm" noOfLines={2}>{cluster.clusterName}</Heading>
                            <Badge colorScheme={getIntentColor(cluster.intent)}>{cluster.intent}</Badge>
                          </HStack>
                          <Text fontSize="xs" color="gray.500">
                            Impact: {cluster.impactScore.toFixed(2)} | {cluster.keywords.length} keywords
                          </Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  </GridItem>
                ))}
              </Grid>
            </>
          )}

          {/* Generate Plan Modal */}
          <Modal isOpen={isPlanModalOpen} onClose={onPlanModalClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Generate Quarterly Plan</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing={4} align="stretch">
                  <FormControl isRequired>
                    <FormLabel>Content Velocity (posts per week)</FormLabel>
                    <NumberInput
                      value={planFormData.contentVelocity}
                      min={1}
                      max={7}
                      onChange={(_, val) => setPlanFormData({ ...planFormData, contentVelocity: val })}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Start Date</FormLabel>
                    <Input
                      type="date"
                      value={planFormData.startDate}
                      onChange={(e) => setPlanFormData({ ...planFormData, startDate: e.target.value })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Traffic Goal (optional)</FormLabel>
                    <Input
                      type="number"
                      placeholder="e.g., 10000"
                      value={planFormData.trafficGoal}
                      onChange={(e) => setPlanFormData({ ...planFormData, trafficGoal: e.target.value })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Leads Goal (optional)</FormLabel>
                    <Input
                      type="number"
                      placeholder="e.g., 100"
                      value={planFormData.leadsGoal}
                      onChange={(e) => setPlanFormData({ ...planFormData, leadsGoal: e.target.value })}
                    />
                  </FormControl>
                  <Alert status="info" fontSize="sm">
                    <AlertIcon />
                    This will generate a 12-week calendar with {planFormData.contentVelocity * 12} content briefs based on your keyword clusters.
                  </Alert>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onPlanModalClose}>
                  Cancel
                </Button>
                <Button bg="brand.orange" color="white" onClick={handleGeneratePlan} isLoading={generating}>
                  Generate Plan
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Generate Clusters Modal */}
          <Modal isOpen={isClusterModalOpen} onClose={onClusterModalClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Generate Keyword Clusters</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>Generate AI-powered keyword clusters from your keywords and GSC data.</Text>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onClusterModalClose}>
                  Cancel
                </Button>
                <Button bg="brand.orange" color="white" onClick={() => { handleGenerateClusters(); onClusterModalClose(); }} isLoading={generating}>
                  Generate
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
