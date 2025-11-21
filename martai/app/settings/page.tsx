'use client';

import { Container, VStack, Heading, Text, Box } from '@chakra-ui/react';

export default function SettingsPage() {
  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container maxW="container.xl" py={{ base: 8, md: 12 }} px={{ base: 4, sm: 6, md: 8, lg: 12 }}>
        <VStack spacing={8} align="stretch">
          <Heading size="2xl" fontWeight="bold" fontFamily="heading" color="gray.800">Settings</Heading>
          <Box bg="white" p={6} borderRadius="lg" shadow="md">
            <Text color="gray.600">Settings page coming soon...</Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

