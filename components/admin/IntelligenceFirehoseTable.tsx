'use client';

/**
 * Admin: Intelligence Firehose
 *
 * Exposes dense, raw, paginated analytics streams (GA4 and GSC)
 * exclusively for Admin staff, bypassing the abstracted UI rules.
 */

import { useState } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { usePaginatedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { format } from 'date-fns';
import { Id } from '@/convex/_generated/dataModel';

type Props = {
  projectId: Id<'projects'>;
};

export function IntelligenceFirehoseTable({ projectId }: Props) {
  // GSC Stream (Paginated)
  const gscFeed = usePaginatedQuery(
    api.admin.projectAnalytics.getRawGSCFeed,
    { projectId },
    { initialNumItems: 50 }
  );

  // GA4 Stream (Paginated)
  const ga4Feed = usePaginatedQuery(
    api.admin.projectAnalytics.getRawGA4Feed,
    { projectId },
    { initialNumItems: 50 }
  );

  const formatNumber = (num: number | undefined) => (num !== undefined ? num.toLocaleString() : '—');

  return (
    <Box bg="white" p={6} rounded="xl" shadow="sm" borderWidth="1px" borderColor="gray.100">
      <Heading size="md" mb={6}>
        Admin Intelligence Firehose
      </Heading>

      <Tabs colorScheme="purple" variant="enclosed">
        <TabList>
          <Tab fontWeight="semibold">Google Search Console Feed</Tab>
          <Tab fontWeight="semibold">GA4 Feed</Tab>
        </TabList>

        <TabPanels>
          {/* GSC Panel */}
          <TabPanel px={0} py={4}>
            {!gscFeed.results || gscFeed.results.length === 0 ? (
              <Box p={4} bg="gray.50" rounded="md">
                <Text color="gray.500">No GSC data synchronized for this project.</Text>
              </Box>
            ) : (
              <Box overflowX="auto" border="1px" borderColor="gray.200" rounded="md">
                <Table size="sm" variant="simple">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>Keyword</Th>
                      <Th isNumeric>Impressions</Th>
                      <Th isNumeric>Clicks</Th>
                      <Th isNumeric>Pos</Th>
                      <Th isNumeric>CTR</Th>
                      <Th>Sync Date</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {gscFeed.results.map((r) => (
                      <Tr key={r._id}>
                        <Td fontWeight="medium">
                          {r.keyword}
                        </Td>
                        <Td isNumeric>{formatNumber(r.impressions)}</Td>
                        <Td isNumeric>{formatNumber(r.clicks)}</Td>
                        <Td isNumeric>{r.position.toFixed(1)}</Td>
                        <Td isNumeric>{(r.ctr * 100).toFixed(2)}%</Td>
                        <Td color="gray.500">
                          {format(r.syncDate, 'MMM d, yy')}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                
                <HStack p={4} justify="center" borderTop="1px" borderColor="gray.100">
                  <Button
                    size="sm"
                    onClick={() => gscFeed.loadMore(50)}
                    isLoading={gscFeed.status === 'LoadingMore'}
                    isDisabled={gscFeed.status !== 'CanLoadMore'}
                    variant="outline"
                  >
                    Load More GSC Data
                  </Button>
                </HStack>
              </Box>
            )}
          </TabPanel>

          {/* GA4 Panel */}
          <TabPanel px={0} py={4}>
            {!ga4Feed.results || ga4Feed.results.length === 0 ? (
              <Box p={4} bg="gray.50" rounded="md">
                <Text color="gray.500">No GA4 data synchronized for this project.</Text>
              </Box>
            ) : (
              <Box overflowX="auto" border="1px" borderColor="gray.200" rounded="md">
                <Table size="sm" variant="simple">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>Date</Th>
                      <Th isNumeric>Sessions</Th>
                      <Th isNumeric>Engaged</Th>
                      <Th isNumeric>Users</Th>
                      <Th isNumeric>Bounce</Th>
                      <Th isNumeric>Conversions</Th>
                      <Th isNumeric>Time (s)</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {ga4Feed.results.map((r) => (
                      <Tr key={r._id}>
                        <Td fontWeight="medium">
                          {format(r.date, 'MMM d, yy')}
                        </Td>
                        <Td isNumeric>{formatNumber(r.sessions)}</Td>
                        <Td isNumeric>{formatNumber(r.engagedSessions)}</Td>
                        <Td isNumeric>{formatNumber(r.users)}</Td>
                        <Td isNumeric>
                          {r.bounceRate !== undefined ? `${r.bounceRate.toFixed(1)}%` : '—'}
                        </Td>
                        <Td isNumeric>{formatNumber(r.conversions)}</Td>
                        <Td isNumeric>{formatNumber(r.engagementDuration)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>

                <HStack p={4} justify="center" borderTop="1px" borderColor="gray.100">
                  <Button
                    size="sm"
                    onClick={() => ga4Feed.loadMore(50)}
                    isLoading={ga4Feed.status === 'LoadingMore'}
                    isDisabled={ga4Feed.status !== 'CanLoadMore'}
                    variant="outline"
                  >
                    Load More GA4 Data
                  </Button>
                </HStack>
              </Box>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
