'use client';

import { type FC } from 'react';
import { Box, VStack, HStack, Heading, Text } from '@chakra-ui/react';
import { InfoBadge } from '../InfoBadge';
import { CTAButton } from '../CTAButton';

export const HeroSection: FC = () => (
  <Box flex={1}>
    <VStack align="start" spacing={6} textAlign="left">
      <InfoBadge>AI-Powered SEO Automation</InfoBadge>
      <Heading size="3xl" fontWeight="bold" color="gray.800">
        Your Answer to All Your Lead Generation and Revenue Problems
      </Heading>
      <Text fontSize="lg" color="gray.600" lineHeight="tall">
        Phoo automates your SEO content system — from strategy to execution — to generate consistent traffic, leads, and sales.
      </Text>
      <HStack spacing={4} mt={2}>
        <CTAButton variant="primary">See My Growth Plan →</CTAButton>
        <CTAButton variant="secondary">Watch Demo</CTAButton>
      </HStack>
      <Text fontSize="sm" color="gray.500" fontStyle="italic" mt={2}>
        Set it once. Watch it grow.
      </Text>
    </VStack>
  </Box>
);

