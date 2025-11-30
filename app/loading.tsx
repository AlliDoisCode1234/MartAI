'use client';

import { Box, Container, Spinner, VStack, Text } from '@chakra-ui/react';

export default function Loading() {
  return (
    <Container maxW="container.xl" py={20}>
      <VStack spacing={4}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="brand.orange"
          size="xl"
        />
        <Text color="gray.500">Loading...</Text>
      </VStack>
    </Container>
  );
}
