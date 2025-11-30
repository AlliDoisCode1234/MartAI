'use client';

import { Box, Container, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function NotFound() {
  const router = useRouter();

  return (
    <Container maxW="container.md" py={20}>
      <VStack spacing={8} textAlign="center">
        <MotionBox
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          // @ts-ignore
          transition={{ duration: 0.5 }}
        >
          <Heading
            fontSize={{ base: '6xl', md: '8xl' }}
            fontWeight="bold"
            bgGradient="linear(to-r, brand.orange, brand.red)"
            bgClip="text"
            mb={4}
          >
            404
          </Heading>
          <Heading size="xl" mb={4}>
            Page Not Found
          </Heading>
          <Text fontSize="lg" color="gray.500" maxW="md" mx="auto">
            The page you're looking for doesn't exist or has been moved.
          </Text>
        </MotionBox>

        <Button
          size="lg"
          colorScheme="brand"
          variant="solid"
          leftIcon={<ArrowBackIcon />}
          onClick={() => router.push('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </VStack>
    </Container>
  );
}
