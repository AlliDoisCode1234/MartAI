'use client';

/**
 * RadialGauge
 *
 * Component Hierarchy:
 * App → StudioLayout → InsightsPage → RadialGauge
 *
 * SVG-based semi-circle gauge for displaying scores (0-100).
 * Color gradient transitions from red → amber → green based on value.
 * Animated on mount with a smooth sweep.
 */

import { Box, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { getScoreColor } from '@/lib/constants/studioTokens';

interface Props {
  value: number;
  maxValue?: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
}

export function RadialGauge({ value, maxValue = 100, label, size = 140, strokeWidth = 10 }: Props) {
  const clampedValue = Math.max(0, Math.min(value, maxValue));
  const percentage = clampedValue / maxValue;
  const color = getScoreColor(clampedValue);

  // Semi-circle geometry
  const radius = (size - strokeWidth) / 2;
  const centerX = size / 2;
  const centerY = size / 2 + radius * 0.1; // Slight downward offset for visual balance
  const circumference = Math.PI * radius; // Half-circle
  const dashOffset = circumference * (1 - percentage);

  // Arc path (semi-circle, left to right)
  const startX = centerX - radius;
  const startY = centerY;
  const endX = centerX + radius;
  const endY = centerY;

  const arcPath = `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;

  return (
    <VStack spacing={0}>
      <Box position="relative" width={`${size}px`} height={`${size * 0.55}px`}>
        <svg
          width={size}
          height={size * 0.6}
          viewBox={`0 0 ${size} ${size * 0.6}`}
          overflow="visible"
        >
          {/* Background arc */}
          <path
            d={arcPath}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Value arc (animated) */}
          <motion.path
            d={arcPath}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          />
          {/* Glow effect */}
          <motion.path
            d={arcPath}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth + 4}
            strokeLinecap="round"
            strokeDasharray={circumference}
            opacity={0.15}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>
        {/* Center value */}
        <Box
          position="absolute"
          bottom="0"
          left="50%"
          transform="translateX(-50%)"
          textAlign="center"
        >
          <Text fontSize="2xl" fontWeight="bold" color="white" lineHeight="1">
            {clampedValue}
          </Text>
        </Box>
      </Box>
      {label && (
        <Text fontSize="xs" color="rgba(255, 255, 255, 0.5)" mt={1} textAlign="center">
          {label}
        </Text>
      )}
    </VStack>
  );
}
