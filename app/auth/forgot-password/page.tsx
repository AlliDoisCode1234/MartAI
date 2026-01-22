'use client';

import { useState } from 'react';
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
} from '@chakra-ui/react';
import { useAuthActions } from '@convex-dev/auth/react';
import { FiMail } from 'react-icons/fi';

/**
 * Forgot Password Page
 *
 * Allows users to request a password reset via magic link email.
 * Since we use Convex Auth with Resend, we leverage the magic link
 * functionality to reset passwords.
 */
export default function ForgotPasswordPage() {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Send magic link for password reset
      await signIn('resend', { email });
      setSuccess(true);
    } catch (err) {
      setError('Failed to send reset email. Please check your email address and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box minH="calc(100vh - 64px)" bg="brand.light" display="flex" alignItems="center">
        <Container maxW="container.sm" py={12}>
          <Box bg="white" p={8} borderRadius="lg" shadow="md">
            <VStack spacing={6} align="stretch">
              <Box textAlign="center" py={4}>
                <Box as={FiMail} fontSize="4xl" color="green.500" mx="auto" mb={4} />
                <Heading size="lg" color="gray.800" mb={2}>
                  Check Your Email
                </Heading>
                <Text color="gray.600">
                  We've sent a sign-in link to <strong>{email}</strong>
                </Text>
                <Text color="gray.500" fontSize="sm" mt={2}>
                  Click the link in the email to sign in. You can then update your password in
                  Settings.
                </Text>
              </Box>

              <Button variant="outline" onClick={() => router.push('/auth/login')} width="full">
                Back to Sign In
              </Button>
            </VStack>
          </Box>
        </Container>
      </Box>
    );
  }

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
              Reset Your Password
            </Heading>
            <Text color="gray.600" textAlign="center">
              Enter your email and we'll send you a link to sign in. You can update your password
              after signing in.
            </Text>

            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    size="lg"
                  />
                </FormControl>

                <Button
                  type="submit"
                  bg="brand.orange"
                  color="white"
                  size="lg"
                  _hover={{ bg: '#E8851A' }}
                  disabled={loading || !email}
                  isLoading={loading}
                  loadingText="Sending..."
                  leftIcon={<FiMail />}
                >
                  Send Reset Link
                </Button>
              </VStack>
            </form>

            <Text textAlign="center" color="gray.600" fontSize="sm">
              Remember your password?{' '}
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
