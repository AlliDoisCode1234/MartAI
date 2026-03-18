'use client';

/**
 * Create Content Page
 *
 * Component Hierarchy:
 * App -> StudioLayout -> CreateContentPage
 *
 * One-click content creation with 17 content types from Content Intelligence.
 * Includes adaptive "Let Phoo Build It" — AI continues from wherever the user stops.
 */

import {
  Box,
  Heading,
  Text,
  HStack,
  VStack,
  Button,
  Icon,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
  Progress,
  useDisclosure,
  Divider,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Tooltip,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { useQuery, useAction, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { StudioLayout } from '@/src/components/studio';
import { ContentTypeSelector } from '@/src/components/studio/ContentTypeSelector';
import { KeywordLibraryPicker } from '@/src/components/studio/KeywordLibraryPicker';
import { FiTarget, FiArrowLeft, FiZap, FiBookOpen, FiClock, FiFileText, FiSearch, FiMessageSquare, FiAlignLeft, FiRefreshCw, FiPlus } from 'react-icons/fi';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BLOG_ONLY_MODE } from '@/lib/constants/featureFlags';

// All 17 content types from Content Intelligence
type ContentType =
  | 'homepage'
  | 'about'
  | 'service'
  | 'landing'
  | 'blog'
  | 'blogVersus'
  | 'blogVideo'
  | 'contentRefresh'
  | 'leadMagnet'
  | 'paidProduct'
  | 'areasWeServe'
  | 'employment'
  | 'mentorship'
  | 'donate'
  | 'events'
  | 'partner'
  | 'program';

// Auto-generate progress stages
const AUTO_GEN_STAGES = [
  { label: 'Analyzing your niche...', threshold: 12 },
  { label: 'Picking the best keyword...', threshold: 28 },
  { label: 'Crafting your title...', threshold: 45 },
  { label: 'Writing your article...', threshold: 70 },
  { label: 'Optimizing for SEO...', threshold: 88 },
  { label: 'Finalizing...', threshold: 100 },
] as const;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(249, 159, 42, 0.3); }
  50% { box-shadow: 0 0 40px rgba(249, 159, 42, 0.6); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

export default function CreateContentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const preselectedType = searchParams.get('type') as ContentType | null;
  const fromStrategy = searchParams.get('fromStrategy') === 'true';
  const scheduledDateParam = searchParams.get('scheduledDate');
  const parsedDate = scheduledDateParam ? new Date(Number(scheduledDateParam)) : null;
  const scheduledDate = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : null;

  const initialKeyword = searchParams.get('keyword') || '';
  const initialTitle = searchParams.get('title') || '';

  const [step, setStep] = useState<'type' | 'details' | 'generating' | 'auto-generating'>(
    BLOG_ONLY_MODE || preselectedType ? 'details' : 'type'
  );
  const [selectedType, setSelectedType] = useState<ContentType | null>(
    BLOG_ONLY_MODE ? 'blog' : preselectedType
  );
  const [title, setTitle] = useState(initialTitle);
  const [keywords, setKeywords] = useState(initialKeyword);
  const [progress, setProgress] = useState(0);
  const [autoProgress, setAutoProgress] = useState(0);
  const [showComeBack, setShowComeBack] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Refs for auto-gen animation
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const comeBackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keyword library picker modal
  const { isOpen: isPickerOpen, onOpen: onPickerOpen, onClose: onPickerClose } = useDisclosure();

  // Get active project
  const projects = useQuery(api.projects.projects.list);
  const activeProject = projects?.[0];

  // Content generation actions
  const generateContent = useAction(api.contentGeneration.generateContent);
  const autoGenerateContent = useAction(api.contentGeneration.autoGenerateContent);
  const generateTitleAction = useAction(api.contentGeneration.generateContentTitle);
  const suggestKeywordsAction = useAction(api.contentGeneration.suggestKeywords);
  const scheduleMutation = useMutation(api.contentPieces.schedule);

  // Field-level AI assist states
  const [isSuggestingTitle, setIsSuggestingTitle] = useState(false);
  const [isSuggestingKeywords, setIsSuggestingKeywords] = useState(false);

  // WordPress connection for capability badges
  const wpConnection = useQuery(
    api.integrations.platformConnections.getConnection,
    activeProject ? { projectId: activeProject._id, platform: 'wordpress' as const } : 'skip'
  );

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (comeBackTimerRef.current) clearTimeout(comeBackTimerRef.current);
    };
  }, []);

  // Current auto-gen stage label
  const currentStageLabel =
    AUTO_GEN_STAGES.find((s) => autoProgress < s.threshold)?.label ?? 'Finalizing...';

  // Handle keyword selection from library
  const handleKeywordsFromLibrary = (selectedKeywords: string[]) => {
    setKeywords(selectedKeywords.join(', '));
  };

  // Parse keywords string into array for chip display
  const keywordChips = keywords
    .split(',')
    .map((k) => k.trim())
    .filter((k) => k.length > 0);

  // Add keyword chips — handles comma-separated bulk input
  const addKeywordChip = useCallback((value: string) => {
    const newKeywords = value.split(',').map((k) => k.trim()).filter((k) => k.length > 0);
    if (newKeywords.length === 0) return;
    setKeywords((prev) => {
      const existing = prev.split(',').map((k) => k.trim()).filter((k) => k.length > 0);
      const merged = [...existing];
      for (const kw of newKeywords) {
        if (!merged.includes(kw)) merged.push(kw);
      }
      return merged.join(', ');
    });
    setKeywordInput('');
  }, []);

  // Remove a keyword chip
  const removeKeywordChip = useCallback((keyword: string) => {
    setKeywords((prev) =>
      prev.split(',').map((k) => k.trim()).filter((k) => k.length > 0 && k !== keyword).join(', ')
    );
  }, []);

  // Handle keyboard events in chip input
  const handleKeywordInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addKeywordChip(keywordInput);
    }
    // Backspace on empty input removes last chip
    if (e.key === 'Backspace' && keywordInput === '' && keywordChips.length > 0) {
      removeKeywordChip(keywordChips[keywordChips.length - 1]);
    }
  }, [addKeywordChip, keywordInput, keywordChips, removeKeywordChip]);

  // Field-level AI: Suggest a title
  const handleSuggestTitle = useCallback(async () => {
    if (!activeProject || isSuggestingTitle) return;
    setIsSuggestingTitle(true);
    try {
      const keyword = keywords.split(',')[0]?.trim() || '';
      const titles = await generateTitleAction({
        projectId: activeProject._id,
        keyword: keyword || activeProject.industry || 'digital marketing',
        contentType: 'blog',
      });
      if (titles.length > 0) {
        setTitle(titles[0]);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      toast({ title: 'Could not suggest title', description: msg, status: 'warning', duration: 3000, isClosable: true });
    } finally {
      setIsSuggestingTitle(false);
    }
  }, [activeProject, generateTitleAction, isSuggestingTitle, keywords, toast]);

  // Field-level AI: Suggest keywords
  const handleSuggestKeywords = useCallback(async () => {
    if (!activeProject || isSuggestingKeywords) return;
    setIsSuggestingKeywords(true);
    try {
      const suggested = await suggestKeywordsAction({
        projectId: activeProject._id,
        topic: title.trim() || undefined,
      });
      if (suggested) {
        setKeywords(suggested);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      toast({ title: 'Could not suggest keywords', description: msg, status: 'warning', duration: 3000, isClosable: true });
    } finally {
      setIsSuggestingKeywords(false);
    }
  }, [activeProject, suggestKeywordsAction, isSuggestingKeywords, title, toast]);

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId as ContentType);
    setStep('details');
  };

  // ── Manual Generate (existing flow) ──────────────────────────────
  const handleGenerate = async () => {
    if (!selectedType || !title) {
      toast({
        title: 'Missing information',
        description: 'Please provide a title for your content',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    if (!activeProject) {
      toast({
        title: 'No project found',
        description: 'Please create a project first',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    // Guard: prevent duplicate generation
    if (isGenerating) return;
    setIsGenerating(true);

    setStep('generating');
    setProgress(10);

    try {
      const keywordList = keywords
        .split(',')
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 10, 90));
      }, 500);

      const contentPieceId = await generateContent({
        projectId: activeProject._id,
        contentType: selectedType,
        title,
        keywords: keywordList.length > 0 ? keywordList : [title.split(' ')[0]],
      });

      clearInterval(progressInterval);
      setProgress(100);

      toast({
        title: 'Content generated!',
        description: scheduledDate
          ? `Scheduled for ${scheduledDate.toLocaleDateString()}`
          : 'Your content is ready',
        status: 'success',
        duration: 3000,
      });

      // Auto-schedule if created from calendar
      if (scheduledDate && scheduledDate.getTime() > Date.now()) {
        try {
          await scheduleMutation({
            contentPieceId,
            publishDate: scheduledDate.getTime(),
          });
        } catch (err) {
          console.error('Failed to auto-schedule content:', err);
          // Non-critical: content created but scheduling may fail if date is past
        }
      }

      router.push(`/studio/${contentPieceId}`);
    } catch (e) {
      setStep('details');
      toast({
        title: 'Generation failed',
        description: e instanceof Error ? e.message : 'Unknown error',
        status: 'error',
        duration: 5000,
      });
    }
  };

  // ── Auto-Generate (Let Phoo Build It) ────────────────────────────
  const handleAutoGenerate = useCallback(async () => {
    if (!activeProject) {
      toast({
        title: 'No project found',
        description: 'Please create a project first',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    // Guard: prevent duplicate generation
    if (isGenerating) return;
    setIsGenerating(true);

    setStep('auto-generating');
    setAutoProgress(0);
    setShowComeBack(false);

    // Animate progress (simulated — real progress comes from completion)
    progressIntervalRef.current = setInterval(() => {
      setAutoProgress((p) => {
        if (p >= 88) return 88; // Cap at 88 until real completion
        return p + Math.random() * 3 + 0.5;
      });
    }, 400);

    // Show "come back later" after 5 seconds
    comeBackTimerRef.current = setTimeout(() => {
      setShowComeBack(true);
    }, 5000);

    try {
      // Pass whatever the user has already filled in — AI fills the rest
      const keywordList =
        keywords.length > 0
          ? keywords
              .split(',')
              .map((k) => k.trim())
              .filter(Boolean)
          : undefined;

      const result = await autoGenerateContent({
        projectId: activeProject._id,
        contentType: selectedType ?? undefined,
        title: title.trim() || undefined,
        keywords: keywordList,
      });

      // Clear intervals
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (comeBackTimerRef.current) clearTimeout(comeBackTimerRef.current);

      setAutoProgress(100);

      toast({
        title: 'Content created!',
        description: `"${result.title}" is ready for review`,
        status: 'success',
        duration: 5000,
      });

      // Brief pause to show completion, then navigate
      setTimeout(() => {
        router.push(`/studio/${result.contentPieceId}`);
      }, 800);
    } catch (e) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (comeBackTimerRef.current) clearTimeout(comeBackTimerRef.current);

      setStep(BLOG_ONLY_MODE || selectedType ? 'details' : 'type');
      setAutoProgress(0);

      toast({
        title: 'Auto-generation failed',
        description: e instanceof Error ? e.message : 'Please try again',
        status: 'error',
        duration: 5000,
      });
      setIsGenerating(false);
    }
  }, [activeProject, autoGenerateContent, keywords, router, selectedType, title, toast, isGenerating]);

  return (
    <StudioLayout>
      <VStack align="stretch" spacing={8} flex={1} minH="calc(100vh - 48px)">
        {/* Header */}
        <HStack justify="space-between">
          <HStack spacing={4}>
            <Link href="/studio">
              <Button
                variant="ghost"
                size="sm"
                color="gray.400"
                leftIcon={<Icon as={FiArrowLeft} />}
                _hover={{ color: 'gray.700' }}
              >
                Back
              </Button>
            </Link>
            <Box>
              <Heading size="lg" color="gray.800">
                Create Content
              </Heading>
              <Text color="gray.500" mt={1}>
                {step === 'type'
                  ? 'Choose content type'
                  : step === 'details'
                    ? BLOG_ONLY_MODE ? 'Create a new blog post' : 'Enter details'
                    : step === 'auto-generating'
                      ? 'Phoo is building your content...'
                      : 'Generating...'}
              </Text>
            </Box>
          </HStack>
          {fromStrategy && (
            <HStack
              bg="rgba(255, 157, 0, 0.1)"
              border="1px solid rgba(255, 157, 0, 0.3)"
              borderRadius="8px"
              px={3}
              py={2}
            >
              <Icon as={FiTarget} color="#FF9D00" />
              <Text color="#FF9D00" fontSize="sm">
                Recommended from Strategy
              </Text>
            </HStack>
          )}
        </HStack>

        {/* Step 1: Type Selection (hidden in BLOG_ONLY_MODE) */}
        {step === 'type' && !BLOG_ONLY_MODE && (
          <VStack spacing={6} align="stretch">
            {/* Let Phoo Build It — Hero Card */}
            <Box
              bg="linear-gradient(135deg, rgba(249, 159, 42, 0.08) 0%, rgba(229, 62, 62, 0.05) 100%)"
              border="1px solid rgba(249, 159, 42, 0.25)"
              borderRadius="16px"
              p={8}
              position="relative"
              overflow="hidden"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                bg: 'linear-gradient(90deg, transparent, #F99F2A, transparent)',
                backgroundSize: '200% 100%',
                animation: `${shimmer} 3s linear infinite`,
              }}
            >
              <VStack spacing={4} align="center">
                <Box
                  bg="rgba(249, 159, 42, 0.15)"
                  borderRadius="full"
                  p={4}
                  animation={`${pulseGlow} 2s ease-in-out infinite`}
                >
                  <Icon as={FiZap} boxSize={8} color="#F99F2A" />
                </Box>
                <VStack spacing={1}>
                  <Text color="gray.800" fontSize="lg" fontWeight="bold">
                    Don&apos;t know where to start?
                  </Text>
                  <Text color="gray.400" fontSize="sm" textAlign="center" maxW="400px">
                    Let Phoo analyze your niche, pick the best keyword, and write high-impact SEO
                    content automatically.
                  </Text>
                </VStack>
                <Button
                  size="lg"
                  bg="linear-gradient(135deg, #F99F2A 0%, #e53e3e 100%)"
                  color="white"
                  leftIcon={<Icon as={FiZap} />}
                  onClick={handleAutoGenerate}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(249, 159, 42, 0.4)',
                  }}
                  _active={{ transform: 'translateY(0)' }}
                  transition="all 0.2s"
                  px={10}
                  h="52px"
                  fontSize="md"
                  fontWeight="bold"
                >
                  Let Phoo Build It
                </Button>
              </VStack>
            </Box>

            <HStack spacing={4} align="center">
              <Divider borderColor="gray.200" />
              <Text color="gray.500" fontSize="xs" whiteSpace="nowrap" textTransform="uppercase">
                or choose a content type
              </Text>
              <Divider borderColor="gray.200" />
            </HStack>

            {/* Type Selector Grid */}
            <ContentTypeSelector
              selectedType={selectedType}
              onSelect={handleTypeSelect}
              wordpressConnected={!!wpConnection?.isValid}
              wordpressCapabilities={wpConnection?.capabilities}
            />
          </VStack>
        )}

        {/* Step 2: Content Details — BLOG ONLY MODE: Unified single-form */}
        {step === 'details' && selectedType && BLOG_ONLY_MODE && (
          <Box
            bg="white"
            border="1px solid"
            borderColor="gray.100"
            borderRadius="20px"
            overflow="hidden"
            boxShadow="0 4px 24px rgba(0, 0, 0, 0.06)"
            position="relative"
            flex={1}
            display="flex"
            flexDirection="column"
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              bg: 'linear-gradient(90deg, #F99F2A, #e53e3e, #F99F2A)',
              backgroundSize: '200% 100%',
              animation: `${shimmer} 4s linear infinite`,
            }}
          >
            {/* ── Value Badges Header ── */}
            <Box
              bg="linear-gradient(135deg, rgba(249, 159, 42, 0.04) 0%, rgba(229, 62, 62, 0.02) 100%)"
              px={8}
              py={5}
              borderBottom="1px solid"
              borderColor="gray.50"
            >
              <VStack spacing={3}>
                <Text color="gray.500" fontSize="xs" textTransform="uppercase" letterSpacing="0.1em" fontWeight="semibold">
                  Every blog post includes
                </Text>
                <HStack spacing={3} justify="center" flexWrap="wrap">
                  {[
                    { icon: FiFileText, label: '1,200+ Words', color: '#F99F2A' },
                    { icon: FiSearch, label: 'SEO Optimized', color: '#38A169' },
                    { icon: FiMessageSquare, label: 'FAQ Section', color: '#3182CE' },
                    { icon: FiAlignLeft, label: 'Meta Description', color: '#805AD5' },
                  ].map((badge) => (
                    <HStack
                      key={badge.label}
                      bg="white"
                      border="1px solid"
                      borderColor="gray.100"
                      borderRadius="full"
                      px={3.5}
                      py={1.5}
                      spacing={2}
                      boxShadow="0 1px 2px rgba(0, 0, 0, 0.03)"
                    >
                      <Icon as={badge.icon} boxSize={3} color={badge.color} />
                      <Text fontSize="xs" color="gray.600" fontWeight="medium">
                        {badge.label}
                      </Text>
                    </HStack>
                  ))}
                </HStack>
              </VStack>
            </Box>

            {/* ── Form ── */}
            <VStack spacing={6} align="stretch" px={{ base: 6, md: 10 }} py={8} flex={1}>
              <FormControl>
                <HStack justify="space-between" mb={1}>
                  <FormLabel color="gray.700" fontSize="sm" fontWeight="semibold" mb={0}>
                    Blog Title
                    <Text as="span" color="gray.400" fontWeight="normal" ml={1}>(optional)</Text>
                  </FormLabel>
                  <Button
                    size="xs"
                    variant="ghost"
                    color="#F99F2A"
                    leftIcon={<Icon as={isSuggestingTitle ? FiRefreshCw : FiZap} boxSize={3} />}
                    onClick={handleSuggestTitle}
                    isLoading={isSuggestingTitle}
                    loadingText="Thinking..."
                    _hover={{ bg: 'rgba(255, 157, 0, 0.08)' }}
                    fontWeight="medium"
                    borderRadius="8px"
                    isDisabled={!activeProject}
                  >
                    Suggest Title
                  </Button>
                </HStack>
                <Input
                  placeholder="e.g. How to Boost Your SEO in 2026"
                  color="gray.800"
                  bg="gray.50"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="10px"
                  h="48px"
                  fontSize="sm"
                  _placeholder={{ color: 'gray.400' }}
                  _focus={{
                    borderColor: '#F99F2A',
                    boxShadow: '0 0 0 1px #F99F2A',
                    bg: 'white',
                  }}
                  _hover={{ borderColor: 'gray.300' }}
                  transition="all 0.15s"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Text color="gray.400" fontSize="xs" mt={1.5}>
                  Give your post a title, or leave blank and AI will create one.
                </Text>
              </FormControl>

              <FormControl flex={1} display="flex" flexDirection="column">
                <HStack justify="space-between" mb={1}>
                  <FormLabel color="gray.700" fontSize="sm" fontWeight="semibold" mb={0}>
                    Target Keywords
                    <Text as="span" color="gray.400" fontWeight="normal" ml={1}>(optional)</Text>
                  </FormLabel>
                  <Button
                    size="xs"
                    variant="ghost"
                    color="#F99F2A"
                    leftIcon={<Icon as={isSuggestingKeywords ? FiRefreshCw : FiZap} boxSize={3} />}
                    onClick={handleSuggestKeywords}
                    isLoading={isSuggestingKeywords}
                    loadingText="Researching..."
                    _hover={{ bg: 'rgba(255, 157, 0, 0.08)' }}
                    fontWeight="medium"
                    borderRadius="8px"
                    isDisabled={!activeProject}
                  >
                    Suggest Keywords
                  </Button>
                </HStack>

                {/* Chip container */}
                <Box
                  bg="gray.50"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="10px"
                  p={3}
                  flex={1}
                  minH="120px"
                  cursor="text"
                  transition="all 0.15s"
                  _focusWithin={{
                    borderColor: '#F99F2A',
                    boxShadow: '0 0 0 1px #F99F2A',
                    bg: 'white',
                  }}
                  _hover={{ borderColor: 'gray.300' }}
                  onClick={() => document.getElementById('keyword-chip-input')?.focus()}
                  display="flex"
                  flexDirection="column"
                >
                  {keywordChips.length > 0 && (
                    <Wrap spacing={2} mb={2}>
                      {keywordChips.map((chip) => (
                        <WrapItem key={chip}>
                          <Tag
                            size="md"
                            borderRadius="full"
                            variant="subtle"
                            bg="rgba(249, 159, 42, 0.1)"
                            color="gray.700"
                            border="1px solid"
                            borderColor="rgba(249, 159, 42, 0.2)"
                            px={3}
                            py={1}
                          >
                            <TagLabel fontSize="xs" fontWeight="medium">{chip}</TagLabel>
                            <TagCloseButton
                              onClick={(e) => { e.stopPropagation(); removeKeywordChip(chip); }}
                              color="gray.400"
                              _hover={{ color: 'red.400' }}
                            />
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                  )}
                  <Input
                    id="keyword-chip-input"
                    placeholder={keywordChips.length === 0 ? 'Type a keyword and press Enter...' : 'Add another keyword...'}
                    variant="unstyled"
                    size="sm"
                    fontSize="sm"
                    color="gray.800"
                    _placeholder={{ color: 'gray.400' }}
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={handleKeywordInputKeyDown}
                    onBlur={() => addKeywordChip(keywordInput)}
                    mt="auto"
                  />
                </Box>

                <HStack justify="space-between" mt={1.5}>
                  <Text color="gray.400" fontSize="xs">
                    {keywordChips.length > 0 ? `${keywordChips.length} keyword${keywordChips.length !== 1 ? 's' : ''}` : 'Press Enter or comma to add'}
                  </Text>
                  <Button
                    size="xs"
                    variant="link"
                    color="gray.400"
                    leftIcon={<Icon as={FiBookOpen} boxSize={3} />}
                    onClick={onPickerOpen}
                    _hover={{ color: '#F99F2A' }}
                    fontWeight="normal"
                    fontSize="xs"
                  >
                    Browse keyword library
                  </Button>
                </HStack>
              </FormControl>

              {/* ── Actions ── */}
              <VStack spacing={2} pt={3} align="flex-end">
                <Text color="gray.400" fontSize="xs" fontStyle="italic">
                  All fields optional — Phoo handles the rest
                </Text>
                <Tooltip
                  label="No input needed! Phoo will pick keywords, craft a title, and write the entire post based on your project."
                  placement="top"
                  hasArrow
                  bg="gray.800"
                  color="white"
                  fontSize="xs"
                  px={4}
                  py={2}
                  borderRadius="8px"
                  maxW="280px"
                >
                  <Button
                    bg="linear-gradient(135deg, #F99F2A 0%, #e53e3e 100%)"
                    color="white"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(249, 159, 42, 0.35)',
                    }}
                    _active={{ transform: 'translateY(0)' }}
                    leftIcon={<Icon as={FiZap} />}
                    onClick={handleAutoGenerate}
                    isLoading={isGenerating}
                    loadingText="Generating..."
                    isDisabled={isGenerating}
                    size="lg"
                    borderRadius="12px"
                    fontWeight="bold"
                    transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                    px={8}
                    h="52px"
                    fontSize="md"
                    aria-label="Generate a blog post with AI"
                  >
                    Generate Blog Post
                  </Button>
                </Tooltip>
              </VStack>
            </VStack>
          </Box>
        )}

        {/* Step 2: Content Details — FULL MODE (all content types) */}
        {step === 'details' && selectedType && !BLOG_ONLY_MODE && (
          <Box
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="16px"
            p={8}
            boxShadow="0 2px 8px rgba(0, 0, 0, 0.06)"
          >
            <VStack spacing={6} align="stretch">
              <HStack>
                <Button variant="ghost" size="sm" color="gray.400" onClick={() => setStep('type')}>
                  ← Change Type
                </Button>
                <Text color="#FF9D00" fontWeight="medium" textTransform="capitalize">
                  {selectedType?.replace(/([A-Z])/g, ' $1').trim()}
                </Text>
              </HStack>

              <FormControl>
                <FormLabel color="gray.600">Title</FormLabel>
                <Input
                  placeholder="Enter your content title..."
                  color="gray.800"
                  bg="white"
                  border="1px solid"
                  borderColor="gray.200"
                  _placeholder={{ color: 'gray.400' }}
                  _focus={{
                    borderColor: 'orange.400',
                    boxShadow: '0 0 0 1px #FF9D00',
                  }}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <HStack justify="space-between" mb={2}>
                  <FormLabel color="gray.600" mb={0}>
                    Target Keywords
                  </FormLabel>
                  <Button
                    size="sm"
                    variant="outline"
                    color="#FF9D00"
                    borderColor="#FF9D00"
                    leftIcon={<Icon as={FiBookOpen} />}
                    onClick={onPickerOpen}
                    _hover={{ bg: 'rgba(255, 157, 0, 0.1)' }}
                  >
                    From Library
                  </Button>
                </HStack>
                <Textarea
                  placeholder="seo tips, content marketing, keyword research..."
                  color="gray.800"
                  bg="white"
                  border="1px solid"
                  borderColor="gray.200"
                  _placeholder={{ color: 'gray.400' }}
                  _focus={{
                    borderColor: 'orange.400',
                    boxShadow: '0 0 0 1px #FF9D00',
                  }}
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  rows={3}
                />
                <Text color="gray.500" fontSize="xs" mt={1}>
                  Comma-separated or select from your keyword library
                </Text>
              </FormControl>

              {/* Let Phoo Build It — inline option */}
              <Box>
                <HStack spacing={4} align="center" py={2}>
                  <Divider borderColor="gray.200" />
                  <Text
                    color="gray.500"
                    fontSize="xs"
                    whiteSpace="nowrap"
                    textTransform="uppercase"
                  >
                    or let Phoo handle it
                  </Text>
                  <Divider borderColor="gray.200" />
                </HStack>

                <Box
                  bg="rgba(249, 159, 42, 0.06)"
                  border="1px solid rgba(249, 159, 42, 0.2)"
                  borderRadius="12px"
                  p={5}
                  cursor="pointer"
                  onClick={handleAutoGenerate}
                  _hover={{
                    borderColor: 'rgba(249, 159, 42, 0.5)',
                    bg: 'rgba(249, 159, 42, 0.1)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 8px 30px rgba(249, 159, 42, 0.15)',
                  }}
                  transition="all 0.2s"
                >
                  <HStack spacing={4}>
                    <Box bg="rgba(249, 159, 42, 0.15)" borderRadius="full" p={3} flexShrink={0}>
                      <Icon as={FiZap} boxSize={5} color="#F99F2A" />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text color="gray.800" fontWeight="bold" fontSize="sm">
                        Let Phoo Build It
                      </Text>
                      <Text color="gray.400" fontSize="xs">
                        Skip the form — Phoo picks the best keyword and writes SEO content for you
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              </Box>

              <HStack justify="flex-end" pt={4}>
                <Link href="/studio">
                  <Button variant="ghost" color="gray.400">
                    Cancel
                  </Button>
                </Link>
                <Button
                  bg="linear-gradient(135deg, #FF9D00, #FF6B00)"
                  color="white"
                  _hover={{ opacity: 0.9 }}
                  leftIcon={<Icon as={FiZap} />}
                  onClick={handleGenerate}
                >
                  Generate Content
                </Button>
              </HStack>
            </VStack>
          </Box>
        )}

        {/* Step 3: Manual Generating (existing flow) */}
        {step === 'generating' && (
          <Box
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="16px"
            p={12}
            boxShadow="0 2px 8px rgba(0, 0, 0, 0.06)"
          >
            <VStack spacing={6}>
              <Box bg="rgba(255, 157, 0, 0.1)" borderRadius="full" p={6}>
                <Icon as={FiZap} boxSize={12} color="#FF9D00" animation="pulse 1s infinite" />
              </Box>
              <Heading size="md" color="gray.800">
                Generating Your Content
              </Heading>
              <Text color="gray.500" textAlign="center">
                {title}
              </Text>
              <Box w="100%" maxW="400px">
                <Progress
                  value={progress}
                  size="sm"
                  colorScheme="orange"
                  borderRadius="full"
                  bg="gray.100"
                />
                <Text color="gray.600" fontSize="sm" textAlign="center" mt={2}>
                  {progress < 30
                    ? 'Creating outline...'
                    : progress < 60
                      ? 'Writing content...'
                      : progress < 90
                        ? 'Optimizing for SEO...'
                        : 'Finalizing...'}
                </Text>
              </Box>
            </VStack>
          </Box>
        )}

        {/* Step 4: Auto-Generating (Let Phoo Build It flow) */}
        {step === 'auto-generating' && (
          <Box
            bg="white"
            border="1px solid rgba(249, 159, 42, 0.15)"
            borderRadius="16px"
            p={12}
            position="relative"
            overflow="hidden"
            boxShadow="0 2px 8px rgba(0, 0, 0, 0.06)"
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              bg: 'linear-gradient(90deg, transparent, #F99F2A, transparent)',
              backgroundSize: '200% 100%',
              animation: `${shimmer} 2s linear infinite`,
            }}
          >
            <VStack spacing={8}>
              {/* Animated Icon */}
              <Box
                bg="rgba(249, 159, 42, 0.1)"
                borderRadius="full"
                p={6}
                animation={`${pulseGlow} 1.5s ease-in-out infinite`}
              >
                <Icon as={FiZap} boxSize={12} color="#F99F2A" />
              </Box>

              <VStack spacing={2}>
                <Heading size="md" color="gray.800">
                  Phoo is Building Your Content
                </Heading>
                <Text color="#F99F2A" fontSize="sm" fontWeight="medium" minH="20px">
                  {currentStageLabel}
                </Text>
              </VStack>

              {/* Progress Bar */}
              <Box w="100%" maxW="500px">
                <Box w="100%" h="6px" bg="gray.200" borderRadius="full" overflow="hidden">
                  <Box
                    h="100%"
                    bg="linear-gradient(90deg, #F99F2A, #e53e3e)"
                    borderRadius="full"
                    w={`${Math.min(autoProgress, 100)}%`}
                    transition="width 0.4s ease-out"
                  />
                </Box>
                <Text color="gray.600" fontSize="xs" textAlign="center" mt={2}>
                  {Math.round(Math.min(autoProgress, 100))}%
                </Text>
              </Box>

              {/* Stage indicators */}
              <HStack spacing={1} flexWrap="wrap" justify="center">
                {AUTO_GEN_STAGES.map((stage, i) => (
                  <Box
                    key={i}
                    w="8px"
                    h="8px"
                    borderRadius="full"
                    bg={
                      autoProgress >= stage.threshold
                        ? '#F99F2A'
                        : autoProgress >= (AUTO_GEN_STAGES[i - 1]?.threshold ?? 0)
                          ? 'rgba(249, 159, 42, 0.5)'
                          : 'rgba(255, 255, 255, 0.1)'
                    }
                    transition="all 0.3s"
                  />
                ))}
              </HStack>

              {/* Come back later */}
              {showComeBack && (
                <VStack
                  spacing={2}
                  opacity={showComeBack ? 1 : 0}
                  transition="opacity 0.5s ease-in"
                >
                  <HStack spacing={2} color="gray.500">
                    <Icon as={FiClock} boxSize={4} />
                    <Text fontSize="sm">This usually takes 1-2 minutes</Text>
                  </HStack>
                  <Link href="/studio">
                    <Button
                      variant="ghost"
                      size="sm"
                      color="gray.500"
                      _hover={{ color: 'gray.300' }}
                    >
                      Come back later — your content will appear in the Library
                    </Button>
                  </Link>
                </VStack>
              )}
            </VStack>
          </Box>
        )}
      </VStack>

      {/* Keyword Library Picker Modal */}
      <KeywordLibraryPicker
        isOpen={isPickerOpen}
        onClose={onPickerClose}
        projectId={activeProject?._id ?? null}
        onSelect={handleKeywordsFromLibrary}
        selectedKeywords={keywords
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean)}
      />
    </StudioLayout>
  );
}
