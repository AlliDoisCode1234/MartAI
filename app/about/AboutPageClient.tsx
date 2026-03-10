'use client';

/**
 * About Page Client Component
 *
 * Component Hierarchy:
 * App -> AboutPage (server) -> AboutPageClient (this file)
 *   ├── MegaMenuHeader
 *   ├── Hero Section
 *   ├── What is GEO Section
 *   ├── Values Section
 *   ├── CTA Section
 *   └── PremiumFooter
 *
 * GEO-optimized copy explaining Phoo's dual SEO+GEO approach.
 * Light mode design consistent with rest of marketing site.
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
import { FiTarget, FiTrendingUp, FiArrowRight, FiSearch, FiCpu, FiAward } from 'react-icons/fi';
import { MegaMenuHeader, PremiumFooter } from '@/src/components/marketing';
import { IS_LAUNCHED, BETA_JOIN_HREF, LAUNCHED_SIGNUP_HREF } from '@/lib/constants/featureFlags';

const MotionBox = motion(Box);

interface ValueCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function ValueCard({ icon, title, description }: ValueCardProps) {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="2xl"
      p={8}
      position="relative"
      overflow="hidden"
      boxShadow="0 4px 20px rgba(0, 0, 0, 0.06)"
      transition="all 0.3s ease"
      _hover={{
        borderColor: 'orange.200',
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.10)',
      }}
    >
      {/* Colored top accent stripe */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="3px"
        bgGradient="linear(to-r, brand.orange, brand.red)"
      />
      <VStack align="start" spacing={4}>
        <Box bg="orange.50" p={3} borderRadius="xl" border="1px solid" borderColor="orange.100">
          <Icon as={icon} boxSize={6} color="brand.orange" />
        </Box>
        <Heading as="h3" size="md" color="gray.800">
          {title}
        </Heading>
        <Text color="gray.600" lineHeight="tall">
          {description}
        </Text>
      </VStack>
    </Box>
  );
}

export function AboutPageClient() {
  return (
    <>
      <MegaMenuHeader />

      <Box bgGradient="linear(180deg, white 0%, #FFF8F0 40%, #FFF5EB 100%)" minH="100vh">
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
                color="gray.800"
                lineHeight="shorter"
              >
                The First SEO Platform Built for the{' '}
                <Text as="span" bgGradient="linear(to-r, brand.orange, brand.red)" bgClip="text">
                  AI Era
                </Text>
              </Heading>
            </MotionBox>

            <Text fontSize="xl" color="gray.600" maxW="3xl" lineHeight="tall">
              Google&apos;s AI now answers questions before showing links. Traditional SEO
              isn&apos;t enough anymore. Phoo optimizes your content for both search engines AND
              AI-generated results—so your business becomes the answer, not just a search result.
            </Text>
          </VStack>
        </Container>

        {/* What is GEO Section */}
        <Box bg="#F8FAFC" py={20}>
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
                <Heading as="h2" size="xl" color="gray.800">
                  Generative Engine Optimization
                </Heading>
                <Text color="gray.600" fontSize="lg" lineHeight="tall">
                  <strong style={{ color: '#1A202C' }}>GEO (Generative Engine Optimization)</strong>{' '}
                  is the practice of optimizing content to be cited by AI systems like Google AI
                  Overviews, ChatGPT, and Perplexity. While traditional SEO focuses on ranking in
                  search results, GEO ensures your content is the <em>source</em> AI systems
                  reference when answering questions.
                </Text>
                <Text color="gray.600" fontSize="lg" lineHeight="tall">
                  Phoo is the first platform to combine both. We don&apos;t just help you rank—we
                  help you become the authoritative source that AI trusts.
                </Text>
              </VStack>

              <VStack spacing={4}>
                <Box
                  bg="white"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="2xl"
                  p={6}
                  w="full"
                  boxShadow="0 4px 16px rgba(0, 0, 0, 0.06)"
                >
                  <HStack spacing={4} mb={4}>
                    <Icon as={FiSearch} color="gray.400" boxSize={5} />
                    <Text color="gray.500" fontWeight="medium">
                      Traditional SEO
                    </Text>
                  </HStack>
                  <Text color="gray.600">&ldquo;Rank on page 1 for target keywords&rdquo;</Text>
                </Box>
                <Icon as={FiArrowRight} color="brand.orange" boxSize={6} />
                <Box
                  bg="orange.50"
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
                  <Text color="gray.800">
                    &ldquo;Be the source Google&apos;s AI cites when answering questions&rdquo;
                  </Text>
                </Box>
              </VStack>
            </SimpleGrid>
          </Container>
        </Box>

        {/* Values Section */}
        <Box bg="#F8FAFC" py={20}>
          <Container maxW="container.xl">
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
                <Heading as="h2" size="xl" color="gray.800">
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
        </Box>

        <Divider borderColor="gray.200" />

        {/* CTA Section */}
        <Box bgGradient="linear(to-br, brand.orange, orange.600)" py={20}>
          <Container maxW="container.xl">
            <VStack spacing={8} textAlign="center">
              <Heading size="lg" color="white">
                Ready to Own the AI Search Results?
              </Heading>
              <Text color="whiteAlpha.900" fontSize="lg" maxW="2xl">
                Join the businesses that are already being cited by Google&apos;s AI.
              </Text>
              <HStack spacing={4}>
                <Button
                  as="a"
                  href={IS_LAUNCHED ? LAUNCHED_SIGNUP_HREF : BETA_JOIN_HREF}
                  size="lg"
                  bg="white"
                  color="brand.orange"
                  borderRadius="full"
                  px={8}
                  fontWeight="bold"
                  rightIcon={<Icon as={FiArrowRight} />}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                  }}
                  transition="all 0.3s ease"
                >
                  {IS_LAUNCHED ? 'Start Getting Leads' : 'Join Beta'}
                </Button>
                <Button
                  as="a"
                  href="/how-it-works"
                  size="lg"
                  variant="outline"
                  borderColor="whiteAlpha.600"
                  color="white"
                  borderRadius="full"
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  See How It Works
                </Button>
              </HStack>
            </VStack>
          </Container>
        </Box>
      </Box>

      <PremiumFooter />
    </>
  );
}
