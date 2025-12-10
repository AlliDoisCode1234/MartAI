/**
 * NextStepCard Component
 *
 * Component Hierarchy:
 * App → StrategyPage → NextStepCard
 *
 * Prominent guidance card showing what to do next.
 * Changes content based on current stage.
 */

'use client';

import {
  Box,
  Card,
  CardBody,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Icon,
  Badge,
  useColorModeValue,
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiLayers,
  FiCalendar,
  FiEdit3,
  FiArrowRight,
  FiZap,
  FiCheckCircle,
  FiExternalLink,
} from 'react-icons/fi';

const MotionCard = motion(Card);

interface Props {
  stage: number;
  keywordCount?: number;
  clusterCount?: number;
  briefCount?: number;
  draftCount?: number;
  onAction: () => void;
  isLoading?: boolean;
}

interface StageConfig {
  icon: any;
  title: string;
  description: string;
  ctaText: string;
  ctaIcon: any;
  statLabel?: string;
  statValue?: number;
  celebrationEmoji?: string;
  celebrationText?: string;
}

export function NextStepCard({
  stage,
  keywordCount = 0,
  clusterCount = 0,
  briefCount = 0,
  draftCount = 0,
  onAction,
  isLoading = false,
}: Props) {
  const cardBg = useColorModeValue('white', 'gray.800');
  const accentGradient = 'linear-gradient(135deg, #F7941E 0%, #E0183C 100%)';

  // Loading skeleton
  if (isLoading) {
    return (
      <Card bg={cardBg} borderRadius="xl" boxShadow="md" overflow="hidden">
        <Box h={1} bg={accentGradient} />
        <CardBody p={6}>
          <VStack align="stretch" spacing={4}>
            <HStack spacing={4}>
              <Skeleton borderRadius="lg" w={12} h={12} />
              <VStack align="start" spacing={2} flex={1}>
                <Skeleton h={5} w="200px" />
                <Skeleton h={3} w="120px" />
              </VStack>
            </HStack>
            <SkeletonText noOfLines={2} spacing={2} />
            <Skeleton h={10} w="180px" borderRadius="md" />
          </VStack>
        </CardBody>
      </Card>
    );
  }

  const getStageConfig = (): StageConfig => {
    switch (stage) {
      case 1:
        return {
          icon: FiSearch,
          title: "Let's Find Topics Worth Writing About",
          description:
            "We'll analyze your website and discover keywords you can rank for. Most users spend about 5 minutes here.",
          ctaText: keywordCount > 0 ? 'Add More Keywords' : 'Connect Google Search Console',
          ctaIcon: FiArrowRight,
          statLabel: 'Keywords found',
          statValue: keywordCount,
          celebrationEmoji: keywordCount > 0 ? '🎯' : undefined,
          celebrationText:
            keywordCount > 0 ? `${keywordCount} keywords ready to organize!` : undefined,
        };

      case 2:
        return {
          icon: FiLayers,
          title: 'Organizing Your Keywords into Topics',
          description: `AI will group your ${keywordCount} keywords into topic clusters. Each cluster becomes an article opportunity.`,
          ctaText: 'Generate Topic Clusters',
          ctaIcon: FiZap,
          statLabel: 'Topic clusters',
          statValue: clusterCount,
          celebrationEmoji: clusterCount > 0 ? '🧩' : undefined,
          celebrationText:
            clusterCount > 0 ? `${clusterCount} topic clusters organized!` : undefined,
        };

      case 3:
        return {
          icon: FiCalendar,
          title: 'Planning Your Content Calendar',
          description: `Based on your ${clusterCount} topic clusters, we'll create a 12-week content schedule with ${clusterCount * 2}-${clusterCount * 3} article briefs.`,
          ctaText: 'Create 12-Week Plan',
          ctaIcon: FiCalendar,
          statLabel: 'Articles planned',
          statValue: briefCount,
          celebrationEmoji: briefCount > 0 ? '📅' : undefined,
          celebrationText: briefCount > 0 ? `${briefCount} articles scheduled!` : undefined,
        };

      case 4:
        return {
          icon: FiEdit3,
          title: 'Time to Write!',
          description: `You have ${briefCount} article briefs ready. Pick one and start writing. AI will help with outlines, research, and drafting.`,
          ctaText: 'Start Writing',
          ctaIcon: FiEdit3,
          statLabel: 'Drafts created',
          statValue: draftCount,
          celebrationEmoji: draftCount > 0 ? '✍️' : undefined,
          celebrationText: draftCount > 0 ? `${draftCount} drafts in progress!` : undefined,
        };

      default:
        return {
          icon: FiCheckCircle,
          title: 'All Caught Up!',
          description: "You've completed all the steps. Keep creating great content!",
          ctaText: 'View Dashboard',
          ctaIcon: FiArrowRight,
        };
    }
  };

  const config = getStageConfig();

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      bg={cardBg}
      borderRadius="xl"
      boxShadow="md"
      overflow="hidden"
    >
      {/* Accent bar at top */}
      <Box h={1} bg={accentGradient} />

      <CardBody p={6}>
        <VStack align="stretch" spacing={4}>
          {/* Header */}
          <HStack spacing={4}>
            <Box p={3} borderRadius="lg" bg="orange.100" color="orange.600">
              <Icon as={config.icon} boxSize={6} />
            </Box>
            <VStack align="start" spacing={0} flex={1}>
              <HStack>
                <Heading size="md" fontFamily="heading">
                  {config.title}
                </Heading>
                {config.celebrationEmoji && <Text fontSize="xl">{config.celebrationEmoji}</Text>}
              </HStack>
              {config.celebrationText && (
                <Badge colorScheme="green" variant="subtle">
                  {config.celebrationText}
                </Badge>
              )}
            </VStack>
          </HStack>

          {/* Description */}
          <Text color="gray.600">{config.description}</Text>

          {/* CTA Button */}
          <Button
            size="lg"
            bg="brand.orange"
            color="white"
            _hover={{ bg: '#E8851A', transform: 'translateY(-1px)' }}
            rightIcon={<Icon as={config.ctaIcon} />}
            onClick={onAction}
            isLoading={isLoading}
            alignSelf="flex-start"
            px={8}
          >
            {config.ctaText}
          </Button>

          {/* Progress hint */}
          <HStack spacing={2} pt={2}>
            <Icon as={FiCheckCircle} color="green.400" />
            <Text fontSize="sm" color="gray.500">
              {stage === 1 && 'Step 1 of 4 • Usually takes 5 minutes'}
              {stage === 2 && 'Step 2 of 4 • AI does the work for you'}
              {stage === 3 && 'Step 3 of 4 • 12 weeks of content planned'}
              {stage === 4 && 'Step 4 of 4 • Create your first article'}
            </Text>
          </HStack>
        </VStack>
      </CardBody>
    </MotionCard>
  );
}
