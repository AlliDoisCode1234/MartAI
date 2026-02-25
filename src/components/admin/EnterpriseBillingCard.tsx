'use client';

/**
 * EnterpriseBillingCard
 *
 * Component Hierarchy:
 * App -> Admin -> Users -> [id] -> EnterpriseBillingCard
 *
 * Admin widget for enterprise billing actions:
 * - Generate Stripe payment link for a customer
 * - Manually provision a subscription (for signed contracts)
 */

import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Select,
  Icon,
  Badge,
  useToast,
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { FiLink, FiCheck, FiCopy, FiDollarSign } from 'react-icons/fi';
import { useAction, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

const ENTERPRISE_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY || '';

const PLAN_TIERS = [
  { value: 'starter', label: 'Starter ($59/mo)' },
  { value: 'engine', label: 'Engine ($149/mo)' },
  { value: 'agency', label: 'Agency ($299/mo)' },
  { value: 'enterprise', label: 'Enterprise (Custom)' },
] as const;

interface Props {
  userId: Id<'users'>;
  userEmail: string;
  userName?: string;
  currentPlan?: string;
}

export function EnterpriseBillingCard({ userId, userEmail, userName, currentPlan }: Props) {
  const [selectedTier, setSelectedTier] = useState('enterprise');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const toast = useToast();

  const generateCheckoutUrl = useAction(api.admin.enterpriseCheckout.generateEnterpriseCheckoutUrl);
  const provisionSubscription = useMutation(api.admin.provisioning.provisionSubscription);

  const handleGenerateLink = async () => {
    if (!ENTERPRISE_PRICE_ID) {
      toast({
        title: 'Missing Price ID',
        description: 'NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY is not configured.',
        status: 'error',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateCheckoutUrl({
        targetUserId: userId,
        targetEmail: userEmail,
        targetName: userName,
        priceId: ENTERPRISE_PRICE_ID,
      });

      if (result.url) {
        setGeneratedUrl(result.url);
        toast({ title: 'Payment link generated', status: 'success', duration: 3000 });
      } else {
        toast({ title: 'Failed to generate link', status: 'error' });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to generate link',
        status: 'error',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    if (!generatedUrl) return;
    try {
      await navigator.clipboard.writeText(generatedUrl);
      toast({ title: 'Link copied to clipboard', status: 'success', duration: 2000 });
    } catch {
      toast({ title: 'Failed to copy', status: 'error' });
    }
  };

  const handleManualProvision = async () => {
    setIsProvisioning(true);
    try {
      await provisionSubscription({
        targetUserId: userId,
        planTier: selectedTier,
        status: 'active',
        billingCycle,
      });
      toast({
        title: 'Subscription Provisioned',
        description: `${selectedTier} plan activated for ${userName || userEmail}`,
        status: 'success',
      });
    } catch (err) {
      toast({
        title: 'Provisioning Failed',
        description: err instanceof Error ? err.message : 'Unknown error',
        status: 'error',
      });
    } finally {
      setIsProvisioning(false);
    }
  };

  return (
    <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="xl" p={5}>
      <VStack align="stretch" spacing={4}>
        {/* Header */}
        <HStack justify="space-between">
          <HStack spacing={2}>
            <Icon as={FiDollarSign} color="green.500" boxSize={5} />
            <Text fontWeight="bold" fontSize="lg">
              Enterprise Billing
            </Text>
          </HStack>
          {currentPlan && (
            <Badge colorScheme="purple" fontSize="xs">
              Current: {currentPlan}
            </Badge>
          )}
        </HStack>

        <Text fontSize="sm" color="gray.500">
          Generate a payment link or manually activate a subscription for this customer.
        </Text>

        {/* Section 1: Generate Payment Link */}
        <Box bg="gray.50" p={4} borderRadius="lg">
          <Text fontWeight="semibold" fontSize="sm" mb={3}>
            Generate Payment Link
          </Text>
          <VStack align="stretch" spacing={3}>
            <HStack>
              <Button
                leftIcon={<Icon as={FiLink} />}
                colorScheme="blue"
                size="sm"
                onClick={handleGenerateLink}
                isLoading={isGenerating}
                loadingText="Generating..."
                flex={1}
              >
                Generate Stripe Link
              </Button>
            </HStack>

            {generatedUrl && (
              <HStack>
                <Input
                  value={generatedUrl}
                  isReadOnly
                  size="sm"
                  fontSize="xs"
                  fontFamily="mono"
                  bg="white"
                />
                <Button
                  leftIcon={<Icon as={FiCopy} />}
                  size="sm"
                  variant="outline"
                  onClick={handleCopyLink}
                >
                  Copy
                </Button>
              </HStack>
            )}
          </VStack>
        </Box>

        {/* Section 2: Manual Provision */}
        <Box bg="orange.50" p={4} borderRadius="lg">
          <Text fontWeight="semibold" fontSize="sm" mb={3}>
            Manual Provision (No Payment)
          </Text>
          <VStack align="stretch" spacing={3}>
            <HStack spacing={3}>
              <FormControl flex={1}>
                <FormLabel fontSize="xs" mb={1}>
                  Plan Tier
                </FormLabel>
                <Select
                  size="sm"
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                >
                  {PLAN_TIERS.map((tier) => (
                    <option key={tier.value} value={tier.value}>
                      {tier.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl flex={1}>
                <FormLabel fontSize="xs" mb={1}>
                  Billing Cycle
                </FormLabel>
                <Select
                  size="sm"
                  value={billingCycle}
                  onChange={(e) => setBillingCycle(e.target.value as 'monthly' | 'annual')}
                >
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                </Select>
              </FormControl>
            </HStack>
            <Button
              leftIcon={<Icon as={FiCheck} />}
              colorScheme="orange"
              size="sm"
              onClick={handleManualProvision}
              isLoading={isProvisioning}
              loadingText="Provisioning..."
            >
              Activate Subscription
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}
