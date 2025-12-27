'use client';

/**
 * Reset Password Page
 *
 * Component Hierarchy:
 * App → Auth → ResetPassword (this file)
 *
 * Handles password reset tokens from email links.
 * Validates token and allows user to set new password.
 */

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Button,
  Alert,
  AlertIcon,
  Progress,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuthActions } from '@convex-dev/auth/react';

/**
 * Calculate password strength
 */
function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: 'gray' };

  let score = 0;
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 15;
  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^a-zA-Z0-9]/.test(password)) score += 15;

  if (score < 40) return { score, label: 'Weak', color: 'red' };
  if (score < 70) return { score, label: 'Fair', color: 'yellow' };
  if (score < 90) return { score, label: 'Good', color: 'blue' };
  return { score: 100, label: 'Strong', color: 'green' };
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const { signIn } = useAuthActions();

  const token = searchParams.get('token');

  // Validate token
  const validation = useQuery(api.auth.passwordReset.validateToken, token ? { token } : 'skip');

  // Mutations
  const resetPassword = useMutation(api.auth.passwordReset.resetPassword);

  // Form state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = getPasswordStrength(newPassword);
  const passwordsMatch = newPassword === confirmPassword;
  const canSubmit = newPassword.length >= 8 && passwordsMatch && strength.score >= 40;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !token || !validation?.valid) return;

    setIsLoading(true);

    try {
      // Reset password in database
      const result = await resetPassword({ token, newPassword });

      if (result.success && result.email) {
        // Auto sign in with new password
        await signIn('password', {
          email: result.email,
          password: newPassword,
          flow: 'signIn',
        });

        setSuccess(true);
        toast({
          title: 'Password Reset Successful',
          description: 'You are now signed in with your new password.',
          status: 'success',
          duration: 5000,
        });

        // Redirect to dashboard after short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (err) {
      toast({
        title: 'Reset Failed',
        description: 'Unable to reset password. Please try again.',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // No token provided
  if (!token) {
    return (
      <Container maxW="md" py={20}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Text>Invalid reset link. No token provided.</Text>
        </Alert>
      </Container>
    );
  }

  // Loading validation
  if (validation === undefined) {
    return (
      <Container maxW="md" py={20}>
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.orange" />
          <Text>Validating reset link...</Text>
        </VStack>
      </Container>
    );
  }

  // Invalid or expired token
  if (!validation.valid) {
    return (
      <Container maxW="md" py={20}>
        <VStack spacing={4}>
          <Box p={4} borderRadius="full" bg="red.100" color="red.500">
            <FiX size={48} />
          </Box>
          <Heading size="lg">Link Expired</Heading>
          <Text color="gray.600" textAlign="center">
            {validation.reason === 'expired'
              ? 'This password reset link has expired. Please request a new one.'
              : validation.reason === 'used'
                ? 'This link has already been used. Please request a new one if needed.'
                : 'This reset link is invalid. Please request a new one.'}
          </Text>
          <Button colorScheme="brand" onClick={() => router.push('/auth/login')}>
            Back to Login
          </Button>
        </VStack>
      </Container>
    );
  }

  // Success state
  if (success) {
    return (
      <Container maxW="md" py={20}>
        <VStack spacing={4}>
          <Box p={4} borderRadius="full" bg="green.100" color="green.500">
            <FiCheck size={48} />
          </Box>
          <Heading size="lg">Password Reset!</Heading>
          <Text color="gray.600">Redirecting to dashboard...</Text>
          <Spinner size="md" color="brand.orange" />
        </VStack>
      </Container>
    );
  }

  // Reset form
  return (
    <Container maxW="md" py={20}>
      <VStack spacing={8} align="stretch">
        <VStack spacing={2} textAlign="center">
          <Heading size="xl">Set New Password</Heading>
          <Text color="gray.600">Enter a new password for your account</Text>
        </VStack>

        <Box bg="white" p={8} borderRadius="lg" shadow="md">
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showNew ? 'Hide password' : 'Show password'}
                      icon={showNew ? <FiEyeOff /> : <FiEye />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNew(!showNew)}
                    />
                  </InputRightElement>
                </InputGroup>
                {newPassword && (
                  <VStack align="stretch" mt={2} spacing={1}>
                    <Progress
                      value={strength.score}
                      size="sm"
                      colorScheme={strength.color}
                      borderRadius="full"
                    />
                    <Text fontSize="xs" color={`${strength.color}.500`}>
                      {strength.label}
                    </Text>
                  </VStack>
                )}
              </FormControl>

              <FormControl isRequired isInvalid={confirmPassword.length > 0 && !passwordsMatch}>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                      icon={showConfirm ? <FiEyeOff /> : <FiEye />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowConfirm(!showConfirm)}
                    />
                  </InputRightElement>
                </InputGroup>
                {confirmPassword && !passwordsMatch && (
                  <Text fontSize="xs" color="red.500" mt={1}>
                    Passwords do not match
                  </Text>
                )}
              </FormControl>

              <Button
                type="submit"
                colorScheme="brand"
                size="lg"
                width="full"
                isLoading={isLoading}
                isDisabled={!canSubmit}
                loadingText="Resetting..."
              >
                Reset Password
              </Button>
            </VStack>
          </form>
        </Box>
      </VStack>
    </Container>
  );
}

export default function ResetPasswordPage() {
  return (
    <Box minH="100vh" bg="brand.light">
      <Suspense
        fallback={
          <Container maxW="md" py={20}>
            <VStack spacing={4}>
              <Spinner size="xl" color="brand.orange" />
              <Text>Loading...</Text>
            </VStack>
          </Container>
        }
      >
        <ResetPasswordContent />
      </Suspense>
    </Box>
  );
}
