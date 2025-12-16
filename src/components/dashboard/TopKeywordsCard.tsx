'use client';

/**
 * TopKeywordsCard Component
 *
 * Component Hierarchy:
 * App → Dashboard → TopKeywordsCard (this file)
 *
 * Top performing keywords table with trends.
 */

import {
  Card,
  CardBody,
  Box,
  HStack,
  Heading,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Progress,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  getPositionColorScheme,
  getTrendBadge,
  getPerformanceValue,
  type KeywordTrend,
} from '@/lib/constants/dashboard';

const MotionCard = motion(Card);

type KeywordData = {
  keyword: string;
  position: number;
  volume: number;
  trend: KeywordTrend;
};

type Props = {
  keywords: KeywordData[];
};

export function TopKeywordsCard({ keywords }: Props) {
  const router = useRouter();
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      bg={cardBg}
      boxShadow="lg"
      borderRadius="xl"
    >
      <CardBody>
        <HStack justify="space-between" mb={6}>
          <Box>
            <Heading size="md" mb={1}>
              Top Performing Keywords
            </Heading>
            <Text color="gray.500" fontSize="sm">
              Your best ranking keywords and their performance
            </Text>
          </Box>
          <Button size="sm" variant="outline" onClick={() => router.push('/keywords')}>
            View All
          </Button>
        </HStack>
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Keyword</Th>
                <Th isNumeric>Position</Th>
                <Th isNumeric>Search Volume</Th>
                <Th>Trend</Th>
                <Th>Performance</Th>
              </Tr>
            </Thead>
            <Tbody>
              {keywords.map((kw, index) => {
                const trendInfo = getTrendBadge(kw.trend);
                return (
                  <Tr key={index} _hover={{ bg: 'gray.50' }}>
                    <Td fontWeight="medium">{kw.keyword}</Td>
                    <Td isNumeric>
                      <Badge colorScheme={getPositionColorScheme(kw.position)}>
                        #{kw.position}
                      </Badge>
                    </Td>
                    <Td isNumeric>{kw.volume.toLocaleString()}/mo</Td>
                    <Td>
                      <Badge colorScheme={trendInfo.colorScheme}>{trendInfo.symbol}</Badge>
                    </Td>
                    <Td>
                      <Progress
                        value={getPerformanceValue(kw.position)}
                        size="sm"
                        colorScheme={getPositionColorScheme(kw.position)}
                        borderRadius="full"
                      />
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </CardBody>
    </MotionCard>
  );
}
