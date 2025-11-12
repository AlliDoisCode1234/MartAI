import React from 'react';
import { Container, VStack, Heading, Box } from '@chakra-ui/react';

export const AboutPage: React.FC = () => (
  <Container maxW="container.xl" py={10}>
    <VStack gap={6}>
      <Heading size="2xl">About</Heading>
      <Box>This is the about page.</Box>
    </VStack>
  </Container>
);

