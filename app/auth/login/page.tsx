/**
 * LoginPage
 *
 * Component Hierarchy:
 * App → auth/login → LoginPage
 *
 * Login page with Google OAuth, email/password, and magic link sign-in.
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Icon,
} from '@chakra-ui/react';
import { useAuthActions } from '@convex-dev/auth/react';
import { useConvexAuth, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { FaGoogle } from 'react-icons/fa';
import { FiMail, FiLock } from 'react-icons/fi';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawReturnTo = searchParams.get('returnTo') || '/studio';
  // Security: Only allow relative paths to prevent Open Redirect
  const returnTo =
    rawReturnTo.startsWith('/') && !rawReturnTo.startsWith('//') ? rawReturnTo : '/studio';
  const isCheckoutIntent = searchParams.get('intent') === 'checkout';
  const { signIn } = useAuthActions();
  const { isAuthenticated } = useConvexAuth();
  const seedSwarmAccount = useMutation(api.testing.swarmSeeder.seedSwarmAccount);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [magicLinkEmail, setMagicLinkEmail] = useState('');

  // Refs to detect browser autofill
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Sync autofilled values from DOM to React state
  const syncAutofillValues = useCallback(() => {
    const emailValue = emailInputRef.current?.value || '';
    const passwordValue = passwordInputRef.current?.value || '';

    if (emailValue !== formData.email || passwordValue !== formData.password) {
      setFormData({
        email: emailValue,
        password: passwordValue,
      });
    }
  }, [formData.email, formData.password]);

  // Check for autofill on mount and after short delay (browser timing)
  useEffect(() => {
    syncAutofillValues();
    const timer = setTimeout(syncAutofillValues, 100);

    const handleAnimationStart = (e: AnimationEvent) => {
      if (e.animationName === 'onAutoFillStart') {
        syncAutofillValues();
      }
    };

    const emailInput = emailInputRef.current;
    const passwordInput = passwordInputRef.current;

    emailInput?.addEventListener('animationstart', handleAnimationStart);
    passwordInput?.addEventListener('animationstart', handleAnimationStart);

    return () => {
      clearTimeout(timer);
      emailInput?.removeEventListener('animationstart', handleAnimationStart);
      passwordInput?.removeEventListener('animationstart', handleAnimationStart);
    };
  }, [syncAutofillValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Sync any autofilled values right before submit
    const email = emailInputRef.current?.value || formData.email;
    const password = passwordInputRef.current?.value || formData.password;

    try {
      await signIn('password', {
        email,
        password,
        flow: 'signIn',
      });

      // After successful authentication, seed the test harness if it's a test email
      // Fire-and-forget so test failures don't block auth success
      if (email.includes('swarm') || email.includes('starter') || email.includes('engine') || email.includes('agency') || email.includes('superadmin')) {
        seedSwarmAccount({ email }).catch(err => console.warn('Swarm seed failed:', err));
      }
      
      router.replace(returnTo);
    } catch (err) {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await signIn('resend', { email: magicLinkEmail });
      setSuccess('Check your email for a sign-in link!');
      setLoading(false);
    } catch (err) {
      setError('Failed to send magic link. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    console.log('[GoogleLogin] Button clicked');
    setLoading(true);
    setError(null);
    try {
      // Persist returnTo so the callback page can redirect back after OAuth
      if (returnTo !== '/studio') {
        try {
          sessionStorage.setItem('authReturnTo', returnTo);
        } catch {
          // sessionStorage unavailable in Safari private browsing
        }
      }
      // Mark this as a LOGIN flow so the callback page can gate new-user creation
      try {
        sessionStorage.setItem('authFlow', 'login');
      } catch {
        // sessionStorage unavailable in Safari private browsing
      }
      console.log('[GoogleLogin] Calling signIn("google")...');
      const result = await signIn('google', { redirectTo: '/auth/callback' });
      console.log('[GoogleLogin] signIn result:', result);

      // For OAuth flows, signIn returns a redirect URL we must navigate to
      if (result?.redirect) {
        console.log('[GoogleLogin] Redirecting to OAuth URL:', result.redirect.toString());
        window.location.href = result.redirect.toString();
      } else if (result?.signingIn) {
        console.log('[GoogleLogin] User signed in immediately');
        router.replace(returnTo);
      } else {
        console.log('[GoogleLogin] No redirect or signingIn - unexpected state');
        setError('Failed to start Google sign-in flow');
        setLoading(false);
      }
    } catch (err: unknown) {
      console.error('[GoogleLogin] Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in with Google';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light" display="flex" alignItems="center">
      <Container maxW="container.sm" py={12}>
        <Box bg="white" p={8} borderRadius="lg" shadow="md">
          <VStack spacing={6} align="stretch">
            <Heading
              size="xl"
              fontWeight="bold"
              fontFamily="heading"
              color="gray.800"
              textAlign="center"
            >
              {isCheckoutIntent ? 'Sign in to continue to checkout' : 'Welcome to Phoo'}
            </Heading>
            <Text color="gray.600" textAlign="center">
              {isCheckoutIntent
                ? 'Quick sign-in, then straight to payment'
                : 'Sign in to your account to continue'}
            </Text>

            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}

            {success && (
              <Alert status="success" borderRadius="md">
                <AlertIcon />
                {success}
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
            >
              Sign in with Google
            </Button>

            <HStack>
              <Divider />
              <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
                OR CONTINUE WITH EMAIL
              </Text>
              <Divider />
            </HStack>

            <Tabs colorScheme="orange" variant="soft-rounded" isFitted>
              <TabList mb={4}>
                <Tab>
                  <Icon as={FiLock} mr={2} />
                  Password
                </Tab>
                <Tab>
                  <Icon as={FiMail} mr={2} />
                  Email Link
                </Tab>
              </TabList>
              <TabPanels>
                {/* Password Tab */}
                <TabPanel p={0}>
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4} align="stretch">
                      <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                          ref={emailInputRef}
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={loading}
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input
                          ref={passwordInputRef}
                          type="password"
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          disabled={loading}
                        />
                      </FormControl>

                      <Text textAlign="right" fontSize="sm">
                        <Link
                          href="/auth/forgot-password"
                          color="gray.500"
                          _hover={{ color: 'brand.orange' }}
                        >
                          Forgot password?
                        </Link>
                      </Text>

                      <Button
                        type="submit"
                        bg="brand.orange"
                        color="white"
                        size="lg"
                        _hover={{ bg: '#E8851A' }}
                        disabled={loading}
                        isLoading={loading}
                        loadingText="Signing in..."
                      >
                        Sign In
                      </Button>
                    </VStack>
                  </form>
                </TabPanel>

                {/* Magic Link Tab */}
                <TabPanel p={0}>
                  <form onSubmit={handleMagicLink}>
                    <VStack spacing={4} align="stretch">
                      <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={magicLinkEmail}
                          onChange={(e) => setMagicLinkEmail(e.target.value)}
                          disabled={loading}
                        />
                      </FormControl>

                      <Text fontSize="sm" color="gray.500">
                        We'll send you a magic link to sign in instantly - no password required.
                      </Text>

                      <Button
                        type="submit"
                        bg="brand.orange"
                        color="white"
                        size="lg"
                        _hover={{ bg: '#E8851A' }}
                        disabled={loading || !magicLinkEmail}
                        isLoading={loading}
                        loadingText="Sending..."
                        leftIcon={<FiMail />}
                      >
                        Send Sign-in Link
                      </Button>
                    </VStack>
                  </form>
                </TabPanel>
              </TabPanels>
            </Tabs>

            <Text textAlign="center" color="gray.600" fontSize="sm">
              Don't have an account?{' '}
              <Link href="/auth/signup" color="brand.orange" fontWeight="semibold">
                Sign up
              </Link>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
