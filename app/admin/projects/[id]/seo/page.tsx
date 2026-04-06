'use client';

import { use } from 'react';
import {
  Container,
  VStack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  Text,
  Badge,
  Box,
} from '@chakra-ui/react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ChevronRightIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import type { Id } from '@/convex/_generated/dataModel';
import { KeywordClusters } from '@/src/components/keywords';

export default function AdminProjectSeoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const projectId = id as Id<'projects'>;

  const project = useQuery(api.projects.projects.getProjectById, { projectId });

  if (project === undefined) {
    return (
      <Container maxW="container.xl" py={4}>
        <Text>Loading SEO Data...</Text>
      </Container>
    );
  }

  if (project === null) {
    return (
      <Container maxW="container.xl" py={4}>
        <Text>Project not found.</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={4}>
      {/* Breadcrumb */}
      <Breadcrumb separator={<ChevronRightIcon color="gray.500" />} mb={6}>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} href="/admin">
            Admin
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} href={`/admin/projects/${projectId}`}>
            {project.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Keyword Clusters</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <VStack spacing={6} align="stretch">
        <Heading size="lg" display="flex" alignItems="center">
          {project.name} <Badge colorScheme="purple" ml={3}>SEO PARITY</Badge>
        </Heading>
        <Text color="gray.600" mt="-4px">
          Omniscient View: Live DataForSEO Keyword Clusters
        </Text>

        <Box bg="#0f0920" p={6} borderRadius="xl" border="1px solid" borderColor="gray.800">
           {/* Direct component injection works with existing Admin roles via the RBAC patch! */}
           <KeywordClusters projectId={projectId} />
        </Box>
      </VStack>
    </Container>
  );
}
