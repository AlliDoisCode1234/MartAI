'use client';

/**
 * CancellationRetentionModal
 *
 * Component Hierarchy:
 * App → Settings → AccountTab → BillingAccordion → CancellationRetentionModal
 *
 * 3-step cancellation flow designed to retain users:
 * Step 1: "We'd hate to see you go" — capture reason
 * Step 2: Retention offer (20% off placeholder)
 * Step 3: Final confirmation with effective date
 */

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Box,
  Icon,
  RadioGroup,
  Radio,
  Textarea,
  Divider,
  Badge,
  useToast,
} from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { useMutation, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  FiAlertTriangle,
  FiGift,
  FiCheckCircle,
  FiXCircle,
  FiBarChart2,
  FiFileText,
  FiSearch,
  FiZap,
  FiPauseCircle,
  FiTrendingDown,
} from 'react-icons/fi';

type CancelReason = 'too_expensive' | 'not_using' | 'missing_features' | 'found_alternative' | 'other';

const REASON_LABELS: Record<CancelReason, string> = {
  too_expensive: 'Too expensive for my needs',
  not_using: 'Not using it enough',
  missing_features: 'Missing features I need',
  found_alternative: 'Found a better alternative',
  other: 'Other reason',
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
  renewsAt?: number;
}

export function CancellationRetentionModal({ isOpen, onClose, currentPlan, renewsAt }: Props) {
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState<CancelReason | ''>('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // UX-045: Synchronous ref guard — prevents duplicate cancellation calls
  const isSubmittingRef = useRef(false);
  const toast = useToast();

  const requestCancellation = useMutation(
    api.subscriptions.subscriptionLifecycle.requestCancellation
  );
  const applyRetentionOffer = useAction(api.subscriptions.retention.applyRetentionOffer);
  const createPortalSession = useAction(api.stripe.checkout.createPortalSession);

  const effectiveDate = renewsAt
    ? new Date(renewsAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'the end of your billing period';

  const handleClose = () => {
    setStep(1);
    setReason('');
    setFeedback('');
    setIsSubmitting(false);
    onClose();
  };

  const handleFinalCancel = async () => {
    if (!reason) return;
    // UX-045: Synchronous guard prevents concurrent submissions
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    try {
      await requestCancellation({
        reason,
        feedback: feedback.trim() || undefined,
      });
      toast({
        title: 'Subscription cancellation requested',
        description: `Your access continues until ${effectiveDate}.`,
        status: 'info',
        duration: 6000,
        isClosable: true,
      });
      handleClose();
    } catch (err) {
      toast({
        title: 'Cancellation failed',
        description: err instanceof Error ? err.message : 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleRetentionOption = async (option: 'pause' | 'stay20' | 'downgrade') => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      if (option === 'downgrade') {
        // Option 3: Redirect to Stripe Customer Portal to downgrade
        const { url } = await createPortalSession({ 
          returnUrl: `${window.location.origin}/settings?tab=billing` 
        });
        window.location.href = url;
        return; // Don't close or unset loading state pending redirect
      }

      // Option 1 & 2: Pause or Apply Coupon
      await applyRetentionOffer({ option });
      toast({
        title: option === 'pause' ? 'Subscription Paused' : 'Discount Applied!',
        description: option === 'pause' 
          ? 'Your subscription will pause for 2 months.'
          : 'Enjoy 20% off for the next 3 months!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      handleClose();
    } catch (err) {
      toast({
        title: 'Action failed',
        description: err instanceof Error ? err.message : 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent borderRadius="xl" mx={4}>
        {/* ─── Step 1: Capture Reason ─── */}
        {step === 1 && (
          <>
            <ModalHeader pb={2}>
              <HStack spacing={3}>
                <Icon as={FiAlertTriangle} color="orange.400" boxSize={5} />
                <Text>We&apos;d hate to see you go</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack align="stretch" spacing={5}>
                <Text color="gray.600" fontSize="sm">
                  Before you cancel, help us understand why so we can improve.
                </Text>

                {/* What you'll lose */}
                <Box bg="orange.50" p={4} borderRadius="lg" border="1px solid" borderColor="orange.100">
                  <Text fontWeight="semibold" fontSize="sm" color="orange.700" mb={3}>
                    Here&apos;s what you&apos;ll lose access to:
                  </Text>
                  <VStack align="start" spacing={2}>
                    {[
                      { icon: FiFileText, label: 'AI content generation & optimization' },
                      { icon: FiSearch, label: 'Keyword research & rank tracking' },
                      { icon: FiBarChart2, label: 'Analytics dashboards & SEO audits' },
                      { icon: FiZap, label: 'Automated publishing & scheduling' },
                    ].map((item) => (
                      <HStack key={item.label} spacing={2}>
                        <Icon as={item.icon} color="orange.500" boxSize={3.5} />
                        <Text fontSize="sm" color="gray.600">{item.label}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>

                <Divider />

                {/* Reason selector */}
                <Box>
                  <Text fontWeight="medium" fontSize="sm" color="gray.700" mb={3}>
                    Why are you canceling?
                  </Text>
                  <RadioGroup
                    value={reason}
                    onChange={(val) => setReason(val as CancelReason)}
                  >
                    <VStack align="start" spacing={2}>
                      {(Object.entries(REASON_LABELS) as [CancelReason, string][]).map(
                        ([key, label]) => (
                          <Radio key={key} value={key} colorScheme="orange" size="sm">
                            <Text fontSize="sm">{label}</Text>
                          </Radio>
                        )
                      )}
                    </VStack>
                  </RadioGroup>
                </Box>

                {/* Optional feedback */}
                <Textarea
                  placeholder="Anything else you'd like us to know? (optional)"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  size="sm"
                  borderRadius="lg"
                  rows={3}
                  _focus={{ borderColor: 'orange.400', boxShadow: '0 0 0 1px var(--chakra-colors-orange-400)' }}
                />
              </VStack>
            </ModalBody>
            <ModalFooter gap={3}>
              <Button
                colorScheme="orange"
                onClick={handleClose}
                size="md"
              >
                Keep My Subscription
              </Button>
              <Button
                variant="ghost"
                color="gray.500"
                size="sm"
                onClick={() => setStep(2)}
                isDisabled={!reason}
                _hover={{ color: 'gray.700' }}
              >
                Continue cancellation
              </Button>
            </ModalFooter>
          </>
        )}

        {/* ─── Step 2: Retention Offers ─── */}
        {step === 2 && (
          <>
            <ModalHeader pb={2}>
              <HStack spacing={3}>
                <Icon as={FiGift} color="orange.400" boxSize={5} />
                <Text>Wait, before you go...</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack align="stretch" spacing={4}>
                <Text color="gray.600" fontSize="sm">
                  We value your membership. Choose an option below that works better for you:
                </Text>

                <VStack spacing={3} align="stretch" mt={2}>
                  {/* Option 2: Discount */}
                  <Box 
                    p={4} 
                    borderWidth="2px" 
                    borderColor="orange.400" 
                    borderRadius="xl" 
                    bg="orange.50"
                    position="relative"
                    overflow="hidden"
                  >
                    <Badge position="absolute" top={3} right={3} colorScheme="green" variant="solid">
                      RECOMMENDED
                    </Badge>
                    <HStack mb={2}>
                      <Icon as={FiGift} color="orange.500" boxSize={5} />
                      <Text fontWeight="bold" color="orange.800">Stay and Save 20%</Text>
                    </HStack>
                    <Text fontSize="sm" color="orange.700" mb={4}>
                      Get 20% off your subscription for the next 3 months. Keep all your benefits and data.
                    </Text>
                    <Button 
                      w="full" 
                      colorScheme="orange" 
                      onClick={() => handleRetentionOption('stay20')}
                      isLoading={isSubmitting}
                      loadingText="Applying coupon..."
                    >
                      Claim 20% Off
                    </Button>
                  </Box>

                  {/* Option 1: Pause */}
                  <Box p={4} borderWidth="1px" borderColor="gray.200" borderRadius="xl" bg="white">
                    <HStack mb={2}>
                      <Icon as={FiPauseCircle} color="blue.500" boxSize={5} />
                      <Text fontWeight="bold" color="gray.800">Need a break? Pause it</Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.600" mb={4}>
                      Pause billing for up to 2 months. We'll save your projects exactly how you left them.
                    </Text>
                    <Button 
                      w="full" 
                      variant="outline" 
                      onClick={() => handleRetentionOption('pause')}
                      isLoading={isSubmitting}
                      loadingText="Pausing..."
                    >
                      Pause For 2 Months
                    </Button>
                  </Box>

                  {/* Option 3: Downgrade */}
                  <Box p={4} borderWidth="1px" borderColor="gray.200" borderRadius="xl" bg="white">
                    <HStack mb={2}>
                      <Icon as={FiTrendingDown} color="gray.500" boxSize={5} />
                      <Text fontWeight="bold" color="gray.800">Switch to a lower plan</Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.600" mb={4}>
                      Don't need all the features right now? Switch to a lighter subscription tier.
                    </Text>
                    <Button 
                      w="full" 
                      variant="ghost" 
                      onClick={() => handleRetentionOption('downgrade')}
                      isLoading={isSubmitting}
                      loadingText="Redirecting..."
                    >
                      View Lower Plans
                    </Button>
                  </Box>
                </VStack>
              </VStack>
            </ModalBody>
            <ModalFooter justifyContent="center" pt={0}>
              <Button
                variant="ghost"
                color="gray.400"
                size="sm"
                onClick={() => setStep(3)}
                _hover={{ color: 'red.500', bg: 'red.50' }}
                isDisabled={isSubmitting}
              >
                No thanks, I still want to cancel
              </Button>
            </ModalFooter>
          </>
        )}

        {/* ─── Step 3: Final Confirmation ─── */}
        {step === 3 && (
          <>
            <ModalHeader pb={2}>
              <HStack spacing={3}>
                <Icon as={FiXCircle} color="red.400" boxSize={5} />
                <Text>Confirm cancellation</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack align="stretch" spacing={4}>
                <Box
                  bg="gray.50"
                  p={4}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <HStack spacing={3} mb={2}>
                    <Icon as={FiCheckCircle} color="blue.400" boxSize={4} />
                    <Text fontWeight="medium" fontSize="sm" color="gray.700">
                      Your access continues until
                    </Text>
                  </HStack>
                  <Text fontWeight="bold" fontSize="lg" color="gray.800" pl={7}>
                    {effectiveDate}
                  </Text>
                </Box>

                <Text fontSize="sm" color="gray.500">
                  After this date, your account will become read-only. You can
                  resubscribe at any time to regain full access.
                </Text>

                {reason && (
                  <Text fontSize="xs" color="gray.400">
                    Reason: {REASON_LABELS[reason]}
                  </Text>
                )}
              </VStack>
            </ModalBody>
            <ModalFooter gap={3}>
              <Button
                colorScheme="orange"
                onClick={handleClose}
                size="md"
              >
                I changed my mind
              </Button>
              <Button
                colorScheme="red"
                variant="outline"
                size="sm"
                onClick={handleFinalCancel}
                isLoading={isSubmitting}
                loadingText="Cancelling..."
              >
                Cancel my subscription
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
