"use client";

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
  Card,
  CardBody,
} from "@chakra-ui/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function AdminKeywordsPage() {
  const keywords = useQuery(api.admin.getAllKeywords, { limit: 100 });

  return (
    <Container maxW="container.xl">
      <Box mb={8}>
        <Heading size="lg">Keywords</Heading>
        <Text color="gray.600">Master list of keywords across all projects.</Text>
      </Box>

      <Card>
        <CardBody>
          {!keywords ? (
            <Text color="gray.500">Loading keywords…</Text>
          ) : keywords.length === 0 ? (
            <Text color="gray.500">No keywords found.</Text>
          ) : (
            <Table>
              <Thead>
                <Tr>
                  <Th>Keyword</Th>
                  <Th>Volume</Th>
                  <Th>Difficulty</Th>
                  <Th>Intent</Th>
                  <Th>Status</Th>
                  <Th>Client</Th>
                </Tr>
              </Thead>
              <Tbody>
                {keywords.map((kw: any) => (
                  <Tr key={kw._id}>
                    <Td fontWeight="medium">{kw.keyword}</Td>
                    <Td>{kw.searchVolume?.toLocaleString() || "—"}</Td>
                    <Td>
                      {kw.difficulty !== undefined ? (
                        <Badge
                          colorScheme={
                            kw.difficulty > 70 ? "red" :
                            kw.difficulty > 40 ? "orange" : "green"
                          }
                        >
                          {kw.difficulty}
                        </Badge>
                      ) : "—"}
                    </Td>
                    <Td>
                      {kw.intent && (
                        <Badge variant="outline" colorScheme="blue">
                          {kw.intent}
                        </Badge>
                      )}
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={
                          kw.status === "implemented" ? "green" :
                          kw.status === "approved" ? "blue" : "gray"
                        }
                      >
                        {kw.status}
                      </Badge>
                    </Td>
                    <Td fontSize="sm" color="gray.600">
                      {kw.clientName}
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
