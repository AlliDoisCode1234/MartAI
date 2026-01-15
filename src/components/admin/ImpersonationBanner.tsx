'use client';

/**
 * ImpersonationBanner Component
 *
 * Component Hierarchy:
 * App → Layout → ImpersonationBanner (this file)
 *
 * Displays a prominent banner when an admin is impersonating a user.
 * MUST be always visible and unmissable per security requirements.
 */

import { Box, HStack, Text, Button, Icon, Flex } from '@chakra-ui/react';
import { FiAlertTriangle, FiX, FiUser, FiClock } from 'react-icons/fi';
import { useImpersonation } from '@/lib/hooks/useImpersonation';
import { formatDistanceToNow } from 'date-fns';

export function ImpersonationBanner() {
  const { isImpersonating, targetUser, endImpersonation, expiresAt } = useImpersonation();

  if (!isImpersonating || !targetUser) {
    return null;
  }

  const timeRemaining = expiresAt
    ? formatDistanceToNow(expiresAt, { addSuffix: false })
    : 'unknown';

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={9999}
      bg="red.600"
      color="white"
      py={2}
      px={4}
      boxShadow="0 2px 8px rgba(0,0,0,0.3)"
    >
      <Flex justify="space-between" align="center" maxW="container.xl" mx="auto">
        {/* Warning */}
        <HStack spacing={3}>
          <Icon as={FiAlertTriangle} boxSize={5} />
          <Text fontWeight="bold" fontSize="sm">
            IMPERSONATING USER
          </Text>
        </HStack>

        {/* Target User Info */}
        <HStack spacing={4}>
          <HStack spacing={2}>
            <Icon as={FiUser} boxSize={4} />
            <Text fontSize="sm" fontWeight="medium">
              {targetUser.name ?? targetUser.email}
            </Text>
            {targetUser.email && targetUser.name && (
              <Text fontSize="xs" opacity={0.8}>
                ({targetUser.email})
              </Text>
            )}
          </HStack>

          {/* Time remaining */}
          <HStack spacing={1} opacity={0.9}>
            <Icon as={FiClock} boxSize={3} />
            <Text fontSize="xs">{timeRemaining} remaining</Text>
          </HStack>
        </HStack>

        {/* Exit Button */}
        <Button
          size="sm"
          colorScheme="whiteAlpha"
          leftIcon={<Icon as={FiX} />}
          onClick={() => endImpersonation()}
          _hover={{ bg: 'whiteAlpha.300' }}
        >
          Exit Impersonation
        </Button>
      </Flex>
    </Box>
  );
}
