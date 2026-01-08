'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Grid,
  Card,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Skeleton,
  Icon,
} from '@chakra-ui/react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { FiDollarSign, FiActivity, FiCpu, FiTrendingUp } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { StatsSkeleton, TableSkeleton } from '@/components/skeletons';
import { TrendChart } from '@/src/components/admin/TrendChart';

export default function AdminCostsPage() {
  const summary = useQuery(api.admin.costs.getAICostSummary);
  const recentCosts = useQuery(api.admin.costs.getAllAICosts, { limit: 25 });

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const formatCost = (cost: number) => {
    return `$${cost.toFixed(4)}`;
  };

  const formatTokens = (tokens: number) => {
    if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
    if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}K`;
    return tokens.toString();
  };

  if (!summary) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Skeleton height="40px" width="200px" borderRadius="md" />
          <StatsSkeleton count={4} />
          <TableSkeleton rows={5} columns={4} />
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>
            AI Cost Tracking
          </Heading>
          <Text color="gray.500">Monitor and analyze AI generation costs across the platform</Text>
        </Box>

        {/* Summary Stats */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6}>
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <HStack spacing={3}>
                  <Icon as={FiDollarSign} boxSize={8} color="green.500" />
                  <Box>
                    <StatLabel>Total Cost</StatLabel>
                    <StatNumber>{formatCost(summary.totalCost)}</StatNumber>
                    <StatHelpText>All-time spend</StatHelpText>
                  </Box>
                </HStack>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <HStack spacing={3}>
                  <Icon as={FiActivity} boxSize={8} color="blue.500" />
                  <Box>
                    <StatLabel>Total Tokens</StatLabel>
                    <StatNumber>{formatTokens(summary.totalTokens)}</StatNumber>
                    <StatHelpText>Processed</StatHelpText>
                  </Box>
                </HStack>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <HStack spacing={3}>
                  <Icon as={FiCpu} boxSize={8} color="purple.500" />
                  <Box>
                    <StatLabel>Generations</StatLabel>
                    <StatNumber>{summary.totalGenerations}</StatNumber>
                    <StatHelpText>API calls</StatHelpText>
                  </Box>
                </HStack>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <HStack spacing={3}>
                  <Icon as={FiTrendingUp} boxSize={8} color="orange.500" />
                  <Box>
                    <StatLabel>Avg Cost</StatLabel>
                    <StatNumber>
                      {summary.totalGenerations > 0
                        ? formatCost(summary.totalCost / summary.totalGenerations)
                        : '$0'}
                    </StatNumber>
                    <StatHelpText>Per generation</StatHelpText>
                  </Box>
                </HStack>
              </Stat>
            </CardBody>
          </Card>
        </Grid>

        {/* Daily Cost Trend */}
        {summary.dailyCosts && summary.dailyCosts.length > 0 && (
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <Heading size="md" mb={2}>
                Daily Cost Trend
              </Heading>
              <Text fontSize="sm" color="gray.500" mb={4}>
                AI spend over the last 7 days
              </Text>
              <TrendChart data={summary.dailyCosts} height={120} barColor="green.400" />
            </CardBody>
          </Card>
        )}

        {/* Cost by Model */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Heading size="md" mb={4}>
              Cost by Model
            </Heading>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Model</Th>
                  <Th isNumeric>Generations</Th>
                  <Th isNumeric>Total Cost</Th>
                  <Th isNumeric>Avg/Call</Th>
                </Tr>
              </Thead>
              <Tbody>
                {summary.byModel
                  .sort(
                    (
                      a: { model: string; cost: number; count: number },
                      b: { model: string; cost: number; count: number }
                    ) => b.cost - a.cost
                  )
                  .map((item: { model: string; cost: number; count: number }) => (
                    <Tr key={item.model}>
                      <Td>
                        <Badge colorScheme="purple">{item.model}</Badge>
                      </Td>
                      <Td isNumeric>{item.count}</Td>
                      <Td isNumeric fontWeight="semibold">
                        {formatCost(item.cost)}
                      </Td>
                      <Td isNumeric color="gray.500">
                        {formatCost(item.cost / item.count)}
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>

        {/* Recent Generations */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Heading size="md" mb={4}>
              Recent Generations
            </Heading>
            <Box overflowX="auto">
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Time</Th>
                    <Th>Tokens</Th>
                    <Th isNumeric>Cost</Th>
                    <Th>User Cost</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {recentCosts?.map((cost: any) => (
                    <Tr key={cost._id}>
                      <Td>
                        <Text fontSize="sm">
                          {formatDistanceToNow(cost._creationTime, {
                            addSuffix: true,
                          })}
                        </Text>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <Text fontSize="xs" color="gray.500">
                            In: {cost.usage?.promptTokens || 0}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            Out: {cost.usage?.completionTokens || 0}
                          </Text>
                        </HStack>
                      </Td>
                      <Td isNumeric>
                        <Badge colorScheme="green">{formatCost(cost.cost?.totalCost || 0)}</Badge>
                      </Td>
                      <Td>
                        <Badge colorScheme="blue">
                          {formatCost(cost.costForUser?.totalCost || 0)}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
}
