'use client';

/**
 * KeywordPlanTable Component
 *
 * Component Hierarchy:
 * App → Calendar → KeywordPlanTable (this file)
 *
 * Spreadsheet-style table view matching helps2 content calendar format.
 * Columns: # | Page Type | Exact Title To Use | Status | Primary Keyword(s) | Notes
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
  Heading,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FiDownload } from 'react-icons/fi';
import { getStatusColorScheme } from '@/lib/constants/statusColors';

type TargetKeyword = {
  keyword: string;
  volume?: number;
};

type CalendarItem = {
  _id: string;
  title: string;
  status: string;
  pageType?: string;
  targetKeywords?: TargetKeyword[];
  primaryKeyword?: string;
  notes?: string;
};

type Props = {
  items: CalendarItem[];
};

const PAGE_TYPE_COLORS: Record<string, string> = {
  homepage: 'blue',
  service: 'purple',
  blog: 'green',
  about: 'orange',
  product: 'teal',
};

function formatKeywordsWithVolume(keywords?: TargetKeyword[], primaryKeyword?: string): string {
  if (keywords && keywords.length > 0) {
    return keywords.map((k) => (k.volume ? `${k.keyword} - ${k.volume}` : k.keyword)).join(', ');
  }
  return primaryKeyword || '';
}

export function KeywordPlanTable({ items }: Props) {
  const handleExport = () => {
    const headers = [
      '#',
      'Page Type',
      'Exact Title To Use',
      'Status',
      'Primary Keyword(s)',
      'Notes',
    ];
    const rows = items.map((item, index) => [
      (index + 1).toString(),
      item.pageType || 'blog',
      item.title,
      item.status,
      formatKeywordsWithVolume(item.targetKeywords, item.primaryKeyword),
      item.notes || '',
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seo-content-calendar.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box bg="white" borderRadius="lg" boxShadow="sm" overflow="hidden">
      <HStack justify="space-between" p={4} borderBottom="1px solid" borderColor="gray.200">
        <Heading size="md">SEO Content Calendar</Heading>
        <Button size="sm" leftIcon={<FiDownload />} onClick={handleExport} colorScheme="purple">
          Export CSV
        </Button>
      </HStack>

      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead bg="gray.50">
            <Tr>
              <Th w="50px">#</Th>
              <Th>Page Type</Th>
              <Th>Exact Title To Use</Th>
              <Th>Status</Th>
              <Th>Primary Keyword(s)</Th>
              <Th>Notes</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((item, index) => (
              <Tr key={item._id} _hover={{ bg: 'gray.50' }}>
                <Td fontWeight="bold" color="gray.500">
                  {index + 1}
                </Td>
                <Td>
                  <Badge colorScheme={PAGE_TYPE_COLORS[item.pageType || 'blog'] || 'gray'}>
                    {item.pageType || 'Blog'}
                  </Badge>
                </Td>
                <Td>
                  <Text fontWeight="medium" maxW="400px">
                    {item.title}
                  </Text>
                </Td>
                <Td>
                  <Badge colorScheme={getStatusColorScheme(item.status)}>{item.status}</Badge>
                </Td>
                <Td>
                  <Wrap spacing={1}>
                    {item.targetKeywords && item.targetKeywords.length > 0 ? (
                      item.targetKeywords.map((kw, i) => (
                        <WrapItem key={i}>
                          <Badge variant="subtle" colorScheme="purple" fontSize="xs">
                            {kw.keyword}
                            {kw.volume ? ` - ${kw.volume}` : ''}
                          </Badge>
                        </WrapItem>
                      ))
                    ) : item.primaryKeyword ? (
                      <Badge variant="subtle" colorScheme="purple" fontSize="xs">
                        {item.primaryKeyword}
                      </Badge>
                    ) : (
                      <Text color="gray.400" fontSize="xs">
                        —
                      </Text>
                    )}
                  </Wrap>
                </Td>
                <Td>
                  <Text fontSize="sm" color="gray.600" noOfLines={2} maxW="200px">
                    {item.notes || '—'}
                  </Text>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {items.length === 0 && (
        <Box p={8} textAlign="center" color="gray.500">
          <Text>No content items scheduled. Add content to see your SEO calendar.</Text>
        </Box>
      )}
    </Box>
  );
}
