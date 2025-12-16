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
} from '@chakra-ui/react';
import { useSubscription } from '@/lib/hooks';
import { FiCheck, FiArrowUp, FiCreditCard, FiCalendar, FiPackage } from 'react-icons/fi';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const PLANS = [
  {
    id: 'solo',
    name: 'Solo',
    price: 49,
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
    features: [
      '3 Websites',
      '15 AI Reports/mo',
      '20 Content Pieces/mo',
      'Priority Support',
      'API Access',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 499,
    urls: 10,
    reports: 50,
    content: 100,
    features: [
      '10 Websites',
      '50 AI Reports/mo',
      '100 Content Pieces/mo',
      'Dedicated Account Manager',
      'Custom Integrations',
    ],
  },
];

export default function SubscriptionPage() {
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
                <Button colorScheme="orange" leftIcon={<FiArrowUp />}>
                  Upgrade Plan
                </Button>
                <Button variant="ghost" size="sm" leftIcon={<FiCreditCard />}>
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
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
              {PLANS.map((plan, i) => (
                <MotionBox
                  key={plan.id}
                  bg={cardBg}
                  p={6}
                  borderRadius="xl"
                  shadow="md"
                  borderWidth="2px"
                  borderColor={plan.id === tier ? 'brand.orange' : borderColor}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <VStack align="stretch" spacing={4}>
                    <VStack align="start" spacing={1}>
                      <HStack justify="space-between" w="full">
                        <Heading size="md">{plan.name}</Heading>
                        {plan.id === tier && <Badge colorScheme="orange">Current</Badge>}
                      </HStack>
                      <HStack align="baseline">
                        <Text fontSize="3xl" fontWeight="bold">
                          ${plan.price}
                        </Text>
                        <Text color="gray.500">/mo</Text>
                      </HStack>
                    </VStack>
                    <Divider />
                    <VStack align="start" spacing={2}>
                      {plan.features.map((feat) => (
                        <HStack key={feat}>
                          <Icon as={FiCheck} color="green.500" />
                          <Text fontSize="sm">{feat}</Text>
                        </HStack>
                      ))}
                    </VStack>
                    <Button
                      colorScheme={plan.id === tier ? 'gray' : 'orange'}
                      variant={plan.id === tier ? 'outline' : 'solid'}
                      isDisabled={plan.id === tier}
                      w="full"
                    >
                      {plan.id === tier ? 'Current Plan' : 'Upgrade'}
                    </Button>
                  </VStack>
                </MotionBox>
              ))}
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
