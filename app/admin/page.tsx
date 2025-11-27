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
  Input,
  FormControl,
  FormLabel,
  VStack,
  useToast,
  HStack,
} from "@chakra-ui/react";
import type { ProspectRecord } from "@/lib/services/admin";
import {
  fetchAdminProspects,
  runMartAiAnalysis,
} from "@/lib/services/admin";

export default function AdminDashboardPage() {
  const [prospects, setProspects] = useState<ProspectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState("");
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

  const triggerAnalysis = async (payload: Record<string, string>) => {
    try {
      setRunning(payload.prospectId || payload.url || "manual");
      const data = await runMartAiAnalysis(payload);
      toast({
        status: "success",
        title: "Analysis running",
        description: `Report ${data.reportId} created`,
      });
      if (payload.url && !payload.prospectId && !payload.projectId) {
        setManualUrl("");
      }
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
    <Container maxW="6xl" py={10}>
      <VStack align="stretch" spacing={10}>
        <Box>
          <Heading size="lg">Admin Portal</Heading>
          <Text color="gray.600">Manage prospects and trigger MartAI intelligence.</Text>
        </Box>

        <Box bg="white" p={6} borderRadius="lg" shadow="md">
          <Heading size="md" mb={4}>
            Run Analysis for a URL
          </Heading>
          <HStack as="form" gap={4} onSubmit={(e) => e.preventDefault()}>
            <FormControl>
              <FormLabel>Website URL</FormLabel>
              <Input
                placeholder="https://example.com"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
              />
            </FormControl>
            <Button
              colorScheme="purple"
              isLoading={running === manualUrl}
              onClick={() => manualUrl && triggerAnalysis({ url: manualUrl })}
            >
              Run Analysis
            </Button>
          </HStack>
        </Box>

        <Box bg="white" p={6} borderRadius="lg" shadow="md">
          <Heading size="md" mb={4}>
            Prospect Intake
          </Heading>
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
                        onClick={() =>
                          triggerAnalysis({ prospectId: record.prospect._id.toString() })
                        }
                      >
                        Run AI
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Box>
      </VStack>
    </Container>
  );
}

