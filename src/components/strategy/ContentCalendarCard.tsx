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
    <Card bg="rgba(30, 30, 30, 0.6)" borderWidth="1px" borderColor="rgba(255, 255, 255, 0.1)">
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <Heading size="md" color="white">
            12-Week Content Calendar
          </Heading>
          <Box overflowX="auto">
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th color="gray.400" borderColor="whiteAlpha.200">
                    Week
                  </Th>
                  <Th color="gray.400" borderColor="whiteAlpha.200">
                    Date
                  </Th>
                  <Th color="gray.400" borderColor="whiteAlpha.200">
                    Article Topic
                  </Th>
                  <Th color="gray.400" borderColor="whiteAlpha.200">
                    Status
                  </Th>
                  <Th color="gray.400" borderColor="whiteAlpha.200">
                    Actions
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {briefs.map((brief, index) => (
                  <Tr key={brief._id || index}>
                    <Td color="white" borderColor="whiteAlpha.100">
                      {brief.week || Math.floor(index / contentVelocity) + 1}
                    </Td>
                    <Td color="gray.300" borderColor="whiteAlpha.100">
                      {new Date(brief.scheduledDate).toLocaleDateString()}
                    </Td>
                    <Td color="white" borderColor="whiteAlpha.100">
                      {brief.title}
                    </Td>
                    <Td borderColor="whiteAlpha.100">
                      <Badge colorScheme={brief.status === 'published' ? 'green' : 'gray'}>
                        {brief.status}
                      </Badge>
                    </Td>
                    <Td borderColor="whiteAlpha.100">
                      <Button
                        size="xs"
                        variant="outline"
                        colorScheme="orange"
                        onClick={() => (window.location.href = `/studio/${brief._id}`)}
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
