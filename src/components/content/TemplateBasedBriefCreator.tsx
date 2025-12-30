'use client';

/**
 * TemplateBasedBriefCreator
 *
 * Component Hierarchy:
 * App → Content → TemplateBasedBriefCreator (this file)
 *
 * Form for creating a new brief from a content template.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Button,
} from '@chakra-ui/react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useProject } from '@/lib/hooks';
import { trackEvent, ANALYTICS_EVENTS } from '@/src/lib/analyticsEvents';
import type { ContentTemplate } from '@/lib/constants/contentTemplates';
import type { Id } from '@/convex/_generated/dataModel';

interface Props {
  template: ContentTemplate;
}

export function TemplateBasedBriefCreator({ template }: Props) {
  const router = useRouter();
  const { projectId } = useProject(null, { autoSelect: true });
  const [title, setTitle] = useState('');
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const clusters = useQuery(
    api.seo.keywordClusters.getActiveClusters,
    projectId ? { projectId: projectId as Id<'projects'> } : 'skip'
  );

  const createBrief = useMutation(api.content.briefs.createBrief);

  const handleCreate = async () => {
    if (!projectId || !title.trim()) return;
    setCreating(true);
    try {
      const briefId = await createBrief({
        projectId: projectId as Id<'projects'>,
        clusterId: selectedClusterId ? (selectedClusterId as Id<'keywordClusters'>) : undefined,
        title: title.trim(),
        scheduledDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
        status: 'in_progress',
        h2Outline: template.structure,
      });
      trackEvent(ANALYTICS_EVENTS.BRIEF_CREATED, { briefId, templateId: template.id });
      router.push(`/content?briefId=${briefId}`);
    } catch (error) {
      console.error('Failed to create brief:', error);
      alert('Failed to create brief. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container maxW="container.lg" py={{ base: 8, md: 12 }} px={{ base: 4, md: 8 }}>
        <VStack spacing={8} align="stretch">
          <VStack spacing={2} textAlign="center">
            <Badge colorScheme={template.color} fontSize="sm" px={3} py={1}>
              {template.useCase}
            </Badge>
            <Heading size="xl">Create {template.name}</Heading>
            <Text color="gray.600">{template.description}</Text>
          </VStack>

          <Card>
            <CardBody>
              <VStack align="stretch" spacing={6}>
                <FormControl isRequired>
                  <FormLabel>Content Title</FormLabel>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., How to Improve Your SEO Strategy"
                    size="lg"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Link to Cluster (Optional)</FormLabel>
                  <Box
                    as="select"
                    w="full"
                    p={2}
                    borderWidth={1}
                    borderRadius="md"
                    value={selectedClusterId || ''}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setSelectedClusterId(e.target.value || null)
                    }
                  >
                    <option value="">No cluster - standalone content</option>
                    {clusters?.map(
                      (cluster: { _id: string; clusterName?: string; keywords?: string[] }) => (
                        <option key={cluster._id} value={cluster._id}>
                          {cluster.clusterName} ({cluster.keywords?.length || 0} keywords)
                        </option>
                      )
                    )}
                  </Box>
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    Linking to a cluster helps with SEO targeting
                  </Text>
                </FormControl>

                <Box>
                  <Text fontWeight="medium" mb={2}>
                    Template Structure (H2 Outline)
                  </Text>
                  <VStack align="stretch" spacing={2}>
                    {template.structure.map((section, i) => (
                      <HStack key={i} spacing={3} p={2} bg="gray.50" borderRadius="md">
                        <Badge colorScheme="gray">{i + 1}</Badge>
                        <Text>{section}</Text>
                      </HStack>
                    ))}
                  </VStack>
                  <Text fontSize="sm" color="gray.500" mt={2}>
                    You can edit this structure after creating the brief
                  </Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          <HStack spacing={4} justify="flex-end">
            <Button variant="ghost" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button
              bg="brand.orange"
              color="white"
              _hover={{ bg: '#E8851A' }}
              onClick={handleCreate}
              isLoading={creating}
              loadingText="Creating..."
              isDisabled={!title.trim() || !projectId}
              size="lg"
            >
              Create Brief
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}
