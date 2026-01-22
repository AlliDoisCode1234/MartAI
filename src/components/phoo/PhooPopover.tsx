/**
 * PhooPopover - Intercom-style chat popup
 *
 * Component Hierarchy:
 * App → Layout → PhooPopover (this file)
 *
 * Features:
 * - Floating popup that overlays current page
 * - Can be minimized while browsing
 * - Remembers conversation in session
 * - Works for both guests and authenticated users
 */

'use client';

import { Box, VStack, HStack, Text, IconButton, Button, Collapse } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMinus, FiMaximize2, FiExternalLink } from 'react-icons/fi';
import Link from 'next/link';
import { useAuth } from '@/lib/useAuth';
import { useProject } from '@/lib/hooks';
import { PhooChatWidget } from '@/src/components/phoo';
import { MartCharacter } from '@/src/components/assistant';
import { Id } from '@/convex/_generated/dataModel';

const MotionBox = motion(Box);

interface Props {
  isOpen: boolean;
  isMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}

export default function PhooPopover({
  isOpen,
  isMinimized,
  onClose,
  onMinimize,
  onMaximize,
}: Props) {
  const { isAuthenticated } = useAuth();
  const { projectId } = useProject(null, { autoSelect: true });
  const typedProjectId = projectId as Id<'projects'> | null;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <MotionBox
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        position="fixed"
        bottom={isMinimized ? 4 : 6}
        left={isMinimized ? 4 : 6}
        zIndex={1100}
        w={isMinimized ? 'auto' : { base: 'calc(100vw - 48px)', sm: '400px' }}
        maxW="400px"
        maxH={isMinimized ? 'auto' : '600px'}
        bg="gray.900"
        borderRadius="2xl"
        boxShadow="2xl"
        overflow="hidden"
        border="1px solid"
        borderColor="whiteAlpha.200"
      >
        {/* Header */}
        <HStack
          px={4}
          py={3}
          bg="gray.800"
          borderBottom={isMinimized ? 'none' : '1px solid'}
          borderColor="whiteAlpha.100"
          justify="space-between"
          cursor={isMinimized ? 'pointer' : 'default'}
          onClick={isMinimized ? onMaximize : undefined}
          _hover={isMinimized ? { bg: 'gray.700' } : undefined}
          transition="background 0.2s"
        >
          <HStack spacing={3}>
            <Box w="32px" h="32px">
              <MartCharacter size="xs" showBubble={false} />
            </Box>
            <VStack spacing={0} align="start">
              <Text fontWeight="bold" color="white" fontSize="sm">
                Ask Phoo
              </Text>
              {!isMinimized && (
                <Text fontSize="xs" color="gray.400">
                  Your AI SEO Assistant
                </Text>
              )}
            </VStack>
          </HStack>

          <HStack spacing={1}>
            {!isMinimized && (
              <>
                {/* Open full experience */}
                <Link href="/assistant" style={{ textDecoration: 'none' }}>
                  <IconButton
                    aria-label="Open full experience"
                    icon={<FiExternalLink />}
                    size="sm"
                    variant="ghost"
                    color="gray.400"
                    _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
                  />
                </Link>
                {/* Minimize */}
                <IconButton
                  aria-label="Minimize"
                  icon={<FiMinus />}
                  size="sm"
                  variant="ghost"
                  color="gray.400"
                  _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
                  onClick={onMinimize}
                />
              </>
            )}
            {isMinimized && (
              <IconButton
                aria-label="Expand"
                icon={<FiMaximize2 />}
                size="sm"
                variant="ghost"
                color="gray.400"
                _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onMaximize();
                }}
              />
            )}
            {/* Close */}
            <IconButton
              aria-label="Close chat"
              icon={<FiX />}
              size="sm"
              variant="ghost"
              color="gray.400"
              _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            />
          </HStack>
        </HStack>

        {/* Chat Content - only visible when not minimized */}
        <Collapse in={!isMinimized} animateOpacity>
          <Box h="500px" overflow="hidden">
            <PhooChatWidget
              projectId={typedProjectId ?? undefined}
              isAuthenticated={isAuthenticated}
            />
          </Box>
        </Collapse>
      </MotionBox>
    </AnimatePresence>
  );
}
