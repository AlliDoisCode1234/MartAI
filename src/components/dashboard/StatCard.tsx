'use client';

/**
 * StatCard
 * ├── src/components/dashboard/
 * │   └── StatCard.tsx (this file)
 */

import { ReactNode } from 'react';
import {
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  HStack,
  Box,
  Icon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

const MotionCard = motion(Card);

type Props = {
  label: string;
  value: string | number;
  helpText?: string;
  trend?: 'increase' | 'decrease';
  trendValue?: string;
  icon: IconType;
  iconColor: string;
  iconBg: string;
  delay?: number;
};

export function StatCard({
  label,
  value,
  helpText,
  trend,
  trendValue,
  icon,
  iconColor,
  iconBg,
  delay = 0,
}: Props) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <MotionCard
      variants={itemVariants}
      bg="white"
      boxShadow="lg"
      borderRadius="xl"
      initial="hidden"
      animate="show"
      transition={{ delay }}
    >
      <CardBody>
        <Stat>
          <HStack mb={2}>
            <Box p={2} bg={iconBg} borderRadius="lg">
              <Icon as={icon} boxSize={6} color={iconColor} />
            </Box>
            <StatLabel fontWeight="bold" fontSize="sm">
              {label}
            </StatLabel>
          </HStack>
          <StatNumber fontSize="3xl">{value}</StatNumber>
          {(helpText || trend) && (
            <StatHelpText>
              {trend && trendValue && <StatArrow type={trend} />}
              {helpText || trendValue}
            </StatHelpText>
          )}
        </Stat>
      </CardBody>
    </MotionCard>
  );
}
