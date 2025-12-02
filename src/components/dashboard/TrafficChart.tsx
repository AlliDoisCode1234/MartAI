'use client';

import { Card, CardBody, VStack, Box, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

interface TrafficChartProps {
  data: Array<{ name: string; traffic: number }>;
  delay?: number;
}

export function TrafficChart({ data, delay = 0 }: TrafficChartProps) {
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <MotionCard
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      bg={cardBg}
      boxShadow="lg"
      borderRadius="xl"
    >
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <Box>
            <Heading size="md" mb={1}>
              Traffic Trend
            </Heading>
            <Text color="gray.500" fontSize="sm">
              Last 6 months organic traffic growth
            </Text>
          </Box>
          <Box h="250px">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="traffic"
                  stroke="#FF6B35"
                  fillOpacity={1}
                  fill="url(#colorTraffic)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </VStack>
      </CardBody>
    </MotionCard>
  );
}
