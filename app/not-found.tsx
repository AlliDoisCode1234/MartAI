'use client';

import { Box, Container, Heading, Text, Button, VStack, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';


const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

export default function NotFound() {
  const router = useRouter();

  return (
    <Container maxW="container.xl" h="100vh" display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={8} textAlign="center">
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Heading
            fontSize={{ base: '8xl', md: '9xl' }}
            fontWeight="extrabold"
            bgGradient="linear(to-r, brand.orange, brand.red)"
            bgClip="text"
            lineHeight="1"
          >
            404
          </Heading>
        </MotionBox>

        <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
        >
            <Heading size="xl" mb={4} color="gray.700">
                Page Not Found
            </Heading>
            <Text fontSize="xl" color="gray.500" maxW="lg" mx="auto">
                Oops! The page you are looking for seems to have vanished into the digital void.
            </Text>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Button
            size="lg"
            colorScheme="brand"
            variant="solid"
            leftIcon={<ArrowBackIcon />}
            onClick={() => router.push('/dashboard')}
            px={8}
            py={6}
            fontSize="lg"
            _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
            }}
          >
            Return to Dashboard
          </Button>
        </MotionBox>
      </VStack>
    </Container>
  );
}
