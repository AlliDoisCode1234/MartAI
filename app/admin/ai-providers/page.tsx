'use client';

/**
 * Component Hierarchy:
 * app/admin/layout.tsx
 * └── app/admin/ai-providers/page.tsx (this file)
 *     └── HowItWorksCarousel
 *     └── ProviderCard
 *     └── HealthMetrics
 */

import { useQuery, useMutation, useAction } from 'convex/react';
import { useState } from 'react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import {
  Box,
  Card,
  Flex,
  Heading,
  Text,
  Badge,
  Button,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  Icon,
  useToast,
  Spinner,
  Switch,
  VStack,
  HStack,
  Tooltip,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from '@chakra-ui/react';
import {
  FiCheckCircle,
  FiAlertCircle,
  FiAlertTriangle,
  FiSlash,
  FiRefreshCw,
  FiActivity,
  FiClock,
  FiZap,
  FiCopy,
  FiChevronDown,
  FiChevronUp,
  FiChevronLeft,
  FiChevronRight,
  FiHelpCircle,
  FiShield,
  FiStar,
  FiX,
} from 'react-icons/fi';
import {
  parseProviderError,
  getSeverityColor,
  getCategoryColor,
  type ParsedError,
} from '@/lib/errors/parseProviderError';
import { AICostDashboard } from '@/src/components/admin/AICostDashboard';

interface Props {}

type ProviderStatus = 'healthy' | 'degraded' | 'unhealthy' | 'circuit_open' | 'unknown';
type CircuitState = 'closed' | 'open' | 'half_open';

interface ProviderHealth {
  status: ProviderStatus;
  circuitState: CircuitState;
  avgLatencyMs: number;
  errorRate: number;
  successCount: number;
  errorCount: number;
  lastSuccessAt?: number;
  lastErrorAt?: number;
  lastErrorMessage?: string;
}

interface ProviderData {
  _id: Id<'aiProviders'>;
  name: string;
  displayName: string;
  isEnabled: boolean;
  priority: number;
  health?: ProviderHealth;
}

// Default models per provider (used by router)
const DEFAULT_MODELS: Record<string, string> = {
  openai: 'gpt-4o',
  anthropic: 'claude-3-5-sonnet',
  google: 'gemini-1.5-flash',
};

// Carousel explainer slides
interface ExplainerSlide {
  title: string;
  description: string;
  icon: typeof FiZap;
  color: string;
  highlight: string;
}

const EXPLAINER_SLIDES: ExplainerSlide[] = [
  {
    title: 'Fast Tier',
    description:
      'Uses lightweight models for quick tasks like translations and summaries. Prioritizes speed and cost efficiency.',
    icon: FiZap,
    color: 'green',
    highlight: 'Best for: Quick edits',
  },
  {
    title: 'Balanced Tier',
    description:
      'Our smart default. Perfect balance of quality and speed for articles, blogs, and briefs.',
    icon: FiCheckCircle,
    color: 'blue',
    highlight: 'Best for: Most content',
  },
  {
    title: 'Premium Tier',
    description:
      'Uses advanced reasoning models for complex analysis and long-form content that needs depth.',
    icon: FiStar,
    color: 'purple',
    highlight: 'Best for: Deep analysis',
  },
  {
    title: 'Auto Fail-over',
    description:
      'If any AI provider is down, we automatically switch to a backup—your content generation never stops.',
    icon: FiShield,
    color: 'cyan',
    highlight: '99.9% uptime',
  },
];

