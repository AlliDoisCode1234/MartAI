'use client';

import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  HStack,
  Box,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
  Image,
  Progress,
  Circle,
  Flex,
  Alert,
  AlertIcon,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon, ExternalLinkIcon } from '@chakra-ui/icons';

const MotionBox = motion(Box);

interface AnalyticsSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: { ga4PropertyId: string; gscSiteUrl?: string }) => Promise<void>;
  tokens: {
    accessToken: string;
    refreshToken: string;
    projectId: string;
  };
}

const steps = [
  {
    id: 'intro',
    title: 'Connect Your Analytics',
    description: "We'll guide you through connecting Google Analytics and Search Console.",
  },
  {
    id: 'ga4-guide',
    title: 'Find Your GA4 Property ID',
    description: 'Follow these steps to get your Property ID.',
  },
  {
    id: 'ga4-input',
    title: 'Enter Property ID',
    description: 'Paste your GA4 Property ID below.',
  },
  {
    id: 'gsc-input',
    title: 'Connect Search Console',
    description: 'Add your website from Search Console.',
  },
  {
    id: 'complete',
    title: 'All Set! 🎉',
    description: 'Your analytics are now connected.',
  },
];

export function AnalyticsSetupWizard({
  isOpen,
  onClose,
  onComplete,
  tokens,
}: AnalyticsSetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [ga4PropertyId, setGA4PropertyId] = useState('');
  const [gscSiteUrl, setGscSiteUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const stepBg = useColorModeValue('gray.50', 'gray.700');
  const activeBg = useColorModeValue('blue.500', 'blue.400');

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await onComplete({
        ga4PropertyId,
        gscSiteUrl: gscSiteUrl || undefined,
      });
      handleNext(); // Go to complete step
    } catch (error) {
      console.error('Failed to save connection:', error);
      alert('Failed to save connection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipGSC = async () => {
    setLoading(true);
    try {
      await onComplete({
        ga4PropertyId,
        gscSiteUrl: undefined,
      });
      setCurrentStep(steps.length - 1); // Go to complete step
    } catch (error) {
      console.error('Failed to save connection:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.id) {
      case 'intro':
        return (
          <VStack spacing={6} py={4}>
            <Box fontSize="6xl">📊</Box>
            <Text textAlign="center" color="gray.600" maxW="sm">
              Connect your Google Analytics 4 and Search Console to unlock powerful SEO insights and
              recommendations.
            </Text>
            <VStack spacing={2} align="start" w="full" bg={stepBg} p={4} borderRadius="lg">
              <HStack>
                <CheckIcon color="green.500" />
                <Text fontSize="sm">Real traffic and engagement data</Text>
              </HStack>
              <HStack>
                <CheckIcon color="green.500" />
                <Text fontSize="sm">Keyword rankings and opportunities</Text>
              </HStack>
              <HStack>
                <CheckIcon color="green.500" />
                <Text fontSize="sm">AI-powered insights and recommendations</Text>
              </HStack>
            </VStack>
          </VStack>
        );

      case 'ga4-guide':
        return (
          <VStack spacing={4} py={4}>
            <Box borderRadius="lg" overflow="hidden" boxShadow="md" position="relative" w="full">
              <Image
                src="/images/guides/ga4_admin_step.png"
                alt="Click Admin in Google Analytics"
                fallback={
                  <Box
                    bg="gray.100"
                    h="200px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text color="gray.500">Guide Image</Text>
                  </Box>
                }
              />
            </Box>

            <VStack align="start" spacing={3} w="full">
              <HStack spacing={3} align="flex-start">
                <Circle size="24px" bg="blue.500" color="white" fontSize="xs" fontWeight="bold">
                  1
                </Circle>
                <Text fontSize="sm">
                  Open{' '}
                  <Link href="https://analytics.google.com" isExternal color="blue.500">
                    Google Analytics <ExternalLinkIcon mx="2px" />
                  </Link>
                </Text>
              </HStack>
              <HStack spacing={3} align="flex-start">
                <Circle size="24px" bg="blue.500" color="white" fontSize="xs" fontWeight="bold">
                  2
                </Circle>
                <Text fontSize="sm">
                  Click the <strong>Admin</strong> (gear icon) in the bottom left
                </Text>
              </HStack>
              <HStack spacing={3} align="flex-start">
                <Circle size="24px" bg="blue.500" color="white" fontSize="xs" fontWeight="bold">
                  3
                </Circle>
                <Text fontSize="sm">
                  Under <strong>Property</strong>, click <strong>Property Settings</strong>
                </Text>
              </HStack>
              <HStack spacing={3} align="flex-start">
                <Circle size="24px" bg="blue.500" color="white" fontSize="xs" fontWeight="bold">
                  4
                </Circle>
                <Text fontSize="sm">
                  Copy the <strong>Property ID</strong> (numbers only, like 123456789)
                </Text>
              </HStack>
            </VStack>
          </VStack>
        );

      case 'ga4-input':
        return (
          <VStack spacing={6} py={4}>
            <Box borderRadius="lg" overflow="hidden" boxShadow="md" w="full">
              <Image
                src="/images/guides/ga4_property_step.png"
                alt="Copy Property ID"
                fallback={
                  <Box
                    bg="gray.100"
                    h="150px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text color="gray.500">Property ID Location</Text>
                  </Box>
                }
              />
            </Box>

            <FormControl isRequired>
              <FormLabel>GA4 Property ID</FormLabel>
              <Input
                placeholder="123456789"
                value={ga4PropertyId}
                onChange={(e) => setGA4PropertyId(e.target.value)}
                size="lg"
                textAlign="center"
                fontSize="xl"
                letterSpacing="wider"
              />
              <Text fontSize="xs" color="gray.500" mt={2} textAlign="center">
                Just the numbers, no dashes or letters
              </Text>
            </FormControl>
          </VStack>
        );

      case 'gsc-input':
        return (
          <VStack spacing={6} py={4}>
            <Alert status="success" borderRadius="md">
              <AlertIcon />
              GA4 connected! Now add Search Console (optional).
            </Alert>

            <FormControl>
              <FormLabel>Search Console Site URL</FormLabel>
              <Input
                placeholder="https://example.com or sc-domain:example.com"
                value={gscSiteUrl}
                onChange={(e) => setGscSiteUrl(e.target.value)}
                size="lg"
              />
            </FormControl>

            <Box bg={stepBg} p={4} borderRadius="lg" w="full">
              <Text fontSize="sm" fontWeight="semibold" mb={2}>
                📖 Site URL Format:
              </Text>
              <VStack align="start" spacing={1} fontSize="sm" color="gray.600">
                <Text>
                  • URL-prefix: <code>https://example.com/</code>
                </Text>
                <Text>
                  • Domain: <code>sc-domain:example.com</code>
                </Text>
              </VStack>
            </Box>
          </VStack>
        );

      case 'complete':
        return (
          <VStack spacing={6} py={8}>
            <MotionBox
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Circle size="80px" bg="green.100">
                <CheckIcon boxSize="40px" color="green.500" />
              </Circle>
            </MotionBox>
            <Text textAlign="center" color="gray.600">
              Your analytics are now connected. Data will sync automatically every night, and you'll
              start seeing insights on your dashboard.
            </Text>
          </VStack>
        );

      default:
        return null;
    }
  };

  const renderFooter = () => {
    const step = steps[currentStep];

    switch (step.id) {
      case 'intro':
        return (
          <Button colorScheme="blue" onClick={handleNext} size="lg" w="full">
            Let's Get Started
          </Button>
        );

      case 'ga4-guide':
        return (
          <HStack w="full">
            <Button variant="ghost" onClick={handleBack}>
              Back
            </Button>
            <Button colorScheme="blue" onClick={handleNext} flex={1}>
              I Found It
            </Button>
          </HStack>
        );

      case 'ga4-input':
        return (
          <HStack w="full">
            <Button variant="ghost" onClick={handleBack}>
              Back
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleNext}
              flex={1}
              isDisabled={!ga4PropertyId || ga4PropertyId.length < 6}
            >
              Continue
            </Button>
          </HStack>
        );

      case 'gsc-input':
        return (
          <HStack w="full">
            <Button variant="ghost" onClick={handleSkipGSC} isLoading={loading}>
              Skip for now
            </Button>
            <Button
              colorScheme="green"
              onClick={handleComplete}
              flex={1}
              isLoading={loading}
              isDisabled={!gscSiteUrl}
            >
              Connect GSC
            </Button>
          </HStack>
        );

      case 'complete':
        return (
          <Button colorScheme="green" onClick={onClose} size="lg" w="full">
            Go to Dashboard
          </Button>
        );

      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" closeOnOverlayClick={false}>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent mx={4}>
        <ModalHeader pb={2}>
          <VStack align="stretch" spacing={3}>
            {/* Step Indicators */}
            <HStack justify="center" spacing={2}>
              {steps.map((step, index) => (
                <Circle
                  key={step.id}
                  size="8px"
                  bg={index <= currentStep ? activeBg : 'gray.200'}
                  transition="all 0.3s"
                />
              ))}
            </HStack>
            <Progress value={progress} size="xs" colorScheme="blue" borderRadius="full" />
            <Text fontSize="lg" fontWeight="bold" textAlign="center">
              {steps[currentStep].title}
            </Text>
            <Text fontSize="sm" color="gray.500" textAlign="center">
              {steps[currentStep].description}
            </Text>
          </VStack>
        </ModalHeader>
        {currentStep < steps.length - 1 && <ModalCloseButton />}

        <ModalBody>
          <AnimatePresence mode="wait">
            <MotionBox
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStepContent()}
            </MotionBox>
          </AnimatePresence>
        </ModalBody>

        <ModalFooter>{renderFooter()}</ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AnalyticsSetupWizard;
