"use client";

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
} from "@chakra-ui/react";

export default function AdminDashboardPage() {
  return (
    <Container maxW="container.xl">
      <Box mb={8}>
        <Heading size="lg">Admin Dashboard</Heading>
        <Text color="gray.600">Welcome to the MartAI CRM & Intelligence Portal.</Text>
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
              <StatLabel>Reports Generated</StatLabel>
              <StatNumber>--</StatNumber>
              <StatHelpText>This month</StatHelpText>
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
          <Heading size="md" mb={4}>Recent Activity</Heading>
          <Text color="gray.500">No recent activity to display.</Text>
        </CardBody>
      </Card>
    </Container>
  );
}
