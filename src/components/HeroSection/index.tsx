'use client';

import { type FC } from 'react';
import { Box, VStack, HStack, Heading, Text, Button } from '@chakra-ui/react';
import { InfoBadge } from '@/src/components/shared';
import Link from 'next/link';

export const HeroSection: FC = () => (
  <Box flex={1}>
    <VStack align="start" spacing={6} textAlign="left">
      <InfoBadge>AI-Powered SEO Automation</InfoBadge>
      <Heading size="3xl" fontWeight="bold" color="gray.800" fontFamily="heading">
        Your Answer to All Your Lead Generation and Revenue Problems
      </Heading>
      <Text fontSize="lg" color="gray.600" lineHeight="tall">
        Phoo automates your SEO content system — from strategy to execution — to generate consistent
        traffic, leads, and sales.
      </Text>
      <HStack spacing={4} mt={2}>
        <Link href="/onboarding">
          <Button
            bg="brand.orange"
            color="white"
            size="lg"
            borderRadius="md"
            px={6}
            py={3}
            _hover={{ bg: '#E8851A' }}
          >
            See My Growth Plan →
          </Button>
        </Link>
        <Button
          variant="outline"
          borderColor="gray.300"
          color="gray.700"
          size="lg"
          borderRadius="md"
        >
          Watch Demo
        </Button>
      </HStack>
      <Text fontSize="sm" color="gray.500" fontStyle="italic" mt={2}>
        Set it once. Watch it grow.
      </Text>
    </VStack>
  </Box>
);
