'use client';

/**
 * CTASection
 *
 * Component Hierarchy:
 * App -> LandingPage -> CTASection (above PremiumFooter)
 *
 * Full-width dark final conversion block.
 * Per LDD section 3.8: charcoal background with bold headline and dual CTAs.
 */

import { Box, Container, Heading, Text, VStack, Button, HStack, Icon } from '@chakra-ui/react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { IS_LAUNCHED, BETA_JOIN_HREF, LAUNCHED_SIGNUP_HREF, PRIMARY_CTA_TEXT } from '@/lib/constants/featureFlags';

const MotionBox = motion(Box);

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-80px' });

  return (
    <Box as="section" bg="#0a0a0a" py={{ base: 16, md: 24 }} ref={ref} aria-label="Call to action">
      <Container maxW="4xl">
        <MotionBox
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <VStack spacing={{ base: 6, md: 8 }} textAlign="center">
            <Heading
              as="h2"
              fontSize={{ base: '3xl', md: '5xl' }}
              fontWeight="extrabold"
              color="white"
              lineHeight="1.15"
            >
              Ready to Stop Guessing
              <br />
              <Text as="span" bgGradient="linear(to-r, brand.orange, brand.red)" bgClip="text">
                and Start Growing?
              </Text>
            </Heading>

            <Text fontSize={{ base: 'md', md: 'lg' }} color="rgba(255, 255, 255, 0.7)" maxW="520px">
              Join businesses that replaced their marketing agency with an AI-powered lead
              generation system.
            </Text>

            <HStack spacing={4} pt={2} flexWrap="wrap" justify="center">
              <Button
                as={Link}
                href={IS_LAUNCHED ? LAUNCHED_SIGNUP_HREF : BETA_JOIN_HREF}
                size="lg"
                bgGradient="linear(to-r, brand.orange, brand.red)"
                color="white"
                borderRadius="full"
                px={8}
                fontWeight="semibold"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(247, 148, 30, 0.4)',
                }}
                transition="all 0.3s ease"
                rightIcon={<FiArrowRight />}
              >
                {PRIMARY_CTA_TEXT}
              </Button>
              <Button
                as={Link}
                href="/how-it-works"
                size="lg"
                variant="outline"
                borderColor="rgba(255, 255, 255, 0.3)"
                color="white"
                borderRadius="full"
                px={8}
                fontWeight="semibold"
                _hover={{
                  borderColor: 'brand.orange',
                  color: 'brand.orange',
                  bg: 'transparent',
                }}
                transition="all 0.3s ease"
              >
                How It Works
              </Button>
            </HStack>

            {/* Trust Signals */}
            <HStack spacing={{ base: 4, md: 8 }} pt={2} flexWrap="wrap" justify="center">
              <HStack spacing={2}>
                <Icon as={FiCheckCircle} color="green.400" boxSize={4} />
                <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)">
                  {IS_LAUNCHED ? 'Cancel anytime' : '$700+ value FREE for 6 months'}
                </Text>
              </HStack>
              <HStack spacing={2}>
                <Icon as={FiCheckCircle} color="green.400" boxSize={4} />
                <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)">
                  {IS_LAUNCHED ? 'Instant activation' : 'White-glove onboarding'}
                </Text>
              </HStack>
            </HStack>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
}
