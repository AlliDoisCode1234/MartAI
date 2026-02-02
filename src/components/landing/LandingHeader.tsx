'use client';

/**
 * LandingHeader
 *
 * Component Hierarchy:
 * App → LandingPage → LandingHeader
 *
 * Minimal header for the marketing landing page.
 * Uses brand color scheme: white background + orange text.
 * Sign in/sign up commented out per beta launch.
 */

import { Box, Container, HStack, Text, Button, Icon } from '@chakra-ui/react';
import Link from 'next/link';
import { FiMessageCircle } from 'react-icons/fi';

export function LandingHeader() {
  return (
    <Box
      as="header"
      bg="white"
      shadow="sm"
      borderBottom="1px"
      borderColor="gray.200"
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Container maxW="6xl">
        <HStack justify="space-between" h={16}>
          {/* Logo - Orange on white per brand standards */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Text fontSize="xl" fontWeight="bold" color="brand.orange">
              Phoo
            </Text>
          </Link>

          {/* Navigation Links */}
          <HStack spacing={8}>
            {/* Public nav items */}
            <Link href="/how-it-works" style={{ textDecoration: 'none' }}>
              <Text
                color="gray.700"
                fontWeight="medium"
                _hover={{ color: 'brand.orange' }}
                display={{ base: 'none', md: 'inline' }}
              >
                How It Works
              </Text>
            </Link>
            <Link href="/pricing" style={{ textDecoration: 'none' }}>
              <Text
                color="gray.700"
                fontWeight="medium"
                _hover={{ color: 'brand.orange' }}
                display={{ base: 'none', md: 'inline' }}
              >
                Pricing
              </Text>
            </Link>

            {/* Ask Phoo - AI Assistant for guests */}
            <Link href="/assistant" style={{ textDecoration: 'none' }}>
              <Button
                size="sm"
                variant="ghost"
                color="brand.orange"
                _hover={{ bg: 'orange.50' }}
                leftIcon={<Icon as={FiMessageCircle} />}
              >
                Ask Phoo
              </Button>
            </Link>

            {/* Resources - Blog, guides, educational content */}
            <Link href="/resources" style={{ textDecoration: 'none' }}>
              <Text
                color="gray.700"
                fontWeight="medium"
                _hover={{ color: 'brand.orange' }}
                display={{ base: 'none', md: 'inline' }}
              >
                Resources
              </Text>
            </Link>

            {/* Auth Buttons - COMMENTED OUT FOR BETA LAUNCH
             * Users can still access /auth/login directly if they know the URL
             * TODO: Uncomment when ready for public launch
             */}
            {/*
            <HStack spacing={4}>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button bg="brand.orange" color="white" size="sm" _hover={{ bg: '#E8851A' }}>
                  Sign Up
                </Button>
              </Link>
            </HStack>
            */}
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
}
