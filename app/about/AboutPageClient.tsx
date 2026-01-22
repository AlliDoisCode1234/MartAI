'use client';

/**
 * About Page Client Component
 *
 * Component Hierarchy:
 * App → AboutPage (server) → AboutPageClient (this file)
 *
 * Contains the actual UI content for the about page.
 * GEO-optimized copy explaining Phoo's dual SEO+GEO approach.
 */

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Icon,
  HStack,
  Button,
  Divider,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  FiTarget,
  FiZap,
  FiTrendingUp,
  FiArrowRight,
  FiSearch,
  FiCpu,
  FiAward,
} from 'react-icons/fi';

const MotionBox = motion(Box);

interface ValueCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function ValueCard({ icon, title, description }: ValueCardProps) {
  return (
    <Box
      bg="rgba(255, 255, 255, 0.03)"
      backdropFilter="blur(10px)"
      border="1px solid"
      borderColor="rgba(255, 255, 255, 0.1)"
      borderRadius="xl"
      p={6}
      transition="all 0.3s"
      _hover={{
        borderColor: 'brand.orange',
        transform: 'translateY(-4px)',
      }}
    >
      <VStack align="start" spacing={4}>
        <Box
          w={12}
          h={12}
          bg="rgba(255, 157, 0, 0.1)"
          borderRadius="lg"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={icon} boxSize={6} color="brand.orange" />
        </Box>
        <Heading size="md" color="white">
          {title}
        </Heading>
        <Text color="gray.400" lineHeight="tall">
          {description}
        </Text>
      </VStack>
    </Box>
  );
}

export function AboutPageClient() {
  const router = useRouter();

  return (
    <Box bg="#0A0A0A" minH="100vh">
      {/* Hero Section */}
      <Container maxW="container.xl" pt={{ base: 16, md: 24 }} pb={16}>
        <VStack spacing={8} textAlign="center" maxW="4xl" mx="auto">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Text
              color="brand.orange"
              fontWeight="bold"
              fontSize="sm"
              textTransform="uppercase"
              letterSpacing="wide"
              mb={4}
            >
              About Phoo.ai
            </Text>
            <Heading
              as="h1"
              fontSize={{ base: '3xl', md: '5xl' }}
              fontWeight="bold"
              color="white"
              lineHeight="shorter"
            >
              The First SEO Platform Built for the{' '}
              <Text as="span" color="brand.orange">
                AI Era
              </Text>
            </Heading>
          </MotionBox>

          <Text fontSize="xl" color="gray.400" maxW="3xl" lineHeight="tall">
            Google&apos;s AI now answers questions before showing links. Traditional SEO isn&apos;t
            enough anymore. Phoo optimizes your content for both search engines AND AI-generated
            results—so your business becomes the answer, not just a search result.
          </Text>
        </VStack>
      </Container>

      {/* What is GEO Section */}
      <Box bg="rgba(255, 157, 0, 0.03)" py={20}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={16} alignItems="center">
            <VStack align="start" spacing={6}>
              <Text
                color="brand.orange"
                fontWeight="bold"
                fontSize="sm"
                textTransform="uppercase"
                letterSpacing="wide"
              >
                What is GEO?
              </Text>
              <Heading as="h2" size="xl" color="white">
                Generative Engine Optimization
              </Heading>
              <Text color="gray.400" fontSize="lg" lineHeight="tall">
                <strong style={{ color: 'white' }}>GEO (Generative Engine Optimization)</strong> is
                the practice of optimizing content to be cited by AI systems like Google AI
                Overviews, ChatGPT, and Perplexity. While traditional SEO focuses on ranking in
                search results, GEO ensures your content is the <em>source</em> AI systems reference
                when answering questions.
              </Text>
              <Text color="gray.400" fontSize="lg" lineHeight="tall">
                Phoo is the first platform to combine both. We don&apos;t just help you rank—we help
                you become the authoritative source that AI trusts.
              </Text>
            </VStack>

            <VStack spacing={4}>
              <Box
                bg="rgba(255, 255, 255, 0.02)"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.1)"
                borderRadius="xl"
                p={6}
                w="full"
              >
                <HStack spacing={4} mb={4}>
                  <Icon as={FiSearch} color="gray.500" boxSize={5} />
                  <Text color="gray.500" fontWeight="medium">
                    Traditional SEO
                  </Text>
                </HStack>
                <Text color="gray.400">&ldquo;Rank on page 1 for target keywords&rdquo;</Text>
              </Box>
              <Icon as={FiArrowRight} color="brand.orange" boxSize={6} />
              <Box
                bg="rgba(255, 157, 0, 0.1)"
                border="1px solid"
                borderColor="brand.orange"
                borderRadius="xl"
                p={6}
                w="full"
              >
                <HStack spacing={4} mb={4}>
                  <Icon as={FiCpu} color="brand.orange" boxSize={5} />
                  <Text color="brand.orange" fontWeight="medium">
                    SEO + GEO with Phoo
                  </Text>
                </HStack>
                <Text color="white">
                  &ldquo;Be the source Google&apos;s AI cites when answering questions&rdquo;
                </Text>
              </Box>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Values Section */}
      <Container maxW="container.xl" py={20}>
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Text
              color="brand.orange"
              fontWeight="bold"
              fontSize="sm"
              textTransform="uppercase"
              letterSpacing="wide"
            >
              Why Phoo
            </Text>
            <Heading as="h2" size="xl" color="white">
              Built for the Future of Search
            </Heading>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
            <ValueCard
              icon={FiTarget}
              title="Answer-First Content"
              description="Our AI structures every piece of content to directly answer user questions—making your business the source Google's AI cites."
            />
            <ValueCard
              icon={FiAward}
              title="E-E-A-T Signals"
              description="Experience, Expertise, Authoritativeness, and Trust are baked into every article. AI systems recognize and prioritize authoritative sources."
            />
            <ValueCard
              icon={FiTrendingUp}
              title="Semantic Authority"
              description="We build topic clusters that establish you as THE authority in your space—so AI systems consistently reference your content."
            />
          </SimpleGrid>
        </VStack>
      </Container>

      <Divider borderColor="rgba(255, 255, 255, 0.1)" />

      {/* CTA Section */}
      <Container maxW="container.xl" py={20}>
        <VStack spacing={8} textAlign="center">
          <Heading size="lg" color="white">
            Ready to Own the AI Search Results?
          </Heading>
          <Text color="gray.400" fontSize="lg" maxW="2xl">
            Join the businesses that are already being cited by Google&apos;s AI. Start your trial
            today.
          </Text>
          <HStack spacing={4}>
            <Button
              size="lg"
              bg="brand.orange"
              color="white"
              rightIcon={<Icon as={FiArrowRight} />}
              _hover={{ bg: 'orange.500', transform: 'translateY(-2px)' }}
              onClick={() => router.push('/onboarding')}
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              borderColor="rgba(255, 255, 255, 0.2)"
              color="white"
              _hover={{ bg: 'rgba(255, 255, 255, 0.05)' }}
              onClick={() => router.push('/how-it-works')}
            >
              See How It Works
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}
