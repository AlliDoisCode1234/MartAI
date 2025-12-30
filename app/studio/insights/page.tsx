'use client';

/**
 * Insights Page (Coming Soon)
 *
 * Component Hierarchy:
 * App → StudioLayout → InsightsPage
 */

import { Box, Heading, Text, VStack, Icon, Button } from '@chakra-ui/react';
import { StudioLayout } from '@/src/components/studio';
import { FiBarChart2, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

export default function InsightsPage() {
  return (
    <StudioLayout>
      <VStack spacing={8} py={20} textAlign="center">
        <Box bg="rgba(255, 157, 0, 0.1)" borderRadius="full" p={6}>
          <Icon as={FiBarChart2} boxSize={12} color="#FF9D00" />
        </Box>
        <Heading size="lg" color="white">
          Insights Coming Soon
        </Heading>
        <Text color="gray.500" maxW="400px">
          Track your content performance, SEO scores, and generation analytics all in one place.
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
