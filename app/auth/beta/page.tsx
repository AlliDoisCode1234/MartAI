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
  Icon,
  InputGroup,
  InputRightElement,
  Spinner,
  Badge,
} from '@chakra-ui/react';
import { useAuthActions } from '@convex-dev/auth/react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { FaGoogle, FaCheck } from 'react-icons/fa';
import { FiKey } from 'react-icons/fi';

/**
 * Beta Signup Page
 *
 * Accessed via email CTA: /auth/beta?code=PHOO-XXXXXX
 * Validates beta code, then allows user to sign up with Google.
 *
 * Architecture:
 * - /auth/login = Normal login (no beta code required)
 * - /auth/beta = Beta invitation signup flow (requires valid code)
 */

const BETA_CODE_KEY = 'phoo_beta_code';

export default function BetaSignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuthActions();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Beta code state
  const [betaCode, setBetaCode] = useState('');
  const [betaCodeVerified, setBetaCodeVerified] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [betaCodeError, setBetaCodeError] = useState<string | null>(null);

  // Get code from URL on mount
  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      setBetaCode(codeFromUrl.toUpperCase().trim());
      setVerifyingCode(true);
    }
  }, [searchParams]);

  // Validate beta code reactively
  const codeValidation = useQuery(
    api.betaCodes.validate,
    betaCode.length >= 6 ? { code: betaCode } : 'skip'
  );

  // Update verification state when validation result changes
  useEffect(() => {
    if (codeValidation && betaCode.length >= 6) {
      if (codeValidation.valid) {
        setBetaCodeVerified(true);
        setBetaCodeError(null);
        localStorage.setItem(BETA_CODE_KEY, betaCode.toUpperCase().trim());
      } else {
        setBetaCodeVerified(false);
        setBetaCodeError(codeValidation.error || 'Invalid code');
      }
      setVerifyingCode(false);
    }
  }, [codeValidation, betaCode]);

  const handleCodeChange = (value: string) => {
    const formatted = value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    setBetaCode(formatted);
    setBetaCodeError(null);
    setBetaCodeVerified(false);
    if (formatted.length >= 6) {
      setVerifyingCode(true);
    }
  };

  const handleGoogleSignup = async () => {
    if (!betaCodeVerified) {
      setError('Please enter a valid beta code first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await signIn('google');
      if (result?.redirect) {
        // Google will redirect the user
      } else if (result?.signingIn) {
        // Sign-in in progress
      } else {
        setError('Failed to start Google sign-in flow');
        setLoading(false);
      }
    } catch (err: unknown) {
      console.error('[BetaSignup] Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign up with Google';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light" display="flex" alignItems="center">
      <Container maxW="container.sm" py={12}>
        <Box bg="white" p={8} borderRadius="lg" shadow="md">
          <VStack spacing={6} align="stretch">
            <Badge colorScheme="orange" alignSelf="center" fontSize="sm" px={3} py={1}>
              Beta Access
            </Badge>

            <Heading
              size="xl"
              fontWeight="bold"
              fontFamily="heading"
              color="gray.800"
              textAlign="center"
            >
              Welcome to Phoo Beta
            </Heading>
            <Text color="gray.600" textAlign="center">
              Enter your beta code to create your account
            </Text>

            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}

            {/* Beta Code Input */}
            <Box p={4} bg="gray.50" borderRadius="lg" border="1px" borderColor="gray.200">
              <FormControl>
                <FormLabel fontWeight="semibold" display="flex" alignItems="center">
                  <Icon as={FiKey} mr={2} color="brand.orange" />
                  Beta Access Code
                </FormLabel>
                <InputGroup>
                  <Input
                    placeholder="PHOO-XXXXXX"
                    value={betaCode}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    fontFamily="mono"
                    letterSpacing="wider"
                    textTransform="uppercase"
                    bg="white"
                    isDisabled={betaCodeVerified}
                  />
                  <InputRightElement>
                    {verifyingCode && <Spinner size="sm" color="brand.orange" />}
                    {betaCodeVerified && <Icon as={FaCheck} color="green.500" />}
                  </InputRightElement>
                </InputGroup>
                {betaCodeError && (
                  <Text color="red.500" fontSize="sm" mt={2}>
                    {betaCodeError}
                  </Text>
                )}
                {betaCodeVerified && (
                  <Text color="green.500" fontSize="sm" mt={2}>
                    Code verified! You can now create your account.
                  </Text>
                )}
              </FormControl>
            </Box>

            {/* Sign up button - only enabled after code verified */}
            <Button
              leftIcon={<FaGoogle />}
              onClick={handleGoogleSignup}
              size="lg"
              bg="brand.orange"
              color="white"
              _hover={{ bg: '#E8851A' }}
              width="full"
              isLoading={loading}
              isDisabled={loading || !betaCodeVerified}
            >
              Sign up with Google
            </Button>

            <Text textAlign="center" color="gray.600" fontSize="sm">
              Already have an account?{' '}
              <Button
                variant="link"
                color="brand.orange"
                fontWeight="semibold"
                onClick={() => router.push('/auth/login')}
              >
                Sign in
              </Button>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
