'use client';

/**
 * LoadingState Component
 *
 * Component Hierarchy:
 * App → shared/LoadingState (this file)
 *
 * Displays a centered loading spinner with optional message.
 * Supports light and dark themes for consistent UX across all pages.
 */

import { type FC } from 'react';
import { Box, Spinner, Text, VStack } from '@chakra-ui/react';

type Props = {
  message?: string;
  fullPage?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark';
};

export const LoadingState: FC<Props> = ({
  message,
  fullPage = false,
  size = 'xl',
  theme = 'light',
}) => {
  const isDark = theme === 'dark';

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
  const textColor = isDark ? 'gray.400' : 'gray.600';
  const spinnerColor = isDark ? 'orange.400' : 'brand.orange';

  return (
    <Box bg={bgColor} {...containerProps}>
      <VStack spacing={4}>
        <Spinner size={size} color={spinnerColor} thickness="4px" speed="0.8s" />
        {message && <Text color={textColor}>{message}</Text>}
      </VStack>
    </Box>
  );
};
