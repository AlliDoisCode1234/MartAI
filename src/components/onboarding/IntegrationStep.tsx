'use client';

/**
 * IntegrationStep Component
 *
 * Component Hierarchy:
 * App → Onboarding → IntegrationStep (this file)
 *
 * Step 4: GA4/GSC connection.
 */

import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  Card,
  CardBody,
  Icon,
  Button,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FiArrowRight,
  FiArrowLeft,
  FiCheck,
  FiTrendingUp,
  FiZap,
  FiAlertCircle,
} from 'react-icons/fi';

const MotionBox = motion(Box);

const GoogleIcon = () => (
  <Box as="svg" viewBox="0 0 24 24" w={5} h={5} fill="currentColor">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </Box>
);

type Props = {
  projectId: string | null;
  ga4Connected: boolean;
  connectionError: string | null; // Error message when connection fails (e.g., no properties)
  onConnect: () => void;
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
};

export function IntegrationStep({
  projectId,
  ga4Connected,
  connectionError,
  onConnect,
  onNext,
  onSkip,
  onBack,
}: Props) {
  // Check if error is "no properties found"
  const isNoPropertiesError =
    connectionError?.toLowerCase().includes('no') ||
    connectionError?.toLowerCase().includes('properties');

  return (
    <MotionBox
      key="step4"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <Box bg="white" p={8} borderRadius="2xl" shadow="lg">
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Badge colorScheme="orange" mb={2}>
              Preliminary Score Ready!
            </Badge>
            <Heading size="lg" mb={2}>
              Boost Your PR Score
            </Heading>
            <Text color="gray.600">
              Connect Google Analytics to unlock accurate traffic data and improve your Phoo Rating
              by up to 30%.
            </Text>
          </Box>

          <Card bg="orange.50" borderWidth="1px" borderColor="orange.200">
            <CardBody>
              <HStack spacing={4}>
                <Icon as={FiTrendingUp} boxSize={8} color="orange.500" />
                <Box>
                  <Text fontWeight="semibold">Why Connect GA4?</Text>
                  <Text fontSize="sm" color="gray.600">
                    Real traffic data lets Phoo understand your actual audience, find better
                    keywords, and create more targeted content strategies.
                  </Text>
                </Box>
              </HStack>
            </CardBody>
          </Card>

          <VStack spacing={4} align="stretch">
            {ga4Connected ? (
              <Box p={4} bg="green.50" borderRadius="lg" borderWidth="1px" borderColor="green.200">
                <HStack spacing={3}>
                  <Icon as={FiCheck} boxSize={6} color="green.500" />
                  <Box>
                    <Text fontWeight="semibold" color="green.700">
                      Google Analytics Connected
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Your GA4 data will be used to enhance your PR Score
                    </Text>
                  </Box>
                </HStack>
              </Box>
            ) : connectionError ? (
              // Error state - show error and try again option
              <Box p={4} bg="red.50" borderRadius="lg" borderWidth="1px" borderColor="red.200">
                <VStack spacing={3} align="stretch">
                  <HStack spacing={3}>
                    <Icon as={FiAlertCircle} boxSize={6} color="red.500" />
                    <Box>
                      <Text fontWeight="semibold" color="red.700">
                        {isNoPropertiesError ? 'No GA4 Properties Found' : 'Connection Failed'}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {isNoPropertiesError
                          ? "This Google account doesn't have any GA4 properties. Try a different account or skip for now."
                          : connectionError}
                      </Text>
                    </Box>
                  </HStack>
                  <Button
                    size="md"
                    variant="outline"
                    colorScheme="blue"
                    leftIcon={<GoogleIcon />}
                    onClick={onConnect}
                  >
                    Try a Different Account
                  </Button>
                </VStack>
              </Box>
            ) : (
              <Button
                size="lg"
                variant="outline"
                colorScheme="blue"
                leftIcon={<GoogleIcon />}
                onClick={onConnect}
                isDisabled={!projectId}
              >
                Connect with Google
              </Button>
            )}

            <Text fontSize="xs" color="gray.500" textAlign="center">
              {ga4Connected
                ? 'Connected! You can manage this in the Integrations page later.'
                : connectionError
                  ? "Make sure you're signed into a Google account with GA4 access for your website."
                  : projectId
                    ? 'Sign in with the Google account linked to your Analytics & Search Console.'
                    : 'Creating your project... Please wait.'}
            </Text>
          </VStack>

          <Box p={4} bg="blue.50" borderRadius="lg" borderWidth="1px" borderColor="blue.200">
            <VStack spacing={2}>
              <Icon as={FiZap} boxSize={6} color="blue.500" />
              <Text fontWeight="medium" color="blue.700">
                What you'll get with GA4 connected:
              </Text>
              <VStack fontSize="sm" color="gray.600" spacing={1}>
                <Text>Real traffic data instead of estimates</Text>
                <Text>Accurate user behavior insights</Text>
                <Text>Up to 30% more accurate PR Score</Text>
              </VStack>
            </VStack>
          </Box>

          <VStack spacing={3} pt={4}>
            <HStack justify="space-between" w="full">
              <Button variant="ghost" leftIcon={<FiArrowLeft />} onClick={onBack}>
                Back
              </Button>
              <Button colorScheme="orange" rightIcon={<FiArrowRight />} onClick={onNext} size="lg">
                {ga4Connected ? 'Continue' : 'Continue without GA4'}
              </Button>
            </HStack>

            {!ga4Connected && (
              <Text
                fontSize="xs"
                color="gray.400"
                textAlign="center"
                cursor="pointer"
                _hover={{ color: 'gray.500' }}
                onClick={onSkip}
              >
                Skip for now (you'll miss out on accurate analytics)
              </Text>
            )}
          </VStack>
        </VStack>
      </Box>
    </MotionBox>
  );
}
