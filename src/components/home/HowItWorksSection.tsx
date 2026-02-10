'use client';

/**
 * HowItWorksSection
 *
 * Component Hierarchy:
 * App → LandingPage → HowItWorksSection
 *
 * Animated 3-step explainer with arrow progression.
 */

import { Box, Container, Heading, Text, HStack, VStack, Icon, Flex } from '@chakra-ui/react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Globe, Sparkles, TrendingUp, ChevronRight } from 'lucide-react';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const STEPS = [
  {
    icon: Globe,
    step: '1',
    title: 'Connect your site',
    description: 'One URL unlocks your integrations',
    color: 'blue.500',
    bgColor: 'blue.50',
  },
  {
    icon: Sparkles,
    step: '2',
    title: 'AI creates content',
    description: 'Optimized for Google & ChatGPT',
    color: 'brand.orange',
    bgColor: 'orange.50',
  },
  {
    icon: TrendingUp,
    step: '3',
    title: 'You get leads',
    description: 'Traffic that converts',
    color: 'green.500',
    bgColor: 'green.50',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const arrowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-100px' });

  return (
    <Box
      as="section"
      py={{ base: 16, md: 24 }}
      bgGradient="linear(to-br, brand.orange, orange.600)"
      ref={ref}
    >
      <Container maxW="5xl">
        <VStack spacing={2} mb={12}>
          <Heading
            as="h2"
            fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
            fontWeight="extrabold"
            textAlign="center"
            color="white"
            textShadow="0 4px 20px rgba(0,0,0,0.3)"
            letterSpacing="tight"
          >
            Three Simple Steps
          </Heading>
          <Text
            color="whiteAlpha.800"
            fontSize={{ base: 'md', md: 'lg' }}
            textAlign="center"
            fontWeight="medium"
          >
            Three simple steps to more customers
          </Text>
        </VStack>

        <MotionFlex
          justify="center"
          align="center"
          gap={{ base: 2, md: 4 }}
          flexWrap={{ base: 'wrap', md: 'nowrap' }}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {STEPS.map((step, index) => (
            <HStack key={step.step} spacing={{ base: 2, md: 4 }}>
              {/* Step Card */}
              <MotionBox
                variants={stepVariants}
                p={{ base: 4, md: 6 }}
                borderRadius="2xl"
                bg="white"
                boxShadow="md"
                border="1px solid"
                borderColor="gray.100"
                textAlign="center"
                minW={{ base: '100px', md: '160px' }}
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: 'lg',
                  borderColor: step.color,
                }}
                transition="all 0.3s ease"
                cursor="default"
              >
                <VStack spacing={3}>
                  {/* Icon with colored background */}
                  <Box
                    w={{ base: 12, md: 14 }}
                    h={{ base: 12, md: 14 }}
                    borderRadius="full"
                    bg={step.bgColor}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    border="2px solid"
                    borderColor={step.color}
                  >
                    <Icon as={step.icon} boxSize={{ base: 5, md: 6 }} color={step.color} />
                  </Box>

                  {/* Step number badge */}
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    color="white"
                    bg={step.color}
                    px={2}
                    py={0.5}
                    borderRadius="full"
                  >
                    Step {step.step}
                  </Text>

                  {/* Title */}
                  <Text fontWeight="bold" color="gray.800" fontSize={{ base: 'sm', md: 'md' }}>
                    {step.title}
                  </Text>

                  {/* Description */}
                  <Text color="gray.500" fontSize="xs" display={{ base: 'none', md: 'block' }}>
                    {step.description}
                  </Text>
                </VStack>
              </MotionBox>

              {/* Animated Arrow (not after last step) */}
              {index < STEPS.length - 1 && (
                <MotionBox
                  variants={arrowVariants}
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="center"
                  px={2}
                >
                  <motion.div
                    animate={{
                      x: [0, 8, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Icon as={ChevronRight} boxSize={8} color="white" strokeWidth={3} />
                  </motion.div>
                </MotionBox>
              )}
            </HStack>
          ))}
        </MotionFlex>
      </Container>
    </Box>
  );
}
