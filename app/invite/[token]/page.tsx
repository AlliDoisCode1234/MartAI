'use client';

/**
 * Invite Accept Page
 *
 * Component Hierarchy:
 * App → Invite → [token] → page.tsx (this file)
 *
 * Security:
 * - Token validated via Convex query (no auth required to view)
 * - Accept requires auth + email match (enforced in mutation)
 * - RLS: User can only accept invites to their own email
 */

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Spinner,
  Icon,
  Alert,
  AlertIcon,
  HStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useConvexAuth, useQuery, useMutation } from 'convex/react';
import { useAuthActions } from '@convex-dev/auth/react';
import { api } from '@/convex/_generated/api';
import { FiMail, FiUsers, FiCheckCircle, FiAlertTriangle, FiLogIn, FiLogOut } from 'react-icons/fi';
import Link from 'next/link';

const MotionBox = motion(Box);

export default function InviteAcceptPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.current);

  // Validate token (public query - no auth needed to view invite details)
  const validation = useQuery(api.teams.invitations.validateInviteToken, { token });
  const acceptInvite = useMutation(api.teams.invitations.acceptInvitation);

  const [accepting, setAccepting] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Handle sign out (preserves current URL so user can sign back in)
  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      // Page will re-render as unauthenticated, showing "Sign In to Accept"
    } catch (err) {
      console.error('Sign out failed:', err);
    } finally {
      setSigningOut(false);
    }
  };

  // Handle accept
  const handleAccept = async () => {
    if (!isAuthenticated || !user) return;

    setAccepting(true);
    setError(null);

    try {
      await acceptInvite({ token });
      setSuccess(true);
      // Redirect to dashboard after short delay
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept invitation');
    } finally {
      setAccepting(false);
    }
  };

  // Loading state
  if (authLoading || validation === undefined) {
    return (
      <Box
        minH="100vh"
        bg="linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={4}>
          <Spinner size="xl" color="orange.400" thickness="4px" />
          <Text color="gray.400">Validating invitation...</Text>
        </VStack>
      </Box>
    );
  }

  // Invalid token
  if (!validation.valid) {
    return (
      <Box
        minH="100vh"
        bg="linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Container maxW="md">
          <MotionBox
            bg="rgba(255, 255, 255, 0.03)"
            backdropFilter="blur(20px)"
            border="1px solid rgba(255, 255, 255, 0.08)"
            borderRadius="2xl"
            p={8}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <VStack spacing={6} textAlign="center">
              <Icon as={FiAlertTriangle} boxSize={16} color="red.400" />
              <Heading size="lg" color="white">
                Invalid Invitation
              </Heading>
              <Text color="gray.400">{validation.error}</Text>
              <Link href="/">
                <Button colorScheme="orange">Go Home</Button>
              </Link>
            </VStack>
          </MotionBox>
        </Container>
      </Box>
    );
  }

  const invite = validation.invitation;
  const emailMatch = user?.email?.toLowerCase() === invite?.email?.toLowerCase();

  // Success state
  if (success) {
    return (
      <Box
        minH="100vh"
        bg="linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Container maxW="md">
          <MotionBox
            bg="rgba(255, 255, 255, 0.03)"
            backdropFilter="blur(20px)"
            border="1px solid rgba(34, 197, 94, 0.3)"
            borderRadius="2xl"
            p={8}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <VStack spacing={6} textAlign="center">
              <Icon as={FiCheckCircle} boxSize={16} color="green.400" />
              <Heading size="lg" color="white">
                Welcome to the team!
              </Heading>
              <Text color="gray.400">
                You've joined {invite?.organizationName}. Redirecting to dashboard...
              </Text>
              <Spinner size="sm" color="green.400" />
            </VStack>
          </MotionBox>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
    >
      {/* Ambient glow */}
      <Box
        position="absolute"
        top="20%"
        left="50%"
        transform="translateX(-50%)"
        w="400px"
        h="400px"
        bg="radial-gradient(circle, rgba(249, 159, 42, 0.15) 0%, transparent 70%)"
        pointerEvents="none"
      />

      <Container maxW="md" position="relative" zIndex={1}>
        <MotionBox
          bg="rgba(255, 255, 255, 0.03)"
          backdropFilter="blur(20px)"
          border="1px solid rgba(255, 255, 255, 0.08)"
          borderRadius="2xl"
          p={8}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <VStack spacing={6}>
            {/* Header */}
            <VStack spacing={2} textAlign="center">
              <Icon as={FiUsers} boxSize={12} color="orange.400" />
              <Heading size="lg" color="white">
                Team Invitation
              </Heading>
              <Text color="gray.400">You've been invited to join</Text>
              <Text color="white" fontSize="xl" fontWeight="bold">
                {invite?.organizationName}
              </Text>
            </VStack>

            {/* Invite Details */}
            <Box w="full" bg="whiteAlpha.50" borderRadius="lg" p={4}>
              <VStack spacing={3} align="start">
                <HStack>
                  <Icon as={FiMail} color="gray.400" />
                  <Text color="gray.300" fontSize="sm">
                    Invited email:{' '}
                    <Text as="span" color="white">
                      {invite?.email}
                    </Text>
                  </Text>
                </HStack>
                <HStack>
                  <Icon as={FiUsers} color="gray.400" />
                  <Text color="gray.300" fontSize="sm">
                    Role:{' '}
                    <Text as="span" color="orange.300" textTransform="capitalize">
                      {invite?.role}
                    </Text>
                  </Text>
                </HStack>
              </VStack>
            </Box>

            {/* Error */}
            {error && (
              <Alert status="error" borderRadius="lg">
                <AlertIcon />
                {error}
              </Alert>
            )}

            {/* Actions */}
            {!isAuthenticated ? (
              // Not logged in - show login prompt
              <VStack spacing={4} w="full">
                <Text color="gray.400" fontSize="sm" textAlign="center">
                  Sign in with the email address above to accept this invitation
                </Text>
                <Link href={`/auth/login?redirect=/invite/${token}`} style={{ width: '100%' }}>
                  <Button
                    w="full"
                    size="lg"
                    bg="linear-gradient(135deg, #F99F2A 0%, #e53e3e 100%)"
                    color="white"
                    leftIcon={<FiLogIn />}
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 30px rgba(249, 159, 42, 0.3)',
                    }}
                  >
                    Sign In to Accept
                  </Button>
                </Link>
              </VStack>
            ) : !emailMatch ? (
              // Logged in but wrong email
              <VStack spacing={4} w="full">
                <Alert status="warning" borderRadius="lg">
                  <AlertIcon />
                  <Box>
                    <Text fontWeight="bold">Email mismatch</Text>
                    <Text fontSize="sm">
                      You're signed in as {user?.email}, but this invite is for {invite?.email}
                    </Text>
                  </Box>
                </Alert>
                <Button
                  w="full"
                  size="lg"
                  variant="outline"
                  borderColor="orange.400"
                  color="orange.400"
                  leftIcon={<FiLogOut />}
                  onClick={handleSignOut}
                  isLoading={signingOut}
                  loadingText="Signing out..."
                  _hover={{
                    bg: 'whiteAlpha.100',
                  }}
                >
                  Sign Out & Switch Account
                </Button>
                <Text color="gray.500" fontSize="xs" textAlign="center">
                  You'll be redirected to sign in with the correct email
                </Text>
              </VStack>
            ) : (
              // Ready to accept
              <Button
                w="full"
                size="lg"
                bg="linear-gradient(135deg, #F99F2A 0%, #e53e3e 100%)"
                color="white"
                onClick={handleAccept}
                isLoading={accepting}
                loadingText="Joining..."
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 30px rgba(249, 159, 42, 0.3)',
                }}
              >
                Accept Invitation
              </Button>
            )}
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
}
