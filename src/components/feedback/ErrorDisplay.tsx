/**
 * Error Handling Components
 *
 * Component Hierarchy:
 * App → ErrorBoundary → ErrorDisplay (this file)
 *
 * User-friendly error messages with recovery actions.
 * Non-blaming tone, clear next steps.
 *
 * Reference: docs/project/USER_FLOW_LDD.md
 */

'use client';

import { Box, VStack, HStack, Text, Button, Icon, Alert, AlertIcon, Code } from '@chakra-ui/react';
import { FiRefreshCw, FiMessageCircle, FiWifi, FiAlertTriangle, FiClock } from 'react-icons/fi';
import type { IconType } from 'react-icons';

// Error type configurations
const ERROR_CONFIGS: Record<
  string,
  {
    icon: IconType;
    title: string;
    message: string;
    recoveryAction: string;
    colorScheme: string;
  }
> = {
  gsc_oauth: {
    icon: FiAlertTriangle,
    title: 'GSC Connection Issue',
    message:
      "We couldn't connect to Google Search Console. This sometimes happens with expired tokens.",
    recoveryAction: 'Reconnect GSC',
    colorScheme: 'yellow',
  },
  ga4_oauth: {
    icon: FiAlertTriangle,
    title: 'GA4 Connection Issue',
    message: "We couldn't connect to Google Analytics. Let's try reconnecting.",
    recoveryAction: 'Reconnect GA4',
    colorScheme: 'yellow',
  },
  ai_timeout: {
    icon: FiClock,
    title: 'AI Request Timed Out',
    message: 'The AI is taking longer than usual. This might be due to high demand.',
    recoveryAction: 'Try Again',
    colorScheme: 'orange',
  },
  wordpress_publish: {
    icon: FiAlertTriangle,
    title: 'WordPress Publish Failed',
    message: "We couldn't publish to WordPress. Check your connection settings.",
    recoveryAction: 'Check Settings',
    colorScheme: 'red',
  },
  network: {
    icon: FiWifi,
    title: 'Connection Issue',
    message: "We're having trouble connecting. Check your internet connection.",
    recoveryAction: 'Retry',
    colorScheme: 'gray',
  },
  rate_limit: {
    icon: FiClock,
    title: 'Slow Down!',
    message: "You're moving fast! Please wait a moment before trying again.",
    recoveryAction: 'Wait & Retry',
    colorScheme: 'blue',
  },
  unknown: {
    icon: FiAlertTriangle,
    title: 'Something Went Wrong',
    message: 'We hit an unexpected issue. Our team has been notified.',
    recoveryAction: 'Try Again',
    colorScheme: 'red',
  },
};

type ErrorType = keyof typeof ERROR_CONFIGS;

interface Props {
  type?: ErrorType;
  customMessage?: string;
  errorDetails?: string;
  onRetry?: () => void;
  onContact?: () => void;
  showDetails?: boolean;
}

export function ErrorDisplay({
  type = 'unknown',
  customMessage,
  errorDetails,
  onRetry,
  onContact,
  showDetails = false,
}: Props) {
  const config = ERROR_CONFIGS[type] || ERROR_CONFIGS.unknown;

  return (
    <Box
      bg="white"
      borderRadius="xl"
      boxShadow="md"
      border="1px"
      borderColor={`${config.colorScheme}.200`}
      p={6}
      maxW="400px"
      mx="auto"
    >
      <VStack spacing={4} textAlign="center">
        {/* Icon */}
        <Box
          w="64px"
          h="64px"
          borderRadius="full"
          bg={`${config.colorScheme}.50`}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={config.icon} boxSize={8} color={`${config.colorScheme}.500`} />
        </Box>

        {/* Message */}
        <VStack spacing={1}>
          <Text fontWeight="semibold" color="gray.800">
            {config.title}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {customMessage || config.message}
          </Text>
        </VStack>

        {/* Error Details (optional) */}
        {showDetails && errorDetails && (
          <Code fontSize="xs" p={2} borderRadius="md" maxW="100%" overflow="auto">
            {errorDetails}
          </Code>
        )}

        {/* Actions */}
        <HStack spacing={3}>
          {onRetry && (
            <Button
              colorScheme={config.colorScheme}
              size="sm"
              leftIcon={<FiRefreshCw />}
              onClick={onRetry}
            >
              {config.recoveryAction}
            </Button>
          )}
          {onContact && (
            <Button variant="outline" size="sm" leftIcon={<FiMessageCircle />} onClick={onContact}>
              Contact Support
            </Button>
          )}
        </HStack>
      </VStack>
    </Box>
  );
}

/**
 * Inline error alert for forms/sections
 */
interface InlineErrorProps {
  message: string;
  onRetry?: () => void;
}

export function InlineError({ message, onRetry }: InlineErrorProps) {
  return (
    <Alert status="error" borderRadius="md" variant="left-accent">
      <AlertIcon />
      <HStack justify="space-between" w="full">
        <Text fontSize="sm">{message}</Text>
        {onRetry && (
          <Button size="xs" variant="ghost" leftIcon={<FiRefreshCw />} onClick={onRetry}>
            Retry
          </Button>
        )}
      </HStack>
    </Alert>
  );
}

/**
 * Toast-style error notification
 */
export function useErrorToast() {
  // This would integrate with Chakra's useToast
  // Implementation depends on existing toast setup
  return {
    showError: (type: ErrorType, onRetry?: () => void) => {
      const config = ERROR_CONFIGS[type] || ERROR_CONFIGS.unknown;
      // Would call toast() here
      console.log('Error toast:', config.title, config.message);
    },
  };
}

/**
 * Map API errors to error types
 */
export function getErrorType(error: unknown): ErrorType {
  if (!error) return 'unknown';

  const message = error instanceof Error ? error.message : String(error);

  if (message.includes('GSC') || message.includes('Search Console')) return 'gsc_oauth';
  if (message.includes('GA4') || message.includes('Analytics')) return 'ga4_oauth';
  if (message.includes('timeout') || message.includes('TIMEOUT')) return 'ai_timeout';
  if (message.includes('WordPress') || message.includes('publish')) return 'wordpress_publish';
  if (message.includes('network') || message.includes('fetch')) return 'network';
  if (message.includes('rate limit') || message.includes('429')) return 'rate_limit';

  return 'unknown';
}
