'use client';

import { useState, useEffect } from 'react';
import { Box, HStack, Text, Button, CloseButton, Icon, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

interface IntegrationPromptBannerProps {
  isConnected?: boolean;
  projectId?: string;
}

export function IntegrationPromptBanner({ isConnected, projectId }: IntegrationPromptBannerProps) {
  const [isDismissed, setIsDismissed] = useState(true); // Start hidden until we check
  const router = useRouter();
  const bgColor = useColorModeValue('blue.50', 'blue.900');
  const borderColor = useColorModeValue('blue.200', 'blue.700');

  useEffect(() => {
    // Check if user has dismissed this banner before
    const dismissed = localStorage.getItem('ga4_banner_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    } else if (!isConnected) {
      setIsDismissed(false);
    }
  }, [isConnected]);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('ga4_banner_dismissed', 'true');
  };

  const handleConnect = () => {
    router.push('/settings?tab=integrations');
  };

  // Don't show if connected or dismissed
  if (isConnected || isDismissed) {
    return null;
  }

  return (
    <Box bg={bgColor} borderWidth="1px" borderColor={borderColor} borderRadius="lg" p={4} mb={6}>
      <HStack justify="space-between" align="center" spacing={4}>
        <HStack spacing={3} flex={1}>
          <Text fontSize="xl">📊</Text>
          <Box>
            <Text fontWeight="semibold" color="blue.800">
              Unlock deeper insights!
            </Text>
            <Text fontSize="sm" color="blue.700">
              Connect Google Analytics to see real traffic data, keyword rankings, and AI-powered
              recommendations.
            </Text>
          </Box>
        </HStack>

        <HStack spacing={2}>
          <Button colorScheme="blue" size="sm" onClick={handleConnect} rightIcon={<Text>→</Text>}>
            Connect Now
          </Button>
          <CloseButton size="sm" onClick={handleDismiss} aria-label="Dismiss" />
        </HStack>
      </HStack>
    </Box>
  );
}

export default IntegrationPromptBanner;
