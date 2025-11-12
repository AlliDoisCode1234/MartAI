'use client';

import { Container, VStack, Heading, Text, Box, Input, Button, HStack, FormControl, FormLabel } from '@chakra-ui/react';

export default function OnboardingPage() {
  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container maxW="container.xl" py={{ base: 8, md: 12 }} px={{ base: 4, sm: 6, md: 8, lg: 12 }}>
        <HStack spacing={8} align="start" flexDirection={{ base: 'column', lg: 'row' }}>
          <Box flex={1} bg="white" p={8} borderRadius="lg" shadow="md">
            <VStack spacing={6} align="stretch">
              <Heading size="xl" fontWeight="bold" fontFamily="heading" color="gray.800">Business Setup</Heading>
              <Text color="gray.600">Tell us about your business to generate your personalized SEO growth plan.</Text>
              
              <FormControl>
                <FormLabel>Business Name</FormLabel>
                <Input placeholder="Enter your business name" />
              </FormControl>

              <FormControl>
                <FormLabel>Website</FormLabel>
                <Input placeholder="https://yourwebsite.com" />
              </FormControl>

              <FormControl>
                <FormLabel>Industry / Niche</FormLabel>
                <Input placeholder="e.g., E-commerce, SaaS, Consulting" />
              </FormControl>

              <FormControl>
                <FormLabel>Target Audience</FormLabel>
                <Input placeholder="Describe your ideal customer" />
              </FormControl>

              <FormControl>
                <FormLabel>Monthly Revenue Goal</FormLabel>
                <Input placeholder="$10,000" type="number" />
              </FormControl>

              <Button bg="brand.orange" color="white" size="lg" mt={4} _hover={{ bg: '#E8851A' }}>
                Generate My SEO Growth Plan
              </Button>
            </VStack>
          </Box>

          <Box w={{ base: 'full', lg: '400px' }} bg="white" p={6} borderRadius="lg" shadow="md" bgGradient="linear(to-br, brand.lavender, white)">
            <VStack spacing={4} align="stretch">
              <Heading size="md" fontFamily="heading">Estimated Traffic & Lead Growth</Heading>
              <Box p={6} bg="white" borderRadius="md">
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Text color="gray.600">Traffic Growth</Text>
                    <Text fontWeight="bold" color="brand.orange" fontFamily="heading">+247%</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text color="gray.600">New Leads</Text>
                    <Text fontWeight="bold" color="brand.teal" fontFamily="heading">1,248</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text color="gray.600">Est. Revenue</Text>
                    <Text fontWeight="bold" color="brand.orange" fontFamily="heading">$24,500</Text>
                  </HStack>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </HStack>
      </Container>
    </Box>
  );
}

