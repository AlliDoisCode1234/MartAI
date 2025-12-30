'use client';

/**
 * EmptyState Component
 *
 * Component Hierarchy:
 * App → shared/EmptyState (this file)
 *
 * Displays a centered empty state with optional icon, message, and CTA.
 * Supports light and dark themes.
 *
 * @example
 * <EmptyState
 *   title="No keywords yet"
 *   message="Connect GSC or add keywords manually"
 *   actionLabel="Add Keywords"
 *   actionRoute="/studio/strategy"
 *   theme="dark"
 *   icon={<MartCharacter size="md" />}
 * />
 */

import { type FC, type ReactNode } from 'react';
import { Box, VStack, Heading, Text, Button, Container } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

type Props = {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionRoute?: string;
  fullPage?: boolean;
  icon?: ReactNode;
  theme?: 'light' | 'dark';
};

export const EmptyState: FC<Props> = ({
  title,
  message,
  actionLabel,
  onAction,
  actionRoute,
  fullPage = false,
  icon,
  theme = 'light',
}) => {
  const router = useRouter();
  const isDark = theme === 'dark';

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (actionRoute) {
      router.push(actionRoute);
    }
  };

  // Theme-aware styles
  const bgColor = isDark ? 'transparent' : 'brand.light';
  const titleColor = isDark ? 'white' : 'gray.800';
  const messageColor = isDark ? 'gray.400' : 'gray.600';
  const buttonColorScheme = isDark ? 'orange' : undefined;
  const buttonBg = isDark ? undefined : 'brand.orange';

  const containerProps = fullPage
    ? {
        minH: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }
    : {
        minH: 'calc(100vh - 200px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 12,
      };

  return (
    <Box bg={bgColor} {...containerProps}>
      <Container maxW="container.sm">
        <VStack spacing={6}>
          {icon}
          <Heading size="lg" textAlign="center" color={titleColor}>
            {title}
          </Heading>
          {message && (
            <Text color={messageColor} textAlign="center" maxW="md">
              {message}
            </Text>
          )}
          {(actionLabel || onAction || actionRoute) && (
            <Button
              colorScheme={buttonColorScheme}
              bg={buttonBg}
              color="white"
              onClick={handleAction}
              size="lg"
              px={8}
            >
              {actionLabel}
            </Button>
          )}
        </VStack>
      </Container>
    </Box>
  );
};
