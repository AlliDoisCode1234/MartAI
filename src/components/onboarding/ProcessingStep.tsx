'use client';

/**
 * ProcessingStep Component
 *
 * Component Hierarchy:
 * App → Onboarding → ProcessingStep (this file)
 *
 * Step 5: Processing/analyzing state.
 */

import { Box, VStack, HStack, Heading, Text, Badge } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiZap, FiTrendingUp } from 'react-icons/fi';
import { MartCharacter } from '@/src/components/assistant';

const MotionBox = motion(Box);

export function ProcessingStep() {
  return (
    <MotionBox
      key="step5"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Box bg="white" p={12} borderRadius="2xl" shadow="lg" textAlign="center">
        <VStack spacing={6}>
          <MartCharacter state="loading" size="lg" showBubble={false} />
          <Heading size="lg">Phoo is analyzing your site...</Heading>
          <Text color="gray.600">
            Finding keywords, analyzing competitors, and building your strategy.
          </Text>
          <HStack spacing={4} pt={4}>
            <Badge colorScheme="green" px={3} py={1}>
              <HStack spacing={1}>
                <FiZap />
                <Text>Crawling pages</Text>
              </HStack>
            </Badge>
            <Badge colorScheme="blue" px={3} py={1}>
              <HStack spacing={1}>
                <FiTrendingUp />
                <Text>Finding keywords</Text>
              </HStack>
            </Badge>
          </HStack>
        </VStack>
      </Box>
    </MotionBox>
  );
}
