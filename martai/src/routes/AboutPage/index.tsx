'use client';

import { type FC } from 'react';
import { Container, VStack, Heading, Box } from '@chakra-ui/react';

export const AboutPage: FC = () => (
  <Container maxW="container.xl" py={{ base: 8, md: 10 }} px={{ base: 4, sm: 6, md: 8, lg: 12 }}>
    <VStack spacing={6}>
      <Heading size="2xl">About</Heading>
      <Box>This is the about page.</Box>
    </VStack>
  </Container>
);

