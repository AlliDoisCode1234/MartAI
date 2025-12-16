'use client';

/**
 * WelcomeStep Component
 *
 * Component Hierarchy:
 * App → Onboarding → WelcomeStep (this file)
 *
 * Step 1: Welcome with website URL input.
 */

import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { MartCharacter } from '@/src/components/assistant';

const MotionBox = motion(Box);

type Props = {
  formData: { businessName: string; website: string };
  onFormChange: (data: { businessName: string; website: string }) => void;
  onNext: () => void;
  loading: boolean;
};

export function WelcomeStep({ formData, onFormChange, onNext, loading }: Props) {
  return (
    <MotionBox
      key="step1"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <Box bg="white" p={8} borderRadius="2xl" shadow="lg">
        <VStack spacing={6} align="stretch">
          <HStack spacing={4} align="start">
            <Box flexShrink={0}>
              <MartCharacter size="md" />
            </Box>
            <Box>
              <Heading size="lg" mb={2}>
                Welcome to MartAI
              </Heading>
              <Text color="gray.600">
                I'm Mart, your AI marketing manager. Enter your website below and I'll analyze it to
                find keyword opportunities and create your SEO strategy.
              </Text>
            </Box>
          </HStack>

          <VStack spacing={4} align="stretch" pt={4}>
            <FormControl>
              <FormLabel>Business Name (optional)</FormLabel>
              <Input
                type="text"
                autoComplete="organization"
                placeholder="e.g., Acme Corp"
                value={formData.businessName}
                onChange={(e) => onFormChange({ ...formData, businessName: e.target.value })}
                size="lg"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Website URL</FormLabel>
              <Input
                type="url"
                autoComplete="url"
                placeholder="https://yourwebsite.com"
                value={formData.website}
                onChange={(e) => onFormChange({ ...formData, website: e.target.value })}
                size="lg"
              />
            </FormControl>
          </VStack>

          <Button
            colorScheme="orange"
            size="lg"
            rightIcon={<FiArrowRight />}
            onClick={onNext}
            isDisabled={!formData.website}
            isLoading={loading}
            px={8}
          >
            Analyze My Site
          </Button>
        </VStack>
      </Box>
    </MotionBox>
  );
}
