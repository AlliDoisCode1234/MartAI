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
} from '@chakra-ui/react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ChevronRightIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import type { Id } from '@/convex/_generated/dataModel';
import { IntelligenceFirehoseTable } from '@/components/admin/IntelligenceFirehoseTable';

export default function AdminProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const projectId = id as Id<'projects'>;

  const project = useQuery(api.projects.projects.getProjectById, { projectId });

  if (project === undefined) {
    return (
      <Container maxW="container.xl" py={4}>
        <Text>Loading Firehose...</Text>
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
        {project.userId && (
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} href={`/admin/users/${project.userId}`}>
              User
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{project.name}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <VStack spacing={6} align="stretch">
        <Heading size="lg">
          {project.name} <Badge colorScheme="red" ml={2}>OMNISCIENT VIEW</Badge>
        </Heading>
        <Text color="gray.600" mt="-4px">
          {project.websiteUrl}
        </Text>

        {/* Intelligence Raw Data Firehose */}
        <IntelligenceFirehoseTable projectId={projectId} />
      </VStack>
    </Container>
  );
}
