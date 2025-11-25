'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Heading,
  VStack,
  HStack,
  Badge,
  Flex,
  keyframes,
  usePrefersReducedMotion,
} from '@chakra-ui/react';
import type { KeywordCluster } from '@/types';

const float = keyframes`
  0%, 100% { transform: translateY(0px) scale(1); opacity: 0.8; }
  50% { transform: translateY(-10px) scale(1.05); opacity: 1; }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const fadeInScale = keyframes`
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.9;
  }
`;

interface KeywordRevealProps {
  clusters: KeywordCluster[];
  onComplete?: () => void;
  autoAdvance?: boolean;
  delay?: number;
}

export function KeywordReveal({
  clusters,
  onComplete,
  autoAdvance = true,
  delay = 3000,
}: KeywordRevealProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const currentCluster = clusters[currentIndex];
  const progress = ((currentIndex + 1) / clusters.length) * 100;

  useEffect(() => {
    if (!autoAdvance || currentIndex >= clusters.length - 1) {
      if (currentIndex === clusters.length - 1 && onComplete) {
        const timer = setTimeout(() => {
          onComplete();
        }, delay);
        return () => clearTimeout(timer);
      }
      return;
    }

    const timer = setTimeout(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsAnimating(false);
      }, 300);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentIndex, clusters.length, autoAdvance, delay, onComplete]);

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'transactional':
        return 'brand.orange';
      case 'commercial':
        return 'brand.teal';
      case 'informational':
        return 'blue.500';
      case 'navigational':
        return 'purple.500';
      default:
        return 'gray.500';
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return 'green.500';
    if (difficulty < 60) return 'yellow.500';
    return 'red.500';
  };

  if (!currentCluster) {
    return null;
  }

  const slideInAnimation = prefersReducedMotion ? undefined : `${slideIn} 0.6s ease-out`;
  const fadeScaleAnimation = prefersReducedMotion
    ? undefined
    : `${fadeInScale} 0.5s ease-out`;
  const floatAnimation = prefersReducedMotion ? undefined : `${float} 3s ease-in-out infinite`;
  const pulseAnimation = prefersReducedMotion ? undefined : `${pulse} 2s ease-in-out infinite`;

  return (
    <Box
      w="100%"
      h="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      position="relative"
      px={4}
    >
      {/* Progress bar */}
      <Box
        w="100%"
        maxW="600px"
        mb={8}
        position="relative"
      >
        <Box
          h="4px"
          bg="gray.200"
          borderRadius="full"
          overflow="hidden"
        >
          <Box
            h="100%"
            bg="brand.orange"
            borderRadius="full"
            transition="width 0.5s ease-out"
            style={{ width: `${progress}%` }}
          />
        </Box>
        <Text
          fontSize="sm"
          color="gray.600"
          mt={2}
          textAlign="center"
        >
          {currentIndex + 1} of {clusters.length} opportunities discovered
        </Text>
      </Box>

      {/* Main cluster card */}
      <Box
        w="100%"
        maxW="700px"
        bg="white"
        borderRadius="2xl"
        p={8}
        shadow="2xl"
        border="2px"
        borderColor="brand.orange"
        animation={isAnimating ? undefined : fadeScaleAnimation}
        transition="all 0.3s ease-out"
        position="relative"
        overflow="hidden"
      >
        {/* Background gradient */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient="linear(to-br, brand.orange, brand.teal)"
          opacity={0.05}
          pointerEvents="none"
        />

        <VStack spacing={6} align="stretch" position="relative" zIndex={1}>
          {/* Cluster name */}
          <Box>
            <Text
              fontSize="xs"
              fontWeight="bold"
              color="brand.orange"
              textTransform="uppercase"
              letterSpacing="wide"
              mb={2}
            >
              Keyword Opportunity
            </Text>
            <Heading
              size="xl"
              fontFamily="heading"
              color="gray.800"
              animation={isAnimating ? undefined : slideInAnimation}
            >
              {currentCluster.clusterName}
            </Heading>
          </Box>

          {/* Keywords */}
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={3}>
              Target Keywords:
            </Text>
            <Flex wrap="wrap" gap={2}>
              {currentCluster.keywords.slice(0, 8).map((keyword, idx) => (
                <Badge
                  key={idx}
                  px={4}
                  py={2}
                  borderRadius="full"
                  bg="brand.orange"
                  color="white"
                  fontSize="sm"
                  fontWeight="medium"
                  animation={
                    prefersReducedMotion
                      ? undefined
                      : `${fadeInScale} 0.4s ease-out ${idx * 0.1}s both`
                  }
                >
                  {keyword}
                </Badge>
              ))}
              {currentCluster.keywords.length > 8 && (
                <Badge
                  px={4}
                  py={2}
                  borderRadius="full"
                  bg="gray.200"
                  color="gray.700"
                  fontSize="sm"
                  fontWeight="medium"
                >
                  +{currentCluster.keywords.length - 8} more
                </Badge>
              )}
            </Flex>
          </Box>

          {/* Stats row */}
          <HStack spacing={6} flexWrap="wrap">
            <Box>
              <Text fontSize="xs" color="gray.500" mb={1}>
                Search Intent
              </Text>
              <Badge
                bg={getIntentColor(currentCluster.intent)}
                color="white"
                px={3}
                py={1}
                borderRadius="md"
                fontSize="xs"
                textTransform="capitalize"
                animation={floatAnimation}
              >
                {currentCluster.intent}
              </Badge>
            </Box>

            <Box>
              <Text fontSize="xs" color="gray.500" mb={1}>
                Difficulty
              </Text>
              <HStack>
                <Text
                  fontWeight="bold"
                  color={getDifficultyColor(currentCluster.difficulty)}
                  fontSize="lg"
                  animation={pulseAnimation}
                >
                  {currentCluster.difficulty}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  /100
                </Text>
              </HStack>
            </Box>

            <Box>
              <Text fontSize="xs" color="gray.500" mb={1}>
                Search Volume
              </Text>
              <Text fontWeight="bold" color="gray.800" fontSize="lg">
                {currentCluster.volumeRange.min.toLocaleString()} -{' '}
                {currentCluster.volumeRange.max.toLocaleString()}
              </Text>
            </Box>

            <Box>
              <Text fontSize="xs" color="gray.500" mb={1}>
                Impact Score
              </Text>
              <Text fontWeight="bold" color="brand.orange" fontSize="lg">
                {currentCluster.impactScore.toFixed(1)}
              </Text>
            </Box>
          </HStack>

          {/* Reasoning if available */}
          {currentCluster.reasoning && (
            <Box
              bg="brand.light"
              p={4}
              borderRadius="lg"
              borderLeft="4px"
              borderColor="brand.teal"
            >
              <Text fontSize="sm" color="gray.700" lineHeight="tall">
                {currentCluster.reasoning}
              </Text>
            </Box>
          )}
        </VStack>
      </Box>

      {/* Navigation dots */}
      <HStack spacing={2} mt={8}>
        {clusters.map((_, idx) => (
          <Box
            key={idx}
            w={idx === currentIndex ? '32px' : '8px'}
            h="8px"
            bg={idx === currentIndex ? 'brand.orange' : 'gray.300'}
            borderRadius="full"
            transition="all 0.3s ease-out"
            cursor="pointer"
            onClick={() => {
              setIsAnimating(true);
              setTimeout(() => {
                setCurrentIndex(idx);
                setIsAnimating(false);
              }, 300);
            }}
          />
        ))}
      </HStack>
    </Box>
  );
}

