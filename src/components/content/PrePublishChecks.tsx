'use client';

/**
 * Component Hierarchy:
 * app/article/[id]/page.tsx
 *   └── ArticleEditor
 *       └── PrePublishChecks (this file)
 */

import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Progress,
  Icon,
  Box,
  Divider,
  Collapse,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
  Tooltip,
} from '@chakra-ui/react';
import {
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiChevronDown,
  FiChevronUp,
  FiShield,
  FiCpu,
  FiBook,
  FiSend,
} from 'react-icons/fi';
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import {
  getPlagiarismLabel,
  getAiScoreLabel,
  getReadabilityLabel,
  getOverallCheckStatus,
} from '@/src/lib/copyStrings';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPublish: () => void;
  draftId: Id<'drafts'>;
  briefId?: Id<'briefs'>;
  projectId: Id<'projects'>;
  content: string;
}

interface CheckResult {
  plagiarismScore: number;
  aiScore: number;
  readabilityScore?: number;
  status: 'pass' | 'warning' | 'fail';
  details?: {
    flaggedSentences?: { text: string; aiProbability: number }[];
    plagiarismMatches?: { text: string; source: string; matchPercentage: number }[];
  };
  provider: string;
}

export function PrePublishChecks({
  isOpen,
  onClose,
  onPublish,
  draftId,
  briefId,
  projectId,
  content,
}: Props) {
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runCheck = useAction(api.content.contentChecks.runAndStoreCheck);

  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleRunCheck = async () => {
    setIsChecking(true);
    setError(null);

    try {
      const checkResult = await runCheck({
        draftId,
        briefId,
        projectId,
        content,
      });
      setResult(checkResult);
    } catch (err) {
      console.error('Check failed:', err);
      setError('Failed to run quality check. You can still publish.');
    } finally {
      setIsChecking(false);
    }
  };

  const handlePublish = () => {
    onPublish();
    onClose();
  };

  const getStatusIcon = (status: 'pass' | 'warning' | 'fail') => {
    switch (status) {
      case 'pass':
        return FiCheckCircle;
      case 'warning':
        return FiAlertTriangle;
      case 'fail':
        return FiXCircle;
    }
  };

  const getStatusColor = (status: 'pass' | 'warning' | 'fail') => {
    switch (status) {
      case 'pass':
        return 'green';
      case 'warning':
        return 'orange';
      case 'fail':
        return 'red';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <Icon as={FiShield} color="purple.500" />
            <Text>Pre-Publish Quality Check</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Not checked yet */}
            {!result && !isChecking && !error && (
              <VStack spacing={4} py={4}>
                <Text color="gray.600" textAlign="center">
                  Before publishing, we&apos;ll check your content for:
                </Text>
                <VStack align="start" spacing={2} w="full" px={4}>
                  <HStack>
                    <Icon as={FiShield} color="blue.500" />
                    <Text fontSize="sm">Plagiarism - Is it original?</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCpu} color="purple.500" />
                    <Text fontSize="sm">AI Detection - Does it read naturally?</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiBook} color="green.500" />
                    <Text fontSize="sm">Readability - Is it easy to understand?</Text>
                  </HStack>
                </VStack>
                <Button
                  colorScheme="purple"
                  size="lg"
                  onClick={handleRunCheck}
                  leftIcon={<FiShield />}
                >
                  Run Quality Check
                </Button>
              </VStack>
            )}

            {/* Loading */}
            {isChecking && (
              <VStack spacing={4} py={8}>
                <Spinner size="xl" color="purple.500" thickness="4px" />
                <Text color="gray.600">Analyzing your content...</Text>
                <Text fontSize="sm" color="gray.400">
                  This usually takes 5-10 seconds
                </Text>
              </VStack>
            )}

            {/* Error */}
            {error && (
              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Results */}
            {result && (
              <VStack spacing={4} align="stretch">
                {/* Overall Status */}
                <Box
                  p={4}
                  bg={cardBg}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <HStack justify="space-between">
                    <HStack spacing={3}>
                      <Icon
                        as={getStatusIcon(result.status)}
                        color={`${getStatusColor(result.status)}.500`}
                        boxSize={8}
                      />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold" fontSize="lg">
                          {getOverallCheckStatus(result.status).label}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {getOverallCheckStatus(result.status).description}
                        </Text>
                      </VStack>
                    </HStack>
                    <Badge colorScheme={getStatusColor(result.status)} fontSize="md" px={3} py={1}>
                      {result.status.toUpperCase()}
                    </Badge>
                  </HStack>
                </Box>

                {/* Individual Scores */}
                <VStack spacing={3} align="stretch">
                  {/* Plagiarism */}
                  <Box p={3} bg={cardBg} borderRadius="md">
                    <HStack justify="space-between" mb={2}>
                      <HStack>
                        <Icon as={FiShield} color="blue.500" />
                        <Text fontWeight="medium">Originality</Text>
                      </HStack>
                      <Tooltip label={getPlagiarismLabel(result.plagiarismScore).description}>
                        <Badge colorScheme={getPlagiarismLabel(result.plagiarismScore).color}>
                          {getPlagiarismLabel(result.plagiarismScore).label}
                        </Badge>
                      </Tooltip>
                    </HStack>
                    <Progress
                      value={result.plagiarismScore}
                      colorScheme={getPlagiarismLabel(result.plagiarismScore).color}
                      size="sm"
                      borderRadius="full"
                    />
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      {result.plagiarismScore}% unique content
                    </Text>
                  </Box>

                  {/* AI Detection */}
                  <Box p={3} bg={cardBg} borderRadius="md">
                    <HStack justify="space-between" mb={2}>
                      <HStack>
                        <Icon as={FiCpu} color="purple.500" />
                        <Text fontWeight="medium">Human-like</Text>
                      </HStack>
                      <Tooltip label={getAiScoreLabel(result.aiScore).description}>
                        <Badge colorScheme={getAiScoreLabel(result.aiScore).color}>
                          {getAiScoreLabel(result.aiScore).label}
                        </Badge>
                      </Tooltip>
                    </HStack>
                    <Progress
                      value={100 - result.aiScore}
                      colorScheme={getAiScoreLabel(result.aiScore).color}
                      size="sm"
                      borderRadius="full"
                    />
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      {100 - result.aiScore}% human-like ({result.aiScore}% AI patterns)
                    </Text>
                  </Box>

                  {/* Readability (if available) */}
                  {result.readabilityScore !== undefined && (
                    <Box p={3} bg={cardBg} borderRadius="md">
                      <HStack justify="space-between" mb={2}>
                        <HStack>
                          <Icon as={FiBook} color="green.500" />
                          <Text fontWeight="medium">Readability</Text>
                        </HStack>
                        <Tooltip label={getReadabilityLabel(result.readabilityScore).description}>
                          <Badge colorScheme={getReadabilityLabel(result.readabilityScore).color}>
                            {getReadabilityLabel(result.readabilityScore).label}
                          </Badge>
                        </Tooltip>
                      </HStack>
                      <Progress
                        value={result.readabilityScore}
                        colorScheme={getReadabilityLabel(result.readabilityScore).color}
                        size="sm"
                        borderRadius="full"
                      />
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        Score: {result.readabilityScore}/100
                      </Text>
                    </Box>
                  )}
                </VStack>

                {/* Details Toggle */}
                {(result.details?.flaggedSentences?.length ||
                  result.details?.plagiarismMatches?.length) && (
                  <>
                    <Divider />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDetails(!showDetails)}
                      rightIcon={showDetails ? <FiChevronUp /> : <FiChevronDown />}
                    >
                      {showDetails ? 'Hide Details' : 'Show Details'}
                    </Button>
                    <Collapse in={showDetails}>
                      <VStack align="stretch" spacing={2} fontSize="sm">
                        {result.details?.flaggedSentences?.map((s, i) => (
                          <Box key={i} p={2} bg="orange.50" borderRadius="md">
                            <Text color="orange.700">&quot;{s.text}&quot;</Text>
                            <Text fontSize="xs" color="orange.500">
                              {s.aiProbability}% AI-like
                            </Text>
                          </Box>
                        ))}
                        {result.details?.plagiarismMatches?.map((m, i) => (
                          <Box key={i} p={2} bg="red.50" borderRadius="md">
                            <Text color="red.700">&quot;{m.text}&quot;</Text>
                            <Text fontSize="xs" color="red.500">
                              {m.matchPercentage}% match from {m.source}
                            </Text>
                          </Box>
                        ))}
                      </VStack>
                    </Collapse>
                  </>
                )}
              </VStack>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            {result && (
              <Button
                colorScheme={result.status === 'fail' ? 'orange' : 'green'}
                leftIcon={<FiSend />}
                onClick={handlePublish}
              >
                {result.status === 'fail' ? 'Publish Anyway' : 'Publish'}
              </Button>
            )}
            {error && (
              <Button colorScheme="orange" leftIcon={<FiSend />} onClick={handlePublish}>
                Publish Anyway
              </Button>
            )}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
