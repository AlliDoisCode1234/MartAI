"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
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
} from "@chakra-ui/react";
import type { ProspectRecord } from "@/lib/services/admin";
import {
  fetchAdminProspects,
  runMartAiAnalysis,
} from "@/lib/services/admin";

export default function ProspectsPage() {
  const [prospects, setProspects] = useState<ProspectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    const loadProspects = async () => {
      try {
        const data = await fetchAdminProspects();
        setProspects(data.prospects || []);
      } catch (error) {
        toast({
          status: "error",
          title: "Failed to load prospects",
          description: error instanceof Error ? error.message : "Unknown error",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProspects();
  }, [toast]);

  const triggerAnalysis = async (prospectId: string) => {
    try {
      setRunning(prospectId);
      const data = await runMartAiAnalysis({ prospectId });
      toast({
        status: "success",
        title: "Analysis running",
        description: `Report ${data.reportId} created`,
      });
    } catch (error) {
      toast({
        status: "error",
        title: "Failed to run analysis",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setRunning(null);
    }
  };

  return (
    <Container maxW="container.xl">
      <Box mb={8}>
        <Heading size="lg">Prospects</Heading>
        <Text color="gray.600">Manage and analyze potential leads.</Text>
      </Box>

      <Card>
        <CardBody>
          {loading ? (
            <Text color="gray.500">Loading prospects…</Text>
          ) : prospects.length === 0 ? (
            <Text color="gray.500">No prospects yet.</Text>
          ) : (
            <Table>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Status</Th>
                  <Th>Priority</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {prospects.map((record) => (
                  <Tr key={record.prospect._id}>
                    <Td>
                      <Text fontWeight="semibold">
                        {record.prospect.firstName || 'New'} {record.prospect.lastName || ''}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {record.urls?.[0]?.url || record.prospect.source || 'No URL'}
                      </Text>
                    </Td>
                    <Td>
                      <Badge colorScheme={record.prospect.status === 'details_submitted' ? 'green' : 'orange'}>
                        {record.prospect.status}
                      </Badge>
                    </Td>
                    <Td>
                      <Text fontSize="sm" color="gray.600">
                        {record.detail?.topPriority || 'N/A'}
                      </Text>
                    </Td>
                    <Td>
                      <Button
                        size="sm"
                        colorScheme="purple"
                        isLoading={running === record.prospect._id.toString()}
                        onClick={() => triggerAnalysis(record.prospect._id.toString())}
                      >
                        Run AI
                      </Button>
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
