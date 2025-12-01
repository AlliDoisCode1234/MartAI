'use client';

import { Box, Container, Spinner, VStack, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function Loading() {
  return (
    <Container maxW="container.xl" h="100vh" display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={6}>
        <MotionBox
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Box
            position="relative"
            width="80px"
            height="80px"
            borderRadius="full"
            borderWidth="4px"
            borderColor="gray.100"
            borderTopColor="brand.orange"
            borderRightColor="brand.red"
          />
        </MotionBox>
        
        <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        >
            <Text 
                color="gray.500" 
                fontSize="lg" 
                fontWeight="medium"
                letterSpacing="wide"
            >
                LOADING
            </Text>
        </MotionBox>
      </VStack>
    </Container>
  );
}
