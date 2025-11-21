'use client';

import { Container, VStack, Heading, Text, Box, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, HStack } from '@chakra-ui/react';

export default function ContentPage() {
  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container maxW="container.xl" py={{ base: 8, md: 12 }} px={{ base: 4, sm: 6, md: 8, lg: 12 }}>
        <VStack spacing={8} align="stretch">
          <Heading size="2xl" fontWeight="bold" fontFamily="heading" color="gray.800">AI in Action: Your Content Pipeline</Heading>
          
          <HStack spacing={6} align="start" flexDirection={{ base: 'column', lg: 'row' }}>
            <Box flex={1} bg="white" p={6} borderRadius="lg" shadow="md">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Topic</Th>
                    <Th>Status</Th>
                    <Th>Publish Date</Th>
                    <Th>Est. Leads</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {[
                    { topic: 'SEO Best Practices 2025', status: 'Active', date: 'Jan 15', leads: 45 },
                    { topic: 'Content Marketing Guide', status: 'Drafted', date: 'Jan 22', leads: 32 },
                    { topic: 'Keyword Research Tips', status: 'Active', date: 'Jan 29', leads: 28 },
                  ].map((row, i) => (
                    <Tr key={i}>
                      <Td>{row.topic}</Td>
                      <Td>
                        <Badge bg={row.status === 'Active' ? 'brand.teal' : 'brand.orange'} color="white" px={2} py={1} borderRadius="md">{row.status}</Badge>
                      </Td>
                      <Td>{row.date}</Td>
                      <Td>{row.leads}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            <Box w={{ base: 'full', lg: '400px' }} bg="white" p={6} borderRadius="lg" shadow="md">
              <Heading size="md" mb={4} fontFamily="heading">Blog Draft Preview</Heading>
              <Box h="300px" overflowY="auto" p={4} bg="brand.light" borderRadius="md">
                <Text fontSize="sm" color="gray.600">
                  Preview of the selected blog post will appear here...
                </Text>
              </Box>
              <HStack mt={4} spacing={4}>
                <Button bg="brand.orange" color="white" flex={1} _hover={{ bg: '#E8851A' }}>Publish Now</Button>
                <Button variant="outline" flex={1}>Send to Editor</Button>
              </HStack>
            </Box>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}

