'use client';

/**
 * ProjectBasicsStep Component
 *
 * Component Hierarchy:
 * App → Projects/New → ProjectBasicsStep (this file)
 *
 * Step 1 form card for project name and URL.
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
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiGlobe, FiArrowRight } from 'react-icons/fi';
import type { UseFormReturn } from 'react-hook-form';
import type { ProjectFormValues } from '@/types/forms/project';

const MotionCard = motion(Card);

interface Props {
  form: UseFormReturn<ProjectFormValues>;
  onNext: () => void;
  isNextDisabled: boolean;
}

export function ProjectBasicsStep({ form, onNext, isNextDisabled }: Props) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <MotionCard
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      bg="white"
      borderRadius="2xl"
      boxShadow="lg"
    >
      <CardBody p={8}>
        <VStack spacing={6} align="stretch">
          <HStack>
            <Icon as={FiGlobe} color="orange.500" fontSize="2xl" />
            <Heading size="md" color="gray.800">
              Project Basics
            </Heading>
          </HStack>

          <FormControl isInvalid={!!errors.name}>
            <FormLabel fontWeight="medium" color="gray.700">
              Project Name
            </FormLabel>
            <Input
              {...register('name', { required: 'Project name is required' })}
              placeholder="My Awesome Website"
              size="lg"
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
              _focus={{ borderColor: 'orange.400', bg: 'white' }}
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.websiteUrl}>
            <FormLabel fontWeight="medium" color="gray.700">
              Website URL
            </FormLabel>
            <Input
              {...register('websiteUrl', {
                required: 'Website URL is required',
                pattern: {
                  value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                  message: 'Please enter a valid URL',
                },
              })}
              placeholder="https://example.com"
              size="lg"
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
              _focus={{ borderColor: 'orange.400', bg: 'white' }}
            />
            <FormHelperText color="gray.500">
              Enter your website&apos;s URL for analysis and optimization
            </FormHelperText>
            <FormErrorMessage>{errors.websiteUrl?.message}</FormErrorMessage>
          </FormControl>

          <Button
            colorScheme="orange"
            size="lg"
            rightIcon={<FiArrowRight />}
            onClick={onNext}
            isDisabled={isNextDisabled}
            mt={4}
          >
            Continue
          </Button>
        </VStack>
      </CardBody>
    </MotionCard>
  );
}
