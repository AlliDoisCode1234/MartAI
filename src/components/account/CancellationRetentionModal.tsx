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
import { useMutation } from 'convex/react';
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
                onClick={() => setStep(3)}
                isDisabled={!reason}
                _hover={{ color: 'gray.700' }}
              >
                Continue cancellation
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
