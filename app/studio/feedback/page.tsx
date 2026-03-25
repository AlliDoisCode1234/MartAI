import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { BetaFeedbackForm } from '@/src/components/shared/BetaFeedbackForm';

export default function FeedbackPage() {
  return (
    <Box minH="100vh" bg="gray.50" py={12}>
      <Container maxW="3xl">
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading size="lg" color="gray.900" mb={3}>
              Help Us Build Phoo
            </Heading>
            <Text color="gray.600" fontSize="lg">
              As a beta tester, your feedback is crucial. Let us know what's working, what's broken, or what features you'd like to see next.
            </Text>
          </Box>
          
          <Box bg="white" p={8} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.200">
            <BetaFeedbackForm />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
