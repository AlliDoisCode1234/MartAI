"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Select,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  prospectIntakeSchema,
  ProspectIntakeValues,
} from "@/lib/validation/prospectSchemas";
import {
  createProspectDraft,
  loadProspectRecord,
  saveProspectDraft,
} from "@/lib/services/prospectIntake";

const monthlyRevenueOptions = [
  "Less than $10k",
  "$10k - $25k",
  "$25k - $50k",
  "$50k - $100k",
  "$100k+",
];

const timelineOptions = [
  "ASAP",
  "Within 30 days",
  "Within 60 days",
  "Within 90 days",
  "Just exploring",
];

const autosaveDelay = 800;

export default function ApplyPage() {
  const router = useRouter();
  const toast = useToast();
  const [prospectId, setProspectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const latestValuesRef = useRef<ProspectIntakeValues | null>(null);

  const form = useForm<ProspectIntakeValues>({
    resolver: zodResolver(prospectIntakeSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      companyName: "",
      monthlyRevenue: "",
      marketingFrustration: "",
      investedBefore: undefined as unknown as "yes" | "no",
      timeline: "",
      source: "",
    },
  });

  const watchedValues = useWatch({ control: form.control });

  const fetchExistingProspect = async (id: string) => {
    try {
      const data = await loadProspectRecord(id);
      if (data?.prospect) {
        form.reset({
          firstName: data.prospect.firstName || "",
          lastName: data.prospect.lastName || "",
          email: data.prospect.email || "",
          phone: data.prospect.phone || "",
          companyName: data.prospect.companyName || "",
          monthlyRevenue: data.prospect.monthlyRevenue || "",
          marketingFrustration: data.prospect.marketingFrustration || "",
          investedBefore: (data.prospect.investedBefore as "yes" | "no") || "yes",
          timeline: data.prospect.timeline || "",
          source: data.prospect.source || "",
        });
      }
    } catch (error) {
      console.warn("Could not load existing prospect draft", error);
    }
  };

  const createDraftProspect = async () => {
    try {
      const data = await createProspectDraft({ status: "draft" });
      sessionStorage.setItem("prospectId", data.prospectId);
      setProspectId(data.prospectId);
    } catch (error) {
      console.error(error);
      toast({
        title: "Unable to start application",
        description: "Please refresh and try again.",
        status: "error",
      });
    } finally {
      setInitializing(false);
    }
  };

  useEffect(() => {
    const existingId =
      sessionStorage.getItem("prospectId") ||
      new URLSearchParams(window.location.search).get("prospectId");

    if (existingId) {
      setProspectId(existingId);
      fetchExistingProspect(existingId).finally(() => setInitializing(false));
    } else {
      createDraftProspect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!prospectId || initializing) return;
    if (!watchedValues) return;

    const serialized = JSON.stringify(watchedValues);
    if (latestValuesRef.current && JSON.stringify(latestValuesRef.current) === serialized) {
      return;
    }
    latestValuesRef.current = watchedValues;

    const timeout = setTimeout(async () => {
      try {
        await saveProspectDraft(prospectId, watchedValues || {});
      } catch (error) {
        console.warn("Autosave failed", error);
      }
    }, autosaveDelay);

    return () => clearTimeout(timeout);
  }, [prospectId, watchedValues, initializing]);

  const onSubmit = async (values: ProspectIntakeValues) => {
    if (!prospectId) return;
    setLoading(true);
    try {
      await saveProspectDraft(prospectId, values, { markSubmitted: true });
      toast({
        title: "Great!",
        description: "Tell us more about your business.",
        status: "success",
      });
      router.push(`/apply/details?prospectId=${prospectId}`);
    } catch (error: any) {
      toast({
        title: "Submission error",
        description: error?.message || "Please try again.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const revenueOptions = useMemo(
    () =>
      monthlyRevenueOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      )),
    []
  );

  const timelineChoices = useMemo(
    () =>
      timelineOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      )),
    []
  );

  if (initializing) {
    return (
      <Flex minH="80vh" align="center" justify="center">
        <Text color="gray.500">Preparing your application...</Text>
      </Flex>
    );
  }

  return (
    <Container maxW="container.md" py={12}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="xl" color="gray.800">
            Tell us about your business
          </Heading>
          <Text color="gray.600" mt={2}>
            Share the essentials below. You can save and return any time.
          </Text>
        </Box>

        <Box bg="white" p={8} borderRadius="lg" shadow="md">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <VStack spacing={6} align="stretch">
              <HStack spacing={4}>
                <FormControl isInvalid={!!form.formState.errors.firstName}>
                  <FormLabel>First name *</FormLabel>
                  <Input placeholder="Gabby" {...form.register("firstName")} />
                  <FormErrorMessage>
                    {form.formState.errors.firstName?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!form.formState.errors.lastName}>
                  <FormLabel>Last name *</FormLabel>
                  <Input placeholder="Martinez" {...form.register("lastName")} />
                  <FormErrorMessage>
                    {form.formState.errors.lastName?.message}
                  </FormErrorMessage>
                </FormControl>
              </HStack>

              <HStack spacing={4}>
                <FormControl isInvalid={!!form.formState.errors.email}>
                  <FormLabel>Username (email) *</FormLabel>
                  <Input placeholder="you@company.com" {...form.register("email")} />
                  <FormErrorMessage>
                    {form.formState.errors.email?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!form.formState.errors.phone}>
                  <FormLabel>Phone number</FormLabel>
                  <Input placeholder="(555) 123-4567" {...form.register("phone")} />
                  <FormErrorMessage>
                    {form.formState.errors.phone?.message}
                  </FormErrorMessage>
                </FormControl>
              </HStack>

              <FormControl isInvalid={!!form.formState.errors.companyName}>
                <FormLabel>Company name *</FormLabel>
                <Input placeholder="The Makeshift Chef" {...form.register("companyName")} />
                <FormErrorMessage>
                  {form.formState.errors.companyName?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!form.formState.errors.monthlyRevenue}>
                <FormLabel>Current monthly revenue *</FormLabel>
                <Select placeholder="Select range" {...form.register("monthlyRevenue")}>
                  {revenueOptions}
                </Select>
                <FormErrorMessage>
                  {form.formState.errors.monthlyRevenue?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!form.formState.errors.marketingFrustration}>
                <FormLabel>What’s your biggest marketing frustration right now? *</FormLabel>
                <Textarea
                  rows={4}
                  placeholder="Tell us about the challenge you're facing."
                  {...form.register("marketingFrustration")}
                />
                <FormErrorMessage>
                  {form.formState.errors.marketingFrustration?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!form.formState.errors.investedBefore}>
                <FormLabel>Have you invested in marketing before? *</FormLabel>
                <RadioGroup
                  onChange={(value) =>
                    form.setValue("investedBefore", value as "yes" | "no", {
                      shouldDirty: true,
                    })
                  }
                  value={form.watch("investedBefore")}
                >
                  <HStack spacing={6}>
                    <Radio value="yes">Yes</Radio>
                    <Radio value="no">No</Radio>
                  </HStack>
                </RadioGroup>
                <FormErrorMessage>
                  {form.formState.errors.investedBefore?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!form.formState.errors.timeline}>
                <FormLabel>Timeline to start if it’s a fit? *</FormLabel>
                <Select placeholder="Select timeline" {...form.register("timeline")}>
                  {timelineChoices}
                </Select>
                <FormErrorMessage>
                  {form.formState.errors.timeline?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>How did you hear about MartAI?</FormLabel>
                <Input placeholder="Referral, podcast, social, etc." {...form.register("source")} />
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
        </Box>
      </VStack>
    </Container>
  );
}

