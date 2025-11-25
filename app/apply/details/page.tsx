"use client";

import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Container,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Text,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import {
  ProspectDetailsValues,
  UrlEntryValues,
  prospectDetailsSchema,
} from "@/lib/validation/prospectSchemas";
import {
  loadProspectRecord,
  saveProspectDetailsDraft,
  submitProspectDetails,
} from "@/lib/services/prospectIntake";

const supportOptions = [
  "Website Creation/Rebuild",
  "Social Media Strategy/Content",
  "SEO or Website Traffic",
  "Branding and Design",
  "Email Marketing",
  "Marketing Consultation",
  "Paid Advertising",
  "Other",
];

const defaultUrl: UrlEntryValues = {
  label: "Website",
  value: "",
};

const autosaveDelay = 900;

export default function ProspectDetailsPage() {
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();
  const [prospectId, setProspectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const latestValues = useRef<ProspectDetailsValues | null>(null);

  const form = useForm<ProspectDetailsValues>({
    resolver: zodResolver(prospectDetailsSchema),
    mode: "onBlur",
    defaultValues: {
      businessName: "",
      topPriority: "",
      marketingTried: "",
      goals: "",
      supportNeeds: [],
      idealOutcome: "",
      additionalNotes: "",
      hearAbout: "",
      sendSms: "",
      urls: [defaultUrl],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "urls",
  });

  const watchValues = useWatch({ control: form.control });

  const populateFromServer = async (id: string) => {
    try {
      const data = await loadProspectRecord(id);
      const detail = data?.detail;
      const urls = data?.urls || [];
      form.reset({
        businessName: detail?.businessName || data?.prospect?.companyName || "",
        topPriority: detail?.topPriority || "",
        marketingTried: detail?.marketingTried || "",
        goals: detail?.goals || "",
        supportNeeds: detail?.supportNeeds || [],
        idealOutcome: detail?.idealOutcome || "",
        additionalNotes: detail?.additionalNotes || "",
        hearAbout: detail?.hearAbout || "",
        sendSms: detail?.sendSms || "",
        urls:
          urls.length > 0
            ? urls.map((entry: any) => ({ label: entry.label, value: entry.url }))
            : [defaultUrl],
      });
    } catch (error) {
      console.warn("Prospect load failed", error);
    } finally {
      setInitializing(false);
    }
  };

  useEffect(() => {
    const queryId = params.get("prospectId");
    const stored = sessionStorage.getItem("prospectId");
    const id = queryId || stored;

    if (!id) {
      toast({
        title: "Complete step one first",
        description: "We need your basic info before the deep dive.",
        status: "warning",
      });
      router.push("/apply");
      return;
    }

    setProspectId(id);
    sessionStorage.setItem("prospectId", id);
    populateFromServer(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!prospectId || initializing) return;
    const serialized = JSON.stringify(watchValues);
    if (latestValues.current && JSON.stringify(latestValues.current) === serialized) {
      return;
    }
    latestValues.current = watchValues as ProspectDetailsValues;

    const timeout = setTimeout(async () => {
      try {
        await saveProspectDetailsDraft(prospectId, watchValues as ProspectDetailsValues);
      } catch (error) {
        console.warn("Autosave (details) failed", error);
      }
    }, autosaveDelay);

    return () => clearTimeout(timeout);
  }, [prospectId, watchValues, initializing]);

  const handleSubmit = async (values: ProspectDetailsValues) => {
    if (!prospectId) return;
    setLoading(true);
    try {
      await submitProspectDetails(prospectId, values);
      toast({
        title: "Discovery received",
        description: "Watch your inbox—we’re crafting a custom brief.",
        status: "success",
      });
      router.push("/thank-you");
    } catch (error: any) {
      toast({
        title: "Unable to submit",
        description: error?.message || "Please try again.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const addUrlRow = () => {
    if (fields.length >= 10) {
      toast({
        title: "Link limit reached",
        description: "You can add up to 10 links per application.",
        status: "info",
      });
      return;
    }
    append({ label: "", value: "" });
  };

  if (initializing) {
    return (
      <Flex minH="80vh" align="center" justify="center">
        <Text color="gray.500">Loading your saved answers...</Text>
      </Flex>
    );
  }

  return (
    <Container maxW="4xl" py={12}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="xl" color="gray.800">
            Deep dive discovery
          </Heading>
          <Text color="gray.600" mt={2}>
            Give MartAI the context it needs to spin up keyword research, offers, and messaging.
          </Text>
        </Box>

        <Box bg="white" p={8} borderRadius="lg" shadow="md">
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <VStack spacing={8} align="stretch">
              <FormControl isInvalid={!!form.formState.errors.businessName}>
                <FormLabel>Business or brand name *</FormLabel>
                <Input placeholder="The Makeshift Chef" {...form.register("businessName")} />
                <FormErrorMessage>
                  {form.formState.errors.businessName?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!form.formState.errors.topPriority}>
                <FormLabel>What is your top priority or challenge right now?</FormLabel>
                <Textarea rows={4} {...form.register("topPriority")} />
                <FormErrorMessage>
                  {form.formState.errors.topPriority?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!form.formState.errors.marketingTried}>
                <FormLabel>What marketing efforts have you already tried?</FormLabel>
                <Textarea rows={4} {...form.register("marketingTried")} />
                <FormErrorMessage>
                  {form.formState.errors.marketingTried?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!form.formState.errors.goals}>
                <FormLabel>What goal do you hope to reach in the next 3–6 months?</FormLabel>
                <Textarea rows={3} {...form.register("goals")} />
                <FormErrorMessage>
                  {form.formState.errors.goals?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!form.formState.errors.supportNeeds}>
                <FormLabel>What marketing support are you looking for?</FormLabel>
                <CheckboxGroup
                  value={form.watch("supportNeeds")}
                  onChange={(values) =>
                    form.setValue("supportNeeds", values as string[], { shouldDirty: true })
                  }
                >
                  <VStack align="flex-start">
                    {supportOptions.map((option) => (
                      <Checkbox key={option} value={option}>
                        {option}
                      </Checkbox>
                    ))}
                  </VStack>
                </CheckboxGroup>
                <FormErrorMessage>
                  {form.formState.errors.supportNeeds?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!form.formState.errors.idealOutcome}>
                <FormLabel>What’s your ideal outcome from this consultation?</FormLabel>
                <Textarea rows={3} {...form.register("idealOutcome")} />
                <FormErrorMessage>
                  {form.formState.errors.idealOutcome?.message}
                </FormErrorMessage>
              </FormControl>

              <Box>
                <FormLabel>Links we should review *</FormLabel>
                <VStack spacing={4} align="stretch">
                  {fields.map((field, index) => (
                    <HStack key={field.id} align="flex-start">
                      <FormControl isInvalid={!!form.formState.errors.urls?.[index]?.label}>
                        <Input
                          placeholder="Website, Instagram, Pitch Deck"
                          {...form.register(`urls.${index}.label` as const)}
                        />
                        <FormErrorMessage>
                          {form.formState.errors.urls?.[index]?.label?.message}
                        </FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={!!form.formState.errors.urls?.[index]?.value}>
                        <Input
                          placeholder="https://example.com"
                          {...form.register(`urls.${index}.value` as const)}
                        />
                        <FormErrorMessage>
                          {form.formState.errors.urls?.[index]?.value?.message}
                        </FormErrorMessage>
                      </FormControl>
                      {fields.length > 1 && (
                        <IconButton
                          aria-label="Remove URL"
                          icon={<CloseIcon />}
                          variant="ghost"
                          mt={2}
                          onClick={() => remove(index)}
                        />
                      )}
                    </HStack>
                  ))}
                  <Button
                    variant="outline"
                    leftIcon={<AddIcon />}
                    onClick={addUrlRow}
                    alignSelf="flex-start"
                  >
                    Add another link
                  </Button>
                </VStack>
              </Box>

              <Divider />

              <FormControl isInvalid={!!form.formState.errors.hearAbout}>
                <FormLabel>How did you hear about MartAI? *</FormLabel>
                <Input placeholder="Podcast, friend, Instagram, etc." {...form.register("hearAbout")} />
                <FormErrorMessage>
                  {form.formState.errors.hearAbout?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!form.formState.errors.sendSms}>
                <FormLabel>Send text updates to</FormLabel>
                <Input placeholder="(555) 987-6543" {...form.register("sendSms")} />
                <FormErrorMessage>
                  {form.formState.errors.sendSms?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Anything else we should know?</FormLabel>
                <Textarea rows={3} {...form.register("additionalNotes")} />
              </FormControl>

              <VStack align="flex-start" spacing={3}>
                <Button
                  type="submit"
                  colorScheme="orange"
                  size="lg"
                  isLoading={loading}
                >
                  Submit discovery form
                </Button>
                <Text fontSize="sm" color="gray.500">
                  We’ll review everything, run it through MartAI’s intelligence layer, and follow up
                  with a tailored plan.
                </Text>
              </VStack>
            </VStack>
          </form>
        </Box>
      </VStack>
    </Container>
  );
}

