'use client';

/**
 * Create Content Page
 *
 * Component Hierarchy:
 * App → StudioLayout → CreateContentPage
 *
 * One-click content creation with 17 content types from Content Intelligence.
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
} from '@chakra-ui/react';
import { useQuery, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { StudioLayout } from '@/src/components/studio';
import { ContentTypeSelector } from '@/src/components/studio/ContentTypeSelector';
import { KeywordLibraryPicker } from '@/src/components/studio/KeywordLibraryPicker';
import { FiTarget, FiArrowLeft, FiZap, FiBookOpen } from 'react-icons/fi';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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

export default function CreateContentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const preselectedType = searchParams.get('type') as ContentType | null;
  const fromStrategy = searchParams.get('fromStrategy') === 'true';

  const [step, setStep] = useState<'type' | 'details' | 'generating'>(
    preselectedType ? 'details' : 'type'
  );
  const [selectedType, setSelectedType] = useState<ContentType | null>(preselectedType);
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [progress, setProgress] = useState(0);

  // Keyword library picker modal
  const { isOpen: isPickerOpen, onOpen: onPickerOpen, onClose: onPickerClose } = useDisclosure();

  // Get active project
  const projects = useQuery(api.projects.projects.list);
  const activeProject = projects?.[0];

  // Content generation action
  const generateContent = useAction(api.contentGeneration.generateContent);

  // WordPress connection for capability badges
  const wpConnection = useQuery(
    api.integrations.platformConnections.getConnection,
    activeProject ? { projectId: activeProject._id, platform: 'wordpress' as const } : 'skip'
  );

  // Handle keyword selection from library
  const handleKeywordsFromLibrary = (selectedKeywords: string[]) => {
    setKeywords(selectedKeywords.join(', '));
  };

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId as ContentType);
    setStep('details');
  };

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

    setStep('generating');
    setProgress(10);

    try {
      // Parse keywords
      const keywordList = keywords
        .split(',')
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 10, 90));
      }, 500);

      // Call generation action
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
        description: 'Your content is ready',
        status: 'success',
        duration: 3000,
      });

      // Navigate to editor
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

  return (
    <StudioLayout>
      <VStack align="stretch" spacing={8}>
        {/* Header */}
        <HStack justify="space-between">
          <HStack spacing={4}>
            <Link href="/studio">
              <Button
                variant="ghost"
                size="sm"
                color="gray.400"
                leftIcon={<Icon as={FiArrowLeft} />}
                _hover={{ color: 'white' }}
              >
                Back
              </Button>
            </Link>
            <Box>
              <Heading size="lg" color="white">
                Create Content
              </Heading>
              <Text color="gray.500" mt={1}>
                {step === 'type'
                  ? 'Choose content type'
                  : step === 'details'
                    ? 'Enter details'
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

        {/* Step 1: Type Selection - 17 Content Types from Content Intelligence */}
        {step === 'type' && (
          <ContentTypeSelector
            selectedType={selectedType}
            onSelect={handleTypeSelect}
            wordpressConnected={!!wpConnection?.isValid}
            wordpressCapabilities={wpConnection?.capabilities}
          />
        )}

        {/* Step 2: Content Details */}
        {step === 'details' && selectedType && (
          <Box
            bg="rgba(255, 255, 255, 0.03)"
            border="1px solid rgba(255, 255, 255, 0.08)"
            borderRadius="16px"
            p={8}
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
                <FormLabel color="gray.300">Title</FormLabel>
                <Input
                  placeholder="Enter your content title..."
                  color="white"
                  bg="rgba(255, 255, 255, 0.05)"
                  border="1px solid rgba(255, 255, 255, 0.1)"
                  _placeholder={{ color: 'gray.500' }}
                  _focus={{
                    borderColor: '#FF9D00',
                    boxShadow: '0 0 0 1px #FF9D00',
                  }}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <HStack justify="space-between" mb={2}>
                  <FormLabel color="gray.300" mb={0}>
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
                  color="white"
                  bg="rgba(255, 255, 255, 0.05)"
                  border="1px solid rgba(255, 255, 255, 0.1)"
                  _placeholder={{ color: 'gray.500' }}
                  _focus={{
                    borderColor: '#FF9D00',
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

        {/* Step 3: Generating */}
        {step === 'generating' && (
          <Box
            bg="rgba(255, 255, 255, 0.03)"
            border="1px solid rgba(255, 255, 255, 0.08)"
            borderRadius="16px"
            p={12}
          >
            <VStack spacing={6}>
              <Box bg="rgba(255, 157, 0, 0.1)" borderRadius="full" p={6}>
                <Icon as={FiZap} boxSize={12} color="#FF9D00" animation="pulse 1s infinite" />
              </Box>
              <Heading size="md" color="white">
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
                  bg="rgba(255, 255, 255, 0.1)"
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
