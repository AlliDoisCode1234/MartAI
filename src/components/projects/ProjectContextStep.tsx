'use client';

/**
 * ProjectContextStep Component
 *
 * Component Hierarchy:
 * App → Projects/New → ProjectContextStep (this file)
 *
 * Step 2 form card for optional industry/audience context.
 */

import {
  Card,
  CardBody,
  VStack,
  HStack,
  Heading,
  Icon,
  FormControl,
  FormLabel,
  FormHelperText,
  Select,
  Textarea,
  Button,
  ButtonGroup,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiArrowLeft, FiCheck } from 'react-icons/fi';
import type { UseFormReturn } from 'react-hook-form';
import type { ProjectFormValues } from '@/types/forms/project';

const MotionCard = motion(Card);

const INDUSTRIES = [
  'Technology',
  'E-commerce',
  'Healthcare',
  'Finance',
  'Education',
  'Real Estate',
  'Travel',
  'Food & Beverage',
  'Professional Services',
  'Other',
];

interface Props {
  form: UseFormReturn<ProjectFormValues>;
  onBack: () => void;
  isSubmitting: boolean;
}

export function ProjectContextStep({ form, onBack, isSubmitting }: Props) {
  const { register } = form;

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
          <HStack>
            <Icon as={FiBriefcase} color="orange.500" fontSize="2xl" />
            <Heading size="md" color="gray.800">
              Project Context
            </Heading>
          </HStack>

          <FormControl>
            <FormLabel fontWeight="medium" color="gray.700">
              Industry (Optional)
            </FormLabel>
            <Select
              {...register('industry')}
              placeholder="Select industry"
              size="lg"
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
              _focus={{ borderColor: 'orange.400', bg: 'white' }}
            >
              {INDUSTRIES.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="medium" color="gray.700">
              Target Audience (Optional)
            </FormLabel>
            <Textarea
              {...register('targetAudience')}
              placeholder="Describe your ideal customers..."
              size="lg"
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
              _focus={{ borderColor: 'orange.400', bg: 'white' }}
            />
            <FormHelperText color="gray.500">
              E.g., &quot;Small business owners aged 30-50&quot;
            </FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="medium" color="gray.700">
              Business Goals (Optional)
            </FormLabel>
            <Textarea
              {...register('businessGoals')}
              placeholder="What do you want to achieve?"
              size="lg"
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
              _focus={{ borderColor: 'orange.400', bg: 'white' }}
            />
          </FormControl>

          <ButtonGroup spacing={4} mt={4}>
            <Button
              variant="outline"
              colorScheme="gray"
              size="lg"
              leftIcon={<FiArrowLeft />}
              onClick={onBack}
            >
              Back
            </Button>
            <Button
              type="submit"
              colorScheme="orange"
              size="lg"
              rightIcon={<FiCheck />}
              isLoading={isSubmitting}
              flex={1}
            >
              Create Project
            </Button>
          </ButtonGroup>
        </VStack>
      </CardBody>
    </MotionCard>
  );
}
