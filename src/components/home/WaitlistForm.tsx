'use client';

/**
 * WaitlistForm
 *
 * Component Hierarchy:
 * App → LandingPage → WaitlistForm
 *
 * Email capture form for phoo.ai beta waitlist with founding member benefits.
 * Submits to Convex waitlist mutation which syncs to HubSpot.
 */

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Box,
  Container,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  Icon,
  SimpleGrid,
} from '@chakra-ui/react';
import { ArrowRight, CheckCircle2, Users, Check, Sparkles } from 'lucide-react';

/**
 * Beta waitlist cap - when we hit this number, the form closes
 * and shows "Beta Full" messaging instead.
 */
const BETA_CAP = 101;

const BETA_BENEFITS = [
  '$700+ value FREE for 6 months',
  'Shape the product roadmap',
  'White-glove onboarding',
  'Lock in 50% off forever',
];

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const joinWaitlist = useMutation(api.waitlist.joinWaitlist);
  const waitlistData = useQuery(api.waitlist.getWaitlistCount);

  // Check if beta is at capacity - automatically updates via Convex reactive query
  const isBetaFull = waitlistData && waitlistData.count >= BETA_CAP;

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

  // Render content based on state: beta full > success > form
  const renderFormContent = () => {
    // Beta Full State - highest priority
    if (isBetaFull) {
      return (
        <VStack spacing={4}>
          <Icon as={Users} boxSize={12} color="brand.orange" />
          <Text fontSize="xl" color="gray.800" fontWeight="medium">
            The Beta is Full!
          </Text>
          <Text color="gray.600" textAlign="center" maxW="sm">
            100+ businesses are already building with Phoo. We&apos;ll announce when more spots
            open.
          </Text>
        </VStack>
      );
    }

    // Success State - after successful signup
    if (status === 'success') {
      return (
        <VStack spacing={4}>
          <Icon as={CheckCircle2} boxSize={12} color="green.500" />
          <Text fontSize="xl" color="green.600" fontWeight="medium">
            You&apos;re on the list!
          </Text>
          <Text color="gray.600">We&apos;ll be in touch soon.</Text>
        </VStack>
      );
    }

    // Default: Signup Form
    return (
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            size="lg"
            bg="white"
            border="1px solid"
            borderColor="gray.300"
            color="gray.800"
            _placeholder={{ color: 'gray.500' }}
            _focus={{
              borderColor: 'brand.orange',
              boxShadow: '0 0 0 1px var(--chakra-colors-orange-500)',
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
    );
  };

  return (
    <Box as="section" id="join-beta" py={16} bg="gray.800">
      <Container maxW="2xl" textAlign="center">
        {/* Founding member badge */}
        <HStack justify="center" mb={4}>
          <Icon as={Sparkles} color="brand.orange" boxSize={5} />
          <Text
            fontWeight="semibold"
            color="brand.orange"
            fontSize="sm"
            textTransform="uppercase"
            letterSpacing="wide"
          >
            Founding Beta Access
          </Text>
        </HStack>

        <Heading
          as="h2"
          fontSize={{ base: '2xl', md: '3xl' }}
          fontWeight="bold"
          mb={4}
          color="white"
        >
          {isBetaFull ? "You're Early — That's a Good Sign" : 'Join 101 Founding Members'}
        </Heading>

        {/* Benefits grid */}
        {!isBetaFull && (
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={8}>
            {BETA_BENEFITS.map((benefit) => (
              <HStack key={benefit} justify="center">
                <Icon as={Check} color="green.400" boxSize={4} />
                <Text fontSize="sm" color="gray.300">
                  {benefit}
                </Text>
              </HStack>
            ))}
          </SimpleGrid>
        )}

        <Box
          bg="gray.700"
          borderRadius="2xl"
          p={8}
          border="1px solid"
          borderColor="gray.600"
          boxShadow="lg"
        >
          {renderFormContent()}
        </Box>

        {/* Social proof counter */}
        {waitlistData && waitlistData.count > 0 && (
          <Text mt={6} fontSize="sm" color="gray.500">
            {isBetaFull
              ? `${waitlistData.count.toLocaleString()}+ businesses have joined`
              : `${waitlistData.count.toLocaleString()} spots claimed`}
          </Text>
        )}
      </Container>
    </Box>
  );
}
