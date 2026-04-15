'use client';

/**
 * KeywordClusters
 *
 * Component Hierarchy:
 * App -> Keywords -> KeywordsPage -> KeywordClusters (this file)
 *
 * Cluster table matching keyword library styling.
 * Columns: Select, Cluster Name, Keywords, Intent, Difficulty, Volume Range,
 *          Impact, Status, CTA, Actions (⋮)
 * Features: Row ⋮ menu (Delete, Status), bulk select + delete, Create Content CTA.
 */

import { useState, useRef } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  HStack,
  VStack,
  Badge,
  Button,
  Icon,
  Tooltip,
  useToast,
  Spinner,
  Checkbox,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
} from '@chakra-ui/react';
import { useQuery, useAction, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useProjectContext } from '@/src/providers/ProjectProvider';
import { FiLayers, FiEdit3, FiTrendingUp, FiMoreVertical, FiTrash2, FiPlus } from 'react-icons/fi';
import { Id } from '@/convex/_generated/dataModel';
import { IntentBadge } from '@/src/components/keywords/IntentBadge';
import { AddToClusterModal } from './AddToClusterModal';

const thStyle = {
  color: 'gray.500',
  borderColor: 'rgba(255,255,255,0.06)',
  fontSize: '10px',
  fontWeight: 'bold',
  textTransform: 'uppercase' as const,
  letterSpacing: 'wider',
  py: 3,
};

