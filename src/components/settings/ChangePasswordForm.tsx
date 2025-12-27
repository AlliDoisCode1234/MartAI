'use client';

/**
 * ChangePasswordForm Component
 *
 * Component Hierarchy:
 * App → Settings → ChangePasswordForm (this file)
 *
 * Allows authenticated users to change their password.
 * Requires current password for verification (security).
 */

import { useState } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  IconButton,
  Text,
  Progress,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuthActions } from '@convex-dev/auth/react';

type Props = {
  userEmail: string;
  hasPassword: boolean;
};

/**
 * Calculate password strength (0-100)
 */
function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: 'gray' };

  let score = 0;

  // Length checks
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 15;

  // Character variety
  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^a-zA-Z0-9]/.test(password)) score += 15;

  // Determine label and color
  if (score < 40) return { score, label: 'Weak', color: 'red' };
  if (score < 70) return { score, label: 'Fair', color: 'yellow' };
  if (score < 90) return { score, label: 'Good', color: 'blue' };
  return { score: 100, label: 'Strong', color: 'green' };
}

export function ChangePasswordForm({ userEmail, hasPassword }: Props) {
  const { signIn } = useAuthActions();
  const toast = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strength = getPasswordStrength(newPassword);
  const passwordsMatch = newPassword === confirmPassword;
  const canSubmit =
    (!hasPassword || currentPassword.length > 0) &&
    newPassword.length >= 8 &&
    passwordsMatch &&
    strength.score >= 40;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsLoading(true);
    setError(null);

    try {
      // If user has existing password, verify it first
      if (hasPassword) {
        try {
          await signIn('password', {
            email: userEmail,
            password: currentPassword,
            flow: 'signIn',
          });
        } catch {
          setError('Current password is incorrect');
          setIsLoading(false);
          return;
        }
      }

      // Set new password using signUp flow (creates/updates password)
      await signIn('password', {
        email: userEmail,
        password: newPassword,
        flow: 'signUp',
      });

      toast({
        title: 'Password updated',
        description: 'Your password has been changed successfully.',
        status: 'success',
        duration: 5000,
      });

      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {hasPassword && (
          <FormControl isRequired>
            <FormLabel>Current Password</FormLabel>
            <InputGroup>
              <Input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
              <InputRightElement>
                <IconButton
                  aria-label={showCurrent ? 'Hide password' : 'Show password'}
                  icon={showCurrent ? <FiEyeOff /> : <FiEye />}
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCurrent(!showCurrent)}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
        )}

        {!hasPassword && (
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Text fontSize="sm">
              You signed up with Google. Setting a password lets you log in with email too.
            </Text>
          </Alert>
        )}

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
          <FormLabel>Confirm New Password</FormLabel>
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
          isLoading={isLoading}
          isDisabled={!canSubmit}
          loadingText="Updating..."
        >
          {hasPassword ? 'Change Password' : 'Set Password'}
        </Button>
      </VStack>
    </form>
  );
}
