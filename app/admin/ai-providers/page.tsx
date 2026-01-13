'use client';

/**
 * Component Hierarchy:
 * app/admin/layout.tsx
 * └── app/admin/ai-providers/page.tsx (this file)
 *     └── ProviderCard
 *     └── HealthMetrics
 */

import { useQuery, useMutation } from 'convex/react';
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
} from 'react-icons/fi';

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

export default function AIProvidersPage({}: Props) {
  const providers = useQuery(api.ai.health.circuitBreaker.getAllProviderHealth, {});
  const resetHealth = useMutation(api.ai.health.circuitBreaker.resetHealth);
  const toast = useToast();

  const handleResetCircuit = async (providerId: Id<'aiProviders'>, name: string) => {
    try {
      await resetHealth({ providerId });
      toast({
        title: 'Circuit Reset',
        description: `${name} health metrics have been reset.`,
        status: 'success',
        duration: 3000,
      });
    } catch (err: any) {
      toast({
        title: 'Reset Failed',
        description: err.message,
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

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg">AI Providers</Heading>
          <Text color="gray.500">Multi-agent failover infrastructure</Text>
        </Box>
        <HStack>
          <Badge colorScheme="green" fontSize="sm" px={3} py={1}>
            {providers.filter((p: any) => p.health?.status === 'healthy').length} Healthy
          </Badge>
          <Badge colorScheme="yellow" fontSize="sm" px={3} py={1}>
            {providers.filter((p: any) => p.health?.circuitState === 'open').length} Circuit Open
          </Badge>
        </HStack>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {providers.map((provider: ProviderData) => (
          <ProviderCard
            key={provider._id}
            provider={provider}
            onResetCircuit={() => handleResetCircuit(provider._id, provider.displayName)}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}

interface ProviderCardProps {
  provider: ProviderData;
  onResetCircuit: () => void;
}

function ProviderCard({ provider, onResetCircuit }: ProviderCardProps) {
  const health = provider.health;

  const statusConfig: Record<ProviderStatus, { color: string; icon: typeof FiCheckCircle }> = {
    healthy: { color: 'green', icon: FiCheckCircle },
    degraded: { color: 'yellow', icon: FiAlertTriangle },
    unhealthy: { color: 'red', icon: FiAlertCircle },
    circuit_open: { color: 'red', icon: FiSlash },
    unknown: { color: 'gray', icon: FiAlertCircle },
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

  return (
    <Card p={5} borderRadius="xl" boxShadow="md" bg="whiteAlpha.50">
      <VStack align="stretch" spacing={4}>
        {/* Header */}
        <Flex justify="space-between" align="center">
          <HStack>
            <Icon as={StatusIcon} color={`${color}.400`} boxSize={5} />
            <Heading size="md">{provider.displayName}</Heading>
          </HStack>
          <Badge colorScheme={color}>{status.replace('_', ' ').toUpperCase()}</Badge>
        </Flex>

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

        {/* Last Error */}
        {health?.lastErrorMessage && (
          <Box p={2} bg="red.900" borderRadius="md">
            <Text fontSize="xs" color="red.300" noOfLines={2}>
              {health.lastErrorMessage}
            </Text>
          </Box>
        )}

        {/* Actions */}
        <Flex justify="space-between" pt={2}>
          <Tooltip label={provider.isEnabled ? 'Enabled' : 'Disabled'}>
            <Switch isChecked={provider.isEnabled} colorScheme="green" isReadOnly />
          </Tooltip>
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
