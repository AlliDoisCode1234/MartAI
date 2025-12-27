'use client';

/**
 * Apply Page
 *
 * Component Hierarchy:
 * App → Apply (this file)
 *
 * First step of prospect intake form.
 * Uses extracted UI components and centralized constants.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Container,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  Textarea,
  Radio,
  RadioGroup,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { prospectIntakeSchema, ProspectIntakeValues } from '@/lib/validation/prospectSchemas';
import { assertProspectId } from '@/lib/typeGuards';
import { MONTHLY_REVENUE_OPTIONS, TIMELINE_OPTIONS, AUTOSAVE_DELAY } from '@/lib/constants/apply';

// Extracted components
import { ApplyHeader, ApplyFormCard, ApplySkeleton } from '@/src/components/apply';

export default function ApplyPage() {
  const router = useRouter();
  const toast = useToast();
  const [prospectId, setProspectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [waitingForPrefill, setWaitingForPrefill] = useState(false);
  const latestSerializedRef = useRef<string | null>(null);

  const form = useForm<ProspectIntakeValues>({
    resolver: zodResolver(prospectIntakeSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      companyName: '',
      monthlyRevenue: '',
      marketingFrustration: '',
      investedBefore: undefined as unknown as 'yes' | 'no',
      timeline: '',
      source: '',
    },
  });

  const watchedValues = useWatch({ control: form.control }) as ProspectIntakeValues;
  const createProspect = useMutation(api.prospects.prospects.createProspect);
  const updateProspect = useMutation(api.prospects.prospects.updateProspect);
  const prospectRecord = useQuery(
    api.prospects.prospects.getProspect,
    prospectId ? { prospectId: prospectId as Id<'prospects'> } : 'skip'
  );

  const createDraftProspect = useCallback(async () => {
    try {
      const newId = await createProspect({ status: 'draft' });
      const idString = newId as unknown as string;
      sessionStorage.setItem('prospectId', idString);
      setProspectId(idString);
      setWaitingForPrefill(false);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Unable to start application',
        description: 'Please refresh and try again.',
        status: 'error',
      });
    } finally {
      setInitializing(false);
    }
  }, [createProspect, toast]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const existingId = sessionStorage.getItem('prospectId') || params.get('prospectId');
    if (existingId) {
      try {
        const typed = assertProspectId(existingId);
        const idString = typed as unknown as string;
        setProspectId(idString);
        sessionStorage.setItem('prospectId', idString);
        setWaitingForPrefill(true);
        return;
      } catch {
        sessionStorage.removeItem('prospectId');
      }
    }
    createDraftProspect();
  }, [createDraftProspect]);

  useEffect(() => {
    if (!waitingForPrefill || prospectRecord === undefined) return;
    if (!prospectRecord?.prospect) {
      setWaitingForPrefill(false);
      setInitializing(false);
      return;
    }
    form.reset({
      firstName: prospectRecord.prospect.firstName || '',
      lastName: prospectRecord.prospect.lastName || '',
      email: prospectRecord.prospect.email || '',
      phone: prospectRecord.prospect.phone || '',
      companyName: prospectRecord.prospect.companyName || '',
      monthlyRevenue: prospectRecord.prospect.monthlyRevenue || '',
      marketingFrustration: prospectRecord.prospect.marketingFrustration || '',
      investedBefore: (prospectRecord.prospect.investedBefore as 'yes' | 'no') || 'yes',
      timeline: prospectRecord.prospect.timeline || '',
      source: prospectRecord.prospect.source || '',
    });
    setWaitingForPrefill(false);
    setInitializing(false);
  }, [waitingForPrefill, prospectRecord, form]);

  const persistProspect = useCallback(
    async (values: Partial<ProspectIntakeValues>, options?: { markSubmitted?: boolean }) => {
      if (!prospectId) return;
      await updateProspect({
        prospectId: prospectId as Id<'prospects'>,
        ...values,
        ...(options?.markSubmitted ? { status: 'initial_submitted' } : {}),
      });
    },
    [prospectId, updateProspect]
  );

  useEffect(() => {
    if (!prospectId || initializing || !watchedValues) return;
    const serialized = JSON.stringify(watchedValues);
    if (latestSerializedRef.current === serialized) return;
    latestSerializedRef.current = serialized;
    const timeout = setTimeout(async () => {
      try {
        await persistProspect(watchedValues || {});
      } catch (error) {
        console.warn('Autosave failed', error);
      }
    }, AUTOSAVE_DELAY);
    return () => clearTimeout(timeout);
  }, [prospectId, watchedValues, initializing, persistProspect]);

  const onSubmit = async (values: ProspectIntakeValues) => {
    if (!prospectId) return;
    setLoading(true);
    try {
      await persistProspect(values, { markSubmitted: true });
      toast({
        title: 'Great!',
        description: 'Tell us more about your business.',
        status: 'success',
      });
      router.push(`/apply/details?prospectId=${prospectId}`);
    } catch (error: any) {
      toast({
        title: 'Submission error',
        description: error?.message || 'Please try again.',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const revenueOptions = useMemo(
    () =>
      MONTHLY_REVENUE_OPTIONS.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      )),
    []
  );
  const timelineOptions = useMemo(
    () =>
      TIMELINE_OPTIONS.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      )),
    []
  );

  if (initializing) return <ApplySkeleton />;

  return (
    <Container maxW="container.md" py={12}>
      <VStack spacing={8} align="stretch">
        <ApplyHeader
          title="Tell us about your business"
          subtitle="Share the essentials below. You can save and return any time."
        />
        <ApplyFormCard>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <VStack spacing={6} align="stretch">
              <HStack spacing={4}>
                <FormControl isInvalid={!!form.formState.errors.firstName}>
                  <FormLabel>First name *</FormLabel>
                  <Input placeholder="Gabby" {...form.register('firstName')} />
                  <FormErrorMessage>{form.formState.errors.firstName?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!form.formState.errors.lastName}>
                  <FormLabel>Last name *</FormLabel>
                  <Input placeholder="Martinez" {...form.register('lastName')} />
                  <FormErrorMessage>{form.formState.errors.lastName?.message}</FormErrorMessage>
                </FormControl>
              </HStack>
              <HStack spacing={4}>
                <FormControl isInvalid={!!form.formState.errors.email}>
                  <FormLabel>Username (email) *</FormLabel>
                  <Input placeholder="you@company.com" {...form.register('email')} />
                  <FormErrorMessage>{form.formState.errors.email?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!form.formState.errors.phone}>
                  <FormLabel>Phone number</FormLabel>
                  <Input placeholder="(555) 123-4567" {...form.register('phone')} />
                  <FormErrorMessage>{form.formState.errors.phone?.message}</FormErrorMessage>
                </FormControl>
              </HStack>
              <FormControl isInvalid={!!form.formState.errors.companyName}>
                <FormLabel>Company name *</FormLabel>
                <Input placeholder="The Makeshift Chef" {...form.register('companyName')} />
                <FormErrorMessage>{form.formState.errors.companyName?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!form.formState.errors.monthlyRevenue}>
                <FormLabel>Current monthly revenue *</FormLabel>
                <Select placeholder="Select range" {...form.register('monthlyRevenue')}>
                  {revenueOptions}
                </Select>
                <FormErrorMessage>{form.formState.errors.monthlyRevenue?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!form.formState.errors.marketingFrustration}>
                <FormLabel>What's your biggest marketing frustration right now? *</FormLabel>
                <Textarea
                  rows={4}
                  placeholder="Tell us about the challenge you're facing."
                  {...form.register('marketingFrustration')}
                />
                <FormErrorMessage>
                  {form.formState.errors.marketingFrustration?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!form.formState.errors.investedBefore}>
                <FormLabel>Have you invested in marketing before? *</FormLabel>
                <RadioGroup
                  onChange={(v) =>
                    form.setValue('investedBefore', v as 'yes' | 'no', { shouldDirty: true })
                  }
                  value={form.watch('investedBefore')}
                >
                  <HStack spacing={6}>
                    <Radio value="yes">Yes</Radio>
                    <Radio value="no">No</Radio>
                  </HStack>
                </RadioGroup>
                <FormErrorMessage>{form.formState.errors.investedBefore?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!form.formState.errors.timeline}>
                <FormLabel>Timeline to start if it's a fit? *</FormLabel>
                <Select placeholder="Select timeline" {...form.register('timeline')}>
                  {timelineOptions}
                </Select>
                <FormErrorMessage>{form.formState.errors.timeline?.message}</FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel>How did you hear about Phoo?</FormLabel>
                <Input placeholder="Referral, podcast, social, etc." {...form.register('source')} />
              </FormControl>
              <Button
                type="submit"
                colorScheme="orange"
                size="lg"
                alignSelf="flex-start"
                isLoading={loading}
              >
                Next: Tell us more
              </Button>
            </VStack>
          </form>
        </ApplyFormCard>
      </VStack>
    </Container>
  );
}
