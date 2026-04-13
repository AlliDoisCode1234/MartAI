'use client';

/**
 * WelcomeStep Component
 *
 * Component Hierarchy:
 * App → Onboarding → WelcomeStep (this file)
 *
 * Step 1: Welcome with website URL input.
 */

import { useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Textarea,
  Button,
  Select,
  Link,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { MartCharacter } from '@/src/components/assistant';
import { INDUSTRY_OPTIONS } from '@/lib/constants/industries';

const MotionBox = motion(Box);

type Props = {
  formData: {
    businessName: string;
    website: string;
    industry?: string;
    customIndustry?: string;
    targetAudience?: string;
    businessGoals?: string;
  };
  onFormChange: (data: Props['formData']) => void;
  onNext: () => void;
  loading: boolean;
};

export function WelcomeStep({ formData, onFormChange, onNext, loading }: Props) {
  const websiteInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on website input when step loads
  useEffect(() => {
    // Small delay to ensure animation completes
    const timer = setTimeout(() => {
      websiteInputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle Enter key to submit (no form wrapper to avoid "Leave site?" warning)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && formData.website && !loading) {
      e.preventDefault();
      onNext();
    }
  };

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
                Welcome to Phoo
              </Heading>
              <Text color="gray.600">
                I&apos;m Phoo, your AI marketing manager. Enter your website below and I&apos;ll
                analyze it to find keyword opportunities and create your SEO strategy.
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
                onKeyDown={handleKeyDown}
                size="lg"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Website URL</FormLabel>
              <Input
                ref={websiteInputRef}
                type="url"
                autoComplete="url"
                placeholder="https://yourwebsite.com"
                value={formData.website}
                onChange={(e) => onFormChange({ ...formData, website: e.target.value })}
                onKeyDown={handleKeyDown}
                size="lg"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Industry</FormLabel>
              <Select
                placeholder="Select your industry (optional)"
                value={formData.industry || ''}
                onChange={(e) => onFormChange({ ...formData, industry: e.target.value })}
                size="lg"
              >
                {INDUSTRY_OPTIONS.filter((opt) => opt.value).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
              {formData.industry === 'other' && (
                <Box mt={3} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} as={motion.div}>
                  <Input
                    placeholder="Please specify your industry..."
                    value={formData.customIndustry || ''}
                    onChange={(e) => onFormChange({ ...formData, customIndustry: e.target.value })}
                    size="lg"
                    autoFocus
                  />
                </Box>
              )}
              <Text fontSize="xs" color="gray.500" mt={1}>
                Helps us provide more relevant keyword and content recommendations
              </Text>
            </FormControl>

            <FormControl>
              <FormLabel>Target Audience (optional)</FormLabel>
              <Textarea
                placeholder="e.g., Small business owners aged 30-50 looking for local services"
                value={formData.targetAudience || ''}
                onChange={(e) => onFormChange({ ...formData, targetAudience: e.target.value })}
                size="lg"
                rows={2}
                resize="vertical"
              />
              <FormHelperText color="gray.500">
                Helps our AI tailor content tone and keyword strategy
              </FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel>Business Goals (optional)</FormLabel>
              <Textarea
                placeholder="e.g., Increase organic traffic by 50%, generate more leads"
                value={formData.businessGoals || ''}
                onChange={(e) => onFormChange({ ...formData, businessGoals: e.target.value })}
                size="lg"
                rows={2}
                resize="vertical"
              />
              <FormHelperText color="gray.500">
                Guides content prioritization and strategy recommendations
              </FormHelperText>
            </FormControl>
          </VStack>

          <HStack justify="space-between" pt={2}>
            <Link
              href="/auth/login"
              color="gray.500"
              fontSize="sm"
              display="flex"
              alignItems="center"
              _hover={{ color: 'gray.700' }}
            >
              <Box as={FiArrowLeft} mr={1} />
              Back to Login
            </Link>

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
          </HStack>
        </VStack>
      </Box>
    </MotionBox>
  );
}
