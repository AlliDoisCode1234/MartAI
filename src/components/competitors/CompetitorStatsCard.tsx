'use client';

/**
 * CompetitorStatsCard Component
 *
 * Component Hierarchy:
 * App → Competitors → CompetitorStatsCard (this file)
 *
 * Stats card for competitor page metrics.
 */

import { Card, CardBody, HStack, Box, Text, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import type { IconType } from 'react-icons';

const MotionCard = motion(Card);

type Props = {
  icon: IconType;
  iconBg: string;
  iconColor: string;
  value: number | string;
  label: string;
  delay?: number;
  cardBg?: string;
};

export function CompetitorStatsCard({
  icon,
  iconBg,
  iconColor,
  value,
  label,
  delay = 0,
  cardBg = 'white',
}: Props) {
  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      bg={cardBg}
      borderRadius="xl"
      boxShadow="sm"
    >
      <CardBody>
        <HStack spacing={3}>
          <Box p={3} borderRadius="lg" bg={iconBg}>
            <Icon as={icon} color={iconColor} boxSize={5} />
          </Box>
          <Box>
            <Text fontSize="2xl" fontWeight="bold">
              {value}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {label}
            </Text>
          </Box>
        </HStack>
      </CardBody>
    </MotionCard>
  );
}
