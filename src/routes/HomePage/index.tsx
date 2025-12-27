'use client';

import { type FC, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  SimpleGrid,
  Icon,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ArrowForwardIcon, CheckCircleIcon, StarIcon, SettingsIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';

const MotionBox = motion(Box);
const MotionStack = motion(Stack);

export const HomePage: FC = () => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated, loading, router]);

  const bgGradient = useColorModeValue(
    'radial(brand.orange 1px, transparent 1px)',
    'radial(brand.orange 1px, transparent 1px)'
  );
  const heroGradient = useColorModeValue(
    'linear(to-r, brand.orange, brand.red)',
    'linear(to-r, brand.orange, brand.red)'
  );

  // Show loading or redirect in progress
  if (loading || isAuthenticated) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Text color="gray.500">Loading...</Text>
      </Box>
    );
  }

  return (
    <Box position="relative" overflow="hidden">
      {/* Background Pattern */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.1}
        bgImage={bgGradient}
        bgSize="20px 20px"
        zIndex={-1}
      />

      <Container maxW="container.xl" pt={{ base: 20, md: 32 }} pb={{ base: 20, md: 24 }}>
        <VStack spacing={8} textAlign="center" maxW="4xl" mx="auto">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            // @ts-ignore
            transition={{ duration: 0.5 }}
          >
            <Heading
              as="h1"
              fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
              fontWeight="bold"
              lineHeight="1.1"
              letterSpacing="tight"
              mb={4}
            >
              Your Autonomous <br />
              <Text as="span" bgGradient={heroGradient} bgClip="text">
                SEO & Marketing Agent
              </Text>
            </Heading>
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color="gray.600"
              maxW="2xl"
              mx="auto"
              lineHeight="1.6"
            >
              Stop drowning in data dashboards. Phoo is an intelligent agent that audits your site,
              builds your strategy, writes your content, and publishes it for you.
              <br />
              <Text as="span" fontWeight="bold">
                Outcomes, not just analytics.
              </Text>
            </Text>
          </MotionBox>

          <MotionStack
            direction={{ base: 'column', sm: 'row' }}
            spacing={4}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            // @ts-ignore
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              size="lg"
              height="4rem"
              px={8}
              fontSize="lg"
              colorScheme="brand"
              variant="solid"
              rightIcon={<ArrowForwardIcon />}
              onClick={() => router.push('/onboarding')}
              boxShadow="xl"
              _hover={{ transform: 'translateY(-2px)', boxShadow: '2xl' }}
            >
              Hire Phoo
            </Button>
            <Button
              size="lg"
              height="4rem"
              px={8}
              fontSize="lg"
              variant="outline"
              onClick={() => router.push('/pricing')}
            >
              See Pricing
            </Button>
          </MotionStack>
        </VStack>

        {/* Features Grid */}
        <Box mt={24}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <FeatureCard
              icon={SettingsIcon}
              title="Autonomous Strategy"
              description="Phoo analyzes 10,000+ keywords and builds a 12-week content calendar focused on 'Easy Wins' and revenue."
              delay={0.4}
            />
            <FeatureCard
              icon={StarIcon}
              title="Agentic Writing"
              description="From cluster to published post in minutes. Phoo writes high-ranking content in your brand voice."
              delay={0.5}
            />
            <FeatureCard
              icon={CheckCircleIcon}
              title="Done-For-You Growth"
              description="Integrated directly with WordPress & Shopify. You approve, Phoo publishes. No more copy-pasting."
              delay={0.6}
            />
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
  delay,
}: {
  icon: any;
  title: string;
  description: string;
  delay: number;
}) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      // @ts-ignore
      transition={{ duration: 0.5, delay }}
      p={8}
      bg="whiteAlpha.500"
      backdropFilter="blur(10px)"
      borderRadius="2xl"
      borderWidth="1px"
      borderColor="gray.100"
      _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg', borderColor: 'brand.orange' }}
    >
      <Box
        w={12}
        h={12}
        bg="brand.50"
        color="brand.orange"
        borderRadius="lg"
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb={4}
      >
        <Icon as={icon} boxSize={6} />
      </Box>
      <Heading size="md" mb={2}>
        {title}
      </Heading>
      <Text color="gray.600">{description}</Text>
    </MotionBox>
  );
};
