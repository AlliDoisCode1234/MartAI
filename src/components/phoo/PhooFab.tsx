/**
 * PhooFab - Floating Action Button for Phoo
 *
 * Component Hierarchy:
 * App → Layout → PhooFab (this file)
 *
 * Behavior:
 * - Guest: Opens chat drawer (marketing mode)
 * - Logged in: Navigates to /assistant
 * - Can be minimized but not dismissed
 */

'use client';

import { useState } from 'react';
import { Box, IconButton, Tooltip } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FiMessageCircle, FiMinus } from 'react-icons/fi';
import { useAuth } from '@/lib/useAuth';
import { MartCharacter } from '@/src/components/assistant';

const MotionBox = motion(Box);

interface Props {
  onOpenDrawer?: () => void;
}

export default function PhooFab({ onOpenDrawer }: Props) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isMinimized, setIsMinimized] = useState(false);

  const handleClick = () => {
    if (isAuthenticated) {
      // Logged in: navigate to assistant page
      router.push('/assistant');
    } else {
      // Guest: open marketing drawer
      onOpenDrawer?.();
    }
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(true);
  };

  const handleRestore = () => {
    setIsMinimized(false);
  };

  if (loading) return null;

  return (
    <AnimatePresence mode="wait">
      {isMinimized ? (
        // Minimized state - small pill
        <MotionBox
          key="minimized"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          position="fixed"
          bottom={4}
          left={4}
          zIndex={1000}
        >
          <Tooltip label="Open Phoo" hasArrow>
            <IconButton
              aria-label="Open Phoo"
              icon={<FiMessageCircle />}
              size="sm"
              colorScheme="teal"
              borderRadius="full"
              boxShadow="md"
              onClick={handleRestore}
            />
          </Tooltip>
        </MotionBox>
      ) : (
        // Full FAB with MartCharacter
        <MotionBox
          key="full"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          position="fixed"
          bottom={4}
          left={4}
          zIndex={1000}
        >
          <Box
            bg="white"
            borderRadius="2xl"
            boxShadow="xl"
            p={2}
            cursor="pointer"
            onClick={handleClick}
            position="relative"
            transition="all 0.2s"
            _hover={{ boxShadow: '2xl', transform: 'scale(1.02)' }}
          >
            {/* Minimize button */}
            <IconButton
              aria-label="Minimize"
              icon={<FiMinus />}
              size="xs"
              variant="ghost"
              position="absolute"
              top={1}
              right={1}
              onClick={handleMinimize}
              zIndex={1}
            />

            {/* MartCharacter animation */}
            <Box w="60px" h="60px" display="flex" alignItems="center" justifyContent="center">
              <MartCharacter size="xs" showBubble={false} />
            </Box>

            {/* Tooltip text */}
            <Box
              position="absolute"
              bottom="-24px"
              left="50%"
              transform="translateX(-50%)"
              bg="gray.800"
              color="white"
              px={2}
              py={1}
              borderRadius="md"
              fontSize="xs"
              whiteSpace="nowrap"
              opacity={0.9}
            >
              {isAuthenticated ? 'Ask Phoo' : 'Need help?'}
            </Box>
          </Box>
        </MotionBox>
      )}
    </AnimatePresence>
  );
}
