'use client';

/**
 * ContentCalendarCard Component
 *
 * Component Hierarchy:
 * App → Strategy → ContentCalendarCard (this file)
 *
 * Displays 12-week content calendar table.
 */

import {
  Card,
  CardBody,
  VStack,
  Heading,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
} from '@chakra-ui/react';

type Brief = {
  _id: string;
  title: string;
  status: string;
  scheduledDate: number;
  week?: number;
};

type Props = {
  briefs: Brief[];
  contentVelocity: number;
};

export function ContentCalendarCard({ briefs, contentVelocity }: Props) {
  if (!briefs || briefs.length === 0) return null;

  return (
    <Card>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <Heading size="md">12-Week Content Calendar</Heading>
          <Box overflowX="auto">
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Week</Th>
                  <Th>Date</Th>
                  <Th>Article Topic</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {briefs.map((brief, index) => (
                  <Tr key={brief._id || index}>
                    <Td>{brief.week || Math.floor(index / contentVelocity) + 1}</Td>
                    <Td>{new Date(brief.scheduledDate).toLocaleDateString()}</Td>
                    <Td>{brief.title}</Td>
                    <Td>
                      <Badge colorScheme={brief.status === 'published' ? 'green' : 'gray'}>
                        {brief.status}
                      </Badge>
                    </Td>
                    <Td>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => (window.location.href = `/content?briefId=${brief._id}`)}
                      >
                        View Outline
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
}
