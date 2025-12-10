/**
 * KeywordSourceModal Component
 *
 * Component Hierarchy:
 * App → StrategyPage → KeywordSourceModal
 *
 * Modal for Stage 1 of Strategy flow.
 * Offers two paths: Import from GSC or Add Keywords Manually.
 */

'use client';

import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  VStack,
  HStack,
  Button,
  Text,
  Icon,
  Box,
  Textarea,
  Badge,
  useColorModeValue,
  Alert,
  AlertIcon,
  Divider,
  Spinner,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiDatabase, FiEdit3, FiCheck, FiAlertCircle, FiArrowRight, FiLink } from 'react-icons/fi';

const MotionBox = motion(Box);

interface Props {
  isOpen: boolean;
  onClose: () => void;
  hasGSC: boolean;
  gscSiteUrl?: string;
  onImportFromGSC: () => Promise<void>;
  onAddManually: (keywords: string[]) => Promise<void>;
  isLoading?: boolean;
  existingKeywordCount?: number;
}

type Mode = 'select' | 'manual';

export function KeywordSourceModal({
  isOpen,
  onClose,
  hasGSC,
  gscSiteUrl,
  onImportFromGSC,
  onAddManually,
  isLoading = false,
  existingKeywordCount = 0,
}: Props) {
  const [mode, setMode] = useState<Mode>('select');
  const [manualKeywords, setManualKeywords] = useState('');
  const [importing, setImporting] = useState(false);

  const cardBg = useColorModeValue('white', 'gray.700');
  const cardHoverBg = useColorModeValue('gray.50', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleImportGSC = async () => {
    setImporting(true);
    try {
      await onImportFromGSC();
      onClose();
    } finally {
      setImporting(false);
    }
  };

  const handleAddManually = async () => {
    const keywords = manualKeywords
      .split('\n')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    if (keywords.length === 0) return;

    setImporting(true);
    try {
      await onAddManually(keywords);
      setManualKeywords('');
      setMode('select');
      onClose();
    } finally {
      setImporting(false);
    }
  };

  const parsedKeywords = manualKeywords
    .split('\n')
    .map((k) => k.trim())
    .filter((k) => k.length > 0);

  const handleClose = () => {
    setMode('select');
    setManualKeywords('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent borderRadius="xl" overflow="hidden">
        <ModalHeader borderBottom="1px" borderColor={borderColor}>
          <HStack>
            <Icon as={FiDatabase} color="brand.orange" />
            <Text>Add Keywords</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody py={6}>
          {mode === 'select' ? (
            <VStack spacing={4} align="stretch">
              {existingKeywordCount > 0 && (
                <Alert status="info" borderRadius="lg">
                  <AlertIcon />
                  <Text fontSize="sm">
                    You have {existingKeywordCount} keywords already. Add more to improve
                    clustering.
                  </Text>
                </Alert>
              )}

              <Text color="gray.600" fontSize="sm">
                Choose how you want to add keywords to your strategy:
              </Text>

              {/* GSC Import Option */}
              <MotionBox
                as="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={hasGSC ? handleImportGSC : undefined}
                disabled={!hasGSC || importing}
                p={4}
                bg={cardBg}
                borderRadius="lg"
                border="2px"
                borderColor={hasGSC ? 'brand.orange' : borderColor}
                textAlign="left"
                cursor={hasGSC ? 'pointer' : 'not-allowed'}
                opacity={hasGSC ? 1 : 0.6}
                _hover={hasGSC ? { bg: cardHoverBg } : undefined}
                position="relative"
              >
                <HStack justify="space-between">
                  <HStack spacing={3}>
                    <Box p={2} borderRadius="md" bg="orange.100">
                      <Icon as={FiLink} color="orange.600" boxSize={5} />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <HStack>
                        <Text fontWeight="bold">Import from Google Search Console</Text>
                        {hasGSC && (
                          <Badge colorScheme="green" fontSize="xs">
                            Connected
                          </Badge>
                        )}
                      </HStack>
                      <Text fontSize="sm" color="gray.500">
                        {hasGSC
                          ? `Import keywords from ${gscSiteUrl || 'your site'}`
                          : 'Connect GSC first to use this option'}
                      </Text>
                    </VStack>
                  </HStack>
                  {importing ? (
                    <Spinner size="sm" color="brand.orange" />
                  ) : hasGSC ? (
                    <Icon as={FiArrowRight} color="brand.orange" />
                  ) : (
                    <Icon as={FiAlertCircle} color="gray.400" />
                  )}
                </HStack>
              </MotionBox>

              {/* Manual Entry Option */}
              <MotionBox
                as="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setMode('manual')}
                p={4}
                bg={cardBg}
                borderRadius="lg"
                border="2px"
                borderColor={borderColor}
                textAlign="left"
                cursor="pointer"
                _hover={{ bg: cardHoverBg, borderColor: 'blue.300' }}
              >
                <HStack justify="space-between">
                  <HStack spacing={3}>
                    <Box p={2} borderRadius="md" bg="blue.100">
                      <Icon as={FiEdit3} color="blue.600" boxSize={5} />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="bold">Add Keywords Manually</Text>
                      <Text fontSize="sm" color="gray.500">
                        Paste or type your target keywords
                      </Text>
                    </VStack>
                  </HStack>
                  <Icon as={FiArrowRight} color="gray.400" />
                </HStack>
              </MotionBox>

              {!hasGSC && (
                <Alert status="warning" borderRadius="lg" fontSize="sm">
                  <AlertIcon />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium">GSC not connected</Text>
                    <Text>
                      Connect Google Search Console in{' '}
                      <Text as="span" color="blue.500" cursor="pointer">
                        Settings → Integrations
                      </Text>{' '}
                      to import keywords automatically.
                    </Text>
                  </VStack>
                </Alert>
              )}
            </VStack>
          ) : (
            /* Manual Entry Mode */
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Text fontWeight="medium">Enter Keywords</Text>
                <Button size="sm" variant="ghost" onClick={() => setMode('select')}>
                  ← Back
                </Button>
              </HStack>

              <Text fontSize="sm" color="gray.500">
                Enter one keyword per line. Aim for at least 10 keywords for effective clustering.
              </Text>

              <Textarea
                value={manualKeywords}
                onChange={(e) => setManualKeywords(e.target.value)}
                placeholder={`best seo tools for small business
how to improve google rankings
local seo tips
content marketing strategy
keyword research tools`}
                rows={8}
                fontFamily="mono"
                fontSize="sm"
              />

              <HStack justify="space-between">
                <Badge colorScheme={parsedKeywords.length >= 10 ? 'green' : 'yellow'}>
                  {parsedKeywords.length} keywords
                </Badge>
                {parsedKeywords.length < 10 && (
                  <Text fontSize="xs" color="gray.500">
                    Add {10 - parsedKeywords.length} more for best results
                  </Text>
                )}
              </HStack>
            </VStack>
          )}
        </ModalBody>

        {mode === 'manual' && (
          <ModalFooter borderTop="1px" borderColor={borderColor}>
            <HStack spacing={3}>
              <Button variant="ghost" onClick={() => setMode('select')}>
                Cancel
              </Button>
              <Button
                bg="brand.orange"
                color="white"
                _hover={{ bg: '#E8851A' }}
                onClick={handleAddManually}
                isLoading={importing}
                isDisabled={parsedKeywords.length === 0}
                leftIcon={<Icon as={FiCheck} />}
              >
                Add {parsedKeywords.length} Keywords
              </Button>
            </HStack>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
