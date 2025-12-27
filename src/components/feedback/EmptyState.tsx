/**
 * Empty State Components
 *
 * Component Hierarchy:
 * App → Page → EmptyState (this file)
 *
 * Consistent empty state designs per LDD.
 * Shows Mart illustration, helpful message, and CTA.
 *
 * Reference: docs/project/USER_FLOW_LDD.md
 */

'use client';

import { Box, VStack, Text, Button, Icon, Heading } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiLayers,
  FiCalendar,
  FiTrendingUp,
  FiFileText,
  FiPlusCircle,
  FiRefreshCw,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { MartCharacter } from '@/src/components/assistant';

const MotionBox = motion(Box);

// Empty state configurations per page
const EMPTY_STATES = {
  keywords: {
    icon: FiSearch,
    title: 'No keywords yet',
    message:
      "Connect GSC to import keywords, or add them manually. I'll find ranking opportunities!",
    cta: 'Add Keywords',
    ctaIcon: FiPlusCircle,
  },
  strategy: {
    icon: FiLayers,
    title: 'No topic clusters yet',
    message: "Once you have 10+ keywords, I'll group them into smart topic clusters.",
    cta: 'Generate Clusters',
    ctaIcon: FiRefreshCw,
  },
  calendar: {
    icon: FiCalendar,
    title: 'Calendar is empty',
    message: "Create briefs from your clusters and I'll schedule them optimally.",
    cta: 'Create First Brief',
    ctaIcon: FiPlusCircle,
  },
  analytics: {
    icon: FiTrendingUp,
    title: 'No analytics data yet',
    message: 'Connect GA4 to see traffic trends and content performance.',
    cta: 'Connect GA4',
    ctaIcon: FiPlusCircle,
  },
  content: {
    icon: FiFileText,
    title: 'No content yet',
    message: "Your briefs and articles will appear here. Let's create your first one!",
    cta: 'Start Writing',
    ctaIcon: FiPlusCircle,
  },
} as const;

type EmptyStateType = keyof typeof EMPTY_STATES;

interface Props {
  type: EmptyStateType;
  onAction?: () => void;
  customMessage?: string;
  customCta?: string;
}

export function EmptyState({ type, onAction, customMessage, customCta }: Props) {
  const config = EMPTY_STATES[type];

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      py={12}
      px={6}
    >
      <VStack spacing={6} textAlign="center" maxW="400px" mx="auto">
        {/* Mart Illustration */}
        <Box
          w="120px"
          h="120px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
        >
          <MartCharacter size="xs" showBubble={false} />
          <Box position="absolute" bottom={0} right={0}>
            <Icon as={config.icon} boxSize={6} color="orange.400" />
          </Box>
        </Box>

        {/* Message */}
        <VStack spacing={2}>
          <Heading size="md" color="gray.700">
            {config.title}
          </Heading>
          <Text color="gray.500" fontSize="sm" maxW="320px">
            {customMessage || config.message}
          </Text>
        </VStack>

        {/* CTA Button */}
        {onAction && (
          <Button
            colorScheme="orange"
            size="lg"
            leftIcon={<Icon as={config.ctaIcon} />}
            onClick={onAction}
          >
            {customCta || config.cta}
          </Button>
        )}
      </VStack>
    </MotionBox>
  );
}

/**
 * Compact empty state for cards/sections
 */
interface CompactEmptyStateProps {
  icon?: IconType;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function CompactEmptyState({
  icon = FiFileText,
  message,
  actionLabel,
  onAction,
}: CompactEmptyStateProps) {
  return (
    <VStack spacing={3} py={6} px={4} textAlign="center">
      <Icon as={icon} boxSize={8} color="gray.300" />
      <Text fontSize="sm" color="gray.500">
        {message}
      </Text>
      {actionLabel && onAction && (
        <Button size="sm" variant="outline" colorScheme="orange" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </VStack>
  );
}

/**
 * Loading empty state with skeleton
 */
export function LoadingEmptyState({ message = 'Loading...' }: { message?: string }) {
  return (
    <VStack spacing={4} py={12} textAlign="center">
      <MotionBox
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <Icon as={FiRefreshCw} boxSize={8} color="orange.400" />
      </MotionBox>
      <Text color="gray.500">{message}</Text>
    </VStack>
  );
}
