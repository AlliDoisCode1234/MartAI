'use client';

/**
 * LeadsGeneratedChart Component
 *
 * Component Hierarchy:
 * App → Analytics → LeadsGeneratedChart (this file)
 *
 * Bar chart for leads over time.
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type ChartDataPoint = { date: string; leads: number };

type Props = {
  data: ChartDataPoint[];
  onSync: () => void;
};

export function LeadsGeneratedChart({ data, onSync }: Props) {
  return (
    <Card
      shadow="xl"
      bg="white"
      border="1px"
      borderColor="gray.200"
      _hover={{ shadow: '2xl', borderColor: 'brand.teal' }}
      transition="all 0.3s"
    >
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Heading size="md" fontFamily="heading" color="gray.800">
                Leads Generated
              </Heading>
              <Text fontSize="sm" color="gray.600">
                Conversion tracking
              </Text>
            </VStack>
            <Badge colorScheme="teal" fontSize="sm" px={3} py={1}>
              Goals
            </Badge>
          </HStack>
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#40DEC7" stopOpacity={1} />
                    <stop offset="95%" stopColor="#38B2AC" stopOpacity={1} />
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
                    border: '2px solid #40DEC7',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  }}
                  cursor={{ fill: 'rgba(64, 222, 199, 0.1)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar
                  dataKey="leads"
                  fill="url(#leadsGradient)"
                  name="Leads"
                  radius={[12, 12, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Box
              h="320px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bgGradient="linear(to-br, teal.50, green.50)"
              borderRadius="lg"
              border="2px dashed"
              borderColor="brand.teal"
            >
              <VStack spacing={4}>
                <Text fontSize="4xl" color="brand.teal">
                  ●
                </Text>
                <VStack spacing={2}>
                  <Text fontWeight="semibold" color="gray.700">
                    No leads data
                  </Text>
                  <Text fontSize="sm" color="gray.600" textAlign="center">
                    Connect GA4 to track conversions and revenue
                  </Text>
                </VStack>
                <Button
                  onClick={onSync}
                  bg="brand.teal"
                  color="white"
                  _hover={{ bg: '#3AD4B8' }}
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
