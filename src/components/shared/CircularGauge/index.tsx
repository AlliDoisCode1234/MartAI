'use client';

import { Box, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';

interface CircularGaugeProps {
  /** Value from 0-100 */
  value: number;
  /** Size in pixels */
  size?: number;
  /** Stroke width in pixels */
  strokeWidth?: number;
  /** Unique ID for gradient (required for multiple gauges on page) */
  gradientId?: string;
  /** Gradient colors [start, middle, end] */
  colors?: [string, string, string];
  /** Animation duration in seconds */
  animationDuration?: number;
}

/**
 * Animated circular progress gauge with gradient stroke.
 * Reusable for any percentage-based visualizations.
 */
export function CircularGauge({
  value,
  size = 180,
  strokeWidth = 12,
  gradientId = 'gauge-gradient',
  colors = ['#38A169', '#4299E1', '#9F7AEA'],
  animationDuration = 1.5,
}: CircularGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (Math.min(Math.max(value, 0), 100) / 100) * circumference;
  const bgStroke = useColorModeValue('#E2E8F0', '#2D3748');

  return (
    <Box position="relative" w={`${size}px`} h={`${size}px`}>
      <svg width={size} height={size}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="50%" stopColor={colors[1]} />
            <stop offset="100%" stopColor={colors[2]} />
          </linearGradient>
        </defs>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgStroke}
          strokeWidth={strokeWidth}
        />
        {/* Animated progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: animationDuration, ease: 'easeOut' }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
    </Box>
  );
}
