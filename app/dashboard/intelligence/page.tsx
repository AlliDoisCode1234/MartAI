"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Badge,
  Button,
  Card,
  CardBody,
  Container,
  Divider,
  Grid,
  Heading,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Text,
  VStack,
  Stack,
} from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/lib/useAuth";
import { LoadingState } from "@/src/components/shared";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export default function IntelligencePage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectsLoading, setProjectsLoading] = useState(true);

  const projects = useQuery(
    api.projects.projects.getProjectsByUser,
    user?._id ? { userId: user._id as unknown as Id<"users"> } : "skip",
  );
  const projectList = (projects ?? []) as Array<{ _id: Id<"projects">; name?: string }>;

  const latestReport = useQuery(
    api.ai.reports.getLatestAiReport,
    projectId ? { projectId: projectId as Id<"projects"> } : "skip",
  );

  const recentReports = useQuery(
    api.ai.reports.listAiReports,
    projectId ? { projectId: projectId as Id<"projects">, limit: 10 } : "skip",
  );
  type AiReport = {
    _id: string;
    status?: string;
    summary?: string;
    metrics?: {
      coverageScore?: number;
      backlinksProxy?: number;
      organicKeywords?: number;
      trafficEstimate?: number;
    };
    confidence?: { score?: number };
    dataSources?: string[];
    createdAt: number;
  };
  const reportList = (recentReports ?? []) as AiReport[];
  const latestReportData = (latestReport ?? null) as AiReport | null;

  useEffect(() => {
    if (authLoading) {
      return;
    }
    if (!isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      return;
    }
    if (projects === undefined) {
      setProjectsLoading(true);
      return;
    }

    setProjectsLoading(false);
    if (!projectList || projectList.length === 0) {
      setProjectId(null);
      return;
    }

    const storedId =
      typeof window !== "undefined" ? window.localStorage.getItem("currentProjectId") : null;

    const matched = storedId
      ? projectList.find((proj) => (proj._id as unknown as string) === storedId)
      : null;

    const nextProject = matched ?? projectList[0];
    const nextId = (nextProject._id as unknown as string) ?? nextProject._id.toString();

    if (nextId !== projectId) {
      setProjectId(nextId);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("currentProjectId", nextId);
      }
    }
  }, [projects, authLoading, isAuthenticated, projectId]);

  const project = useMemo(() => {
    if (!projectList || projectList.length === 0) return null;
    if (!projectId) return projectList[0];
    return projectList.find((p) => (p._id as unknown as string) === projectId) ?? projectList[0];
  }, [projectList, projectId]);

  const loadingState =
    authLoading ||
    projectsLoading ||
    (projectId !== null && latestReport === undefined) ||
    (projectId !== null && recentReports === undefined);

  if (loadingState) {
    return <LoadingState message="Loading AI intelligence..." fullPage />;
  }

  if (!project) {
    return (
      <Container maxW="container.xl" py={12}>
        <VStack spacing={6}>
          <Heading size="lg">No project found</Heading>
          <Text>Create a project to see MartAI intelligence insights.</Text>
          <Button
            bg="brand.orange"
            color="white"
            onClick={() => router.push("/onboarding")}
          >
            Create Project
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <VStack align="stretch" spacing={8}>
        <Box>
          <Heading size="xl">Intelligence</Heading>
          <Text color="gray.600">
            Latest MartAI crawl + keyword intelligence for {project.name}.
          </Text>
        </Box>

        <Card variant="outline">
          <CardBody>
            <HStack justify="space-between" mb={4} align="flex-start">
              <Box>
                <Heading size="md">Latest Report</Heading>
                <Text color="gray.600">
                  Generated {latestReportData ? formatDistanceToNow(latestReportData.createdAt, { addSuffix: true }) : "—"}
                </Text>
              </Box>
              <Badge colorScheme={latestReportData?.status === "completed" ? "green" : "orange"}>
                {latestReportData?.status ?? "pending"}
              </Badge>
            </HStack>

            {latestReportData ? (
              <Stack spacing={4}>
                {latestReportData.summary && <Text>{latestReportData.summary}</Text>}
                <Divider />
                <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={4}>
                  <Stat>
                    <StatLabel>Coverage Score</StatLabel>
                    <StatNumber>{latestReportData.metrics?.coverageScore ?? "—"}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Backlinks Proxy</StatLabel>
                    <StatNumber>{latestReportData.metrics?.backlinksProxy ?? "—"}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Organic Keywords</StatLabel>
                    <StatNumber>{latestReportData.metrics?.organicKeywords ?? "—"}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Traffic Estimate</StatLabel>
                    <StatNumber>
                      {latestReportData.metrics?.trafficEstimate
                        ? latestReportData.metrics.trafficEstimate.toLocaleString()
                        : "—"}
                    </StatNumber>
                  </Stat>
                </Grid>
                <Divider />
                <HStack justify="space-between">
                  <Box>
                    <Text fontSize="sm" color="gray.600">
                      Confidence
                    </Text>
                    <Heading size="lg">{latestReportData.confidence?.score ?? "—"}%</Heading>
                  </Box>
                  {latestReportData.dataSources?.length ? (
                    <Text fontSize="sm" color="gray.500">
                      Sources: {latestReportData.dataSources.join(", ")}
                    </Text>
                  ) : null}
                </HStack>
              </Stack>
            ) : (
              <Stack spacing={3}>
                <Text color="gray.600">
                  No intelligence report yet. Run the analysis flow from the Admin portal to populate insights here.
                </Text>
                <Button
                  alignSelf="flex-start"
                  variant="outline"
                  onClick={() => router.push("/admin")}
                >
                  Open Admin Portal
                </Button>
              </Stack>
            )}
          </CardBody>
        </Card>

        <Card variant="outline">
          <CardBody>
            <Heading size="md" mb={4}>
              Recent Reports
            </Heading>
            {reportList && reportList.length > 0 ? (
              <VStack align="stretch" spacing={4}>
                {reportList.map((report) => (
                  <Box key={report._id} border="1px solid" borderColor="gray.100" borderRadius="md" p={4}>
                    <HStack justify="space-between">
                      <Text fontWeight="semibold">
                        Report {report._id.slice(-6)}
                      </Text>
                      <Badge colorScheme={report.status === "completed" ? "green" : "orange"}>
                        {report.status}
                      </Badge>
                    </HStack>
                    <Text fontSize="sm" color="gray.500">
                      {formatDistanceToNow(report.createdAt, { addSuffix: true })}
                    </Text>
                    {report.summary && (
                      <Text mt={2} color="gray.700">
                        {report.summary}
                      </Text>
                    )}
                  </Box>
                ))}
              </VStack>
            ) : (
              <Text color="gray.600">No historical reports yet.</Text>
            )}
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
}

