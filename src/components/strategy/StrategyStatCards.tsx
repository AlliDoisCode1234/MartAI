'use client';

/**
 * StrategyStatCards Component
 *
 * Component Hierarchy:
 * App → Strategy → StrategyStatCards (this file)
 *
 * Displays 4 hero stat cards for strategy metrics.
 */

import { SimpleGrid, Card, CardBody, HStack, Box, Text, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiLayers, FiFileText, FiTrendingUp, FiZap } from 'react-icons/fi';

const MotionCard = motion(Card);

type Props = {
  clusterCount: number;
  briefCount: number;
  contentVelocity: number;
  keywordCount: number;
};

export function StrategyStatCards({
  clusterCount,
  briefCount,
  contentVelocity,
  keywordCount,
}: Props) {
  const stats = [
    { label: 'Topic Clusters', value: clusterCount, icon: FiLayers, color: 'purple', delay: 0.1 },
    { label: 'Planned Briefs', value: briefCount, icon: FiFileText, color: 'blue', delay: 0.2 },
    { label: 'Posts/Week', value: contentVelocity, icon: FiTrendingUp, color: 'green', delay: 0.3 },
    { label: 'Target Keywords', value: keywordCount, icon: FiZap, color: 'yellow', delay: 0.4 },
  ];

  return (
    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
      {stats.map((stat) => (
        <MotionCard
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: stat.delay }}
          bg="white"
          borderRadius="xl"
          boxShadow="sm"
        >
          <CardBody>
            <HStack spacing={3}>
              <Box p={3} borderRadius="lg" bg={`${stat.color}.100`}>
                <Icon as={stat.icon} color={`${stat.color}.600`} boxSize={5} />
              </Box>
              <Box>
                <Text fontSize="2xl" fontWeight="bold">
                  {stat.value}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {stat.label}
                </Text>
              </Box>
            </HStack>
          </CardBody>
        </MotionCard>
      ))}
    </SimpleGrid>
  );
}
