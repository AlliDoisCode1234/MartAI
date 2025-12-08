'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Textarea,
  Select,
  Card,
  CardBody,
  Progress,
  Icon,
  useToast,
  Divider,
  Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@/lib/useAuth';
import {
  FiGlobe,
  FiTarget,
  FiBriefcase,
  FiUsers,
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
} from 'react-icons/fi';
import Link from 'next/link';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

interface NewProjectFormValues {
  // Required
  name: string;
  websiteUrl: string;
  // Optional context
  industry?: string;
  targetAudience?: string;
  businessGoals?: string;
  competitors?: string;
}

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

export default function NewProjectPage() {
  const router = useRouter();
  const toast = useToast();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const createProject = useMutation(api.projects.projects.createProject);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<NewProjectFormValues>({
    defaultValues: {
      name: '',
      websiteUrl: '',
      industry: '',
      targetAudience: '',
      businessGoals: '',
      competitors: '',
    },
  });

  const websiteUrl = watch('websiteUrl');
  const name = watch('name');

  const onSubmit = async (data: NewProjectFormValues) => {
    setIsSubmitting(true);
    try {
      const projectId = await createProject({
        name: data.name,
        websiteUrl: data.websiteUrl,
        industry: data.industry || undefined,
      });

      toast({
        title: 'Project created!',
        description: 'Your new project is ready. Connect integrations to start analyzing.',
        status: 'success',
        duration: 5000,
      });

      // Save as current project
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentProjectId', projectId);
      }

      router.push('/home');
    } catch (error: any) {
      toast({
        title: 'Failed to create project',
        description: error.message || 'Please try again.',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    const valid = await trigger(['name', 'websiteUrl']);
    if (valid) setStep(2);
  };

  if (authLoading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="brand.light">
        <Text>Loading...</Text>
      </Box>
    );
  }

  if (!isAuthenticated) {
    router.replace('/auth/login');
    return null;
  }

  return (
    <Box minH="100vh" bg="brand.light" py={12}>
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <MotionBox initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/home">
              <Button variant="ghost" leftIcon={<FiArrowLeft />} mb={4}>
                Back to Home
              </Button>
            </Link>
            <Heading size="xl" fontWeight="bold" color="gray.800">
              Create New Project
            </Heading>
            <Text color="gray.600" mt={2}>
              Add a website to analyze and grow with MartAI
            </Text>
          </MotionBox>

          {/* Progress */}
          <HStack spacing={4}>
            <Badge
              colorScheme={step >= 1 ? 'orange' : 'gray'}
              fontSize="sm"
              px={3}
              py={1}
              borderRadius="full"
            >
              1. Basics
            </Badge>
            <Progress
              value={step >= 2 ? 100 : 0}
              size="xs"
              flex={1}
              colorScheme="orange"
              borderRadius="full"
            />
            <Badge
              colorScheme={step >= 2 ? 'orange' : 'gray'}
              fontSize="sm"
              px={3}
              py={1}
              borderRadius="full"
            >
              2. Context
            </Badge>
          </HStack>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
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
                      <FormHelperText>
                        Enter the main URL of the website you want to analyze
                      </FormHelperText>
                      <FormErrorMessage>{errors.websiteUrl?.message}</FormErrorMessage>
                    </FormControl>

                    <HStack justify="flex-end" pt={4}>
                      <Button
                        colorScheme="orange"
                        size="lg"
                        rightIcon={<FiArrowRight />}
                        onClick={nextStep}
                        isDisabled={!name || !websiteUrl}
                      >
                        Continue
                      </Button>
                    </HStack>
                  </VStack>
                </CardBody>
              </MotionCard>
            )}

            {step === 2 && (
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
                      Help Mart understand your business better for tailored insights
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
                      <Button variant="ghost" leftIcon={<FiArrowLeft />} onClick={() => setStep(1)}>
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
            )}
          </form>
        </VStack>
      </Container>
    </Box>
  );
}
