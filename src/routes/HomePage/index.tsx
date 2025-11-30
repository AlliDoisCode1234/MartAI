'use client';

import { type FC } from 'react';
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
import { ArrowForwardIcon, CheckCircleIcon, StarIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';

const MotionBox = motion(Box);
const MotionStack = motion(Stack);

export const HomePage: FC = () => {
  const router = useRouter();
  const bgGradient = useColorModeValue(
    'radial(brand.orange 1px, transparent 1px)',
    'radial(brand.orange 1px, transparent 1px)'
  );
  const heroGradient = useColorModeValue(
    'linear(to-r, brand.orange, brand.red)',
    'linear(to-r, brand.orange, brand.red)'
  );

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
        <VStack spacing={8} textAlign="center" maxW="3xl" mx="auto">
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
              Automate Your SEO <br />
              <Text as="span" bgGradient={heroGradient} bgClip="text">
                Accelerate Growth
              </Text>
            </Heading>
            <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.500" maxW="2xl" mx="auto">
              MartAI uses advanced AI to analyze your niche, generate keyword clusters, and create high-ranking content briefs in seconds.
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
              Get Started for Free
            </Button>
            <Button
              size="lg"
              height="4rem"
              px={8}
              fontSize="lg"
              variant="outline"
              onClick={() => router.push('/auth/login')}
            >
              Sign In
            </Button>
          </MotionStack>
        </VStack>

        {/* Features Grid */}
        <Box mt={24}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <FeatureCard
              icon={StarIcon}
              title="AI Keyword Clusters"
              description="Automatically group thousands of keywords into topical clusters to dominate your niche."
              delay={0.4}
            />
            <FeatureCard
              icon={CheckCircleIcon}
              title="Content Briefs"
              description="Generate detailed content briefs with H2s, FAQs, and meta tags optimized for search intent."
              delay={0.5}
            />
            <FeatureCard
              icon={ArrowForwardIcon}
              title="Auto-Publishing"
              description="Seamlessly integrate with WordPress to publish content directly from your dashboard."
              delay={0.6}
            />
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
};

const FeatureCard = ({ icon, title, description, delay }: { icon: any; title: string; description: string; delay: number }) => {
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

