'use client';

/**
 * WaitlistForm
 *
 * Component Hierarchy:
 * App → LandingPage → WaitlistForm
 *
 * Email capture form for phoo.ai beta waitlist.
 * Submits to Convex waitlist mutation which syncs to HubSpot.
 * Uses Chakra UI for styling (project standard).
 */

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Box, Container, Heading, Text, Input, Button, VStack, Icon } from '@chakra-ui/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const joinWaitlist = useMutation(api.waitlist.joinWaitlist);
  const waitlistData = useQuery(api.waitlist.getWaitlistCount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const params = new URLSearchParams(window.location.search);
      const metadata = {
        referrer: document.referrer || undefined,
        utmSource: params.get('utm_source') || undefined,
        utmMedium: params.get('utm_medium') || undefined,
        utmCampaign: params.get('utm_campaign') || undefined,
        userAgent: navigator.userAgent,
      };

      await joinWaitlist({ email, source: 'phoo.ai', metadata });
      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <Box
      as="section"
      id="join-beta"
      py={24}
      borderTop="1px solid"
      borderColor="whiteAlpha.100"
      bg="gray.900"
    >
      <Container maxW="xl" textAlign="center">
        <Heading
          as="h2"
          fontSize={{ base: '3xl', md: '4xl' }}
          fontWeight="bold"
          mb={6}
          color="white"
        >
          Ready to make your website work for your business?
        </Heading>
        <Text fontSize="xl" color="gray.400" mb={10}>
          Join the Phoo beta and be part of building a smarter, more meaningful way to grow.
        </Text>

        <Box
          bg="whiteAlpha.50"
          backdropFilter="blur(8px)"
          borderRadius="2xl"
          p={8}
          border="1px solid"
          borderColor="whiteAlpha.100"
        >
          {status === 'success' ? (
            <VStack spacing={4}>
              <Icon as={CheckCircle2} boxSize={12} color="green.400" />
              <Text fontSize="xl" color="green.300" fontWeight="medium">
                You&apos;re on the list!
              </Text>
              <Text color="gray.400">We&apos;ll be in touch soon.</Text>
            </VStack>
          ) : (
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  size="lg"
                  bg="whiteAlpha.50"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  color="white"
                  _placeholder={{ color: 'gray.500' }}
                  _focus={{
                    borderColor: 'brand.orange',
                    boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)',
                  }}
                  borderRadius="xl"
                  py={7}
                  px={6}
                  fontSize="lg"
                  isDisabled={status === 'loading'}
                />
                <Button
                  type="submit"
                  isLoading={status === 'loading'}
                  loadingText="Joining..."
                  size="lg"
                  w="100%"
                  py={7}
                  fontSize="lg"
                  fontWeight="semibold"
                  bgGradient="linear(to-r, brand.orange, brand.red)"
                  color="white"
                  _hover={{
                    bgGradient: 'linear(to-r, orange.600, red.500)',
                  }}
                  _disabled={{
                    opacity: 0.5,
                    cursor: 'not-allowed',
                  }}
                  borderRadius="xl"
                  boxShadow="0 10px 40px rgba(237, 137, 54, 0.25)"
                  rightIcon={<Icon as={ArrowRight} boxSize={5} />}
                >
                  Join the Phoo Beta
                </Button>

                {status === 'error' && (
                  <Text color="red.400" fontSize="sm">
                    {errorMessage}
                  </Text>
                )}
              </VStack>
            </form>
          )}
        </Box>

        <Text mt={6} color="gray.500" fontSize="sm">
          Spots are limited.
        </Text>

        {waitlistData && waitlistData.count > 0 && (
          <Text mt={4} fontSize="sm" color="gray.400">
            Join {waitlistData.count.toLocaleString()}+ others on the waitlist
          </Text>
        )}
      </Container>
    </Box>
  );
}
