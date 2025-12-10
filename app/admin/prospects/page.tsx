'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
  Card,
  CardBody,
  Button,
  HStack,
  Avatar,
  Tooltip,
  IconButton,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { useQuery, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { format, formatDistanceToNow } from 'date-fns';
import { ExternalLinkIcon, ViewIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import type { Id } from '@/convex/_generated/dataModel';

type ProspectData = {
  _id: string;
  companyName?: string;
  email?: string;
  websiteUrl?: string;
  status?: string;
  source?: string;
  createdAt?: number;
};

export default function AdminProspectsPage() {
  const prospects = useQuery(api.prospects.prospects.listProspects, {});
  const runAnalysis = useAction(api.ai.analysis.runPipeline);
  const toast = useToast();
  const [runningId, setRunningId] = useState<string | null>(null);

  const handleRunAnalysis = async (prospectId: Id<'prospects'>) => {
    try {
      setRunningId(prospectId);
      const result = await runAnalysis({ prospectId });
      toast({
        status: 'success',
        title: 'Analysis started',
        description: `Report created`,
      });
    } catch (error) {
      toast({
        status: 'error',
        title: 'Analysis failed',
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setRunningId(null);
    }
  };

  // Calculate stats
  const totalProspects = prospects?.length || 0;
  const newProspects = prospects?.filter((p: ProspectData) => p.status === 'new').length || 0;
  const analyzedProspects =
    prospects?.filter((p: ProspectData) =>
      ['analyzed', 'details_submitted'].includes(p.status || '')
    ).length || 0;

  return (
    <Container maxW="container.xl">
      <Box mb={8}>
        <Heading size="lg">Prospects</Heading>
        <Text color="gray.600">Manage and analyze potential leads.</Text>
      </Box>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} gap={4} mb={6}>
        <Card>
          <CardBody py={3}>
            <Stat size="sm">
              <StatLabel>Total</StatLabel>
              <StatNumber>{totalProspects}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody py={3}>
            <Stat size="sm">
              <StatLabel>New</StatLabel>
              <StatNumber>{newProspects}</StatNumber>
              <StatHelpText>Awaiting analysis</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody py={3}>
            <Stat size="sm">
              <StatLabel>Analyzed</StatLabel>
              <StatNumber>{analyzedProspects}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody py={3}>
            <Stat size="sm">
              <StatLabel>Conversion Rate</StatLabel>
              <StatNumber>
                {totalProspects > 0 ? Math.round((analyzedProspects / totalProspects) * 100) : 0}%
              </StatNumber>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Card>
        <CardBody>
          {!prospects ? (
            <Text color="gray.500">Loading prospects...</Text>
          ) : prospects.length === 0 ? (
            <Text color="gray.500">No prospects yet.</Text>
          ) : (
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Prospect</Th>
                  <Th>Website</Th>
                  <Th>Status</Th>
                  <Th>Source</Th>
                  <Th>Created</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {prospects.map((prospect: ProspectData) => (
                  <Tr key={prospect._id}>
                    <Td>
                      <HStack>
                        <Avatar
                          size="sm"
                          name={prospect.companyName || prospect.email}
                          bg="brand.orange"
                          color="white"
                        />
                        <Box>
                          <Text fontWeight="semibold" fontSize="sm">
                            {prospect.companyName || 'Unknown Company'}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {prospect.email}
                          </Text>
                        </Box>
                      </HStack>
                    </Td>
                    <Td>
                      {prospect.websiteUrl ? (
                        <Tooltip label={prospect.websiteUrl} hasArrow>
                          <ChakraLink
                            href={prospect.websiteUrl}
                            isExternal
                            color="blue.500"
                            fontSize="sm"
                          >
                            {new URL(prospect.websiteUrl).hostname}
                            <ExternalLinkIcon mx={1} />
                          </ChakraLink>
                        </Tooltip>
                      ) : (
                        <Text fontSize="sm" color="gray.400">
                          No URL
                        </Text>
                      )}
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={
                          prospect.status === 'details_submitted'
                            ? 'green'
                            : prospect.status === 'analyzed'
                              ? 'blue'
                              : prospect.status === 'new'
                                ? 'orange'
                                : 'gray'
                        }
                      >
                        {prospect.status || 'new'}
                      </Badge>
                    </Td>
                    <Td>
                      <Text fontSize="sm" color="gray.600">
                        {prospect.source || 'Direct'}
                      </Text>
                    </Td>
                    <Td>
                      <Tooltip
                        label={
                          prospect.createdAt
                            ? format(prospect.createdAt, 'MMM d, yyyy h:mm a')
                            : 'N/A'
                        }
                        hasArrow
                      >
                        <Text fontSize="sm" color="gray.600">
                          {prospect.createdAt
                            ? formatDistanceToNow(prospect.createdAt, { addSuffix: true })
                            : 'N/A'}
                        </Text>
                      </Tooltip>
                    </Td>
                    <Td>
                      <HStack spacing={1}>
                        <Tooltip label="View Details" hasArrow>
                          <IconButton
                            aria-label="View prospect"
                            icon={<ViewIcon />}
                            size="xs"
                            variant="ghost"
                          />
                        </Tooltip>
                        <Button
                          size="xs"
                          colorScheme="purple"
                          isLoading={runningId === prospect._id}
                          onClick={() => handleRunAnalysis(prospect._id as Id<'prospects'>)}
                          isDisabled={!prospect.websiteUrl}
                        >
                          Run AI
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </CardBody>
      </Card>
    </Container>
  );
}
