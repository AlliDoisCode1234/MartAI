'use client';

import { Card, CardBody, HStack, Box, Heading, Text, Button, Table, Thead, Tbody, Tr, Th, Td, Badge, Progress, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

interface KeywordData {
  keyword: string;
  position: number;
  volume: number;
  trend: 'up' | 'down' | 'stable';
}

interface TopKeywordsTableProps {
  keywords: KeywordData[];
  onViewAll?: () => void;
  delay?: number;
}

export function TopKeywordsTable({ keywords, onViewAll, delay = 0 }: TopKeywordsTableProps) {
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
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
          {onViewAll && (
            <Button size="sm" variant="outline" onClick={onViewAll}>
              View All
            </Button>
          )}
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
              {keywords.map((kw, index) => (
                <Tr key={index} _hover={{ bg: 'gray.50' }}>
                  <Td fontWeight="medium">{kw.keyword}</Td>
                  <Td isNumeric>
                    <Badge
                      colorScheme={
                        kw.position <= 5 ? 'green' : kw.position <= 10 ? 'yellow' : 'gray'
                      }
                    >
                      #{kw.position}
                    </Badge>
                  </Td>
                  <Td isNumeric>{kw.volume.toLocaleString()}/mo</Td>
                  <Td>
                    <Badge
                      colorScheme={
                        kw.trend === 'up' ? 'green' : kw.trend === 'down' ? 'red' : 'gray'
                      }
                    >
                      {kw.trend === 'up' ? '↑' : kw.trend === 'down' ? '↓' : '→'}
                    </Badge>
                  </Td>
                  <Td>
                    <Progress
                      value={kw.position <= 3 ? 90 : kw.position <= 10 ? 60 : 30}
                      size="sm"
                      colorScheme={
                        kw.position <= 5 ? 'green' : kw.position <= 10 ? 'yellow' : 'gray'
                      }
                      borderRadius="full"
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </CardBody>
    </MotionCard>
  );
}
