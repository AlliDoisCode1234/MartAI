'use client';

import { type FC } from 'react';
import { Box, Spinner, Text, VStack } from '@chakra-ui/react';

type LoadingStateProps = {
  message?: string;
  fullPage?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

export const LoadingState: FC<LoadingStateProps> = ({
  message,
  fullPage = false,
  size = 'xl',
}) => {
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

  return (
    <Box bg="brand.light" {...containerProps}>
      <VStack spacing={4}>
        <Spinner size={size} color="brand.orange" thickness="4px" speed="0.8s" />
        {message && <Text color="gray.600">{message}</Text>}
      </VStack>
    </Box>
  );
};

