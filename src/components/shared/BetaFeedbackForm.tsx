'use client';

/**
 * BetaFeedbackForm
 *
 * Component Hierarchy:
 * App -> [AnyRoute] -> BetaFeedbackForm
 *
 * Renders a mailto-prepopulated feedback link form. 
 * This ensures feedback is ALWAYS collectible, regardless of
 * third-party service availability, seamlessly opening the user's email client.
 */

import { useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Textarea,
  Button,
  Select,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { FiSend, FiMessageSquare, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '@/lib/useAuth';
import { BRAND } from '@/lib/constants/brand';


interface FeedbackFormData {
  category: string;
  message: string;
  rating: string;
}

export const BetaFeedbackForm = () => {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FeedbackFormData>({
    category: 'general',
    message: '',
    rating: '4',
  });

  const handleSubmit = () => {
    if (!formData.message.trim()) {
      toast({
        title: 'Message required',
        description: 'Please describe your feedback before submitting.',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    // Construct a pre-filled mailto link as the delivery mechanism
    const subject = encodeURIComponent(
      `[Phoo Beta Feedback] ${formData.category} - Rating: ${formData.rating}/5`
    );
    const body = encodeURIComponent(
      `Category: ${formData.category}\nRating: ${formData.rating}/5\nUser: ${user?.email || 'Anonymous'}\n\n${formData.message}`
    );
    const supportEmail = BRAND?.supportEmail || 'support@phoo.ai';

    const mailtoUrl = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
    const opened = window.open(mailtoUrl, '_blank');
    if (!opened) {
      window.location.href = mailtoUrl;
    }

    setSubmitted(true);
    toast({
      title: 'Feedback prepared',
      description: 'Your email client should open with your feedback. Thank you!',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  if (submitted) {
    return (
      <Box w="full" maxW="lg" mx="auto" p={8} bg="white" rounded="xl" shadow="sm" borderWidth="1px" borderColor="gray.100" textAlign="center">
        <VStack spacing={4}>
          <Icon as={FiCheckCircle} boxSize={12} color="green.400" />
          <Text fontSize="xl" fontWeight="bold" color="gray.800">
            Thank You!
          </Text>
          <Text fontSize="sm" color="gray.500">
            Your feedback helps us build a better product. We read every message.
          </Text>
          <Button
            variant="outline"
            colorScheme="orange"
            size="sm"
            onClick={() => {
              setSubmitted(false);
              setFormData({ category: 'general', message: '', rating: '4' });
            }}
          >
            Send More Feedback
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <Box w="full" maxW="lg" mx="auto" p={6} bg="white" rounded="xl" shadow="sm" borderWidth="1px" borderColor="gray.100">
      <VStack spacing={5} align="stretch">
        <HStack spacing={3}>
          <Icon as={FiMessageSquare} color="brand.orange" boxSize={5} />
          <Text fontSize="xl" fontWeight="bold" color="gray.800">
            Beta Feedback
          </Text>
        </HStack>
        <Text fontSize="sm" color="gray.500">
          Your feedback goes directly to our product team to help shape the future of Phoo.
        </Text>

        <FormControl>
          <FormLabel fontSize="sm" color="gray.600">Category</FormLabel>
          <Select
            value={formData.category}
            onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
            bg="gray.50"
            borderColor="gray.200"
            _hover={{ borderColor: 'gray.300' }}
            _focus={{ borderColor: 'orange.400', boxShadow: '0 0 0 1px var(--chakra-colors-orange-400)' }}
          >
            <option value="general">General Feedback</option>
            <option value="bug">Bug Report</option>
            <option value="feature">Feature Request</option>
            <option value="ux">UX / Design</option>
            <option value="performance">Performance</option>
            <option value="content">Content Quality</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm" color="gray.600">How would you rate your experience?</FormLabel>
          <HStack spacing={2}>
            {['1', '2', '3', '4', '5'].map((value) => (
              <Button
                key={value}
                size="sm"
                variant={formData.rating === value ? 'solid' : 'outline'}
                colorScheme={formData.rating === value ? 'orange' : 'gray'}
                onClick={() => setFormData((prev) => ({ ...prev, rating: value }))}
                borderRadius="lg"
                minW="40px"
              >
                {value}
              </Button>
            ))}
          </HStack>
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize="sm" color="gray.600">Your Feedback</FormLabel>
          <Textarea
            value={formData.message}
            onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
            placeholder="Tell us what's working, what's broken, or what you'd love to see next..."
            bg="gray.50"
            borderColor="gray.200"
            rows={5}
            _hover={{ borderColor: 'gray.300' }}
            _focus={{ borderColor: 'orange.400', boxShadow: '0 0 0 1px var(--chakra-colors-orange-400)' }}
            _placeholder={{ color: 'gray.400' }}
          />
        </FormControl>

        {isAuthenticated && user?.email && (
          <Text fontSize="xs" color="gray.400">
            Sending as {user.email}
          </Text>
        )}

        <Button
          bg="linear-gradient(135deg, #FF9D00 0%, #FF6B00 100%)"
          color="white"
          size="lg"
          leftIcon={<FiSend />}
          onClick={handleSubmit}
          _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }}
          transition="all 0.2s"
          borderRadius="xl"
        >
          Send Feedback
        </Button>
      </VStack>
    </Box>
  );
};
