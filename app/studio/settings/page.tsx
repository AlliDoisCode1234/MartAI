'use client';

/**
 * Settings Page (Coming Soon)
 *
 * Component Hierarchy:
 * App → StudioLayout → SettingsPage
 */

import { Box, Heading, Text, VStack, Icon, Button } from '@chakra-ui/react';
import { StudioLayout } from '@/src/components/studio';
import { FiSettings, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

export default function SettingsPage() {
  return (
    <StudioLayout>
      <VStack spacing={8} py={20} textAlign="center">
        <Box bg="rgba(255, 157, 0, 0.1)" borderRadius="full" p={6}>
          <Icon as={FiSettings} boxSize={12} color="#FF9D00" />
        </Box>
        <Heading size="lg" color="white">
          Settings Coming Soon
        </Heading>
        <Text color="gray.500" maxW="400px">
          Configure your content preferences, brand voice, and publishing defaults.
        </Text>
        <Link href="/studio">
          <Button
            variant="ghost"
            color="gray.400"
            leftIcon={<Icon as={FiArrowLeft} />}
            _hover={{ color: 'white' }}
          >
            Back to Home
          </Button>
        </Link>
      </VStack>
    </StudioLayout>
  );
}
