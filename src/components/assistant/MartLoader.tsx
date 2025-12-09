'use client';

import { MartCharacter } from './MartCharacter';
import { Box, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface MartLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * MartLoader - Use this instead of Spinner for page loading states
 * Uses the Mart particle animation in loading state
 */
export function MartLoader({ message, size = 'md' }: MartLoaderProps) {
  return (
    <VStack spacing={4} py={8}>
      <MartCharacter size={size} state="loading" showBubble={false} />
      {message && (
        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <Text fontSize="sm" color="gray.500" textAlign="center" fontWeight="medium">
            {message}
          </Text>
        </MotionBox>
      )}
    </VStack>
  );
}
