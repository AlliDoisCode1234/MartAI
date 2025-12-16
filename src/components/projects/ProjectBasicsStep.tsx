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
import type { UseFormRegister, FieldErrors } from 'react-hook-form';

const MotionCard = motion(Card);

type FormValues = { name: string; websiteUrl: string };

type Props = {
  register: UseFormRegister<any>;
  errors: FieldErrors<FormValues>;
  onNext: () => void;
  isNextDisabled: boolean;
};

export function ProjectBasicsStep({ register, errors, onNext, isNextDisabled }: Props) {
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
          <HStack spacing={3} mb={2}>
            <Icon as={FiGlobe} boxSize={6} color="brand.orange" />
            <Heading size="md">Website Details</Heading>
          </HStack>

          <FormControl isInvalid={!!errors.name} isRequired>
            <FormLabel>Project Name</FormLabel>
            <Input
              size="lg"
              placeholder="My Awesome Website"
              {...register('name', {
                required: 'Project name is required',
                minLength: { value: 2, message: 'At least 2 characters' },
              })}
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.websiteUrl} isRequired>
            <FormLabel>Website URL</FormLabel>
            <Input
              size="lg"
              placeholder="https://example.com"
              {...register('websiteUrl', {
                required: 'Website URL is required',
                pattern: {
                  value: /^https?:\/\/.+/i,
                  message: 'Must be a valid URL starting with http:// or https://',
                },
              })}
            />
            <FormHelperText>Enter the main URL of the website you want to analyze</FormHelperText>
            <FormErrorMessage>{errors.websiteUrl?.message}</FormErrorMessage>
          </FormControl>

          <HStack justify="flex-end" pt={4}>
            <Button
              colorScheme="orange"
              size="lg"
              rightIcon={<FiArrowRight />}
              onClick={onNext}
              isDisabled={isNextDisabled}
            >
              Continue
            </Button>
          </HStack>
        </VStack>
      </CardBody>
    </MotionCard>
  );
}
