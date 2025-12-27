'use client';

/**
 * Profile Page
 *
 * Component Hierarchy:
 * App → Profile (this file)
 *
 * User profile with account info, subscription status, and account actions.
 */

import {
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Box,
  Avatar,
  Badge,
  Button,
  Divider,
  Grid,
  GridItem,
  Skeleton,
  useToast,
} from '@chakra-ui/react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useSubscription } from '@/lib/hooks';
import { useAuth } from '@/lib/useAuth';
import { FiMail, FiCalendar, FiShield, FiCreditCard, FiLogOut } from 'react-icons/fi';

export default function ProfilePage() {
  const user = useQuery(api.users.current);
  const {
    tier,
    isActive,
    limits,
    urlsUsed,
    reportsUsed,
    urlsRemaining,
    reportsRemaining,
    isLoading: subLoading,
  } = useSubscription();
  const { logout } = useAuth();
  const toast = useToast();

  const handleSignOut = async () => {
    toast({ title: 'Signing out...', status: 'info' });
    await logout();
  };

  if (!user) {
    return (
      <Box minH="calc(100vh - 64px)" bg="brand.light" p={8}>
        <Container maxW="container.md">
          <VStack spacing={4} align="stretch">
            <Skeleton height="100px" borderRadius="xl" />
            <Skeleton height="200px" borderRadius="xl" />
          </VStack>
        </Container>
      </Box>
    );
  }

  const tierColors: Record<string, string> = {
    solo: 'blue',
    growth: 'green',
    enterprise: 'purple',
  };

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container maxW="container.md" py={{ base: 8, md: 12 }} px={{ base: 4, sm: 6, md: 8 }}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box bg="white" p={8} borderRadius="2xl" shadow="lg">
            <HStack spacing={6}>
              <Avatar size="xl" name={user.name || user.email} bg="brand.orange" color="white" />
              <VStack align="start" spacing={1} flex={1}>
                <Heading size="lg">{user.name || 'Member'}</Heading>
                <HStack color="gray.500" fontSize="sm">
                  <FiMail />
                  <Text>{user.email}</Text>
                </HStack>
                <HStack>
                  <Badge
                    colorScheme={tier ? tierColors[tier] : 'gray'}
                    fontSize="sm"
                    px={2}
                    py={1}
                    borderRadius="full"
                  >
                    {tier?.toUpperCase() || 'FREE'} Plan
                  </Badge>
                  {isActive && <Badge colorScheme="green">Active</Badge>}
                </HStack>
              </VStack>
            </HStack>
          </Box>

          {/* Subscription Usage */}
          <Box bg="white" p={6} borderRadius="xl" shadow="md">
            <VStack align="stretch" spacing={4}>
              <HStack justify="space-between">
                <Heading size="md">Subscription Usage</Heading>
                <Button
                  size="sm"
                  colorScheme="orange"
                  variant="outline"
                  leftIcon={<FiCreditCard />}
                >
                  Manage Plan
                </Button>
              </HStack>
              <Divider />
              <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                <GridItem>
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm" color="gray.500">
                      Projects
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold">
                      {urlsUsed} / {limits?.maxUrls || 1}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      {urlsRemaining} remaining
                    </Text>
                  </VStack>
                </GridItem>
                <GridItem>
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm" color="gray.500">
                      AI Reports
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold">
                      {reportsUsed} / {limits?.maxAiReports || 5}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      {reportsRemaining} remaining
                    </Text>
                  </VStack>
                </GridItem>
                <GridItem>
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm" color="gray.500">
                      Content Pieces
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold">
                      - / {limits?.maxContentPieces || 10}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      This period
                    </Text>
                  </VStack>
                </GridItem>
              </Grid>
            </VStack>
          </Box>

          {/* Account Info */}
          <Box bg="white" p={6} borderRadius="xl" shadow="md">
            <VStack align="stretch" spacing={4}>
              <Heading size="md">Account Details</Heading>
              <Divider />
              <HStack justify="space-between">
                <HStack>
                  <FiCalendar />
                  <Text>Member since</Text>
                </HStack>
                <Text color="gray.600">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </Text>
              </HStack>
              <HStack justify="space-between">
                <HStack>
                  <FiShield />
                  <Text>Role</Text>
                </HStack>
                <Badge>{user.role || 'member'}</Badge>
              </HStack>
            </VStack>
          </Box>

          {/* Actions */}
          <Box bg="white" p={6} borderRadius="xl" shadow="md">
            <VStack align="stretch" spacing={4}>
              <Heading size="md">Account Actions</Heading>
              <Divider />
              <Button
                leftIcon={<FiLogOut />}
                colorScheme="red"
                variant="outline"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
