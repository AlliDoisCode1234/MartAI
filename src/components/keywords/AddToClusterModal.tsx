'use client';

/**
 * AddToClusterModal
 *
 * Component Hierarchy:
 * App -> Keywords -> KeywordsPage -> KeywordTable -> AddToClusterModal (this file)
 * App -> Keywords -> KeywordsPage -> KeywordClusters -> AddToClusterModal (this file)
 *
 * Shared modal for:
 * 1. Adding a keyword to an existing cluster (from keyword ⋮ menu)
 * 2. Creating a new cluster with 3+ keywords (from clusters tab button or inline)
 */

import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  VStack,
  HStack,
  Text,
  Box,
  Icon,
  useToast,
  Divider,
} from '@chakra-ui/react';
import { FiPlus, FiLayers, FiCheck } from 'react-icons/fi';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  /** If provided, the modal assigns this keyword to the selected/new cluster */
  keywordId?: string;
  /** If provided, shows the keyword name in the header */
  keywordText?: string;
};

function parseKeywords(raw: string): string[] {
  return raw
    .split(/[,\n]+/)
    .map((k) => k.trim())
    .filter(Boolean);
}

export function AddToClusterModal({ isOpen, onClose, projectId, keywordId, keywordText }: Props) {
  const [newClusterName, setNewClusterName] = useState('');
  const [keywordsInput, setKeywordsInput] = useState('');
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const toast = useToast();

  const clusters = useQuery(
    api.seo.keywordClusters.getClustersByProject,
    projectId ? { projectId: projectId as Id<'projects'> } : 'skip'
  );

  const createClusterMut = useMutation(api.seo.keywordClusters.createManualCluster);
  const assignKeywordMut = useMutation(api.seo.keywords.assignKeywordToCluster);

  const handleClose = () => {
    setNewClusterName('');
    setKeywordsInput('');
    setSelectedClusterId(null);
    setShowNewForm(false);
    setIsCreating(false);
    onClose();
  };

  const handleCreateCluster = async () => {
    if (!newClusterName.trim()) return;

    // Build the keywords list: textarea input + the keyword being assigned (if any)
    const parsedKeywords = parseKeywords(keywordsInput);
    const allKeywords = keywordText
      ? [...new Set([keywordText, ...parsedKeywords])]
      : parsedKeywords;

    if (allKeywords.length < 3) {
      toast({
        title: 'Need at least 3 keywords',
        description: keywordText
          ? `"${keywordText}" counts as 1. Add ${3 - allKeywords.length} more.`
          : 'Enter at least 3 keywords separated by commas or new lines.',
        status: 'warning',
        duration: 4000,
      });
      return;
    }

    setIsCreating(true);

    try {
      const clusterId = await createClusterMut({
        projectId: projectId as Id<'projects'>,
        clusterName: newClusterName.trim(),
        keywords: allKeywords,
      });

      // If we have a keyword, also set its clusterId FK
      if (keywordId && clusterId) {
        await assignKeywordMut({
          keywordId: keywordId as Id<'keywords'>,
          clusterId: clusterId as Id<'keywordClusters'>,
        });
      }

      toast({
        title: `Cluster "${newClusterName.trim()}" created`,
        description: `${allKeywords.length} keywords added`,
        status: 'success',
        duration: 3000,
      });
      handleClose();
    } catch (error) {
      toast({
        title: 'Failed to create cluster',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleAssignToExisting = async () => {
    if (!keywordId || !selectedClusterId) return;
    setIsCreating(true);

    try {
      await assignKeywordMut({
        keywordId: keywordId as Id<'keywords'>,
        clusterId: selectedClusterId as Id<'keywordClusters'>,
      });

      const cluster = clusters?.find((c) => c._id === selectedClusterId);
      toast({
        title: `Added to "${cluster?.clusterName ?? 'cluster'}"`,
        status: 'success',
        duration: 3000,
      });
      handleClose();
    } catch (error) {
      toast({
        title: 'Failed to assign keyword',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsCreating(false);
    }
  };

  const isAssignMode = !!keywordId;
  const hasClusters = clusters && clusters.length > 0;

  // Count keywords for the create form
  const parsedCount = parseKeywords(keywordsInput).length;
  const totalKeywords = keywordText ? parsedCount + 1 : parsedCount;
  const needMore = Math.max(0, 3 - totalKeywords);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size="md">
      <ModalOverlay bg="blackAlpha.700" />
      <ModalContent bg="#1e1640" border="1px solid rgba(255,255,255,0.1)">
        <ModalHeader color="white" fontSize="lg" pb={1}>
          {isAssignMode ? 'Add to Cluster' : 'New Cluster'}
          {keywordText && (
            <Text fontSize="sm" color="gray.400" fontWeight="normal" mt={1} noOfLines={1}>
              Keyword: {keywordText}
            </Text>
          )}
        </ModalHeader>
        <ModalCloseButton color="gray.500" _hover={{ color: 'white' }} />

        <ModalBody>
          <VStack spacing={3} align="stretch">
            {/* Existing clusters list (only in assign mode when clusters exist) */}
            {isAssignMode && hasClusters && !showNewForm && (
              <>
                <Text
                  fontSize="xs"
                  color="gray.500"
                  fontWeight="bold"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Select a cluster
                </Text>
                <Box
                  maxH="240px"
                  overflowY="auto"
                  borderRadius="md"
                  border="1px solid rgba(255,255,255,0.06)"
                  sx={{
                    '&::-webkit-scrollbar': { width: '4px' },
                    '&::-webkit-scrollbar-thumb': {
                      bg: 'rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                    },
                  }}
                >
                  {clusters.map((cluster) => (
                    <HStack
                      key={cluster._id}
                      px={3}
                      py={2.5}
                      cursor="pointer"
                      bg={
                        selectedClusterId === cluster._id ? 'rgba(249,159,42,0.12)' : 'transparent'
                      }
                      borderBottom="1px solid rgba(255,255,255,0.04)"
                      _hover={{ bg: 'rgba(255,255,255,0.04)' }}
                      onClick={() => setSelectedClusterId(cluster._id)}
                      transition="background 0.15s"
                    >
                      <Icon
                        as={selectedClusterId === cluster._id ? FiCheck : FiLayers}
                        color={selectedClusterId === cluster._id ? '#F99F2A' : 'gray.500'}
                        boxSize={4}
                      />
                      <VStack align="start" spacing={0} flex={1}>
                        <Text
                          fontSize="sm"
                          color={selectedClusterId === cluster._id ? 'white' : 'gray.300'}
                        >
                          {cluster.clusterName}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {cluster.keywords.length} keyword
                          {cluster.keywords.length !== 1 ? 's' : ''}
                        </Text>
                      </VStack>
                    </HStack>
                  ))}
                </Box>

                <Divider borderColor="rgba(255,255,255,0.08)" />
              </>
            )}

            {/* Create new cluster section */}
            {(!isAssignMode || showNewForm || !hasClusters) && (
              <>
                <Text
                  fontSize="xs"
                  color="gray.500"
                  fontWeight="bold"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Cluster name
                </Text>
                <Input
                  placeholder="e.g. Content Marketing Strategy"
                  value={newClusterName}
                  onChange={(e) => setNewClusterName(e.target.value)}
                  bg="#1a1230"
                  border="1px solid rgba(255,255,255,0.1)"
                  color="white"
                  fontSize="sm"
                  _placeholder={{ color: 'gray.500' }}
                  _hover={{ borderColor: 'rgba(255,255,255,0.2)' }}
                  _focus={{ borderColor: '#F99F2A', boxShadow: '0 0 0 1px #F99F2A' }}
                  autoFocus
                />

                <HStack justify="space-between" align="baseline">
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Keywords
                  </Text>
                  <Text fontSize="xs" color={totalKeywords >= 3 ? '#34d399' : 'gray.500'}>
                    {totalKeywords}/3 min
                    {keywordText && ` (includes "${keywordText}")`}
                  </Text>
                </HStack>
                <Textarea
                  placeholder={
                    'Enter keywords separated by commas or new lines\ne.g. content strategy, blog optimization, topic clusters'
                  }
                  value={keywordsInput}
                  onChange={(e) => setKeywordsInput(e.target.value)}
                  bg="#1a1230"
                  border="1px solid rgba(255,255,255,0.1)"
                  color="white"
                  fontSize="sm"
                  rows={4}
                  resize="vertical"
                  _placeholder={{ color: 'gray.500' }}
                  _hover={{ borderColor: 'rgba(255,255,255,0.2)' }}
                  _focus={{ borderColor: '#F99F2A', boxShadow: '0 0 0 1px #F99F2A' }}
                />
                {needMore > 0 && keywordsInput.length > 0 && (
                  <Text fontSize="xs" color="#F99F2A">
                    Add {needMore} more keyword{needMore !== 1 ? 's' : ''} to create a cluster
                  </Text>
                )}
              </>
            )}

            {/* Toggle to show new cluster form when in assign mode */}
            {isAssignMode && hasClusters && !showNewForm && (
              <Button
                variant="ghost"
                size="sm"
                color="gray.400"
                leftIcon={<FiPlus />}
                _hover={{ color: '#F99F2A', bg: 'rgba(249,159,42,0.08)' }}
                onClick={() => {
                  setShowNewForm(true);
                  setSelectedClusterId(null);
                }}
                justifyContent="flex-start"
              >
                Create new cluster instead
              </Button>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter pt={2}>
          <Button
            variant="ghost"
            color="gray.400"
            _hover={{ color: 'white' }}
            onClick={handleClose}
            mr={2}
          >
            Cancel
          </Button>

          {/* Primary action depends on context */}
          {showNewForm || !isAssignMode || !hasClusters ? (
            <Button
              bg="#F99F2A"
              color="white"
              _hover={{ bg: '#e8901f' }}
              isLoading={isCreating}
              isDisabled={!newClusterName.trim() || totalKeywords < 3}
              onClick={handleCreateCluster}
              leftIcon={<FiPlus />}
            >
              Create Cluster
            </Button>
          ) : (
            <Button
              bg="#F99F2A"
              color="white"
              _hover={{ bg: '#e8901f' }}
              isLoading={isCreating}
              isDisabled={!selectedClusterId}
              onClick={handleAssignToExisting}
              leftIcon={<FiLayers />}
            >
              Add to Cluster
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
