'use client';

/**
 * StatBadge
 *
 * Component Hierarchy:
 * App -> HeroSection -> ProductScreenshot -> StatBadge
 *
 * Small floating stat card that appears around product screenshots.
 * Glassmorphic pill design with subtle float animation.
 */

import { type FC } from 'react';
import { HStack, Text, Icon, Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { type ComponentType } from 'react';

const MotionBox = motion(Box);

interface Props {
  label: string;
  value: string;
  icon?: ComponentType;
  color?: string;
}

export const StatBadge: FC<Props> = ({ label, value, icon, color = 'brand.orange' }) => {
  return (
    <MotionBox
      animate={{ y: [0, -6, 0] }}
      // @ts-ignore - framer-motion transition type
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <HStack
        spacing={2}
        px={4}
        py={2.5}
        bg="rgba(255, 255, 255, 0.92)"
        backdropFilter="blur(12px)"
        borderRadius="full"
        border="1px solid"
        borderColor="gray.200"
        boxShadow="0 8px 32px rgba(0, 0, 0, 0.08)"
      >
        {icon && <Icon as={icon} boxSize={4} color={color} />}
        <Text fontSize="xs" fontWeight="bold" color={color}>
          {value}
        </Text>
        <Text fontSize="xs" color="gray.500">
          {label}
        </Text>
      </HStack>
    </MotionBox>
  );
};
