'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function AdminDashboardPage() {
  const metrics = useQuery(api.analytics.aggregations.getDashboardMetrics);
  return (
    <Container maxW="container.xl">
      <Box mb={8}>
        <Heading size="lg">Admin Dashboard</Heading>
        <Text color="gray.600">Welcome to the Phoo CRM & Intelligence Portal.</Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Prospects</StatLabel>
              <StatNumber>--</StatNumber>
              <StatHelpText>All time</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>AI Generations</StatLabel>
              <StatNumber>{metrics?.totalGenerations ?? 0}</StatNumber>
              <StatHelpText>Total requests tracked</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>System Status</StatLabel>
              <StatNumber color="green.500">Healthy</StatNumber>
              <StatHelpText>All systems operational</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Card>
        <CardBody>
          <Heading size="md" mb={4}>
            Recent Activity
          </Heading>
          <Text color="gray.500">No recent activity to display.</Text>
        </CardBody>
      </Card>
    </Container>
  );
}
