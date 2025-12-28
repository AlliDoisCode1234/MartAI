'use client';

import { Box, VStack, HStack, Text, Badge, Icon, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiAward } from 'react-icons/fi';
import { AnimatedCounter, CircularGauge, ChangeIndicator, ScoreBar } from '@/src/components/shared';
import { TIER_CONFIG, SCORE_COMPONENTS } from '@/src/constants/martaiRating';

const MotionBox = motion(Box);
const MotionText = motion(Text);

// Types
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
          <Text color={textMuted}>Calculating Phoo Rating...</Text>
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
              No Phoo Rating Yet
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
        <HStack justify="space-between" w="full">
          <Text fontSize="lg" fontWeight="bold" letterSpacing="tight">
            Phoo Rating
          </Text>
          <ChangeIndicator current={score.overall} previous={score.previousScore} />
        </HStack>

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

        <MotionBox
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Badge
            bg={tierConfig.bgColor}
            color={tierConfig.textColor}
            fontSize="sm"
            px={4}
            py={1.5}
            borderRadius="full"
            fontWeight="medium"
          >
            {tierConfig.label}
          </Badge>
        </MotionBox>

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