export default function AIProvidersPage({}: Props) {
  const providers = useQuery(api.ai.health.circuitBreaker.getAllProviderHealth, {});
  const resetHealth = useMutation(api.ai.health.circuitBreaker.resetHealth);
  const runHealthCheck = useAction(api.ai.health.healthActions.runHealthChecksAdmin);
  const toast = useToast();
  const [isChecking, setIsChecking] = useState(false);
  const carouselModal = useDisclosure();

  const handleRunHealthCheck = async () => {
    setIsChecking(true);
    try {
      const results = await runHealthCheck({});
      const successCount = Object.values(results).filter(
        (r: { healthy?: boolean }) => r.healthy
      ).length;
      toast({
        title: 'Health Check Complete',
        description: `Tested ${Object.keys(results).length} providers. ${successCount} healthy.`,
        status: successCount > 0 ? 'success' : 'warning',
        duration: 3000,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast({
        title: 'Health Check Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleResetCircuit = async (providerId: Id<'aiProviders'>, name: string) => {
    try {
      await resetHealth({ providerId });
      toast({
        title: 'Circuit Reset',
        description: `${name} health metrics have been reset.`,
        status: 'success',
        duration: 3000,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast({
        title: 'Reset Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
      });
    }
  };

  if (!providers) {
    return (
      <Flex justify="center" align="center" h="200px">
        <Spinner size="xl" />
      </Flex>
    );
  }

  const healthyCount = providers.filter((p: ProviderData) => p.health?.status === 'healthy').length;
  const circuitOpenCount = providers.filter(
    (p: ProviderData) => p.health?.circuitState === 'open'
  ).length;

  return (
    <Box p={6}>
      {/* Page Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <HStack spacing={3}>
          <Box>
            <Heading size="lg">AI Providers</Heading>
            <Text color="gray.500">Multi-agent failover infrastructure</Text>
          </Box>
          <Tooltip label="How it works">
            <IconButton
              aria-label="How it works"
              icon={<Icon as={FiHelpCircle} />}
              size="sm"
              variant="ghost"
              color="gray.400"
              _hover={{ color: 'blue.400', bg: 'whiteAlpha.100' }}
              onClick={carouselModal.onOpen}
            />
          </Tooltip>
        </HStack>
        <HStack spacing={4}>
          <Button
            leftIcon={<FiActivity />}
            onClick={handleRunHealthCheck}
            isLoading={isChecking}
            loadingText="Checking..."
            size="sm"
            colorScheme="blue"
            variant="outline"
          >
            Run Health Check
          </Button>
          <HStack>
            <Badge colorScheme="green" fontSize="sm" px={3} py={1}>
              {healthyCount} Healthy
            </Badge>
            <Badge colorScheme="yellow" fontSize="sm" px={3} py={1}>
              {circuitOpenCount} Circuit Open
            </Badge>
          </HStack>
        </HStack>
      </Flex>

      {/* How It Works Modal */}
      <Modal isOpen={carouselModal.isOpen} onClose={carouselModal.onClose} size="xl" isCentered>
        <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
        <ModalContent bg="gray.800" borderRadius="xl">
          <ModalHeader color="white">How AI Tiers Work</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={6}>
            <HowItWorksCarousel onClose={carouselModal.onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Unified AI Infrastructure Section */}
      <VStack spacing={6} align="stretch">
        {/* AI Cost Dashboard (INFRA-003) */}
        <AICostDashboard budget={200} />

        {/* Section connector text */}
        <Text fontSize="sm" color="gray.500" fontWeight="medium">
          Provider Health & Status
        </Text>

        {/* Provider Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {providers.map((provider: ProviderData) => (
            <ProviderCard
              key={provider._id}
              provider={provider}
              onResetCircuit={() => handleResetCircuit(provider._id, provider.displayName)}
            />
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
}

/**
 * How It Works Carousel Component
 */
interface CarouselProps {
  onClose: () => void;
}

function HowItWorksCarousel({ onClose }: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % EXPLAINER_SLIDES.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + EXPLAINER_SLIDES.length) % EXPLAINER_SLIDES.length);

  const slide = EXPLAINER_SLIDES[currentSlide];

  return (
    <Box p={2} position="relative">
      <Flex direction={{ base: 'column', md: 'row' }} align="center" gap={6}>
        {/* Slide content */}
        <Flex direction="column" align="center" textAlign="center" flex={1} py={4}>
          <Icon as={slide.icon} boxSize={10} color={`${slide.color}.400`} mb={3} />
          <Text fontWeight="bold" color="white" fontSize="lg" mb={2}>
            {slide.title}
          </Text>
          <Text fontSize="sm" color="gray.400" mb={3} maxW="320px">
            {slide.description}
          </Text>
          <Badge colorScheme={slide.color} fontSize="xs" px={3} py={1}>
            {slide.highlight}
          </Badge>
        </Flex>

        {/* Navigation */}
        <VStack spacing={3}>
          <HStack spacing={2}>
            <IconButton
              aria-label="Previous"
              icon={<Icon as={FiChevronLeft} />}
              size="sm"
              variant="ghost"
              color="gray.400"
              _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
              onClick={prevSlide}
            />

            {/* Dots */}
            <HStack spacing={1}>
              {EXPLAINER_SLIDES.map((s, idx) => (
                <Box
                  key={idx}
                  w={idx === currentSlide ? '18px' : '8px'}
                  h="8px"
                  borderRadius="full"
                  bg={idx === currentSlide ? `${s.color}.400` : 'whiteAlpha.300'}
                  transition="all 0.2s"
                  cursor="pointer"
                  onClick={() => setCurrentSlide(idx)}
                />
              ))}
            </HStack>

            <IconButton
              aria-label="Next"
              icon={<Icon as={FiChevronRight} />}
              size="sm"
              variant="ghost"
              color="gray.400"
              _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
              onClick={nextSlide}
            />
          </HStack>
          <Text fontSize="xs" color="gray.500">
            {currentSlide + 1} of {EXPLAINER_SLIDES.length}
          </Text>
        </VStack>
      </Flex>
    </Box>
  );
}

interface ProviderCardProps {
  provider: ProviderData;
  onResetCircuit: () => void;
}

function ProviderCard({ provider, onResetCircuit }: ProviderCardProps) {
  const health = provider.health;

  const statusConfig: Record<
    ProviderStatus,
    { color: string; icon: typeof FiCheckCircle; label?: string }
  > = {
    healthy: { color: 'green', icon: FiCheckCircle },
    degraded: { color: 'yellow', icon: FiAlertTriangle },
    unhealthy: { color: 'red', icon: FiAlertCircle },
    circuit_open: { color: 'red', icon: FiSlash },
    unknown: { color: 'gray', icon: FiAlertCircle, label: 'NEVER TESTED' },
  };

  const circuitConfig: Record<CircuitState, { color: string; label: string }> = {
    closed: { color: 'green', label: 'Closed' },
    open: { color: 'red', label: 'Open' },
    half_open: { color: 'yellow', label: 'Half-Open' },
  };

  const status = health?.status || 'healthy';
  const circuit = health?.circuitState || 'closed';
  // Defensive fallback for unknown status values
  const { color, icon: StatusIcon } = statusConfig[status] || statusConfig.healthy;
  const circuitInfo = circuitConfig[circuit] || circuitConfig.closed;

  const totalRequests = (health?.successCount || 0) + (health?.errorCount || 0);
  const successRate = totalRequests > 0 ? ((health?.successCount || 0) / totalRequests) * 100 : 100;

  const activeModel = DEFAULT_MODELS[provider.name] || 'Unknown';

  return (
    <Card
      p={5}
      borderRadius="xl"
      boxShadow="md"
      bg="whiteAlpha.50"
      minH="420px"
      display="flex"
      flexDirection="column"
    >
      <VStack align="stretch" spacing={4} flex="1">
        {/* Header */}
        <Box>
          <Flex justify="space-between" align="center" mb={2}>
            <HStack>
              <Icon as={StatusIcon} color={`${color}.400`} boxSize={5} />
              <Heading size="md">{provider.displayName}</Heading>
            </HStack>
            <Badge colorScheme={color}>
              {statusConfig[status]?.label || status.replace('_', ' ').toUpperCase()}
            </Badge>
          </Flex>
          <Text fontSize="xs" color="gray.400" fontFamily="mono">
            Model: {activeModel}
          </Text>
        </Box>

        {/* Circuit Breaker Status */}
        <Flex
          justify="space-between"
          align="center"
          px={3}
          py={2}
          bg="whiteAlpha.100"
          borderRadius="md"
        >
          <HStack>
            <Icon as={FiActivity} color="gray.400" />
            <Text fontSize="sm" color="gray.400">
              Circuit Breaker
            </Text>
          </HStack>
          <Badge colorScheme={circuitInfo.color}>{circuitInfo.label}</Badge>
        </Flex>

        {/* Stats Grid */}
        <SimpleGrid columns={2} spacing={3}>
          <Stat size="sm">
            <StatLabel color="gray.400">
              <HStack spacing={1}>
                <Icon as={FiClock} boxSize={3} />
                <Text>Latency</Text>
              </HStack>
            </StatLabel>
            <StatNumber fontSize="lg">{Math.round(health?.avgLatencyMs || 0)}ms</StatNumber>
          </Stat>

          <Stat size="sm">
            <StatLabel color="gray.400">
              <HStack spacing={1}>
                <Icon as={FiZap} boxSize={3} />
                <Text>Success Rate</Text>
              </HStack>
            </StatLabel>
            <StatNumber fontSize="lg">{successRate.toFixed(1)}%</StatNumber>
          </Stat>
        </SimpleGrid>

        {/* Success Rate Progress */}
        <Box>
          <Flex justify="space-between" mb={1}>
            <Text fontSize="xs" color="gray.400">
              Health
            </Text>
            <Text fontSize="xs" color="gray.400">
              {health?.successCount || 0}/{totalRequests} requests
            </Text>
          </Flex>
          <Progress
            value={successRate}
            colorScheme={successRate > 95 ? 'green' : successRate > 80 ? 'yellow' : 'red'}
            borderRadius="full"
            size="sm"
          />
        </Box>

        {/* Last Error - Structured Display */}
        {health?.lastErrorMessage && (
          <ErrorCard error={parseProviderError(health.lastErrorMessage)} />
        )}

        {/* Spacer to push actions to bottom */}
        <Box flex="1" />

        {/* Actions */}
        <Flex justify="space-between" pt={2}>
          <HStack spacing={2}>
            <Switch isChecked={provider.isEnabled} colorScheme="green" isReadOnly size="sm" />
            <Text fontSize="xs" color="gray.500">
              {provider.isEnabled ? 'On' : 'Off'}
            </Text>
          </HStack>
          <Button
            size="sm"
            leftIcon={<FiRefreshCw />}
            variant="ghost"
            onClick={onResetCircuit}
            isDisabled={circuit === 'closed' && status === 'healthy'}
          >
            Reset
          </Button>
        </Flex>
      </VStack>
    </Card>
  );
}

/**
 * Structured Error Card Component
 */
interface ErrorCardProps {
  error: ParsedError;
}

function ErrorCard({ error }: ErrorCardProps) {
  const [showRaw, setShowRaw] = useState(false);
  const toast = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(`${error.code}: ${error.rawError}`);
    toast({
      title: 'Copied',
      description: 'Error details copied to clipboard',
      status: 'success',
      duration: 2000,
    });
  };

  // Consistent color scheme - red for errors, no brown/orange
  const isHighSeverity = error.severity === 'critical' || error.severity === 'high';

  return (
    <Box
      p={3}
      bg={isHighSeverity ? 'red.900' : 'gray.800'}
      borderRadius="md"
      borderLeft="4px solid"
      borderLeftColor={isHighSeverity ? 'red.400' : 'gray.500'}
    >
      {/* Header: Category + Severity */}
      <Flex justify="space-between" align="center" mb={2}>
        <Badge colorScheme="purple" fontSize="xs" variant="outline">
          {error.category.replace('_', ' ').toUpperCase()}
        </Badge>
        <Badge
          colorScheme={isHighSeverity ? 'red' : 'gray'}
          fontSize="2xs"
          textTransform="uppercase"
        >
          {error.severity}
        </Badge>
      </Flex>

      {/* Friendly Message */}
      <Text
        fontSize="sm"
        color={isHighSeverity ? 'red.200' : 'gray.300'}
        fontWeight="medium"
        mb={1}
      >
        {error.friendlyMessage}
      </Text>

      {/* Suggested Action */}
      <HStack spacing={1} mb={2}>
        <Text fontSize="xs" color="gray.400">
          Fix:
        </Text>
        <Text fontSize="xs" color="gray.300">
          {error.suggestedAction}
        </Text>
      </HStack>

      {/* Actions: Copy + Toggle Raw */}
      <Flex justify="space-between" align="center">
        <Button
          size="xs"
          variant="ghost"
          leftIcon={<FiCopy />}
          onClick={handleCopy}
          color="gray.400"
          _hover={{ color: 'white' }}
        >
          Copy
        </Button>
        <Button
          size="xs"
          variant="ghost"
          rightIcon={showRaw ? <FiChevronUp /> : <FiChevronDown />}
          onClick={() => setShowRaw(!showRaw)}
          color="gray.400"
          _hover={{ color: 'white' }}
        >
          {showRaw ? 'Hide' : 'Raw'}
        </Button>
      </Flex>

      {/* Collapsible Raw Error - Fixed max height */}
      {showRaw && (
        <Box
          mt={2}
          p={2}
          bg="blackAlpha.400"
          borderRadius="sm"
          fontFamily="mono"
          fontSize="2xs"
          color="gray.500"
          maxH="80px"
          overflowY="auto"
          whiteSpace="pre-wrap"
          wordBreak="break-all"
        >
          {error.rawError}
        </Box>
      )}
    </Box>
  );
}