export function KeywordClusters({ projectId: propProjectId }: { projectId?: string }) {
  const { projectId: hookProjectId } = useProjectContext();
  const projectId = propProjectId || hookProjectId;
  
  const toast = useToast();

  const clusters = useQuery(
    api.seo.keywordClusters.getClustersByProject,
    projectId ? { projectId: projectId as Id<'projects'> } : 'skip'
  );

  const generateContent = useAction(api.contentGeneration.generateContent);
  const deleteClusterMut = useMutation(api.seo.keywordClusters.deleteCluster);

  const [generatingClusterId, setGeneratingClusterId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const allSelected = clusters && clusters.length > 0 && selectedIds.length === clusters.length;

  function toggleAll() {
    if (!clusters) return;
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(clusters.map((c: NonNullable<typeof clusters>[number]) => c._id));
    }
  }

  function toggleOne(id: string) {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((s) => s !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  }

  const handleDeleteCluster = async (clusterId: string) => {
    try {
      await deleteClusterMut({ clusterId: clusterId as Id<'keywordClusters'> });
      setSelectedIds((prev) => prev.filter((id) => id !== clusterId));
      toast({
        title: 'Cluster deleted',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedIds) {
        await deleteClusterMut({ clusterId: id as Id<'keywordClusters'> });
      }
      toast({
        title: `Deleted ${selectedIds.length} cluster${selectedIds.length > 1 ? 's' : ''}`,
        status: 'success',
        duration: 3000,
      });
      setSelectedIds([]);
    } catch (error) {
      toast({
        title: 'Bulk delete failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
      });
    }
    onClose();
  };

  const handleCreateContent = async (cluster: NonNullable<typeof clusters>[number]) => {
    if (!projectId) return;
    setGeneratingClusterId(cluster._id);
    try {
      await generateContent({
        projectId: projectId as Id<'projects'>,
        contentType: 'blog',
        title: cluster.clusterName,
        keywords: cluster.keywords,
        clusterId: cluster._id as Id<'keywordClusters'>,
      });
      toast({
        title: 'Content created',
        description: `Draft generated for "${cluster.clusterName}"`,
        status: 'success',
        duration: 4000,
      });
    } catch (error) {
      toast({
        title: 'Generation failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setGeneratingClusterId(null);
    }
  };

  if (!clusters) {
    return (
      <VStack py={12} spacing={4}>
        <Spinner color="#F99F2A" size="lg" />
        <Text color="gray.500" fontSize="sm">
          Loading clusters...
        </Text>
      </VStack>
    );
  }

  if (clusters.length === 0) {
    return (
      <VStack spacing={6} py={16} align="center">
        <Icon as={FiLayers} boxSize={12} color="#F99F2A" opacity={0.5} />
        <VStack spacing={2}>
          <Text color="white" fontSize="xl" fontWeight="bold">
            No Clusters Yet
          </Text>
          <Text color="gray.400" fontSize="sm" maxW="420px" textAlign="center">
            Group related keywords into topic clusters to plan content strategy and maximize topical
            authority.
          </Text>
        </VStack>
        <Button
          bg="#F99F2A"
          color="white"
          size="sm"
          _hover={{ bg: '#e8901f' }}
          leftIcon={<FiPlus />}
          onClick={() => setShowCreateModal(true)}
        >
          New Cluster
        </Button>
        <AddToClusterModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          projectId={projectId as string}
        />
      </VStack>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Header row */}
      <HStack justify="space-between">
        <HStack spacing={2}>
          <Icon as={FiLayers} color="#F99F2A" boxSize={5} />
          <Text color="white" fontSize="lg" fontWeight="bold">
            {clusters.length} Cluster{clusters.length !== 1 ? 's' : ''}
          </Text>
        </HStack>
        <Button
          size="sm"
          bg="#F99F2A"
          color="white"
          _hover={{ bg: '#e8901f' }}
          leftIcon={<FiPlus />}
          onClick={() => setShowCreateModal(true)}
        >
          New Cluster
        </Button>
      </HStack>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <Box
          bg="rgba(239, 68, 68, 0.08)"
          border="1px solid rgba(239, 68, 68, 0.2)"
          borderRadius="lg"
          px={4}
          py={2}
        >
          <HStack justify="space-between">
            <Text color="gray.300" fontSize="sm">
              {selectedIds.length} cluster{selectedIds.length > 1 ? 's' : ''} selected
            </Text>
            <HStack spacing={2}>
              <Button
                size="xs"
                variant="ghost"
                color="gray.400"
                _hover={{ color: 'white' }}
                onClick={() => setSelectedIds([])}
              >
                Clear
              </Button>
              <Button
                size="xs"
                leftIcon={<FiTrash2 />}
                bg="rgba(239, 68, 68, 0.15)"
                color="#ef4444"
                border="1px solid rgba(239, 68, 68, 0.3)"
                _hover={{ bg: 'rgba(239, 68, 68, 0.25)' }}
                onClick={onOpen}
              >
                Delete Selected
              </Button>
            </HStack>
          </HStack>
        </Box>
      )}

      {/* Table */}
      <Box
        bg="#1a1230"
        borderRadius="xl"
        border="1px solid rgba(255,255,255,0.06)"
        overflowX="auto"
      >
        <Table variant="unstyled" size="sm">
          <Thead>
            <Tr borderBottom="1px solid rgba(255,255,255,0.06)">
              <Th {...thStyle} w="40px">
                <Checkbox
                  isChecked={!!allSelected}
                  isIndeterminate={selectedIds.length > 0 && !allSelected}
                  onChange={toggleAll}
                  borderColor="gray.600"
                  sx={{ '[data-checked] > span': { bg: '#F99F2A', borderColor: '#F99F2A' } }}
                />
              </Th>
              <Th {...thStyle}>Cluster</Th>
              <Th {...thStyle} isNumeric>
                Keywords
              </Th>
              <Th {...thStyle}>Intent</Th>
              <Th {...thStyle} isNumeric>
                Difficulty
              </Th>
              <Th {...thStyle} isNumeric>
                Volume Range
              </Th>
              <Th {...thStyle} isNumeric>
                Impact
              </Th>
              <Th {...thStyle}>Status</Th>
              <Th {...thStyle} />
              <Th {...thStyle} w="40px" />
            </Tr>
          </Thead>
          <Tbody>
            {clusters.map((cluster: NonNullable<typeof clusters>[number]) => {
              const isGenerating = generatingClusterId === cluster._id;
              return (
                <Tr
                  key={cluster._id}
                  borderBottom="1px solid rgba(255,255,255,0.04)"
                  _hover={{ bg: 'rgba(255,255,255,0.03)' }}
                  transition="background 0.15s"
                >
                  {/* Checkbox */}
                  <Td borderColor="transparent" py={3}>
                    <Checkbox
                      isChecked={selectedIds.includes(cluster._id)}
                      onChange={() => toggleOne(cluster._id)}
                      borderColor="gray.600"
                      sx={{ '[data-checked] > span': { bg: '#F99F2A', borderColor: '#F99F2A' } }}
                    />
                  </Td>

                  {/* Cluster Name */}
                  <Td borderColor="transparent" py={3} maxW="260px">
                    <VStack align="start" spacing={0.5}>
                      <Text color="white" fontSize="sm" fontWeight="medium" noOfLines={1}>
                        {cluster.clusterName}
                      </Text>
                      <Text color="gray.600" fontSize="xs" noOfLines={1}>
                        {cluster.keywords.slice(0, 3).join(', ')}
                        {cluster.keywords.length > 3 && ` +${cluster.keywords.length - 3}`}
                      </Text>
                    </VStack>
                  </Td>

                  {/* Keywords Count */}
                  <Td borderColor="transparent" py={3} isNumeric>
                    <Badge
                      bg="rgba(96,165,250,0.2)"
                      color="#60a5fa"
                      fontSize="xs"
                      fontWeight="bold"
                      px={2}
                      py={0.5}
                      borderRadius="4px"
                    >
                      {cluster.keywords.length}
                    </Badge>
                  </Td>

                  {/* Intent */}
                  <Td borderColor="transparent" py={3}>
                    <IntentBadge intent={cluster.intent} />
                  </Td>

                  {/* Difficulty */}
                  <Td borderColor="transparent" py={3} isNumeric>
                    <Text
                      color={getDifficultyColor(cluster.difficulty)}
                      fontSize="sm"
                      fontWeight="medium"
                    >
                      {cluster.difficulty}/100
                    </Text>
                  </Td>

                  {/* Volume Range */}
                  <Td borderColor="transparent" py={3} isNumeric>
                    <Text color="gray.300" fontSize="sm">
                      {cluster.volumeRange.min.toLocaleString()} -{' '}
                      {cluster.volumeRange.max.toLocaleString()}
                    </Text>
                  </Td>

                  {/* Impact Score */}
                  <Td borderColor="transparent" py={3} isNumeric>
                    <HStack spacing={1} justify="flex-end">
                      <Icon
                        as={FiTrendingUp}
                        color={getImpactColor(cluster.impactScore)}
                        boxSize={3}
                      />
                      <Text
                        color={getImpactColor(cluster.impactScore)}
                        fontSize="sm"
                        fontWeight="bold"
                      >
                        {cluster.impactScore}
                      </Text>
                    </HStack>
                  </Td>

                  {/* Status */}
                  <Td borderColor="transparent" py={3}>
                    <StatusBadge status={cluster.status} />
                  </Td>

                  {/* Create Content CTA */}
                  <Td borderColor="transparent" py={3}>
                    <Tooltip
                      label="Generate a blog post from this cluster"
                      hasArrow
                      bg="gray.800"
                      color="gray.200"
                      fontSize="xs"
                    >
                      <Button
                        size="xs"
                        leftIcon={isGenerating ? <Spinner size="xs" /> : <FiEdit3 />}
                        bg="rgba(249,159,42,0.15)"
                        color="#F99F2A"
                        border="1px solid rgba(249,159,42,0.3)"
                        _hover={{ bg: 'rgba(249,159,42,0.25)' }}
                        borderRadius="md"
                        fontSize="xs"
                        fontWeight="semibold"
                        isDisabled={isGenerating}
                        onClick={() => handleCreateContent(cluster)}
                      >
                        {isGenerating ? 'Generating...' : 'Create Content'}
                      </Button>
                    </Tooltip>
                  </Td>

                  {/* Actions ⋮ menu */}
                  <Td borderColor="transparent" py={3}>
                    <Menu placement="bottom-end">
                      <MenuButton
                        as={IconButton}
                        icon={<FiMoreVertical />}
                        variant="ghost"
                        size="xs"
                        color="gray.500"
                        _hover={{ color: 'white', bg: 'rgba(255,255,255,0.08)' }}
                        aria-label="Cluster actions"
                      />
                      <MenuList
                        bg="#1e1640"
                        borderColor="rgba(255,255,255,0.1)"
                        boxShadow="lg"
                        minW="160px"
                        py={1}
                      >
                        <MenuItem
                          icon={<FiTrash2 />}
                          fontSize="sm"
                          color="#ef4444"
                          bg="transparent"
                          _hover={{ bg: 'rgba(239,68,68,0.1)' }}
                          onClick={() => handleDeleteCluster(cluster._id)}
                        >
                          Delete Cluster
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>

      {/* Bulk Delete Confirm Dialog */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
        <AlertDialogOverlay bg="blackAlpha.700">
          <AlertDialogContent bg="#1e1640" border="1px solid rgba(255,255,255,0.1)">
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="white">
              Delete {selectedIds.length} Cluster{selectedIds.length > 1 ? 's' : ''}
            </AlertDialogHeader>
            <AlertDialogBody color="gray.400">
              This action cannot be undone. The selected clusters and their keyword groupings will
              be permanently removed.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onClose}
                variant="ghost"
                color="gray.400"
                _hover={{ color: 'white' }}
              >
                Cancel
              </Button>
              <Button
                bg="#ef4444"
                color="white"
                _hover={{ bg: '#dc2626' }}
                onClick={handleBulkDelete}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Create Cluster Modal */}
      <AddToClusterModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        projectId={projectId as string}
      />
    </VStack>
  );
}

function getDifficultyColor(d: number): string {
  if (d <= 30) return '#34d399';
  if (d <= 60) return '#F99F2A';
  return '#ef4444';
}

function getImpactColor(score: number): string {
  if (score >= 70) return '#34d399';
  if (score >= 40) return '#F99F2A';
  return '#ef4444';
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    active: { bg: 'rgba(52,211,153,0.2)', color: '#34d399', label: 'Active' },
    favorite: { bg: 'rgba(249,159,42,0.2)', color: '#F99F2A', label: 'Favorite' },
    hidden: { bg: 'rgba(148,163,184,0.15)', color: '#94a3b8', label: 'Hidden' },
  };
  const s = styles[status] ?? styles.active;
  return (
    <Badge
      bg={s.bg}
      color={s.color}
      fontSize="9px"
      fontWeight="bold"
      px={2}
      py={0.5}
      borderRadius="4px"
      textTransform="capitalize"
    >
      {s.label}
    </Badge>
  );
}
