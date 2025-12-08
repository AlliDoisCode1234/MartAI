'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Progress,
  Tooltip,
  useColorModeValue,
  Icon,
  Flex,
  SimpleGrid,
  Badge,
} from '@chakra-ui/react';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import {
  FiTrendingUp,
  FiEye,
  FiMousePointer,
  FiActivity,
  FiZap,
  FiFileText,
  FiAward,
  FiArrowUp,
  FiArrowDown,
  FiMinus,
} from 'react-icons/fi';

const MotionBox = motion(Box);
const MotionText = motion(Text);

// -------------------------------------------------------------------
// Types
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
  showHistory?: boolean;
}

// -------------------------------------------------------------------
// Constants
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

const COMPONENTS = [
  {
    key: 'visibility',
    label: 'Visibility',
    icon: FiEye,
    weight: 30,
    description: 'Average position in search',
  },
  {
    key: 'trafficHealth',
    label: 'Traffic',
    icon: FiTrendingUp,
    weight: 25,
    description: 'Week-over-week growth',
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
    description: 'Bounce rate & time on site',
  },
  {
    key: 'quickWinPotential',
    label: 'Quick Wins',
    icon: FiZap,
    weight: 10,
    description: 'Keywords on page 2',
  },
  {
    key: 'contentVelocity',
    label: 'Velocity',
    icon: FiFileText,
    weight: 10,
    description: 'Content creation pace',
  },
] as const;

// -------------------------------------------------------------------
// Animated Counter Component
// -------------------------------------------------------------------

function AnimatedCounter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalMilSecDur = duration * 1000;
    const incrementTime = totalMilSecDur / end;

    const timer = setInterval(() => {
      start += 1;
      setDisplayValue(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <>{displayValue}</>;
}

// -------------------------------------------------------------------
// Circular Gauge Component (SVG)
// -------------------------------------------------------------------

function CircularGauge({
  value,
  size = 180,
  strokeWidth = 12,
  gradientId,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  gradientId: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;

  const bgStroke = useColorModeValue('#E2E8F0', '#2D3748');

  return (
    <Box position="relative" w={`${size}px`} h={`${size}px`}>
      <svg width={size} height={size}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38A169" />
            <stop offset="50%" stopColor="#4299E1" />
            <stop offset="100%" stopColor="#9F7AEA" />
          </linearGradient>
        </defs>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgStroke}
          strokeWidth={strokeWidth}
        />
        {/* Animated progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
    </Box>
  );
}

// -------------------------------------------------------------------
// Component Score Bar
// -------------------------------------------------------------------

function ComponentScoreBar({
  label,
  value,
  icon,
  weight,
  description,
  delay,
}: {
  label: string;
  value: number;
  icon: React.ComponentType;
  weight: number;
  description: string;
  delay: number;
}) {
  const textMuted = useColorModeValue('gray.600', 'gray.400');
  const barBg = useColorModeValue('gray.100', 'gray.700');

  const getColorScheme = (v: number) => {
    if (v >= 80) return 'green';
    if (v >= 60) return 'blue';
    if (v >= 40) return 'yellow';
    return 'red';
  };

  return (
    <Tooltip label={`${description} • ${weight}% of total score`} placement="top" hasArrow>
      <MotionBox
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.4 }}
      >
        <HStack justify="space-between" mb={1}>
          <HStack spacing={2}>
            <Icon as={icon} boxSize={4} color={textMuted} />
            <Text fontSize="sm" color={textMuted} fontWeight="medium">
              {label}
            </Text>
          </HStack>
          <Badge colorScheme={getColorScheme(value)} fontSize="xs" borderRadius="full" px={2}>
            {value}
          </Badge>
        </HStack>
        <Progress
          value={value}
          size="sm"
          borderRadius="full"
          colorScheme={getColorScheme(value)}
          bg={barBg}
          sx={{
            '& > div': {
              transition: 'width 1s ease-out',
            },
          }}
        />
      </MotionBox>
    </Tooltip>
  );
}

// -------------------------------------------------------------------
// Change Indicator
// -------------------------------------------------------------------

function ChangeIndicator({ current, previous }: { current: number; previous?: number }) {
  if (previous === undefined) return null;

  const diff = current - previous;
  const isUp = diff > 0;
  const isDown = diff < 0;

  if (diff === 0) {
    return (
      <HStack spacing={1} fontSize="xs" color="gray.500">
        <Icon as={FiMinus} />
        <Text>No change</Text>
      </HStack>
    );
  }

  return (
    <HStack spacing={1} fontSize="xs" color={isUp ? 'green.500' : 'red.500'}>
      <Icon as={isUp ? FiArrowUp : FiArrowDown} />
      <Text>{Math.abs(diff)} pts</Text>
    </HStack>
  );
}

// -------------------------------------------------------------------
// Main Widget
// -------------------------------------------------------------------

export function MartAIRatingWidget({ score, loading }: MartAIRatingWidgetProps) {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textMuted = useColorModeValue('gray.600', 'gray.400');
  const gradientId = 'mr-gauge-gradient';

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
          <Text color={textMuted}>Calculating your MartAI Rating...</Text>
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
          <MotionBox
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Icon as={FiAward} boxSize={16} color="gray.400" />
          </MotionBox>
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

        {/* Main Score Circle */}
        <Box position="relative">
          <CircularGauge value={score.overall} gradientId={gradientId} />
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
            {COMPONENTS.map((comp, i) => (
              <ComponentScoreBar
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
