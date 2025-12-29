'use client';

import { Box, VStack, HStack, Text, Icon, Button, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';
import {
  FiArrowRight,
  FiCheckCircle,
  FiTarget,
  FiTrendingUp,
  FiZap,
  FiLink,
  FiFileText,
  FiLayers,
  FiBarChart2,
} from 'react-icons/fi';
import Link from 'next/link';

const MotionBox = motion(Box);

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: IconType;
  action?: {
    label: string;
    href: string;
  };
  completed?: boolean;
  gradient: string;
}

// Default onboarding steps - shown during onboarding flow
export const ONBOARDING_STEPS: TutorialStep[] = [
  {
    id: 'connect-ga4',
    title: 'Connect Google Analytics',
    description: 'Link your GA4 to track traffic and engagement metrics.',
    icon: FiBarChart2,
    action: { label: 'Connect GA4', href: '/integrations' },
    gradient: 'linear(to-br, blue.400, blue.600)',
  },
  {
    id: 'connect-gsc',
    title: 'Connect Search Console',
    description: 'Import your keyword rankings and search performance.',
    icon: FiLink,
    action: { label: 'Connect GSC', href: '/integrations' },
    gradient: 'linear(to-br, green.400, green.600)',
  },
  {
    id: 'generate-clusters',
    title: 'Generate Topic Clusters',
    description: 'Let Phoo analyze your keywords and group them into topics.',
    icon: FiLayers,
    action: { label: 'Go to Strategy', href: '/strategy' },
    gradient: 'linear(to-br, purple.400, purple.600)',
  },
  {
    id: 'create-plan',
    title: 'Create Your Content Plan',
    description: 'Generate a 12-week content calendar based on your clusters.',
    icon: FiFileText,
    action: { label: 'Create Plan', href: '/strategy' },
    gradient: 'linear(to-br, orange.400, orange.600)',
  },
];

// Post-onboarding steps - shown on Home after completing onboarding (focus on next action)
export const POST_ONBOARDING_STEPS: TutorialStep[] = [
  {
    id: 'create-clusters',
    title: 'Create Topic Clusters',
    description: 'Group your keywords into topic clusters to build your content strategy.',
    icon: FiLayers,
    action: { label: 'Go to Strategy', href: '/strategy' },
    gradient: 'linear(to-br, purple.400, purple.600)',
  },
  {
    id: 'view-dashboard',
    title: 'Track Your Progress',
    description: 'See your SEO performance and Phoo Rating insights.',
    icon: FiTrendingUp,
    action: { label: 'View Dashboard', href: '/dashboard' },
    gradient: 'linear(to-br, teal.400, green.400)',
  },
];

// Contextual "What's Next" suggestions
export const WHATS_NEXT_STEPS: TutorialStep[] = [
  {
    id: 'quick-wins',
    title: 'Check Quick Wins',
    description: "Keywords where you're close to page 1. Small effort, big gains!",
    icon: FiZap,
    action: { label: 'View Quick Wins', href: '/dashboard' },
    gradient: 'linear(to-br, yellow.400, orange.400)',
  },
  {
    id: 'improve-mr',
    title: 'Improve Your PR Score',
    description: "Your Phoo Rating shows overall SEO health. Let's boost it!",
    icon: FiTrendingUp,
    action: { label: 'View Dashboard', href: '/dashboard' },
    gradient: 'linear(to-br, teal.400, green.400)',
  },
  {
    id: 'review-insights',
    title: 'Review Content Gaps',
    description: "High-value keywords you're not ranking for yet.",
    icon: FiTarget,
    action: { label: 'View Insights', href: '/dashboard' },
    gradient: 'linear(to-br, pink.400, red.400)',
  },
];

interface TutorialCardProps {
  step: TutorialStep;
  index: number;
}

export function TutorialCard({ step, index }: TutorialCardProps) {
  const cardBg = useColorModeValue('white', 'gray.800');
  const IconComponent = step.icon;

  return (
    <MotionBox
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.4 }}
      bg={cardBg}
      borderRadius="2xl"
      p={6}
      boxShadow="lg"
      borderWidth="1px"
      borderColor="gray.100"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'xl',
      }}
      style={{ transition: 'transform 0.3s, box-shadow 0.3s' }}
      position="relative"
      overflow="hidden"
    >
      {/* Gradient accent */}
      <Box position="absolute" top={0} left={0} right={0} h="4px" bgGradient={step.gradient} />

      <VStack align="stretch" spacing={4}>
        <HStack spacing={4}>
          <Box p={3} borderRadius="xl" bgGradient={step.gradient} color="white">
            <Icon as={IconComponent} boxSize={6} />
          </Box>
          <VStack align="start" spacing={0} flex={1}>
            <HStack>
              <Text fontWeight="bold" fontSize="lg">
                {step.title}
              </Text>
              {step.completed && <Icon as={FiCheckCircle} color="green.500" />}
            </HStack>
          </VStack>
        </HStack>

        <Text color="gray.600" fontSize="sm">
          {step.description}
        </Text>

        {step.action && !step.completed && (
          <Link href={step.action.href} style={{ width: '100%' }}>
            <Button
              size="sm"
              rightIcon={<FiArrowRight />}
              colorScheme="orange"
              variant="ghost"
              w="full"
              justifyContent="space-between"
            >
              {step.action.label}
            </Button>
          </Link>
        )}
      </VStack>
    </MotionBox>
  );
}
