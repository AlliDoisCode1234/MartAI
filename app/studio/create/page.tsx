'use client';

/**
 * Create Content Page
 *
 * Component Hierarchy:
 * App → StudioLayout → CreateContentPage
 *
 * One-click content creation with type selection and strategy integration.
 */

import {
  Box,
  Heading,
  Text,
  HStack,
  VStack,
  Button,
  SimpleGrid,
  Icon,
  Input,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { StudioLayout } from '@/src/components/studio';
import {
  FiFileText,
  FiBookOpen,
  FiHelpCircle,
  FiList,
  FiGitBranch,
  FiTarget,
  FiArrowLeft,
} from 'react-icons/fi';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type ContentType = 'blog' | 'pillar' | 'howto' | 'comparison' | 'listicle';

interface ContentTypeOption {
  type: ContentType;
  label: string;
  description: string;
  icon: typeof FiFileText;
  targetWords: string;
}

const contentTypes: ContentTypeOption[] = [
  {
    type: 'blog',
    label: 'Blog Post',
    description: 'Standard SEO-optimized article',
    icon: FiFileText,
    targetWords: '1,200-1,500',
  },
  {
    type: 'pillar',
    label: 'Pillar Content',
    description: 'Comprehensive topic authority',
    icon: FiBookOpen,
    targetWords: '3,000-5,000',
  },
  {
    type: 'howto',
    label: 'How-To Guide',
    description: 'Step-by-step instructions',
    icon: FiHelpCircle,
    targetWords: '1,500-2,000',
  },
  {
    type: 'comparison',
    label: 'Comparison',
    description: 'A vs B analysis',
    icon: FiGitBranch,
    targetWords: '1,800-2,500',
  },
  {
    type: 'listicle',
    label: 'Listicle',
    description: 'Top X list format',
    icon: FiList,
    targetWords: '1,200-1,800',
  },
];

export default function CreateContentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const preselectedType = searchParams.get('type') as ContentType | null;
  const fromStrategy = searchParams.get('fromStrategy') === 'true';

  const [step, setStep] = useState<'type' | 'details'>(preselectedType ? 'details' : 'type');
  const [selectedType, setSelectedType] = useState<ContentType | null>(preselectedType);
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTypeSelect = (type: ContentType) => {
    setSelectedType(type);
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

    setIsGenerating(true);

    // TODO: Implement actual generation via Convex mutation
    toast({
      title: 'Generation started',
      description: 'Your content is being generated...',
      status: 'info',
      duration: 3000,
    });

    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      router.push('/studio/library');
    }, 2000);
  };

  return (
    <StudioLayout>
      <VStack align="stretch" spacing={8}>
        {/* Header */}
        <HStack justify="space-between">
          <HStack spacing={4}>
            <Link href="/studio">
              <IconButton
                aria-label="Back to studio"
                icon={<Icon as={FiArrowLeft} />}
                variant="ghost"
                color="gray.400"
                _hover={{ color: 'white' }}
              />
            </Link>
            <Box>
              <Heading size="lg" color="white">
                Create Content
              </Heading>
              <Text color="gray.500" mt={1}>
                {step === 'type' ? 'Choose content type' : 'Enter details'}
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

        {/* Step 1: Type Selection */}
        {step === 'type' && (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {contentTypes.map((option) => (
              <Box
                key={option.type}
                bg="rgba(255, 255, 255, 0.03)"
                border="1px solid rgba(255, 255, 255, 0.08)"
                borderRadius="16px"
                p={6}
                cursor="pointer"
                transition="all 0.2s ease"
                _hover={{
                  border: '1px solid rgba(255, 157, 0, 0.3)',
                  boxShadow: '0 0 30px rgba(255, 157, 0, 0.1)',
                  transform: 'translateY(-2px)',
                }}
                onClick={() => handleTypeSelect(option.type)}
              >
                <VStack align="start" spacing={3}>
                  <Box bg="rgba(255, 157, 0, 0.1)" borderRadius="12px" p={3}>
                    <Icon as={option.icon} boxSize={6} color="#FF9D00" />
                  </Box>
                  <Text fontWeight="semibold" color="white" fontSize="lg">
                    {option.label}
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    {option.description}
                  </Text>
                  <Text color="gray.600" fontSize="xs">
                    Target: {option.targetWords} words
                  </Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
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
                <Text color="#FF9D00" fontWeight="medium">
                  {contentTypes.find((t) => t.type === selectedType)?.label}
                </Text>
              </HStack>

              <FormControl>
                <FormLabel color="gray.300">Title</FormLabel>
                <Input
                  placeholder="Enter your content title..."
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
                <FormLabel color="gray.300">Target Keywords (comma-separated)</FormLabel>
                <Textarea
                  placeholder="seo tips, content marketing, keyword research..."
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
                  isLoading={isGenerating}
                  loadingText="Generating..."
                  onClick={handleGenerate}
                >
                  Generate Content
                </Button>
              </HStack>
            </VStack>
          </Box>
        )}
      </VStack>
    </StudioLayout>
  );
}

// IconButton wrapper (since we're using it above)
function IconButton({
  'aria-label': ariaLabel,
  icon,
  variant,
  color,
  _hover,
}: {
  'aria-label': string;
  icon: React.ReactNode;
  variant: string;
  color: string;
  _hover: Record<string, string>;
}) {
  return (
    <Button aria-label={ariaLabel} variant={variant} color={color} _hover={_hover} p={2}>
      {icon}
    </Button>
  );
}
