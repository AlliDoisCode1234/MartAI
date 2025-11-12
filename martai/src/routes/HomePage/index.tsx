import React from 'react';
import { Box, Container, HStack } from '@chakra-ui/react';
import { HeroSection } from '../../components/HeroSection';
import { StatsCard } from '../../components/StatsCard';
import { FeaturesSection } from '../../components/FeaturesSection';

export const HomePage: React.FC = () => (
  <Box bg="gray.50" minH="100vh">
    <Container maxW="container.xl" py={16}>
      <HStack align="start" gap={12} flexDirection={{ base: 'column', lg: 'row' }}>
        <HeroSection />
        <StatsCard />
      </HStack>
      <FeaturesSection />
    </Container>
  </Box>
);

