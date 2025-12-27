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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn('password', {
        email: formData.email,
        password: formData.password,
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
                          type="password"
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          disabled={loading}
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
