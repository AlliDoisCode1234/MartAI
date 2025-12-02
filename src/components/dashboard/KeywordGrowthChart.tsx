'use client';

import { Card, CardBody, VStack, Box, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

interface KeywordGrowthChartProps {
  data: Array<{ name: string; keywords: number }>;
  delay?: number;
}

export function KeywordGrowthChart({ data, delay = 0 }: KeywordGrowthChartProps) {
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <MotionCard
      initial={{ opacity: 0, x: 20 }}
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
              Keyword Growth
            </Heading>
            <Text color="gray.500" fontSize="sm">
              Ranking keywords over time
            </Text>
          </Box>
          <Box h="250px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip />
                <Bar dataKey="keywords" fill="#4299E1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </VStack>
      </CardBody>
    </MotionCard>
  );
}
