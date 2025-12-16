'use client';

/**
 * PrimaryCTA Component
 *
 * Component Hierarchy:
 * App → Strategy → PrimaryCTA (this file)
 *
 * Single-action hero card for each strategy stage.
 * One CTA per screen principle.
 */

import {
  Card,
  CardBody,
  VStack,
  Heading,
  Text,
  Button,
  Icon,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiSearch, FiLayers, FiCalendar, FiEdit3, FiArrowRight } from 'react-icons/fi';
import type { IconType } from 'react-icons';

const MotionCard = motion(Card);

type Stage = 1 | 2 | 3 | 4;

type Props = {
  stage: Stage;
  keywordCount: number;
  clusterCount: number;
  briefCount: number;
  isLoading?: boolean;
  onAction: () => void;
};

type StageConfig = {
  icon: IconType;
  title: string;
  description: string;
  cta: string;
  color: string;
  hint?: string;
};

const STAGE_CONFIG: Record<Stage, StageConfig> = {
  1: {
    icon: FiSearch,
    title: "Let's Find Your Keywords",
    description: "We'll analyze your website to discover keywords you could rank for.",
    cta: 'Discover Keywords',
    color: 'blue',
    hint: 'Takes about 30 seconds',
  },
  2: {
    icon: FiLayers,
    title: 'Group Into Topics',
    description: 'Organize your keywords into topic clusters for strategic content.',
    cta: 'Generate Topics',
    color: 'purple',
    hint: 'AI groups related keywords',
  },
  3: {
    icon: FiCalendar,
    title: 'Create Your Content Plan',
    description: 'Turn topic clusters into a 12-week content calendar.',
    cta: 'Create Plan',
    color: 'orange',
    hint: 'Schedule your first articles',
  },
  4: {
    icon: FiEdit3,
    title: 'Start Writing',
    description: 'Your plan is ready! Pick your first article and start creating.',
    cta: 'Open Content Studio',
    color: 'green',
    hint: 'Quick Win articles rank fastest',
  },
};

export function PrimaryCTA({
  stage,
  keywordCount,
  clusterCount,
  briefCount,
  isLoading,
  onAction,
}: Props) {
  const config = STAGE_CONFIG[stage];

  // Determine if CTA should be disabled
  const isDisabled = (stage === 2 && keywordCount < 5) || (stage === 3 && clusterCount === 0);

  const disabledReason =
    stage === 2 && keywordCount < 5
      ? `Need ${5 - keywordCount} more keywords`
      : stage === 3 && clusterCount === 0
        ? 'Generate topics first'
        : undefined;

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      bg="white"
      borderWidth="2px"
      borderColor={`${config.color}.100`}
      shadow="md"
      overflow="hidden"
    >
      <CardBody py={8} px={8}>
        <VStack spacing={5} align="center" textAlign="center">
          <HStack spacing={3}>
            <Badge colorScheme={config.color} fontSize="sm" px={3} py={1} borderRadius="full">
              Stage {stage} of 4
            </Badge>
          </HStack>

          <Icon as={config.icon} boxSize={12} color={`${config.color}.500`} />

          <VStack spacing={2}>
            <Heading size="lg" fontWeight="bold" color="gray.800">
              {config.title}
            </Heading>
            <Text color="gray.600" maxW="400px">
              {config.description}
            </Text>
          </VStack>

          <Button
            size="lg"
            bg={isDisabled ? 'gray.300' : `${config.color}.500`}
            color="white"
            _hover={{ bg: isDisabled ? 'gray.300' : `${config.color}.600` }}
            rightIcon={<FiArrowRight />}
            onClick={onAction}
            isLoading={isLoading}
            isDisabled={isDisabled}
            px={8}
          >
            {config.cta}
          </Button>

          {disabledReason ? (
            <Text fontSize="sm" color="orange.500" fontWeight="medium">
              {disabledReason}
            </Text>
          ) : config.hint ? (
            <Text fontSize="sm" color="gray.500">
              {config.hint}
            </Text>
          ) : null}
        </VStack>
      </CardBody>
    </MotionCard>
  );
}
