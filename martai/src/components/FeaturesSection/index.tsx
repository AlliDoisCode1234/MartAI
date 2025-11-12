'use client';

import { type FC } from 'react';
import { Box, VStack, Heading, Text, Grid, GridItem } from '@chakra-ui/react';
import { FeatureCard } from '../FeatureCard';

export const FeaturesSection: FC = () => (
  <Box w="full" mt={24}>
    <VStack spacing={8}>
      <Heading size="2xl" fontWeight="bold" color="gray.800">How Phoo Drives Results</Heading>
      <Text fontSize="lg" color="gray.600" textAlign="center" maxW="2xl">
        From audit to ROI tracking — everything you need to scale your organic growth
      </Text>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6} mt={8} w="full">
        <GridItem>
          <FeatureCard icon="🔍" title="Audits" description="Deep analysis of your site, competitors, and opportunities" iconBg="blue.100" />
        </GridItem>
        <GridItem>
          <FeatureCard icon="📋" title="Plans" description="Quarterly SEO roadmap with keyword clusters and timelines" iconBg="orange.100" />
        </GridItem>
        <GridItem>
          <FeatureCard icon="✍️" title="Writes" description="AI generates optimized, conversion-focused content" iconBg="yellow.100" />
        </GridItem>
        <GridItem>
          <FeatureCard icon="📊" title="Tracks" description="Real-time analytics showing traffic, leads, and revenue" iconBg="purple.100" />
        </GridItem>
      </Grid>
    </VStack>
  </Box>
);

