'use client';

/**
 * Subscription Page
 *
 * Component Hierarchy:
 * App → Subscription (this file)
 *
 * Manage subscription plan, view usage, and billing history.
 */

import {
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Box,
  Button,
  Badge,
  Divider,
  Grid,
  GridItem,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Skeleton,
  Icon,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useSubscription } from '@/lib/hooks';
import { useAuth } from '@/lib/useAuth';
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { FiCheck, FiArrowUp, FiCreditCard, FiCalendar, FiPackage } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BRAND } from '@/lib/constants/brand';

const MotionBox = motion(Box);

const PLANS = [
  {
    id: 'solo',
    name: 'Solo',
    price: 59,
    urls: 1,
    reports: 4,
    content: 4,
    features: ['1 Website', '4 AI Reports/mo', '4 Content Pieces/mo', 'Email Support'],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 149,
    urls: 3,
    reports: 15,
    content: 20,
    popular: true,
    features: [
      '3 Websites',
      '15 AI Reports/mo',
      '20 Content Pieces/mo',
      'Priority Support',
      '3 Team Members',
    ],
  },
  {
    id: 'team',
    name: 'Team',
    price: 299,
    urls: 10,
    reports: 30,
    content: 50,
    features: [
      '10 Websites',
      '30 AI Reports/mo',
      '50 Content Pieces/mo',
      'White-label Reports',
      '10 Team Members',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: null, // Custom pricing
    urls: -1, // Unlimited
    reports: -1,
    content: -1,
    features: [
      'Unlimited Websites',
      'Unlimited Reports',
      'Unlimited Content',
      'Dedicated Support',
      'Custom Integrations',
    ],
  },
];

// Stripe Price IDs for each plan (set in Stripe Dashboard)
// TODO: Move to environment variables for production
const STRIPE_PRICE_IDS: Record<string, string> = {
  solo: process.env.NEXT_PUBLIC_STRIPE_PRICE_SOLO || 'price_solo_placeholder',
  growth: process.env.NEXT_PUBLIC_STRIPE_PRICE_GROWTH || 'price_growth_placeholder',
  team: process.env.NEXT_PUBLIC_STRIPE_PRICE_TEAM || 'price_team_placeholder',
  enterprise: '', // Enterprise is custom pricing
};

export default function SubscriptionPage() {
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuth();
  const {
    tier,
    isActive,
    limits,
    urlsUsed,
    reportsUsed,
    urlsRemaining,
    reportsRemaining,
    isLoading,
    subscription,
  } = useSubscription();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Stripe actions
  const createCheckout = useAction(api.stripe.checkout.createSubscriptionCheckout);
  const createPortal = useAction(api.stripe.checkout.createPortalSession);
  const [upgradeLoading, setUpgradeLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  // Handle upgrade to a specific plan
  const handleUpgrade = async (planId: string) => {
    const priceId = STRIPE_PRICE_IDS[planId];
    if (!priceId || planId === 'enterprise') {
      // Enterprise plan - contact sales
      window.location.href = `mailto:${BRAND.supportEmail}?subject=Enterprise Plan Inquiry`;
      return;
    }

    setUpgradeLoading(planId);
    try {
      const result = await createCheckout({ priceId });
      if (result.url) {
        window.location.href = result.url;
      } else {
        toast({
          title: 'Checkout session created',
          description: 'Redirecting to payment...',
          status: 'info',
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: 'Upgrade failed',
        description: error instanceof Error ? error.message : 'Please try again',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setUpgradeLoading(null);
    }
  };

  // Handle opening billing portal
  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      const result = await createPortal({ returnUrl: window.location.href });
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      toast({
        title: 'Could not open billing portal',
        description: error instanceof Error ? error.message : 'Please try again',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setPortalLoading(false);
    }
  };

  // Beta users can't access billing until their beta expires
  const isActiveBetaUser =
    user?.isBetaUser && user?.betaExpiresAt && user.betaExpiresAt > Date.now();

  useEffect(() => {
    if (isActiveBetaUser) {
      router.replace('/dashboard');
    }
  }, [isActiveBetaUser, router]);

  // Show loading while redirecting or loading subscription
  if (isActiveBetaUser) {
    return null;
  }

  const currentPlan = PLANS.find((p) => p.id === tier) || PLANS[0];

  if (isLoading) {
    return (
      <Box minH="calc(100vh - 64px)" bg="brand.light" p={8}>
        <Container maxW="container.xl">
          <VStack spacing={6} align="stretch">
            <Skeleton height="60px" width="300px" />
            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} height="400px" borderRadius="xl" />
              ))}
            </Grid>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container maxW="container.xl" py={{ base: 8, md: 12 }} px={{ base: 4, sm: 6, md: 8 }}>
        <VStack spacing={10} align="stretch">
          {/* Header */}
          <VStack align="start" spacing={2}>
            <Heading size="2xl" fontWeight="bold" fontFamily="heading" color="gray.800">
              Subscription
            </Heading>
            <Text color="gray.600">Manage your plan and view usage</Text>
          </VStack>

          {/* Current Plan Status */}
          <MotionBox
            bg={cardBg}
            p={6}
            borderRadius="xl"
            shadow="lg"
            borderWidth="2px"
            borderColor="brand.orange"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <HStack justify="space-between" align="start">
              <VStack align="start" spacing={3}>
                <HStack>
                  <Icon as={FiPackage} boxSize={6} color="brand.orange" />
                  <Heading size="md">Current Plan</Heading>
                </HStack>
                <HStack spacing={3}>
                  <Text fontSize="3xl" fontWeight="bold">
                    {currentPlan.name}
                  </Text>
                  <Badge colorScheme={isActive ? 'green' : 'red'} fontSize="sm">
                    {isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </HStack>
                <Text color="gray.500">${currentPlan.price}/month</Text>
              </VStack>
              <VStack align="end" spacing={2}>
                <Button
                  colorScheme="orange"
                  leftIcon={<FiArrowUp />}
                  onClick={handleManageBilling}
                  isLoading={portalLoading}
                  loadingText="Opening..."
                >
                  Upgrade Plan
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<FiCreditCard />}
                  onClick={handleManageBilling}
                  isLoading={portalLoading}
                >
                  Manage Billing
                </Button>
              </VStack>
            </HStack>
          </MotionBox>

          {/* Usage Stats */}
          <Box bg={cardBg} p={6} borderRadius="xl" shadow="md">
            <Heading size="md" mb={6}>
              This Month's Usage
            </Heading>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
              <GridItem>
                <VStack align="start" spacing={2}>
                  <Text fontWeight="semibold" color="gray.600">
                    Projects
                  </Text>
                  <HStack w="full" justify="space-between">
                    <Text fontSize="2xl" fontWeight="bold">
                      {urlsUsed}
                    </Text>
                    <Text color="gray.500">/ {limits?.maxUrls || 1}</Text>
                  </HStack>
                  <Progress
                    value={(urlsUsed / (limits?.maxUrls || 1)) * 100}
                    colorScheme="orange"
                    borderRadius="full"
                    size="sm"
                    w="full"
                  />
                  <Text fontSize="xs" color="gray.400">
                    {urlsRemaining} remaining
                  </Text>
                </VStack>
              </GridItem>
              <GridItem>
                <VStack align="start" spacing={2}>
                  <Text fontWeight="semibold" color="gray.600">
                    AI Reports
                  </Text>
                  <HStack w="full" justify="space-between">
                    <Text fontSize="2xl" fontWeight="bold">
                      {reportsUsed}
                    </Text>
                    <Text color="gray.500">/ {limits?.maxAiReports || 4}</Text>
                  </HStack>
                  <Progress
                    value={(reportsUsed / (limits?.maxAiReports || 4)) * 100}
                    colorScheme="blue"
                    borderRadius="full"
                    size="sm"
                    w="full"
                  />
                  <Text fontSize="xs" color="gray.400">
                    {reportsRemaining} remaining
                  </Text>
                </VStack>
              </GridItem>
              <GridItem>
                <VStack align="start" spacing={2}>
                  <Text fontWeight="semibold" color="gray.600">
                    Content Pieces
                  </Text>
                  <HStack w="full" justify="space-between">
                    <Text fontSize="2xl" fontWeight="bold">
                      0
                    </Text>
                    <Text color="gray.500">/ {limits?.maxContentPieces || 4}</Text>
                  </HStack>
                  <Progress value={0} colorScheme="purple" borderRadius="full" size="sm" w="full" />
                  <Text fontSize="xs" color="gray.400">
                    {limits?.maxContentPieces || 4} remaining
                  </Text>
                </VStack>
              </GridItem>
            </Grid>
          </Box>

          {/* Plan Comparison */}
          <Box>
            <Heading size="md" mb={6}>
              Available Plans
            </Heading>
            <Grid
              templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
              gap={4}
            >
              {PLANS.map((plan, i) => {
                const currentTierIndex = PLANS.findIndex((p) => p.id === tier);
                const planIndex = PLANS.findIndex((p) => p.id === plan.id);
                const isCurrent = plan.id === tier;
                const isUpgrade = planIndex > currentTierIndex;
                const isDowngrade = planIndex < currentTierIndex;

                return (
                  <MotionBox
                    key={plan.id}
                    bg={cardBg}
                    p={5}
                    borderRadius="xl"
                    shadow="md"
                    borderWidth="2px"
                    borderColor={
                      isCurrent
                        ? 'brand.orange'
                        : 'popular' in plan && plan.popular
                          ? 'purple.300'
                          : borderColor
                    }
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    h="full"
                    display="flex"
                    flexDirection="column"
                    position="relative"
                  >
                    {'popular' in plan && plan.popular && !isCurrent && (
                      <Badge
                        position="absolute"
                        top={-2}
                        right={-2}
                        colorScheme="purple"
                        px={2}
                        py={1}
                        borderRadius="full"
                        fontSize="xs"
                      >
                        Popular
                      </Badge>
                    )}
                    <VStack align="stretch" spacing={3} flex={1}>
                      <VStack align="start" spacing={1}>
                        <HStack justify="space-between" w="full">
                          <Heading size="sm">{plan.name}</Heading>
                          {isCurrent && <Badge colorScheme="orange">Current</Badge>}
                        </HStack>
                        <HStack align="baseline">
                          <Text fontSize="2xl" fontWeight="bold">
                            {plan.price === null ? 'Custom' : `$${plan.price}`}
                          </Text>
                          {plan.price !== null && (
                            <Text color="gray.500" fontSize="sm">
                              /mo
                            </Text>
                          )}
                        </HStack>
                      </VStack>
                      <Divider />
                      <VStack align="start" spacing={1} flex={1}>
                        {plan.features.map((feat) => (
                          <HStack key={feat} spacing={2}>
                            <Icon as={FiCheck} color="green.500" boxSize={3} />
                            <Text fontSize="xs">{feat}</Text>
                          </HStack>
                        ))}
                      </VStack>
                      {isCurrent ? (
                        <Button colorScheme="gray" variant="outline" w="full" mt="auto" isDisabled>
                          Current Plan
                        </Button>
                      ) : isUpgrade ? (
                        <Button
                          colorScheme={plan.price === null ? 'purple' : 'orange'}
                          w="full"
                          mt="auto"
                          leftIcon={plan.price === null ? undefined : <FiArrowUp />}
                          onClick={() => handleUpgrade(plan.id)}
                          isLoading={upgradeLoading === plan.id}
                          loadingText="Redirecting..."
                        >
                          {plan.price === null ? 'Contact Sales' : 'Upgrade'}
                        </Button>
                      ) : isDowngrade ? (
                        <Button
                          variant="ghost"
                          colorScheme="gray"
                          w="full"
                          mt="auto"
                          size="sm"
                          as="a"
                          href={`mailto:${BRAND.supportEmail}?subject=Downgrade Request`}
                        >
                          Contact Support
                        </Button>
                      ) : null}
                    </VStack>
                  </MotionBox>
                );
              })}
            </Grid>
          </Box>

          {/* Billing History Placeholder */}
          <Box bg={cardBg} p={6} borderRadius="xl" shadow="md">
            <HStack justify="space-between" mb={4}>
              <Heading size="md">Billing History</Heading>
              <Button variant="ghost" size="sm" leftIcon={<FiCalendar />}>
                View All
              </Button>
            </HStack>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Description</Th>
                  <Th>Amount</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td colSpan={4}>
                    <Text color="gray.500" textAlign="center" py={4}>
                      No billing history yet
                    </Text>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
