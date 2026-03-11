'use client';

/**
 * KeywordStatCards
 *
 * Component Hierarchy:
 * App -> Keywords -> KeywordsPage -> KeywordStatCards (this file)
 *
 * 4 stat cards pixel-matched to mockup:
 *  1. Foundation: sparkline chart, growth %, badges
 *  2. Authority: colored dot indicators, easiest wins
 *  3. Revenue-Ready: colored dot indicators, rank growth
 *  4. Total: tip with warning icon
 *
 * Each card has gradient accent-tinted background and colored left border.
 */

import { SimpleGrid, Box, VStack, HStack, Text, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';
import { MetricTooltip } from '@/src/components/shared';

const MotionBox = motion(Box);

type Props = {
  foundation: number;
  authority: number;
  revenueReady: number;
  total: number;
  quickWins: number;
};

/** Mini sparkline SVG — upward trend curve with fill */
function Sparkline({ color }: { color: string }) {
  return (
    <Box position="absolute" top="8px" right="8px" opacity={0.6} w="80px" h="40px">
      <svg width="80" height="40" viewBox="0 0 80 40" fill="none">
        <defs>
          <linearGradient id={`sparkGrad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 35 Q10 32 16 28 T32 22 T48 18 T60 10 T72 6 T80 4"
          stroke={color}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M0 35 Q10 32 16 28 T32 22 T48 18 T60 10 T72 6 T80 4 L80 40 L0 40 Z"
          fill={`url(#sparkGrad-${color.replace('#', '')})`}
        />
      </svg>
    </Box>
  );
}

export function KeywordStatCards({ foundation, authority, revenueReady, total, quickWins }: Props) {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={5}>
      {/* ─── Card 1: Foundation ─── */}
      <MotionBox
        position="relative"
        overflow="hidden"
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderLeft="3px solid #F99F2A"
        borderRadius="xl"
        p={5}
        boxShadow="0 2px 12px rgba(0, 0, 0, 0.06)"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Sparkline color="#F99F2A" />
        <VStack align="stretch" spacing={2}>
          <HStack spacing={2} align="baseline">
            <Text color="#F99F2A" fontSize="3xl" fontWeight="bold" lineHeight="1">
              {foundation}
            </Text>
            <Text color="gray.400" fontSize="xs" fontWeight="semibold">
              Foundation Keywords
            </Text>
            <MetricTooltip metricKey="foundation-keywords" size={12} />
          </HStack>
          <Text color="gray.400" fontSize="xs">
            Informational & awareness-stage terms
          </Text>
        </VStack>
      </MotionBox>

      {/* ─── Card 2: Authority ─── */}
      <MotionBox
        position="relative"
        overflow="hidden"
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderLeft="3px solid #475569"
        borderRadius="xl"
        p={5}
        boxShadow="0 2px 12px rgba(0, 0, 0, 0.06)"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
      >
        <VStack align="stretch" spacing={2}>
          <HStack spacing={2} align="baseline">
            <Text color="#475569" fontSize="3xl" fontWeight="bold" lineHeight="1">
              {authority}
            </Text>
            <Text color="gray.400" fontSize="xs" fontWeight="semibold">
              Authority Keywords
            </Text>
            <MetricTooltip metricKey="authority-keywords" size={12} />
          </HStack>
          <Text color="gray.400" fontSize="xs">
            {quickWins} quick win opportunities
          </Text>
        </VStack>
      </MotionBox>

      {/* ─── Card 3: Revenue-Ready ─── */}
      <MotionBox
        position="relative"
        overflow="hidden"
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderLeft="3px solid #0d9488"
        borderRadius="xl"
        p={5}
        boxShadow="0 2px 12px rgba(0, 0, 0, 0.06)"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
      >
        <VStack align="stretch" spacing={2}>
          <HStack spacing={2} align="baseline">
            <Text color="#0d9488" fontSize="3xl" fontWeight="bold" lineHeight="1">
              {revenueReady}
            </Text>
            <Text color="gray.400" fontSize="xs" fontWeight="semibold">
              Revenue-Ready Keywords
            </Text>
            <MetricTooltip metricKey="revenue-ready-keywords" size={12} />
          </HStack>
          <Text color="gray.400" fontSize="xs">
            Bottom-of-funnel, transactional intent
          </Text>
        </VStack>
      </MotionBox>

      {/* ─── Card 4: Total ─── */}
      <MotionBox
        position="relative"
        overflow="hidden"
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderLeft="3px solid #78716c"
        borderRadius="xl"
        p={5}
        boxShadow="0 2px 12px rgba(0, 0, 0, 0.06)"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
      >
        <VStack align="stretch" spacing={2}>
          <HStack spacing={2} align="baseline">
            <Text color="#78716c" fontSize="3xl" fontWeight="bold" lineHeight="1">
              {total}
            </Text>
            <Text color="gray.400" fontSize="xs" fontWeight="semibold">
              Total Keywords
            </Text>
            <MetricTooltip metricKey="total-keywords" size={12} />
          </HStack>
          {revenueReady < total * 0.2 && (
            <HStack spacing={1.5} mt={2} bg="orange.50" px={3} py={2} borderRadius="md">
              <Icon as={FiAlertTriangle} color="#F99F2A" boxSize={3.5} flexShrink={0} />
              <Text color="gray.600" fontSize="xs">
                Focus on Revenue-Ready keywords for quicker lead generation.
              </Text>
            </HStack>
          )}
        </VStack>
      </MotionBox>
    </SimpleGrid>
  );
}
