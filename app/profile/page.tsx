'use client';

/**
 * Profile Page
 *
 * Component Hierarchy:
 * App → Profile (this file)
 *
 * User identity page following Linear/Vercel patterns:
 * - Avatar with initials
 * - Name, Email
 * - Organization info
 * - Subscription tier with upgrade CTA
 * - Role in organization
 * - Member since
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
  Icon,
  Spinner,
  SimpleGrid,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { useMe } from '@/lib/useMe';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  FiMail,
  FiBriefcase,
  FiCalendar,
  FiShield,
  FiArrowRight,
  FiSettings,
} from 'react-icons/fi';
import Link from 'next/link';
import { formatLongDate } from '@/lib/dateUtils';

// Helper to get initials from name or email
function getInitials(name?: string, email?: string): string {
  if (name) {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return 'U';
}

// Tier badge colors
const tierColors: Record<string, string> = {
  starter: 'gray',
  growth: 'purple',
  enterprise: 'orange',
};

export default function ProfilePage() {
  const { me, loading: meLoading } = useMe();

  // Get user's organizations (returns array with role attached)
  const myOrganizations = useQuery(
    api.organizations.organizations.getMyOrganizations,
    me ? undefined : 'skip'
  );

  // Get first organization (most users have one)
  const organization = myOrganizations && myOrganizations.length > 0 ? myOrganizations[0] : null;
  const userRole = organization?.role || 'owner';

  if (meLoading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="brand.light">
        <Spinner size="xl" color="brand.orange" />
      </Box>
    );
  }

  if (!me) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="brand.light">
        <Text color="gray.600">Unable to load profile</Text>
      </Box>
    );
  }

  const tier = me.subscriptionTier || 'starter';
  const isStarter = tier === 'starter';
  const initials = getInitials(me.name, me.email);
  const memberSince = me._creationTime ? formatLongDate(me._creationTime) : 'Unknown';

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container maxW="container.lg" py={{ base: 8, md: 12 }} px={{ base: 4, md: 8 }}>
        <VStack spacing={8} align="stretch">
          {/* Header Section */}
          <Box bg="white" p={{ base: 6, md: 8 }} borderRadius="xl" shadow="md">
            <HStack spacing={6} align="start" flexWrap="wrap">
              {/* Avatar */}
              <Avatar
                size="2xl"
                name={me.name || me.email}
                bg="brand.orange"
                color="white"
                fontSize="2xl"
              >
                {initials}
              </Avatar>

              {/* User Info */}
              <VStack align="start" spacing={2} flex={1} minW="200px">
                <HStack spacing={3} flexWrap="wrap">
                  <Heading size="xl">{me.name || 'User'}</Heading>
                  <Badge
                    colorScheme={tierColors[tier] || 'gray'}
                    fontSize="sm"
                    px={3}
                    py={1}
                    borderRadius="full"
                    textTransform="capitalize"
                  >
                    {tier}
                  </Badge>
                </HStack>
                <Text color="gray.600" fontSize="lg">
                  {me.email}
                </Text>
                {organization && (
                  <HStack spacing={2} color="gray.500">
                    <Icon as={FiBriefcase} />
                    <Text>{organization.name}</Text>
                    {userRole && (
                      <Badge colorScheme="blue" variant="subtle">
                        {userRole}
                      </Badge>
                    )}
                  </HStack>
                )}
              </VStack>

              {/* Actions */}
              <VStack align="stretch" spacing={2}>
                <Link href="/settings" passHref>
                  <Button variant="outline" leftIcon={<FiSettings />} size="sm" w="full">
                    Edit Settings
                  </Button>
                </Link>
              </VStack>
            </HStack>
          </Box>

          {/* Info Cards */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {/* Email */}
            <Card bg="white" shadow="sm">
              <CardBody>
                <HStack spacing={3}>
                  <Icon as={FiMail} boxSize={5} color="brand.orange" />
                  <Box>
                    <Text fontSize="sm" color="gray.500">
                      Email
                    </Text>
                    <Text fontWeight="medium">{me.email}</Text>
                  </Box>
                </HStack>
              </CardBody>
            </Card>

            {/* Role */}
            <Card bg="white" shadow="sm">
              <CardBody>
                <HStack spacing={3}>
                  <Icon as={FiShield} boxSize={5} color="brand.orange" />
                  <Box>
                    <Text fontSize="sm" color="gray.500">
                      Role
                    </Text>
                    <Text fontWeight="medium" textTransform="capitalize">
                      {userRole}
                    </Text>
                  </Box>
                </HStack>
              </CardBody>
            </Card>

            {/* Member Since */}
            <Card bg="white" shadow="sm">
              <CardBody>
                <HStack spacing={3}>
                  <Icon as={FiCalendar} boxSize={5} color="brand.orange" />
                  <Box>
                    <Text fontSize="sm" color="gray.500">
                      Member Since
                    </Text>
                    <Text fontWeight="medium">{memberSince}</Text>
                  </Box>
                </HStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Organization Section */}
          {organization && (
            <Box bg="white" p={6} borderRadius="lg" shadow="md">
              <VStack align="stretch" spacing={4}>
                <HStack justify="space-between">
                  <Box>
                    <Heading size="md" mb={1}>
                      Organization
                    </Heading>
                    <Text color="gray.600" fontSize="sm">
                      Your team workspace
                    </Text>
                  </Box>
                </HStack>
                <Divider />
                <HStack spacing={4}>
                  <Icon as={FiBriefcase} boxSize={6} color="gray.400" />
                  <Box>
                    <Text fontWeight="medium">{organization.name}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {organization.slug ? `@${organization.slug}` : 'Organization'}
                    </Text>
                  </Box>
                </HStack>
              </VStack>
            </Box>
          )}

          {/* Upgrade CTA for Starter */}
          {isStarter && (
            <Box
              bg="linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)"
              p={6}
              borderRadius="lg"
              shadow="md"
              color="white"
            >
              <HStack justify="space-between" align="center" flexWrap="wrap" spacing={4}>
                <Box>
                  <Heading size="md" mb={1}>
                    Upgrade to Growth
                  </Heading>
                  <Text opacity={0.9}>
                    Get team collaboration, advanced analytics, and priority support.
                  </Text>
                </Box>
                <Button
                  bg="white"
                  color="brand.orange"
                  rightIcon={<FiArrowRight />}
                  _hover={{ bg: 'gray.100' }}
                >
                  Upgrade Now
                </Button>
              </HStack>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
