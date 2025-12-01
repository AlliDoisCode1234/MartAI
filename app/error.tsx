'use client';

import { useEffect } from 'react';
import { Box, Container, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { WarningTwoIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Container maxW="container.xl" h="100vh" display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={8} textAlign="center">
        <MotionBox
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <WarningTwoIcon w={20} h={20} color="red.500" mb={6} />
          
          <Heading
            fontSize={{ base: '4xl', md: '5xl' }}
            fontWeight="bold"
            mb={4}
            color="gray.800"
          >
            Something went wrong!
          </Heading>
          
          <Text fontSize="xl" color="gray.600" maxW="lg" mx="auto" mb={8}>
            We apologize for the inconvenience. An unexpected error has occurred.
          </Text>

          <Button
            size="lg"
            colorScheme="brand"
            onClick={reset}
            px={8}
            py={6}
            _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
            }}
          >
            Try again
          </Button>
        </MotionBox>
      </VStack>
    </Container>
  );
}
