'use client';

/**
 * Phoo.ai Join/Waitlist Page
 *
 * Component Hierarchy:
 * └── app/join/page.tsx (this file)
 *     ├── HeroSection
 *     ├── ProblemSection
 *     ├── FeaturesSection
 *     ├── AudienceSection
 *     ├── BetaSection
 *     ├── WaitlistForm
 *     ├── AskPhooSection (FAQ replacement)
 *     └── Footer
 *
 * Public waitlist page for phoo.ai domain.
 * Accessible at phoo.ai/join (and phoo.ai/ redirects here).
 * Uses Chakra UI with brand.orange/white palette.
 */

import {
  Box,
  Container,
  Text,
  HStack,
  VStack,
  Button,
  Heading,
  Link as ChakraLink,
  useDisclosure,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FiMessageCircle } from 'react-icons/fi';
import {
  HeroSection,
  ProblemSection,
  FeaturesSection,
  AudienceSection,
  BetaSection,
  WaitlistForm,
} from '@/src/components/landing';
import { PhooChatDrawer } from '@/src/components/phoo';
import { MartCharacter } from '@/src/components/assistant';

export default function JoinPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg="gray.900" color="white">
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <AudienceSection />
      <BetaSection />
      <WaitlistForm />

      {/* Ask Phoo Section - FAQ Replacement */}
      <Box py={20} bg="gray.800">
        <Container maxW="4xl" textAlign="center">
          <VStack spacing={6}>
            <Box>
              <MartCharacter size="md" showBubble={false} />
            </Box>
            <Heading size="lg" fontWeight="bold">
              Questions? Ask Phoo
            </Heading>
            <Text color="gray.400" maxW="lg" mx="auto">
              Skip the FAQ. Phoo is your AI marketing manager and can answer any question about SEO,
              content strategy, or how Phoo works.
            </Text>
            <Button
              size="lg"
              bg="brand.orange"
              color="white"
              _hover={{ bg: '#E8851A' }}
              leftIcon={<FiMessageCircle />}
              onClick={onOpen}
            >
              Chat with Phoo
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Footer */}
      <Box as="footer" py={12} borderTop="1px solid" borderColor="whiteAlpha.100">
        <Container maxW="6xl" textAlign="center">
          <HStack justify="center" spacing={6} mb={4}>
            <ChakraLink
              as={Link}
              href="/privacy"
              color="gray.400"
              fontSize="sm"
              _hover={{ color: 'white' }}
            >
              Privacy Policy
            </ChakraLink>
            <ChakraLink
              as={Link}
              href="/terms"
              color="gray.400"
              fontSize="sm"
              _hover={{ color: 'white' }}
            >
              Terms of Service
            </ChakraLink>
          </HStack>
          <Text color="gray.500" fontSize="sm">
            © {new Date().getFullYear()} Phoo AI. All rights reserved.
          </Text>
        </Container>
      </Box>

      {/* Phoo Chat Drawer for guests */}
      <PhooChatDrawer isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
