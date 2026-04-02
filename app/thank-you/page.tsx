"use client";

import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FaXTwitter, FaLinkedinIn, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa6";

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

          <Box pt={6} mt={2} w="full" borderTop="1px solid" borderColor="gray.100" textAlign="center">
            <Text fontSize="sm" color="gray.500" mb={4}>
              While you wait, join the Phoo community:
            </Text>
            <HStack justify="center" spacing={6}>
              <Box as="a" href="https://x.com/GetPhooApp" target="_blank" rel="noopener noreferrer" color="gray.400" _hover={{ color: "brand.orange" }} transition="color 0.2s">
                <Icon as={FaXTwitter} boxSize={5} />
              </Box>
              <Box as="a" href="https://www.linkedin.com/company/phooapp" target="_blank" rel="noopener noreferrer" color="gray.400" _hover={{ color: "brand.orange" }} transition="color 0.2s">
                <Icon as={FaLinkedinIn} boxSize={5} />
              </Box>
              <Box as="a" href="https://www.instagram.com/phooapp" target="_blank" rel="noopener noreferrer" color="gray.400" _hover={{ color: "brand.orange" }} transition="color 0.2s">
                <Icon as={FaInstagram} boxSize={5} />
              </Box>
              <Box as="a" href="https://www.tiktok.com/@phooapp" target="_blank" rel="noopener noreferrer" color="gray.400" _hover={{ color: "brand.orange" }} transition="color 0.2s">
                <Icon as={FaTiktok} boxSize={5} />
              </Box>
              <Box as="a" href="https://www.youtube.com/@Phooapp" target="_blank" rel="noopener noreferrer" color="gray.400" _hover={{ color: "brand.orange" }} transition="color 0.2s">
                <Icon as={FaYoutube} boxSize={5} />
              </Box>
            </HStack>
          </Box>
        </VStack>
      </Box>
    </Container>
  );
}

