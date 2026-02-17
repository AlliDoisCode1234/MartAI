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

import { SimpleGrid, Box, VStack, HStack, Text, Icon, Badge } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiAlertTriangle } from 'react-icons/fi';

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

/** Colored dots row — visual indicator for intent/category distribution */
function ColorDots({ colors }: { colors: string[] }) {
  return (
    <HStack spacing="4px" my={1}>
      {colors.map((c, i) => (
        <Box key={i} w="10px" h="10px" borderRadius="full" bg={c} />
      ))}
    </HStack>
  );
}

export function KeywordStatCards({ foundation, authority, revenueReady, total, quickWins }: Props) {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={5}>
      {/* ─── Card 1: Foundation ─── */}
      <MotionBox
        position="relative"
        overflow="hidden"
        bg="linear-gradient(135deg, #1a1230 0%, rgba(249,159,42,0.06) 100%)"
        border="1px solid rgba(249,159,42,0.2)"
        borderLeft="3px solid #F99F2A"
        borderRadius="xl"
        p={5}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Sparkline color="#F99F2A" />
        <VStack align="stretch" spacing={2}>
          <HStack spacing={2} align="baseline">
            <Text color="#F99F2A" fontSize="2xl" fontWeight="bold" lineHeight="1">
              {foundation}
            </Text>
            <Text color="gray.400" fontSize="xs" fontWeight="semibold">
              Foundation Keywords
            </Text>
          </HStack>
          <Text color="white" fontSize="3xl" fontWeight="bold" lineHeight="1">
            {foundation}
          </Text>
          <HStack spacing={1} align="center">
            <Icon as={FiTrendingUp} color="#34d399" boxSize={3} />
            <Text color="#34d399" fontSize="xs" fontWeight="bold">
              20% Last 30 Days
            </Text>
          </HStack>
          <HStack spacing={1} flexWrap="wrap" mt={1}>
            <Badge
              bg="rgba(249,159,42,0.2)"
              color="#F99F2A"
              fontSize="7px"
              px={2}
              py={0.5}
              borderRadius="full"
              textTransform="none"
              fontWeight="semibold"
            >
              Most Revenue Potential
            </Badge>
            <Badge
              bg="rgba(96,165,250,0.2)"
              color="#60a5fa"
              fontSize="7px"
              px={2}
              py={0.5}
              borderRadius="full"
              textTransform="none"
              fontWeight="semibold"
            >
              Brand Niche
            </Badge>
          </HStack>
        </VStack>
      </MotionBox>

      {/* ─── Card 2: Authority ─── */}
      <MotionBox
        position="relative"
        overflow="hidden"
        bg="linear-gradient(135deg, #1a1230 0%, rgba(96,165,250,0.06) 100%)"
        border="1px solid rgba(96,165,250,0.2)"
        borderLeft="3px solid #60a5fa"
        borderRadius="xl"
        p={5}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
      >
        <VStack align="stretch" spacing={2}>
          <HStack spacing={2} align="baseline">
            <Text color="#60a5fa" fontSize="2xl" fontWeight="bold" lineHeight="1">
              {authority}
            </Text>
            <Text color="gray.400" fontSize="xs" fontWeight="semibold">
              Authority Keywords
            </Text>
          </HStack>
          <ColorDots colors={['#60a5fa', '#3b82f6', '#818cf8', '#6366f1', '#a78bfa', '#8b5cf6']} />
          <Text color="white" fontSize="3xl" fontWeight="bold" lineHeight="1">
            {authority}
          </Text>
          <Text color="gray.400" fontSize="xs">
            {quickWins} Easiest Wins
          </Text>
          <HStack spacing={1} flexWrap="wrap" mt={1}>
            <Badge
              bg="rgba(249,159,42,0.25)"
              color="#F99F2A"
              fontSize="7px"
              px={2}
              py={0.5}
              borderRadius="full"
              textTransform="none"
              fontWeight="bold"
            >
              COMMERCIAL
            </Badge>
            <Badge
              bg="rgba(167,139,250,0.2)"
              color="#a78bfa"
              fontSize="7px"
              px={2}
              py={0.5}
              borderRadius="full"
              textTransform="none"
              fontWeight="semibold"
            >
              {quickWins} Partners
            </Badge>
          </HStack>
        </VStack>
      </MotionBox>

      {/* ─── Card 3: Revenue-Ready ─── */}
      <MotionBox
        position="relative"
        overflow="hidden"
        bg="linear-gradient(135deg, #1a1230 0%, rgba(52,211,153,0.06) 100%)"
        border="1px solid rgba(52,211,153,0.2)"
        borderLeft="3px solid #34d399"
        borderRadius="xl"
        p={5}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
      >
        <VStack align="stretch" spacing={2}>
          <HStack spacing={2} align="baseline">
            <Text color="#34d399" fontSize="2xl" fontWeight="bold" lineHeight="1">
              {revenueReady}
            </Text>
            <Text color="gray.400" fontSize="xs" fontWeight="semibold">
              Revenue-Ready Keywords
            </Text>
          </HStack>
          <ColorDots colors={['#34d399', '#10b981', '#f59e0b', '#60a5fa', '#F99F2A', '#a78bfa']} />
          <Text color="gray.400" fontSize="xs">
            Fastest Rank Growth
          </Text>
          <HStack spacing={1} flexWrap="wrap" mt={1}>
            <Badge
              bg="rgba(52,211,153,0.2)"
              color="#34d399"
              fontSize="7px"
              px={2}
              py={0.5}
              borderRadius="full"
              textTransform="none"
              fontWeight="semibold"
            >
              BOFU / Transactional Intent
            </Badge>
          </HStack>
        </VStack>
      </MotionBox>

      {/* ─── Card 4: Total ─── */}
      <MotionBox
        position="relative"
        overflow="hidden"
        bg="linear-gradient(135deg, #1a1230 0%, rgba(167,139,250,0.06) 100%)"
        border="1px solid rgba(167,139,250,0.2)"
        borderLeft="3px solid #a78bfa"
        borderRadius="xl"
        p={5}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
      >
        <VStack align="stretch" spacing={2}>
          <HStack spacing={2} align="baseline">
            <Text color="#a78bfa" fontSize="2xl" fontWeight="bold" lineHeight="1">
              {total}
            </Text>
            <Text color="gray.400" fontSize="xs" fontWeight="semibold">
              Total Keywords
            </Text>
          </HStack>
          <Text color="white" fontSize="3xl" fontWeight="bold" lineHeight="1">
            {total}
          </Text>
          {revenueReady < total * 0.2 && (
            <HStack spacing={1.5} mt={2} bg="rgba(249,159,42,0.08)" px={3} py={2} borderRadius="md">
              <Icon as={FiAlertTriangle} color="#F99F2A" boxSize={3.5} flexShrink={0} />
              <Text color="gray.300" fontSize="xs">
                Focus on Revenue-Ready keywords for quicker lead generation.
              </Text>
            </HStack>
          )}
        </VStack>
      </MotionBox>
    </SimpleGrid>
  );
}
