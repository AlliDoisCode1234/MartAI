'use client';

import { type FC } from 'react';
import { Box, Container, HStack } from '@chakra-ui/react';
import { HeroSection } from '../../components/HeroSection';
import { StatsCard } from '../../components/StatsCard';
import { FeaturesSection } from '../../components/FeaturesSection';

export const HomePage: FC = () => (
  <Box bg="gray.50" minH="100vh" w="100%">
    <Container maxW="container.xl" py={{ base: 8, md: 12, lg: 16 }} px={{ base: 4, sm: 6, md: 8, lg: 12 }}>
      <HStack align="start" spacing={12} flexDirection={{ base: 'column', lg: 'row' }}>
        <HeroSection />
        <StatsCard />
      </HStack>
      <FeaturesSection />
    </Container>
  </Box>
);

