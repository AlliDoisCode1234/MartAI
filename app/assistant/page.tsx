'use client';

import { Container, VStack, Heading, Box, Input, Button, HStack, Text } from '@chakra-ui/react';

export default function AssistantPage() {
  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container maxW="container.xl" py={{ base: 8, md: 12 }} px={{ base: 4, sm: 6, md: 8, lg: 12 }}>
        <VStack spacing={8} align="stretch">
          <Heading size="2xl" fontWeight="bold" fontFamily="heading" color="gray.800">Optimization Assistant</Heading>
          
          <HStack spacing={6} align="start" flexDirection={{ base: 'column', lg: 'row' }}>
            <Box flex={1} bg="white" p={6} borderRadius="lg" shadow="md" h="600px" display="flex" flexDirection="column">
              <Box flex={1} overflowY="auto" mb={4} p={4} bg="brand.light" borderRadius="md">
                <VStack spacing={4} align="stretch">
                  <Box alignSelf="flex-end" bg="brand.teal" color="white" p={4} borderRadius="lg" maxW="80%">
                    <Text fontSize="sm">How can I rank faster for this keyword?</Text>
                  </Box>
                  <Box alignSelf="flex-start" bg="brand.lavender" color="gray.800" p={4} borderRadius="lg" maxW="80%">
                    <Text fontSize="sm">Based on your analytics, I recommend focusing on long-tail variations and creating pillar content around "SEO automation for small businesses". Here's a strategy...</Text>
                  </Box>
                </VStack>
              </Box>
              <HStack>
                <Input placeholder="Ask MartAI anything..." />
                <Button bg="brand.orange" color="white" _hover={{ bg: '#E8851A' }}>Send</Button>
              </HStack>
            </Box>

            <Box w={{ base: 'full', lg: '300px' }} bg="white" p={6} borderRadius="lg" shadow="md">
              <Heading size="sm" mb={4} fontFamily="heading">Quick Actions</Heading>
              <VStack spacing={3} align="stretch">
                <Button variant="outline" size="sm">Apply Suggestion</Button>
                <Button variant="outline" size="sm">Regenerate Plan</Button>
                <Button variant="outline" size="sm">Export Strategy</Button>
              </VStack>
            </Box>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}

