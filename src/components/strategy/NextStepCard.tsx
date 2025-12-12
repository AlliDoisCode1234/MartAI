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
          title: 'Find What Your Customers Search For',
          description:
            'Discover what people type into Google when looking for businesses like yours. Import from Google Search Console or add keywords manually.',
          ctaText: keywordCount > 0 ? 'Add More Keywords' : 'Add Keywords',
          ctaIcon: FiArrowRight,
          statLabel: 'Keywords discovered',
          statValue: keywordCount,
          celebrationEmoji: keywordCount > 0 ? '🎯' : undefined,
          celebrationText:
            keywordCount > 0 ? `${keywordCount} keywords ready to organize!` : undefined,
        };

      case 2:
        return {
          icon: FiLayers,
          title: 'Curate Your Article Topics',
          description: `AI will group your ${keywordCount} keywords into topics. Each topic becomes one article for your website.`,
          ctaText: 'Curate Topics',
          ctaIcon: FiZap,
          statLabel: 'Topics curated',
          statValue: clusterCount,
          celebrationEmoji: clusterCount > 0 ? '🧩' : undefined,
          celebrationText: clusterCount > 0 ? `${clusterCount} article topics ready!` : undefined,
        };

      case 3:
        return {
          icon: FiCalendar,
          title: 'Plan Your Publishing Schedule',
          description: `Based on your ${clusterCount} topics, we'll create a 12-week content calendar. You'll know exactly when to publish each article.`,
          ctaText: 'Plan Schedule',
          ctaIcon: FiCalendar,
          statLabel: 'Articles scheduled',
          statValue: briefCount,
          celebrationEmoji: briefCount > 0 ? '📅' : undefined,
          celebrationText: briefCount > 0 ? `${briefCount} articles on your calendar!` : undefined,
        };

      case 4:
        return {
          icon: FiEdit3,
          title: 'Your Articles Are Ready',
          description: `You have ${briefCount} articles scheduled. Click any article and AI will write the first draft for you to review and publish.`,
          ctaText: 'View Article Studio',
          ctaIcon: FiEdit3,
          statLabel: 'Drafts ready',
          statValue: draftCount,
          celebrationEmoji: draftCount > 0 ? '✍️' : undefined,
          celebrationText: draftCount > 0 ? `${draftCount} drafts ready to review!` : undefined,
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
