'use client';

/**
 * SocialProofBar
 *
 * Component Hierarchy:
 * App -> LandingPage -> SocialProofBar (below HeroSection)
 *
 * Trust signal bar displaying key metrics.
 * Per LDD: shows metric badges when no client logos available.
 */

import { Box, Container, Flex, Text, Icon, HStack } from '@chakra-ui/react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FiUsers, FiTrendingUp, FiZap } from 'react-icons/fi';

const MotionBox = motion(Box);

interface MetricBadge {
  icon: typeof FiUsers;
  value: string;
  label: string;
}

const METRICS: MetricBadge[] = [
  { icon: FiZap, value: 'Minutes', label: 'Not Weeks to Publish' },
  { icon: FiTrendingUp, value: '$164', label: 'Per Month Starting' },
  { icon: FiUsers, value: '6 Tools', label: 'One Platform' },
];

export function SocialProofBar() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true });

  return (
    <Box
      as="section"
      py={{ base: 8, md: 10 }}
      bg="gray.50"
      borderTop="1px solid"
      borderBottom="1px solid"
      borderColor="gray.100"
      ref={ref}
      aria-label="Social proof metrics"
    >
      <Container maxW="5xl">
        <MotionBox
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Text
            textAlign="center"
            fontSize={{ base: 'md', md: 'lg' }}
            color="gray.600"
            fontWeight="medium"
            mb={{ base: 6, md: 8 }}
          >
            Trusted by businesses getting found online
          </Text>

          <Flex
            justify="center"
            align="center"
            gap={{ base: 6, md: 16 }}
            direction={{ base: 'column', sm: 'row' }}
          >
            {METRICS.map((metric) => (
              <HStack key={metric.label} spacing={3}>
                <Box
                  p={2}
                  borderRadius="lg"
                  bg="brand.orange"
                  color="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={metric.icon} boxSize={5} aria-hidden="true" />
                </Box>
                <Box>
                  <Text
                    fontSize={{ base: 'xl', md: '2xl' }}
                    fontWeight="extrabold"
                    color="gray.800"
                    lineHeight="1"
                  >
                    {metric.value}
                  </Text>
                  <Text fontSize="xs" color="gray.500" fontWeight="medium">
                    {metric.label}
                  </Text>
                </Box>
              </HStack>
            ))}
          </Flex>
        </MotionBox>
      </Container>
    </Box>
  );
}
