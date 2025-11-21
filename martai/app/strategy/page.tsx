'use client';

import { Container, VStack, Heading, Text, Grid, GridItem, Box, HStack, Progress, Badge } from '@chakra-ui/react';

export default function StrategyPage() {
  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container maxW="container.xl" py={{ base: 8, md: 12 }} px={{ base: 4, sm: 6, md: 8, lg: 12 }}>
        <VStack spacing={8} align="stretch">
          <Heading size="2xl" fontWeight="bold" fontFamily="heading" color="gray.800">AI Strategy Dashboard</Heading>
          
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
            <GridItem>
              <Box bg="white" p={6} borderRadius="lg" shadow="md">
                <Text fontSize="sm" color="gray.600" mb={2}>Target Keywords & Clusters</Text>
                <Heading size="lg" color="brand.orange" fontFamily="heading">247</Heading>
              </Box>
            </GridItem>
            <GridItem>
              <Box bg="white" p={6} borderRadius="lg" shadow="md">
                <Text fontSize="sm" color="gray.600" mb={2}>Content Opportunities</Text>
                <Heading size="lg" color="brand.teal" fontFamily="heading">89</Heading>
              </Box>
            </GridItem>
            <GridItem>
              <Box bg="white" p={6} borderRadius="lg" shadow="md">
                <Text fontSize="sm" color="gray.600" mb={2}>Traffic Growth Projection</Text>
                <Heading size="lg" color="brand.orange" fontFamily="heading">+247%</Heading>
              </Box>
            </GridItem>
          </Grid>

          <Box bg="white" p={6} borderRadius="lg" shadow="md">
            <Heading size="md" mb={4} fontFamily="heading">Content Rollout Calendar</Heading>
            <VStack spacing={4} align="stretch">
              {[1, 2, 3, 4].map((week) => (
                <HStack key={week} justify="space-between" p={4} bg="brand.light" borderRadius="md">
                  <Text fontWeight="medium">Week {week}</Text>
                  <Badge bg="brand.orange" color="white" px={3} py={1} borderRadius="md">Active</Badge>
                </HStack>
              ))}
            </VStack>
          </Box>

          <Box bg="white" p={6} borderRadius="lg" shadow="md">
            <HStack justify="space-between" mb={4}>
              <Text fontWeight="semibold">Implementation Status</Text>
              <Text color="brand.orange" fontWeight="bold">67%</Text>
            </HStack>
            <Progress value={67} bg="brand.light" colorScheme="orange" size="lg" borderRadius="full" />
          </Box>

          <Box bg="white" p={6} borderRadius="lg" shadow="md" borderLeft="4px" borderColor="brand.teal">
            <Text fontSize="sm" color="gray.600" mb={2}>Lead Forecast</Text>
            <Heading size="xl" color="brand.teal" fontFamily="heading">+37% next quarter</Heading>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

