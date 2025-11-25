'use client';

import { type FC, type ReactNode } from 'react';
import { Box, VStack, Heading, Text, Button, Container } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

type EmptyStateProps = {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionRoute?: string;
  fullPage?: boolean;
  icon?: ReactNode;
};

export const EmptyState: FC<EmptyStateProps> = ({
  title,
  message,
  actionLabel,
  onAction,
  actionRoute,
  fullPage = false,
  icon,
}) => {
  const router = useRouter();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (actionRoute) {
      router.push(actionRoute);
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
        <VStack spacing={6}>
          {icon}
          <Heading size="lg" textAlign="center">
            {title}
          </Heading>
          {message && (
            <Text color="gray.600" textAlign="center">
              {message}
            </Text>
          )}
          {(actionLabel || onAction || actionRoute) && (
            <Button bg="brand.orange" color="white" onClick={handleAction}>
              {actionLabel}
            </Button>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

