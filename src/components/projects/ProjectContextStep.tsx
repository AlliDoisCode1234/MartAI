'use client';

/**
 * ProjectContextStep Component
 *
 * Component Hierarchy:
 * App → Projects/New → ProjectContextStep (this file)
 *
 * Step 2 form card for optional project context.
 */

import {
  Card,
  CardBody,
  VStack,
  HStack,
  Heading,
  Icon,
  Text,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Select,
  Textarea,
  Button,
  Badge,
  Divider,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiTarget, FiBriefcase, FiUsers, FiArrowLeft, FiCheck } from 'react-icons/fi';
import type { UseFormRegister } from 'react-hook-form';

const MotionCard = motion(Card);

const INDUSTRIES = [
  'Technology',
  'E-commerce',
  'Finance',
  'Healthcare',
  'Education',
  'Marketing',
  'Real Estate',
  'Travel',
  'Food & Beverage',
  'Entertainment',
  'Professional Services',
  'Other',
];

type FormValues = {
  industry?: string;
  targetAudience?: string;
  businessGoals?: string;
  competitors?: string;
};

type Props = {
  register: UseFormRegister<FormValues>;
  onBack: () => void;
  isSubmitting: boolean;
};

export function ProjectContextStep({ register, onBack, isSubmitting }: Props) {
  return (
    <MotionCard
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      bg="white"
      borderRadius="2xl"
      boxShadow="lg"
    >
      <CardBody p={8}>
        <VStack spacing={6} align="stretch">
          <HStack spacing={3} mb={2}>
            <Icon as={FiTarget} boxSize={6} color="brand.orange" />
            <Heading size="md">Additional Context</Heading>
            <Badge colorScheme="gray" ml="auto">
              Optional
            </Badge>
          </HStack>
          <Text color="gray.500" fontSize="sm" mt={-4}>
            Help Phoo understand your business better for tailored insights
          </Text>

          <FormControl>
            <FormLabel>
              <HStack spacing={2}>
                <Icon as={FiBriefcase} />
                <Text>Industry</Text>
              </HStack>
            </FormLabel>
            <Select placeholder="Select industry" {...register('industry')}>
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind.toLowerCase()}>
                  {ind}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>
              <HStack spacing={2}>
                <Icon as={FiUsers} />
                <Text>Target Audience</Text>
              </HStack>
            </FormLabel>
            <Textarea
              placeholder="e.g., Small business owners, marketing managers, tech startups..."
              {...register('targetAudience')}
              rows={2}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Business Goals</FormLabel>
            <Textarea
              placeholder="e.g., Increase organic traffic by 50%, rank for 'best CRM software'..."
              {...register('businessGoals')}
              rows={2}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Primary Competitors</FormLabel>
            <Textarea
              placeholder="e.g., competitor1.com, competitor2.com"
              {...register('competitors')}
              rows={2}
            />
            <FormHelperText>
              We'll analyze these for content and keyword opportunities
            </FormHelperText>
          </FormControl>

          <Divider />

          <HStack justify="space-between" pt={2}>
            <Button variant="ghost" leftIcon={<FiArrowLeft />} onClick={onBack}>
              Back
            </Button>
            <Button
              type="submit"
              colorScheme="orange"
              size="lg"
              rightIcon={<FiCheck />}
              isLoading={isSubmitting}
              loadingText="Creating..."
            >
              Create Project
            </Button>
          </HStack>
        </VStack>
      </CardBody>
    </MotionCard>
  );
}
