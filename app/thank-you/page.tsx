"use client";

import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function ThankYouPage() {
  const router = useRouter();

  return (
    <Container maxW="lg" py={16}>
      <Box bg="white" p={10} borderRadius="xl" shadow="lg">
        <VStack spacing={6}>
          <Heading size="lg" textAlign="center">
            Thanks for applying!
          </Heading>
          <Text textAlign="center" color="gray.600">
            Our team is reviewing your answers. We’ll send a personalized strategy preview within
            the next business day. Keep an eye on your inbox for next steps.
          </Text>
          <Button colorScheme="orange" onClick={() => router.push("/")}>
            Back to home
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}

