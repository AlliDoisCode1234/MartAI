'use client';

import { Container, VStack, Heading, Grid, GridItem, Box, Text, HStack } from '@chakra-ui/react';

export default function AnalyticsPage() {
  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container maxW="container.xl" py={{ base: 8, md: 12 }} px={{ base: 4, sm: 6, md: 8, lg: 12 }}>
        <VStack spacing={8} align="stretch">
          <Heading size="2xl" fontWeight="bold" fontFamily="heading" color="gray.800">Analytics & Revenue Dashboard</Heading>
          
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
            <GridItem>
              <Box bg="white" p={6} borderRadius="lg" shadow="md">
                <Text fontSize="sm" color="gray.600" mb={2}>Organic Sessions</Text>
                <Heading size="xl" color="brand.orange" fontFamily="heading">12,458</Heading>
              </Box>
            </GridItem>
            <GridItem>
              <Box bg="white" p={6} borderRadius="lg" shadow="md">
                <Text fontSize="sm" color="gray.600" mb={2}>New Leads</Text>
                <Heading size="xl" color="brand.teal" fontFamily="heading">1,248</Heading>
              </Box>
            </GridItem>
            <GridItem>
              <Box bg="white" p={6} borderRadius="lg" shadow="md">
                <Text fontSize="sm" color="gray.600" mb={2}>Conversion Rate</Text>
                <Heading size="xl" color="brand.orange" fontFamily="heading">3.2%</Heading>
              </Box>
            </GridItem>
            <GridItem>
              <Box bg="white" p={6} borderRadius="lg" shadow="md">
                <Text fontSize="sm" color="gray.600" mb={2}>Est. Monthly Revenue</Text>
                <Heading size="xl" color="brand.teal" fontFamily="heading">$24,500</Heading>
              </Box>
            </GridItem>
          </Grid>

          <HStack spacing={6} align="start" flexDirection={{ base: 'column', lg: 'row' }}>
            <Box flex={1} bg="white" p={6} borderRadius="lg" shadow="md">
              <Heading size="md" mb={4} fontFamily="heading">Traffic Growth</Heading>
              <Box h="200px" bg="brand.light" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                <Text color="gray.400">Line Chart - Orange/Teal Gradient</Text>
              </Box>
            </Box>
            <Box flex={1} bg="white" p={6} borderRadius="lg" shadow="md">
              <Heading size="md" mb={4} fontFamily="heading">Leads Generated</Heading>
              <Box h="200px" bg="brand.light" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                <Text color="gray.400">Bar Graph</Text>
              </Box>
            </Box>
          </HStack>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
            <GridItem>
              <Box bg="white" p={6} borderRadius="lg" shadow="md">
                <Heading size="md" mb={4} fontFamily="heading">Top Performing Content</Heading>
                <VStack spacing={3} align="stretch">
                  {['SEO Guide 2025', 'Content Marketing Tips', 'Keyword Research'].map((item, i) => (
                    <HStack key={i} justify="space-between" p={3} bg="brand.light" borderRadius="md">
                      <Text>{item}</Text>
                      <Text fontWeight="bold" color="brand.orange">+{45 - i * 10}%</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            </GridItem>
            <GridItem>
              <Box bg="white" p={6} borderRadius="lg" shadow="md" borderLeft="4px" borderColor="brand.red">
                <Heading size="md" mb={4} fontFamily="heading">Quick Wins</Heading>
                <VStack spacing={3} align="stretch">
                  {['Optimize meta descriptions', 'Add internal links', 'Update old content'].map((item, i) => (
                    <HStack key={i} p={3} bg="brand.light" borderRadius="md">
                      <Text fontSize="sm">{item}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            </GridItem>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}

