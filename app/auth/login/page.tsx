/**
 * LoginPage
 *
 * Component Hierarchy:
 * App → auth/login → LoginPage
 *
 * Login page with password gate for beta access.
 * Gate validates via server-side API (/api/auth/gate) using httpOnly cookie.
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
import { FaGoogle } from 'react-icons/fa';
import { FiMail, FiLock } from 'react-icons/fi';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [magicLinkEmail, setMagicLinkEmail] = useState('');

  // Password gate state — validated server-side via /api/auth/gate
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isCheckingGate, setIsCheckingGate] = useState(true);
  const [gatePassword, setGatePassword] = useState('');
  const [gateError, setGateError] = useState(false);
  const [gateLoading, setGateLoading] = useState(false);

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

  // Check if gate cookie exists on mount (cookie presence = already authenticated)
  useEffect(() => {
    const hasCookie = document.cookie.includes('phoo_login_gate=');
    // If cookie exists OR no gate is configured, unlock immediately
    // We check by trying a no-op validation — if no password is set server-side, API returns success
    if (hasCookie) {
      setIsUnlocked(true);
      setIsCheckingGate(false);
    } else {
      // Try a probe — if PHOO_BETA_PASSWORD isn't set, the gate should be open
      fetch('/api/auth/gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: '' }),
      })
        .then((res) => {
          if (res.ok) {
            // No password configured, gate is open
            setIsUnlocked(true);
          }
          setIsCheckingGate(false);
        })
        .catch(() => {
          setIsCheckingGate(false);
        });
    }
  }, []);

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

  // Server-side gate validation
  const handleGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGateLoading(true);
    setGateError(false);

    try {
      const res = await fetch('/api/auth/gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: gatePassword }),
      });

      if (res.ok) {
        setIsUnlocked(true);
      } else {
        setGateError(true);
      }
    } catch {
      setGateError(true);
    } finally {
      setGateLoading(false);
    }
  };

  // Loading state while checking gate
  if (isCheckingGate) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <Text color="gray.400">Loading...</Text>
      </Box>
    );
  }

  // Password gate - server-validated, shown before login form
  if (!isUnlocked) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <Container maxW="sm">
          <Box bg="white" p={8} borderRadius="xl" shadow="lg" textAlign="center">
            <VStack spacing={5}>
              <Icon as={FiLock} boxSize={10} color="brand.orange" />
              <Heading size="md" color="gray.800">
                Beta Access Required
              </Heading>
              <Text fontSize="sm" color="gray.500">
                Enter the access password to continue.
              </Text>
              <form onSubmit={handleGateSubmit} style={{ width: '100%' }}>
                <VStack spacing={4}>
                  <Input
                    type="password"
                    placeholder="Access password"
                    value={gatePassword}
                    onChange={(e) => {
                      setGatePassword(e.target.value);
                      setGateError(false);
                    }}
                    isInvalid={gateError}
                    size="lg"
                    borderRadius="lg"
                    autoFocus
                  />
                  {gateError && (
                    <Text fontSize="sm" color="red.500">
                      Incorrect password. Please try again.
                    </Text>
                  )}
                  <Button
                    type="submit"
                    bg="brand.orange"
                    color="white"
                    size="lg"
                    w="100%"
                    _hover={{ bg: '#E8851A' }}
                    borderRadius="lg"
                    isLoading={gateLoading}
                  >
                    Enter
                  </Button>
                </VStack>
              </form>
            </VStack>
          </Box>
        </Container>
      </Box>
    );
  }

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
      router.replace('/dashboard');
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
      console.log('[GoogleLogin] Calling signIn("google")...');
      const result = await signIn('google', { redirectTo: '/auth/callback' });
      console.log('[GoogleLogin] signIn result:', result);

      // For OAuth flows, signIn returns a redirect URL we must navigate to
      if (result?.redirect) {
        console.log('[GoogleLogin] Redirecting to OAuth URL:', result.redirect.toString());
        window.location.href = result.redirect.toString();
      } else if (result?.signingIn) {
        console.log('[GoogleLogin] User signed in immediately');
        router.replace('/dashboard');
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
              Welcome to Phoo
            </Heading>
            <Text color="gray.600" textAlign="center">
              Sign in to your account to continue
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
