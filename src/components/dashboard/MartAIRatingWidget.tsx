'use client';

import { Box, VStack, HStack, Text, Badge, Icon, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FiTrendingUp,
  FiEye,
  FiMousePointer,
  FiActivity,
  FiZap,
  FiFileText,
  FiAward,
} from 'react-icons/fi';
import { AnimatedCounter, CircularGauge, ChangeIndicator, ScoreBar } from '@/src/components/shared';

const MotionBox = motion(Box);
const MotionText = motion(Text);

// -------------------------------------------------------------------
// Types - Exported for reuse
// -------------------------------------------------------------------

export interface MRScoreData {
  overall: number;
  tier: string;
  visibility: number;
  trafficHealth: number;
  ctrPerformance: number;
  engagementQuality: number;
  quickWinPotential: number;
  contentVelocity: number;
  previousScore?: number;
}

interface MartAIRatingWidgetProps {
  score: MRScoreData | null;
  loading?: boolean;
}

// -------------------------------------------------------------------
// Config - Can be moved to a shared config file if needed elsewhere
// -------------------------------------------------------------------

const TIER_CONFIG: Record<
  string,
  { label: string; emoji: string; color: string; bgGradient: string }
> = {
  top_performer: {
    label: 'Top Performer',
    emoji: '🏆',
    color: 'yellow.400',
    bgGradient: 'linear(135deg, #FFD700 0%, #FFA500 100%)',
  },
  super: {
    label: 'Super',
    emoji: '⭐',
    color: 'purple.400',
    bgGradient: 'linear(135deg, #9F7AEA 0%, #ED64A6 100%)',
  },
  excellent: {
    label: 'Excellent',
    emoji: '🌟',
    color: 'green.400',
    bgGradient: 'linear(135deg, #38A169 0%, #319795 100%)',
  },
  really_good: {
    label: 'Really Good',
    emoji: '✅',
    color: 'green.300',
    bgGradient: 'linear(135deg, #68D391 0%, #48BB78 100%)',
  },
  good: {
    label: 'Good',
    emoji: '🔵',
    color: 'blue.400',
    bgGradient: 'linear(135deg, #4299E1 0%, #00B5D8 100%)',
  },
  fair: {
    label: 'Fair',
    emoji: '🟡',
    color: 'yellow.500',
    bgGradient: 'linear(135deg, #ECC94B 0%, #ED8936 100%)',
  },
  needs_work: {
    label: 'Needs Work',
    emoji: '🔴',
    color: 'red.400',
    bgGradient: 'linear(135deg, #F56565 0%, #ED8936 100%)',
  },
};

const SCORE_COMPONENTS = [
  {
    key: 'visibility',
    label: 'Visibility',
    icon: FiEye,
    weight: 30,
    description: 'Average position',
  },
  {
    key: 'trafficHealth',
    label: 'Traffic',
    icon: FiTrendingUp,
    weight: 25,
    description: 'WoW growth',
  },
  {
    key: 'ctrPerformance',
    label: 'CTR',
    icon: FiMousePointer,
    weight: 15,
    description: 'Click-through rate',
  },
  {
    key: 'engagementQuality',
    label: 'Engagement',
    icon: FiActivity,
    weight: 10,
    description: 'Bounce rate',
  },
  {
    key: 'quickWinPotential',
    label: 'Quick Wins',
    icon: FiZap,
    weight: 10,
    description: 'Page 2 keywords',
  },
  {
    key: 'contentVelocity',
    label: 'Velocity',
    icon: FiFileText,
    weight: 10,
    description: 'Content pace',
  },
] as const;

// -------------------------------------------------------------------
// Main Widget
// -------------------------------------------------------------------

export function MartAIRatingWidget({ score, loading }: MartAIRatingWidgetProps) {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textMuted = useColorModeValue('gray.600', 'gray.400');

  if (loading) {
    return (
      <Box
        bg={cardBg}
        borderRadius="2xl"
        p={8}
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow="xl"
      >
        <VStack spacing={6}>
          <Box w="180px" h="180px" borderRadius="full" bg="gray.200" />
          <Text color={textMuted}>Calculating MartAI Rating...</Text>
        </VStack>
      </Box>
    );
  }

  if (!score) {
    return (
      <MotionBox
        bg={cardBg}
        borderRadius="2xl"
        p={8}
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow="lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <VStack spacing={6}>
          <Icon as={FiAward} boxSize={16} color="gray.400" />
          <VStack spacing={2}>
            <Text fontSize="lg" fontWeight="bold" color={textMuted}>
              No MartAI Rating Yet
            </Text>
            <Text fontSize="sm" color={textMuted} textAlign="center" maxW="280px">
              Connect GA4 & Search Console to see your SEO health score
            </Text>
          </VStack>
        </VStack>
      </MotionBox>
    );
  }

  const tierConfig = TIER_CONFIG[score.tier] || TIER_CONFIG.needs_work;

  return (
    <MotionBox
      bg={cardBg}
      borderRadius="2xl"
      p={8}
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <VStack spacing={8}>
        {/* Header */}
        <HStack justify="space-between" w="full">
          <Text fontSize="lg" fontWeight="bold" letterSpacing="tight">
            MartAI Rating
          </Text>
          <ChangeIndicator current={score.overall} previous={score.previousScore} />
        </HStack>

        {/* Score Circle */}
        <Box position="relative">
          <CircularGauge value={score.overall} gradientId="mr-gauge" />
          <VStack
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            spacing={0}
          >
            <MotionText
              fontSize="5xl"
              fontWeight="bold"
              bgGradient="linear(to-r, green.400, blue.400, purple.400)"
              bgClip="text"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            >
              <AnimatedCounter value={score.overall} />
            </MotionText>
            <Text fontSize="xs" color={textMuted} fontWeight="medium" letterSpacing="widest">
              SCORE
            </Text>
          </VStack>
        </Box>

        {/* Tier Badge */}
        <MotionBox
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Badge
            bg={tierConfig.bgGradient}
            color="white"
            fontSize="md"
            px={4}
            py={2}
            borderRadius="full"
            boxShadow="md"
          >
            {tierConfig.emoji} {tierConfig.label}
          </Badge>
        </MotionBox>

        {/* Component Breakdown */}
        <VStack w="full" spacing={4} pt={4}>
          <Text fontSize="sm" fontWeight="semibold" color={textMuted} alignSelf="start">
            Score Breakdown
          </Text>
          <VStack w="full" spacing={3}>
            {SCORE_COMPONENTS.map((comp, i) => (
              <ScoreBar
                key={comp.key}
                label={comp.label}
                value={score[comp.key as keyof MRScoreData] as number}
                icon={comp.icon}
                weight={comp.weight}
                description={comp.description}
                delay={1 + i * 0.1}
              />
            ))}
          </VStack>
        </VStack>
      </VStack>
    </MotionBox>
  );
}
