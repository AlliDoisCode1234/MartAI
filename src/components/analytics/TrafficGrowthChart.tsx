'use client';

/**
 * TrafficGrowthChart Component
 *
 * Component Hierarchy:
 * App → Analytics → TrafficGrowthChart (this file)
 *
 * Line chart for sessions and clicks over time.
 */

import {
  Card,
  CardBody,
  VStack,
  HStack,
  Heading,
  Text,
  Box,
  Badge,
  Button,
} from '@chakra-ui/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type ChartDataPoint = { date: string; sessions: number; clicks: number };

type Props = {
  data: ChartDataPoint[];
  onSync: () => void;
};

export function TrafficGrowthChart({ data, onSync }: Props) {
  return (
    <Card
      shadow="xl"
      bg="white"
      border="1px"
      borderColor="gray.200"
      _hover={{ shadow: '2xl', borderColor: 'brand.orange' }}
      transition="all 0.3s"
    >
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Heading size="md" fontFamily="heading" color="gray.800">
                Traffic Growth
              </Heading>
              <Text fontSize="sm" color="gray.600">
                Sessions & Clicks over time
              </Text>
            </VStack>
            <Badge colorScheme="orange" fontSize="sm" px={3} py={1}>
              Live
            </Badge>
          </HStack>
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="sessionsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F7941E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F7941E" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#40DEC7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#40DEC7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis
                  dataKey="date"
                  stroke="#718096"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="#718096" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '2px solid #F7941E',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  }}
                  cursor={{ stroke: '#F7941E', strokeWidth: 2 }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="line" />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="#F7941E"
                  strokeWidth={3}
                  dot={{ fill: '#F7941E', r: 5, strokeWidth: 2, stroke: 'white' }}
                  activeDot={{ r: 7 }}
                  name="Sessions"
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#40DEC7"
                  strokeWidth={3}
                  dot={{ fill: '#40DEC7', r: 5, strokeWidth: 2, stroke: 'white' }}
                  activeDot={{ r: 7 }}
                  name="Clicks"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Box
              h="320px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bgGradient="linear(to-br, orange.50, teal.50)"
              borderRadius="lg"
              border="2px dashed"
              borderColor="brand.orange"
            >
              <VStack spacing={4}>
                <Text fontSize="4xl" color="brand.orange">
                  ●
                </Text>
                <VStack spacing={2}>
                  <Text fontWeight="semibold" color="gray.700">
                    No data available
                  </Text>
                  <Text fontSize="sm" color="gray.600" textAlign="center">
                    Sync your GA4 and GSC data to see traffic trends
                  </Text>
                </VStack>
                <Button
                  onClick={onSync}
                  bg="brand.orange"
                  color="white"
                  _hover={{ bg: '#E8851A' }}
                  size="sm"
                >
                  Sync Data
                </Button>
              </VStack>
            </Box>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}
