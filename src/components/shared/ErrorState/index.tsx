'use client';

/**
 * ErrorState Component
 *
 * Component Hierarchy:
 * App → shared/ErrorState (this file)
 *
 * Displays an error alert with optional action button.
 * Supports light and dark themes.
 */

import { type FC } from 'react';
import { Box, Alert, AlertIcon, Button, Container, VStack, Text, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { FiAlertTriangle } from 'react-icons/fi';

type Props = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  actionRoute?: string;
  fullPage?: boolean;
  theme?: 'light' | 'dark';
};

export const ErrorState: FC<Props> = ({
  message,
  actionLabel = 'Go Back',
  onAction,
  actionRoute,
  fullPage = false,
  theme = 'light',
}) => {
  const router = useRouter();
  const isDark = theme === 'dark';

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (actionRoute) {
      router.push(actionRoute);
    } else {
      router.back();
    }
  };

  const containerProps = fullPage
    ? {
        minH: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }
    : {
        minH: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      };

  // Theme-aware styles
  const bgColor = isDark ? 'transparent' : 'brand.light';
  const cardBg = isDark ? 'rgba(30, 30, 30, 0.6)' : 'white';
  const textColor = isDark ? 'gray.300' : 'gray.700';
  const iconColor = isDark ? 'red.400' : 'red.500';

  if (isDark) {
    return (
      <Box bg={bgColor} {...containerProps}>
        <Container maxW="container.sm">
          <VStack
            spacing={4}
            p={8}
            bg={cardBg}
            borderRadius="xl"
            borderWidth="1px"
            borderColor="rgba(255, 255, 255, 0.1)"
            backdropFilter="blur(10px)"
          >
            <Icon as={FiAlertTriangle} boxSize={12} color={iconColor} />
            <Text color={textColor} textAlign="center">
              {message}
            </Text>
            <Button colorScheme="orange" onClick={handleAction}>
              {actionLabel}
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} {...containerProps}>
      <Container maxW="container.sm">
        <VStack spacing={4}>
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {message}
          </Alert>
          <Button bg="brand.orange" color="white" onClick={handleAction}>
            {actionLabel}
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};
