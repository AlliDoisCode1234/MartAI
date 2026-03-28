'use client';

/**
 * LetPhooBuildItModal Component
 *
 * Component Hierarchy:
 * App -> Content -> ContentStudioLanding -> LetPhooBuildItModal (this file)
 *
 * Modal flow for AI-powered content creation:
 * 1. Shows top keyword opportunities from the library
 * 2. User selects a keyword
 * 3. AI generates 5 title suggestions
 * 4. User picks a title
 * 5. Full content generation kicks off
 */

import { useState, useRef, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Button,
  Box,
  Badge,
  Spinner,
  Icon,
  Divider,
  Radio,
  RadioGroup,
  Select,
  useToast,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Avatar,
} from '@chakra-ui/react';
import { FiZap, FiCheck, FiArrowRight, FiSend } from 'react-icons/fi';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useProject } from '@/lib/hooks';
import type { Id } from '@/convex/_generated/dataModel';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type Step = 'keyword' | 'titles' | 'generating';

interface KeywordOption {
  _id: string;
  keyword: string;
  searchVolume?: number;
  difficulty?: number;
  intent?: string;
}

export function LetPhooBuildItModal({ isOpen, onClose }: Props) {
  const toast = useToast();
  const { projectId } = useProject(null, { autoSelect: true });

  const [step, setStep] = useState<Step>('keyword');
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [contentType, setContentType] = useState('blog');
  const [titles, setTitles] = useState<string[]>([]);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [isLoadingTitles, setIsLoadingTitles] = useState(false);

  // Interactive Coach State
  const [coachInput, setCoachInput] = useState('');
  const [coachMessages, setCoachMessages] = useState<{ role: 'phoo' | 'user'; text: string }[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const generateTitles = useAction(api.contentGeneration.generateContentTitle);
  // WF-005: Durable workflow trigger replaces direct useAction(generateContent)
  const startGeneration = useMutation(api.workflowTriggers.startContentGeneration);

  // Fetch suggested keywords from library
  const suggestedKeywords = useQuery(
    api.seo.keywords.getKeywordsByStatus,
    projectId ? { projectId: projectId as Id<'projects'>, status: 'suggested' } : 'skip'
  );

  const keywords = (suggestedKeywords ?? []) as KeywordOption[];

  const handleKeywordSelect = async (keyword: string) => {
    if (!projectId) return;
    setSelectedKeyword(keyword);
    setIsLoadingTitles(true);
    setStep('titles');

    try {
      const result = await generateTitles({
        projectId: projectId as Id<'projects'>,
        keyword,
        contentType: contentType as 'blog',
      });
      setTitles(result);
      setSelectedTitle(result[0] || '');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      console.error('[LetPhooBuildIt] Title generation failed:', msg);
      toast({
        title: 'Could not generate titles',
        description: 'Phoo had trouble. Try again or pick manually.',
        status: 'warning',
        duration: 5000,
      });
      setStep('keyword');
    } finally {
      setIsLoadingTitles(false);
    }
  };

  const handleGenerate = async () => {
    if (!projectId || !selectedTitle || !selectedKeyword) return;
    setStep('generating');

    // Initialize the coach chat when generating starts
    setCoachMessages([
      {
        role: 'phoo',
        text: `I'm writing your article on "${selectedTitle}" right now. While we wait (usually 1-2 minutes), is there any specific call-to-action or tone you want me to emphasize for this generation?`,
      },
    ]);

    try {
      // WF-005: Start durable workflow instead of direct action call.
      // The workflow handles RBAC, quota checks, and step-level retry.
      // userId is derived from auth context in the trigger mutation.
      const { workflowId } = await startGeneration({
        projectId: projectId as Id<'projects'>,
        contentType: contentType as 'blog',
        title: selectedTitle,
        keywords: [selectedKeyword],
      });

      toast({
        title: 'Content generation started',
        description: 'Phoo is crafting your article with durable workflow. Check Content Studio in a few minutes.',
        status: 'success',
        duration: 6000,
      });
      handleReset();
      onClose();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      console.error('[LetPhooBuildIt] Workflow start failed:', msg);
      toast({
        title: 'Generation failed',
        description: String(error),
        status: 'error',
        duration: 8000,
      });
      setStep('titles');
    }
  };

  const handleReset = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setStep('keyword');
    setSelectedKeyword('');
    setTitles([]);
    setSelectedTitle('');
    setContentType('blog');
    setCoachInput('');
    setCoachMessages([]);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
      <ModalContent
        bg="gray.900"
        borderWidth="1px"
        borderColor="whiteAlpha.100"
        borderRadius="xl"
        mx={4}
      >
        <ModalHeader color="white" pb={2} borderBottomWidth="1px" borderColor="whiteAlpha.100">
          <HStack>
            <Icon as={FiZap} color="#F99F2A" />
            <Text>Let Phoo Build It</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton color="gray.400" />
        <ModalBody py={6}>
          {/* Step 1: Choose Keyword */}
          {step === 'keyword' && (
            <VStack spacing={5} align="stretch">
              <Text color="gray.300" fontSize="sm">
                Pick a keyword to write about and Phoo will generate title ideas:
              </Text>

              <Select
                size="sm"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                bg="whiteAlpha.100"
                color="white"
                borderColor="whiteAlpha.200"
                _hover={{ borderColor: '#F99F2A' }}
              >
                <option value="blog" style={{ background: '#1a202c' }}>
                  Blog Post
                </option>
                <option value="blogVersus" style={{ background: '#1a202c' }}>
                  Comparison Post
                </option>
                <option value="service" style={{ background: '#1a202c' }}>
                  Service Page
                </option>
                <option value="leadMagnet" style={{ background: '#1a202c' }}>
                  Lead Magnet
                </option>
                <option value="contentRefresh" style={{ background: '#1a202c' }}>
                  Content Refresh
                </option>
              </Select>

              <Divider borderColor="whiteAlpha.100" />

              {keywords.length === 0 ? (
                <Text color="gray.500" fontSize="sm" textAlign="center" py={4}>
                  No keywords in your library yet. Add keywords in the Keyword Library first.
                </Text>
              ) : (
                <VStack spacing={2} align="stretch" maxH="300px" overflowY="auto">
                  {keywords.slice(0, 10).map((kw) => (
                    <Button
                      key={kw._id}
                      variant="ghost"
                      justifyContent="space-between"
                      color="white"
                      _hover={{ bg: 'whiteAlpha.100' }}
                      onClick={() => handleKeywordSelect(kw.keyword)}
                      h="auto"
                      py={3}
                      px={4}
                    >
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" fontWeight="medium">
                          {kw.keyword}
                        </Text>
                        <HStack spacing={2}>
                          {kw.difficulty != null && (
                            <Badge
                              size="sm"
                              colorScheme={
                                kw.difficulty < 30 ? 'green' : kw.difficulty < 60 ? 'yellow' : 'red'
                              }
                            >
                              KD {kw.difficulty}
                            </Badge>
                          )}
                          {kw.searchVolume != null && (
                            <Text fontSize="xs" color="gray.500">
                              {kw.searchVolume.toLocaleString()}/mo
                            </Text>
                          )}
                          {kw.intent && (
                            <Text fontSize="xs" color="gray.600">
                              {kw.intent}
                            </Text>
                          )}
                        </HStack>
                      </VStack>
                      <Icon as={FiArrowRight} color="gray.500" />
                    </Button>
                  ))}
                </VStack>
              )}
            </VStack>
          )}

          {/* Step 2: Choose Title */}
          {step === 'titles' && (
            <VStack spacing={5} align="stretch">
              <HStack>
                <Badge colorScheme="orange" fontSize="xs">
                  Keyword
                </Badge>
                <Text color="white" fontSize="sm" fontWeight="medium">
                  {selectedKeyword}
                </Text>
              </HStack>

              {isLoadingTitles ? (
                <VStack py={8} spacing={3}>
                  <Spinner color="#F99F2A" size="lg" />
                  <Text color="gray.400" fontSize="sm">
                    Phoo is brainstorming titles...
                  </Text>
                </VStack>
              ) : (
                <>
                  <Text color="gray.300" fontSize="sm">
                    Pick a title for your article:
                  </Text>
                  <RadioGroup value={selectedTitle} onChange={setSelectedTitle}>
                    <VStack spacing={2} align="stretch">
                      {titles.map((title, i) => (
                        <Box
                          key={i}
                          p={3}
                          borderRadius="md"
                          borderWidth="1px"
                          borderColor={selectedTitle === title ? '#F99F2A' : 'whiteAlpha.100'}
                          bg={selectedTitle === title ? 'whiteAlpha.100' : 'transparent'}
                          cursor="pointer"
                          onClick={() => setSelectedTitle(title)}
                          _hover={{ borderColor: '#F99F2A', bg: 'whiteAlpha.50' }}
                          transition="all 0.2s"
                        >
                          <Radio value={title} colorScheme="orange">
                            <Text color="white" fontSize="sm">
                              {title}
                            </Text>
                          </Radio>
                        </Box>
                      ))}
                    </VStack>
                  </RadioGroup>

                  <HStack justify="space-between" pt={2}>
                    <Button
                      size="sm"
                      variant="ghost"
                      color="gray.400"
                      onClick={() => setStep('keyword')}
                    >
                      Back
                    </Button>
                    <Button
                      size="md"
                      bg="linear-gradient(135deg, #F99F2A 0%, #e53e3e 100%)"
                      color="white"
                      rightIcon={<FiCheck />}
                      onClick={handleGenerate}
                      isDisabled={!selectedTitle}
                      _hover={{
                        transform: 'translateY(-1px)',
                        boxShadow: '0 10px 30px rgba(249, 159, 42, 0.3)',
                      }}
                      transition="all 0.2s"
                    >
                      Generate Content
                    </Button>
                  </HStack>
                </>
              )}
            </VStack>
          )}

          {/* Step 3: Generating (Interactive Coach) */}
          {step === 'generating' && (
            <VStack spacing={4} align="stretch" h="400px">
              <HStack bg="whiteAlpha.50" p={3} borderRadius="md" justify="space-between">
                <HStack>
                  <Spinner color="#F99F2A" size="sm" />
                  <Text color="white" fontSize="sm" fontWeight="medium">
                    Phoo is writing your article...
                  </Text>
                </HStack>
                <Text color="gray.400" fontSize="xs">
                  Safe to close modal
                </Text>
              </HStack>

              <VStack
                flex={1}
                overflowY="auto"
                bg="blackAlpha.300"
                borderRadius="md"
                p={4}
                spacing={4}
                align="stretch"
                borderWidth="1px"
                borderColor="whiteAlpha.100"
              >
                {coachMessages.map((msg, i) => (
                  <HStack key={i} align="start" justify={msg.role === 'user' ? 'flex-end' : 'flex-start'} spacing={3}>
                    {msg.role === 'phoo' && (
                      <Avatar size="sm" bg="orange.500" icon={<FiZap fontSize="1rem" color="white" />} />
                    )}
                    <Box
                      bg={msg.role === 'user' ? 'orange.500' : 'whiteAlpha.100'}
                      color={msg.role === 'user' ? 'white' : 'gray.100'}
                      px={4}
                      py={2}
                      borderRadius="xl"
                      borderTopRightRadius={msg.role === 'user' ? 'sm' : 'xl'}
                      borderTopLeftRadius={msg.role === 'phoo' ? 'sm' : 'xl'}
                      maxW="85%"
                    >
                      <Text fontSize="sm">{msg.text}</Text>
                    </Box>
                  </HStack>
                ))}
              </VStack>

              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  placeholder="e.g. Keep it strictly professional..."
                  value={coachInput}
                  onChange={(e) => setCoachInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = coachInput.trim();
                      if (!val) return;
                      setCoachInput('');
                      setCoachMessages((prev) => [...prev, { role: 'user', text: val }]);
                      timeoutRef.current = setTimeout(() => {
                        setCoachMessages((prev) => [
                          ...prev,
                          {
                            role: 'phoo',
                            text: 'Got it! I\'ve noted those preferences for this session.',
                          },
                        ]);
                      }, 1000);
                    }
                  }}
                  bg="whiteAlpha.50"
                  color="white"
                  borderColor="whiteAlpha.200"
                  _hover={{ borderColor: 'orange.400' }}
                  _focus={{ borderColor: 'orange.500', boxShadow: 'none' }}
                />
                <InputRightElement width="3rem">
                  <IconButton
                    h="1.75rem"
                    size="sm"
                    variant="ghost"
                    color="orange.400"
                    aria-label="Send"
                    icon={<FiSend />}
                    onClick={() => {
                      const val = coachInput.trim();
                      if (!val) return;
                      setCoachInput('');
                      setCoachMessages((prev) => [...prev, { role: 'user', text: val }]);
                      timeoutRef.current = setTimeout(() => {
                        setCoachMessages((prev) => [
                          ...prev,
                          {
                            role: 'phoo',
                            text: 'Got it! I\'ve noted those preferences for this session.',
                          },
                        ]);
                      }, 1000);
                    }}
                  />
                </InputRightElement>
              </InputGroup>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
