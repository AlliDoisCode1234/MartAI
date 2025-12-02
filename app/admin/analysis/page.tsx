"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Input,
  FormControl,
  FormLabel,
  HStack,
  useToast,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { runMartAiAnalysis } from "@/lib/services/admin";

export default function AnalysisPage() {
  const [manualUrl, setManualUrl] = useState("");
  const [running, setRunning] = useState(false);
  const toast = useToast();

  const triggerAnalysis = async () => {
    if (!manualUrl) return;
    
    try {
      setRunning(true);
      const data = await runMartAiAnalysis({ url: manualUrl });
      toast({
        status: "success",
        title: "Analysis running",
        description: `Report ${data.reportId} created`,
      });
      setManualUrl("");
    } catch (error) {
      toast({
        status: "error",
        title: "Failed to run analysis",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <Container maxW="container.xl">
      <Box mb={8}>
        <Heading size="lg">Analysis Tool</Heading>
        <Text color="gray.600">Manually trigger MartAI intelligence on any URL.</Text>
      </Box>

      <Card maxW="2xl">
        <CardBody>
          <Heading size="md" mb={4}>
            Run Analysis
          </Heading>
          <HStack as="form" gap={4} onSubmit={(e) => { e.preventDefault(); triggerAnalysis(); }}>
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
              isLoading={running}
              type="submit"
              alignSelf="flex-end"
            >
              Run Analysis
            </Button>
          </HStack>
        </CardBody>
      </Card>
    </Container>
  );
}
