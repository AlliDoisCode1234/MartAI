'use client';

/**
 * AboutPhooSection
 *
 * Component Hierarchy:
 * App → LandingPage → AboutPhooSection
 *
 * Explains the origin and meaning of Phoo (from Metamorphoo).
 * Features transformation metaphor with animated gradient text.
 */

import { Box, Container, Heading, Text, VStack, HStack, Icon } from '@chakra-ui/react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Sparkles } from 'lucide-react';

const MotionBox = motion(Box);
const MotionText = motion(Text);

export function AboutPhooSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-100px' });

  return (
    <Box as="section" py={{ base: 16, md: 24 }} bg="white" ref={ref}>
      <Container maxW="4xl">
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <VStack spacing={8} textAlign="center">
            {/* Greek etymology with styled gradient */}
            <VStack spacing={3}>
              <HStack spacing={2} justify="center">
                <Icon as={Sparkles} color="brand.orange" boxSize={5} />
                <Text
                  fontSize={{ base: 'xs', md: 'sm' }}
                  textTransform="uppercase"
                  letterSpacing="widest"
                  color="gray.500"
                  fontWeight="semibold"
                >
                  The Origin Story
                </Text>
                <Icon as={Sparkles} color="brand.orange" boxSize={5} />
              </HStack>

              <Heading
                as="h2"
                fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                fontWeight="bold"
                bgGradient="linear(to-r, brand.orange, orange.400, yellow.500)"
                bgClip="text"
              >
                Metamorphoo
              </Heading>

              <Text fontSize={{ base: 'lg', md: 'xl' }} fontStyle="italic" color="gray.600">
                /met-a-mor-FOO/ — Greek: &ldquo;to transform&rdquo;
              </Text>
            </VStack>

            {/* Transformation narrative - Option A */}
            <VStack spacing={6} maxW="2xl">
              <MotionText
                fontSize={{ base: 'md', md: 'lg' }}
                color="gray.700"
                lineHeight="tall"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                You&apos;re great at what you do. But if Google can&apos;t find you, neither can
                your customers.
              </MotionText>

              <MotionBox
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                bgGradient="linear(to-br, orange.50, white)"
                p={8}
                borderRadius="2xl"
                border="2px solid"
                borderColor="brand.orange"
                boxShadow="0 10px 40px rgba(255, 122, 0, 0.15)"
                w="100%"
                position="relative"
                overflow="hidden"
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  bgGradient: 'linear(to-r, brand.orange, orange.400)',
                }}
              >
                <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.800" fontWeight="bold" mb={5}>
                  Phoo transforms your expertise into content that:
                </Text>
                <VStack align="start" spacing={4} pl={2}>
                  <HStack spacing={3}>
                    <Box
                      w={8}
                      h={8}
                      bg="brand.orange"
                      borderRadius="lg"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                    >
                      <Text color="white" fontWeight="bold" fontSize="sm">
                        1
                      </Text>
                    </Box>
                    <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.700">
                      <Text as="span" fontWeight="bold" color="gray.800">
                        Ranks on Google
                      </Text>{' '}
                      so customers find you first
                    </Text>
                  </HStack>
                  <HStack spacing={3}>
                    <Box
                      w={8}
                      h={8}
                      bg="brand.orange"
                      borderRadius="lg"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                    >
                      <Text color="white" fontWeight="bold" fontSize="sm">
                        2
                      </Text>
                    </Box>
                    <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.700">
                      <Text as="span" fontWeight="bold" color="gray.800">
                        Gets cited by ChatGPT
                      </Text>{' '}
                      so AI recommends you
                    </Text>
                  </HStack>
                  <HStack spacing={3}>
                    <Box
                      w={8}
                      h={8}
                      bg="brand.orange"
                      borderRadius="lg"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                    >
                      <Text color="white" fontWeight="bold" fontSize="sm">
                        3
                      </Text>
                    </Box>
                    <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.700">
                      <Text as="span" fontWeight="bold" color="gray.800">
                        Brings leads to your door
                      </Text>{' '}
                      without hiring an agency
                    </Text>
                  </HStack>
                </VStack>
              </MotionBox>

              <MotionText
                fontSize={{ base: 'md', md: 'lg' }}
                color="gray.500"
                fontStyle="italic"
                fontWeight="medium"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                That&apos;s the transformation.
              </MotionText>
            </VStack>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
}
