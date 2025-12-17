'use client';

/**
 * KeywordPlanTable Component
 *
 * Component Hierarchy:
 * App → Calendar → KeywordPlanTable (this file)
 *
 * Spreadsheet-style table view for content calendar items.
 * Shows keyword, volume, difficulty, status, content title, and competitor.
 * Matches helps2.com content calendar format.
 */

import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  HStack,
  Button,
  Icon,
  Heading,
} from '@chakra-ui/react';
import { FiDownload, FiExternalLink } from 'react-icons/fi';

type CalendarItem = {
  _id: string;
  title: string;
  status: string;
  contentType: string;
  primaryKeyword?: string;
  publishDate?: number;
};

type KeywordMetric = {
  keyword: string;
  searchVolume?: number;
  difficulty?: number;
};

type Props = {
  items: CalendarItem[];
  keywords: KeywordMetric[];
};

function getDifficultyColor(difficulty: number): string {
  if (difficulty <= 30) return 'green';
  if (difficulty <= 60) return 'yellow';
  return 'red';
}

function formatVolume(volume: number): string {
  if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
  return volume.toString();
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function KeywordPlanTable({ items, keywords }: Props) {
  // Build keyword lookup map
  const keywordMap = new Map<string, KeywordMetric>();
  keywords.forEach((k) => keywordMap.set(k.keyword.toLowerCase(), k));

  // Enrich items with keyword metrics
  const enrichedItems = items.map((item) => {
    const kwMetric = item.primaryKeyword
      ? keywordMap.get(item.primaryKeyword.toLowerCase())
      : undefined;
    return {
      ...item,
      volume: kwMetric?.searchVolume,
      difficulty: kwMetric?.difficulty,
    };
  });

  // Sort by volume descending
  const sortedItems = [...enrichedItems].sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0));

  const handleExport = () => {
    const headers = ['Keyword', 'Volume', 'Difficulty', 'Status', 'Content Title', 'Scheduled'];
    const rows = sortedItems.map((item) => [
      item.primaryKeyword ?? '',
      item.volume?.toString() ?? '',
      item.difficulty?.toString() ?? '',
      item.status,
      item.title,
      item.publishDate ? formatDate(item.publishDate) : '',
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content-calendar.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box bg="white" borderRadius="lg" boxShadow="sm" overflow="hidden">
      <HStack justify="space-between" p={4} borderBottom="1px solid" borderColor="gray.200">
        <Heading size="md">Keyword Content Plan</Heading>
        <Button size="sm" leftIcon={<FiDownload />} onClick={handleExport}>
          Export CSV
        </Button>
      </HStack>

      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead bg="gray.50">
            <Tr>
              <Th>Keyword</Th>
              <Th isNumeric>Volume</Th>
              <Th isNumeric>KD</Th>
              <Th>Status</Th>
              <Th>Content Title</Th>
              <Th>Scheduled</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedItems.map((item) => (
              <Tr key={item._id} _hover={{ bg: 'gray.50' }}>
                <Td>
                  {item.primaryKeyword ? (
                    <Text fontWeight="medium" color="purple.600">
                      {item.primaryKeyword}
                    </Text>
                  ) : (
                    <Text color="gray.400" fontStyle="italic">
                      No keyword
                    </Text>
                  )}
                </Td>
                <Td isNumeric>
                  {item.volume ? (
                    <Badge colorScheme="purple">{formatVolume(item.volume)}</Badge>
                  ) : (
                    <Text color="gray.400">—</Text>
                  )}
                </Td>
                <Td isNumeric>
                  {item.difficulty !== undefined ? (
                    <Badge colorScheme={getDifficultyColor(item.difficulty)}>
                      {item.difficulty}
                    </Badge>
                  ) : (
                    <Text color="gray.400">—</Text>
                  )}
                </Td>
                <Td>
                  <Badge
                    colorScheme={
                      item.status === 'published'
                        ? 'green'
                        : item.status === 'draft'
                          ? 'yellow'
                          : 'gray'
                    }
                  >
                    {item.status}
                  </Badge>
                </Td>
                <Td>
                  <Text noOfLines={1} maxW="300px">
                    {item.title}
                  </Text>
                </Td>
                <Td>
                  {item.publishDate ? (
                    <Text fontSize="sm" color="gray.600">
                      {formatDate(item.publishDate)}
                    </Text>
                  ) : (
                    <Text color="gray.400">—</Text>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {sortedItems.length === 0 && (
        <Box p={8} textAlign="center" color="gray.500">
          <Text>No content items scheduled. Add content to see your keyword plan.</Text>
        </Box>
      )}
    </Box>
  );
}
