'use client';

/**
 * KPICard Component
 *
 * Component Hierarchy:
 * App → Analytics → KPICard (this file)
 *
 * Individual KPI card with gradient background.
 */

import { Card, CardBody, VStack, HStack, Heading, Text, Box } from '@chakra-ui/react';
import { TrendingUpIcon } from '@/src/icons/TrendingUpIcon';
import { TrendingDownIcon } from '@/src/icons/TrendingDownIcon';
import { formatNumber } from '@/src/utils/analyticsUtils';

type Props = {
  label: string;
  value: number;
  change?: number;
  description?: string;
  icon: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

export function KPICard({
  label,
  value,
  change,
  description,
  icon,
  color,
  bgGradient,
  borderColor,
  prefix,
  suffix,
  decimals,
}: Props) {
  return (
    <Card
      bgGradient={bgGradient}
      border="2px"
      borderColor={borderColor}
      shadow="xl"
      _hover={{ shadow: '2xl', transform: 'translateY(-4px) scale(1.02)' }}
      transition="all 0.3s"
      overflow="hidden"
      position="relative"
    >
      <Box
        position="absolute"
        top={0}
        right={0}
        w="100px"
        h="100px"
        bg="white"
        opacity="0.1"
        borderRadius="0 0 0 100%"
      />
      <CardBody position="relative" zIndex={1}>
        <VStack align="start" spacing={3}>
          <HStack justify="space-between" w="full">
            <VStack align="start" spacing={0}>
              <Text
                fontSize="xs"
                fontWeight="bold"
                color="white"
                opacity={0.9}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                {label}
              </Text>
              {description && (
                <Text fontSize="xs" color="white" opacity={0.7}>
                  {description}
                </Text>
              )}
            </VStack>
            <Box bg="white" opacity="0.2" borderRadius="full" p={3} fontSize="2xl">
              {icon}
            </Box>
          </HStack>
          <Heading size="3xl" fontWeight="bold" color={color} fontFamily="heading" lineHeight="1">
            {prefix || ''}
            {decimals !== undefined ? value.toFixed(decimals) : formatNumber(value)}
            {suffix || ''}
          </Heading>
          {change !== undefined && (
            <HStack spacing={2} bg="white" opacity="0.25" px={3} py={1.5} borderRadius="full">
              {change > 0 ? <TrendingUpIcon /> : change < 0 ? <TrendingDownIcon /> : null}
              <Text fontSize="sm" fontWeight="bold" color="white">
                {change > 0 ? '+' : ''}
                {change.toFixed(1)}%
              </Text>
              <Text fontSize="xs" color="white" opacity={0.8}>
                vs previous
              </Text>
            </HStack>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}
