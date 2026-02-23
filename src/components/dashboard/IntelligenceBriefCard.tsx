'use client';

/**
 * IntelligenceBriefCard Component
 *
 * Component Hierarchy:
 * App → Dashboard → IntelligenceBriefCard (this file)
 *
 * Translates granular SEO data into a single plain-English paragraph for Business Owners.
 */

import { Box, HStack, Heading, Text, Icon, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiZap } from 'react-icons/fi';
import { STUDIO_COLORS } from '@/lib/constants/studioTokens';

const MotionBox = motion(Box);

type Props = {
  hasData: boolean;
  sessionsChange: number;
  quickWinCount: number;
  pendingDrafts: number;
};

export function IntelligenceBriefCard({
  hasData,
  sessionsChange,
  quickWinCount,
  pendingDrafts,
}: Props) {
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.03)', 'rgba(30, 30, 30, 0.6)');

  let briefText = '';

  if (!hasData) {
    briefText =
      "Welcome to Phoo! We're warming up your SEO engine. While we wait for Google to sync your data, let's start building your content foundation.";
  } else if (sessionsChange > 0) {
    briefText = `Your organic traffic grew by ${Math.abs(sessionsChange)}% recently. Great job! To keep this momentum going, we've identified ${quickWinCount} new keywords you can rank for fast. You also have ${pendingDrafts} drafts waiting for review.`;
  } else if (sessionsChange < 0) {
    briefText = `Your organic traffic dipped by ${Math.abs(sessionsChange)}% recently. The fastest way to recover is to publish consistently. We recommend generating articles for your top ${quickWinCount} quick win keywords today.`;
  } else {
    briefText = `Your traffic is holding steady. Breakout growth requires fresh content. Let's publish articles for your ${quickWinCount} quick win opportunities to capture more searches.`;
  }

  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      bg="linear-gradient(135deg, rgba(249, 159, 42, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)"
      borderWidth="1px"
      borderColor="rgba(249, 159, 42, 0.3)"
      borderRadius="xl"
      p={{ base: 5, md: 6 }}
      position="relative"
      overflow="hidden"
      h="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Box
        position="absolute"
        top="-20px"
        right="-20px"
        w="100px"
        h="100px"
        bg="radial-gradient(circle, rgba(249, 159, 42, 0.2) 0%, transparent 70%)"
        borderRadius="full"
        filter="blur(20px)"
      />

      <HStack mb={4}>
        <Box
          bg="rgba(249, 159, 42, 0.2)"
          borderRadius="full"
          p={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={FiZap} color={STUDIO_COLORS.amber} />
        </Box>
        <Heading size="sm" color="white">
          Phoo Intelligence Brief
        </Heading>
      </HStack>

      <Text color="gray.300" fontSize="md" lineHeight="tall" fontWeight="medium">
        {briefText}
      </Text>
    </MotionBox>
  );
}
