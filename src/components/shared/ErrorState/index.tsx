'use client';

import { type FC, type ReactNode } from 'react';
import { Box, Alert, AlertIcon, Button, Container, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

type ErrorStateProps = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  actionRoute?: string;
  fullPage?: boolean;
};

export const ErrorState: FC<ErrorStateProps> = ({
  message,
  actionLabel = 'Go Back',
  onAction,
  actionRoute,
  fullPage = false,
}) => {
  const router = useRouter();

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

  return (
    <Box bg="brand.light" {...containerProps}>
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

