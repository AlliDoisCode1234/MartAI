'use client';

/**
 * New Project Page
 *
 * Component Hierarchy:
 * App → Projects/New (this file)
 *
 * Add a website to analyze and grow with MartAI.
 * Uses extracted step form components.
 */

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
  Progress,
  Badge,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@/lib/useAuth';
import { FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import { sanitizeErrorMessage } from '@/lib/errorSanitizer';

// Extracted components
import { ProjectBasicsStep, ProjectContextStep } from '@/src/components/projects';

const MotionBox = motion(Box);

interface NewProjectFormValues {
  name: string;
  websiteUrl: string;
  industry?: string;
  targetAudience?: string;
  businessGoals?: string;
  competitors?: string;
}

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
      if (typeof window !== 'undefined') localStorage.setItem('currentProjectId', projectId);
      router.push('/home');
    } catch (error: any) {
      toast({
        title: 'Failed to create project',
        description: sanitizeErrorMessage(error, 'Please try again.'),
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

  if (authLoading)
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="brand.light">
        <Text>Loading...</Text>
      </Box>
    );
  if (!isAuthenticated) {
    router.replace('/auth/login');
    return null;
  }

  return (
    <Box minH="100vh" bg="brand.light" py={12}>
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
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

          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <ProjectBasicsStep
                register={register}
                errors={errors}
                onNext={nextStep}
                isNextDisabled={!name || !websiteUrl}
              />
            )}
            {step === 2 && (
              <ProjectContextStep
                register={register}
                onBack={() => setStep(1)}
                isSubmitting={isSubmitting}
              />
            )}
          </form>
        </VStack>
      </Container>
    </Box>
  );
}
