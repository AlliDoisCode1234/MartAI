'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Container,
  VStack,
  Heading,
  Text,
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Link,
  Divider,
  HStack,
  FormHelperText,
  Badge,
} from '@chakra-ui/react';
import { useAuthActions } from '@convex-dev/auth/react';
import { FaGoogle } from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuthActions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get invite params from URL
  const inviteEmail = searchParams.get('email');
  const inviteToken = searchParams.get('invite');
  const isInviteFlow = !!(inviteEmail && inviteToken);

  const [formData, setFormData] = useState({
    name: '',
    email: inviteEmail || '',
    password: '',
    confirmPassword: '',
  });

  // Sync email from URL params on mount only

  useEffect(() => {
    if (inviteEmail) {
      setFormData((prev) => ({ ...prev, email: inviteEmail }));
    }
  }, [inviteEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await signIn('password', {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        flow: 'signUp',
      });

      // If from invite, redirect back to invite page to accept
      if (isInviteFlow && inviteToken) {
        console.log('🚀 Signup successful, redirecting to invite page');
        router.push(`/invite/${inviteToken}`);
      } else {
        // Regular signup - go to onboarding
        console.log('🚀 Signup successful, redirecting to /onboarding');
        router.push('/onboarding');
      }
    } catch (err) {
      setError('Failed to create account. Email might be already in use.');
      // Clear password fields on error for security
      setFormData({ ...formData, password: '', confirmPassword: '' });
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signIn('google');
    } catch (err) {
      setError('Failed to sign in with Google');
      setLoading(false);
    }
  };

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light" display="flex" alignItems="center">
      <Container maxW="container.sm" py={12}>
        <Box bg="white" p={8} borderRadius="lg" shadow="md">
          <VStack spacing={6} align="stretch">
            {/* Invite context banner */}
            {isInviteFlow && (
              <Alert status="info" borderRadius="lg" bg="blue.50">
                <Box as={FiUsers} color="blue.500" mr={3} flexShrink={0} />
                <Box>
                  <Text fontWeight="bold" color="blue.800">
                    Team Invitation
                  </Text>
                  <Text fontSize="sm" color="blue.700">
                    Create your account to join the team
                  </Text>
                </Box>
              </Alert>
            )}

            <Heading
              size="xl"
              fontWeight="bold"
              fontFamily="heading"
              color="gray.800"
              textAlign="center"
            >
              {isInviteFlow ? 'Create Your Account' : 'Get Started Today'}
            </Heading>
            <Text color="gray.600" textAlign="center">
              {isInviteFlow
                ? 'Set up your password to accept the invitation'
                : "No SEO knowledge needed. We'll help you get found on Google."}
            </Text>

            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}

            <Button
              leftIcon={<FaGoogle />}
              onClick={handleGoogleLogin}
              size="lg"
              variant="outline"
              width="full"
              isLoading={loading}
              isDisabled={loading}
              data-track-id="signup_google"
            >
              Sign up with Google
            </Button>

            <HStack>
              <Divider />
              <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
                OR CONTINUE WITH EMAIL
              </Text>
              <Divider />
            </HStack>

            <form onSubmit={handleSubmit} autoComplete="off">
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel fontWeight="semibold">What should we call you?</FormLabel>
                  <Input
                    type="text"
                    placeholder="Your name (optional)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={loading}
                    size="lg"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontWeight="semibold">Email</FormLabel>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value.toLowerCase() })
                    }
                    disabled={loading}
                    isReadOnly={isInviteFlow}
                    bg={isInviteFlow ? 'gray.100' : 'white'}
                    size="lg"
                    autoComplete="off"
                    aria-describedby="email-helper"
                  />
                  <FormHelperText id="email-helper" color="gray.500">
                    {isInviteFlow
                      ? 'This email is linked to your team invitation'
                      : 'Your email doubles as your username so sign-ins stay simple.'}
                  </FormHelperText>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontWeight="semibold">Create a password</FormLabel>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={loading}
                    size="lg"
                    autoComplete="new-password"
                    aria-describedby="password-helper"
                  />
                  <FormHelperText id="password-helper" color="gray.500">
                    Make it something you'll remember
                  </FormHelperText>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontWeight="semibold">Confirm password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Type it again"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    disabled={loading}
                    size="lg"
                    autoComplete="new-password"
                  />
                </FormControl>

                <Button
                  type="submit"
                  bg="brand.orange"
                  color="white"
                  size="lg"
                  _hover={{ bg: '#E8851A' }}
                  disabled={loading}
                  isLoading={loading}
                  loadingText="Creating account..."
                  data-track-id="signup_submit"
                >
                  Sign Up
                </Button>
              </VStack>
            </form>

            <Text textAlign="center" color="gray.600" fontSize="sm">
              Already have an account?{' '}
              <Link href="/auth/login" color="brand.orange" fontWeight="semibold">
                Sign in
              </Link>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
