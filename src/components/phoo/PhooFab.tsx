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
import { Box, IconButton, Text, Tooltip } from '@chakra-ui/react';
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
      router.push('/assistant');
    } else {
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
        <MotionBox
          key="minimized"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          position="fixed"
          bottom={{ base: '72px', md: 4 }}
          right={4}
          zIndex={1000}
        >
          <Tooltip label="Open Phoo" hasArrow>
            <IconButton
              aria-label="Open Phoo"
              icon={<FiMessageCircle />}
              size="sm"
              bg="brand.orange"
              color="white"
              borderRadius="full"
              boxShadow="0 4px 20px rgba(237, 137, 54, 0.4)"
              border="1px solid"
              borderColor="orange.300"
              onClick={handleRestore}
              _hover={{
                bg: 'orange.500',
                boxShadow: '0 6px 24px rgba(237, 137, 54, 0.5)',
              }}
            />
          </Tooltip>
        </MotionBox>
      ) : (
        <MotionBox
          key="full"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          position="fixed"
          bottom={{ base: '72px', md: 4 }}
          right={4}
          zIndex={1000}
        >
          <Box
            bg="white"
            borderRadius="2xl"
            boxShadow="0 8px 32px rgba(0, 0, 0, 0.12)"
            border="2px solid"
            borderColor="brand.orange"
            px={3}
            pt={4}
            pb={2}
            cursor="pointer"
            onClick={handleClick}
            position="relative"
            transition="all 0.3s ease"
            _hover={{
              boxShadow: '0 12px 40px rgba(237, 137, 54, 0.3)',
            }}
          >
            {/* Minimize button */}
            <IconButton
              aria-label="Minimize"
              icon={<FiMinus />}
              size="xs"
              variant="ghost"
              color="gray.400"
              position="absolute"
              top={1}
              right={1}
              onClick={handleMinimize}
              zIndex={1}
              _hover={{ color: 'gray.600', bg: 'gray.100' }}
            />

            {/* MartCharacter orb */}
            <Box
              w="56px"
              h="56px"
              mx="auto"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <MartCharacter size="xs" showBubble={false} />
            </Box>

            {/* Label */}
            <Text
              textAlign="center"
              fontSize="xs"
              fontWeight="semibold"
              color="brand.orange"
              mt={1}
              letterSpacing="0.02em"
            >
              {isAuthenticated ? 'Ask Phoo' : 'Need help?'}
            </Text>
          </Box>
        </MotionBox>
      )}
    </AnimatePresence>
  );
}
