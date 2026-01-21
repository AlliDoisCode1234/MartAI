/**
 * MartGuide Component
 *
 * Component Hierarchy:
 * App → Layout → MartGuide (this file)
 *
 * MartAI mascot that guides users through the app.
 * Appears on first visit to each page, celebrates milestones.
 *
 * Reference: docs/project/USER_FLOW_LDD.md
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  Image,
  Slide,
  useDisclosure,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiArrowRight, FiMessageCircle } from 'react-icons/fi';
import { MartCharacter } from '@/src/components/assistant';

const MotionBox = motion(Box);

// Mart's messages per page
const MART_MESSAGES: Record<string, { greeting: string; tip: string; action?: string }> = {
  '/dashboard': {
    greeting: "Welcome back! Let's check your progress.",
    tip: 'Your dashboard shows keyword opportunities and content status.',
    action: 'View Keywords',
  },
  '/strategy': {
    greeting: 'Time to build your content strategy!',
    tip: 'Start by adding keywords, then cluster them into topics.',
    action: 'Add Keywords',
  },
  '/keywords': {
    greeting: "Let's find keywords that rank!",
    tip: 'Focus on high PR Score keywords for quick wins.',
    action: 'Import from GSC',
  },
  '/calendar': {
    greeting: 'Plan your content schedule!',
    tip: 'Consistent publishing (2-4x/week) drives best results.',
    action: 'Create Brief',
  },
  '/content': {
    greeting: 'Ready to write great content!',
    tip: "I'll help generate outlines and drafts for you.",
    action: 'Start Writing',
  },
  '/settings': {
    greeting: 'Connect your tools!',
    tip: 'GSC gives keyword data, WordPress enables one-click publish.',
    action: 'Connect GSC',
  },
};

// Celebration messages for phase transitions
const CELEBRATIONS: Record<number, { title: string; message: string }> = {
  3: { title: 'Discovery Unlocked!', message: 'You can now access keywords and strategy.' },
  4: { title: 'Planning Mode!', message: 'Calendar is now available. Time to schedule!' },
  5: { title: 'Creation Time!', message: 'Content studio unlocked. Start writing!' },
  6: { title: 'Full Access!', message: "You've unlocked everything. Welcome to pro mode!" },
};

interface Props {
  currentPath: string;
  phase: number;
  previousPhase?: number;
  onDismiss?: () => void;
  isFirstVisit?: boolean;
}

export function MartGuide({
  currentPath,
  phase,
  previousPhase,
  onDismiss,
  isFirstVisit = false,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: isFirstVisit });
  const [showCelebration, setShowCelebration] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Check for phase transition celebration
  useEffect(() => {
    if (previousPhase && phase > previousPhase && CELEBRATIONS[phase]) {
      setShowCelebration(true);
      // Auto-hide celebration after 5 seconds
      const timer = setTimeout(() => setShowCelebration(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [phase, previousPhase]);

  const message = MART_MESSAGES[currentPath] || MART_MESSAGES['/dashboard'];
  const celebration = CELEBRATIONS[phase];

  const handleDismiss = () => {
    setDismissed(true);
    onClose();
    onDismiss?.();
  };

  if (dismissed && !showCelebration) {
    return <MartMinimized onOpen={() => setDismissed(false)} />;
  }

  return (
    <>
      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && celebration && (
          <MotionBox
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            position="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            zIndex={1100}
            bg="white"
            borderRadius="2xl"
            boxShadow="2xl"
            p={8}
            textAlign="center"
          >
            <VStack spacing={4}>
              <Text fontSize="4xl">{celebration.title}</Text>
              <Text color="gray.600">{celebration.message}</Text>
              <Button colorScheme="orange" onClick={() => setShowCelebration(false)}>
                Let's Go!
              </Button>
            </VStack>
          </MotionBox>
        )}
      </AnimatePresence>

      {/* Mart Guide Slide */}
      <Slide direction="bottom" in={isOpen && !showCelebration} style={{ zIndex: 1000 }}>
        <Box
          position="fixed"
          bottom={4}
          left={4}
          maxW="360px"
          bg="white"
          borderRadius="xl"
          boxShadow="xl"
          border="1px"
          borderColor="orange.200"
          overflow="hidden"
        >
          {/* Header */}
          <HStack
            bg="orange.50"
            px={4}
            py={2}
            justify="space-between"
            borderBottom="1px"
            borderColor="orange.100"
          >
            <HStack spacing={2}>
              <Box w="40px" h="40px" display="flex" alignItems="center" justifyContent="center">
                <MartCharacter size="xs" showBubble={false} />
              </Box>
              <Text fontWeight="semibold" color="orange.700">
                Phoo
              </Text>
            </HStack>
            <IconButton
              aria-label="Dismiss"
              icon={<FiX />}
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
            />
          </HStack>

          {/* Body */}
          <VStack align="stretch" spacing={3} p={4}>
            <Text fontWeight="medium" color="gray.800">
              {message.greeting}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {message.tip}
            </Text>
            {message.action && (
              <Button
                colorScheme="orange"
                size="sm"
                rightIcon={<FiArrowRight />}
                alignSelf="flex-start"
              >
                {message.action}
              </Button>
            )}
          </VStack>
        </Box>
      </Slide>
    </>
  );
}

/**
 * Minimized Mart button when guide is dismissed
 */
function MartMinimized({ onOpen }: { onOpen: () => void }) {
  return (
    <MotionBox
      position="fixed"
      bottom={4}
      left={4}
      zIndex={1000}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
    >
      <IconButton
        aria-label="Open Phoo Guide"
        icon={<FiMessageCircle />}
        colorScheme="orange"
        borderRadius="full"
        size="lg"
        boxShadow="lg"
        onClick={onOpen}
      />
    </MotionBox>
  );
}

/**
 * Hook to track first visits per page
 */
export function useFirstVisit(pageKey: string): boolean {
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    const visitedPages = JSON.parse(localStorage.getItem('phoo_visited_pages') || '[]');
    if (!visitedPages.includes(pageKey)) {
      setIsFirstVisit(true);
      localStorage.setItem('phoo_visited_pages', JSON.stringify([...visitedPages, pageKey]));
    }
  }, [pageKey]);

  return isFirstVisit;
}
