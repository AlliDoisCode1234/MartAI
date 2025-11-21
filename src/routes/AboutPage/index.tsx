'use client';

import { type FC } from 'react';
import { Container, VStack, Heading, Box, Text } from '@chakra-ui/react';

export const AboutPage: FC = () => (
  <Box minH="calc(100vh - 64px)" bg="brand.light">
    <Container maxW="container.xl" py={{ base: 8, md: 12 }} px={{ base: 4, sm: 6, md: 8, lg: 12 }}>
      <VStack spacing={8} align="stretch">
        <Heading size="2xl" fontWeight="bold" fontFamily="heading" color="gray.800">About</Heading>
        <Box bg="white" p={6} borderRadius="lg" shadow="md">
          <Text color="gray.600">This is the about page.</Text>
        </Box>
      </VStack>
    </Container>
  </Box>
);

