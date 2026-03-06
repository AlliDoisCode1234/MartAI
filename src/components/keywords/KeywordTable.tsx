'use client';

/**
 * KeywordTable
 *
 * Component Hierarchy:
 * App -> Keywords -> KeywordsPage -> KeywordTable (this file)
 *
 * Premium dark table with columns: Select, Keyword, Intent,
 * Quick Win, Rev. Potential, Volume, Difficulty, Rank & Change, Actions (⋮)
 *
 * Features:
 * - Vertical ⋮ menu per row: Delete, Change Status, Add to Cluster
 * - Bulk action bar when rows are selected (bulk delete with confirm)
 */

import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Text,
  Badge,
  HStack,
  Icon,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import { FiInfo, FiMoreVertical, FiTrash2, FiLayers } from 'react-icons/fi';
import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { IntentBadge } from './IntentBadge';
import { PhooScoreBadge, computeKeywordPhooScore } from './PhooScoreBadge';
import { useRef, useState } from 'react';
import { AddToClusterModal } from './AddToClusterModal';

interface EnrichedKeyword {
  _id: string;
  keyword: string;
  intent: string | null;
  clusterName: string | null;
  isQuickWin: boolean;
  searchVolume: number | null;
  difficulty: number | null;
  gscPosition: number | null;
  gscCtr: number | null;
  rankChange: number | null;
  status: string;
}

interface Props {
  keywords: EnrichedKeyword[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onDelete?: (ids: string[]) => void;
  projectId: string;
}

const thStyle = {
  color: 'gray.500',
  borderColor: 'gray.200',
  fontSize: '10px',
  fontWeight: 'bold',
  textTransform: 'uppercase' as const,
  letterSpacing: 'wider',
  py: 3,
};

export function KeywordTable({
  keywords,
  selectedIds,
  onSelectionChange,
  onDelete,
  projectId,
}: Props) {
  const allSelected = keywords.length > 0 && selectedIds.length === keywords.length;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [clusterModalKeyword, setClusterModalKeyword] = useState<{
    id: string;
    text: string;
  } | null>(null);

  function toggleAll() {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(keywords.map((k) => k._id));
    }
  }

  function toggleOne(id: string) {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((s) => s !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  }

  function handleBulkDelete() {
    if (onDelete && selectedIds.length > 0) {
      onDelete(selectedIds);
      onSelectionChange([]);
    }
    onClose();
  }

  return (
    <Box position="relative">
      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <Box
          bg="rgba(239, 68, 68, 0.08)"
          border="1px solid rgba(239, 68, 68, 0.2)"
          borderRadius="lg"
          px={4}
          py={2}
          mb={3}
        >
          <HStack justify="space-between">
            <Text color="gray.600" fontSize="sm">
              {selectedIds.length} keyword{selectedIds.length > 1 ? 's' : ''} selected
            </Text>
            <HStack spacing={2}>
              <Button
                size="xs"
                variant="ghost"
                color="gray.400"
                _hover={{ color: 'gray.700' }}
                onClick={() => onSelectionChange([])}
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

      <Box bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200" overflowX="auto">
        <Table variant="unstyled" size="sm">
          <Thead>
            <Tr borderBottom="1px solid" borderColor="gray.200">
              <Th {...thStyle} w="40px">
                <Checkbox
                  isChecked={allSelected}
                  isIndeterminate={selectedIds.length > 0 && !allSelected}
                  onChange={toggleAll}
                  borderColor="gray.600"
                  sx={{ '[data-checked] > span': { bg: '#F99F2A', borderColor: '#F99F2A' } }}
                />
              </Th>
              <Th {...thStyle}>Keyword</Th>
              <Th {...thStyle}>Intent</Th>
              <Th {...thStyle}>Quick Win</Th>
              <Th {...thStyle}>
                <Tooltip
                  label="Revenue Potential: Likelihood this keyword drives revenue when used in content. Based on search position, volume, difficulty, and CTR."
                  bg="gray.800"
                  color="gray.200"
                  fontSize="xs"
                  px={3}
                  py={2}
                  borderRadius="md"
                  hasArrow
                  maxW="260px"
                >
                  <HStack spacing={1} cursor="help">
                    <Text>Rev. Potential</Text>
                    <Icon as={FiInfo} boxSize={3} color="gray.500" />
                  </HStack>
                </Tooltip>
              </Th>
              <Th {...thStyle} isNumeric>
                Volume
              </Th>
              <Th {...thStyle} isNumeric>
                Difficulty
              </Th>
              <Th {...thStyle} isNumeric>
                Rank & Change
              </Th>
              <Th {...thStyle} w="40px" />
            </Tr>
          </Thead>
          <Tbody>
            {keywords.map((kw) => {
              const phooScore = computeKeywordPhooScore({
                position: kw.gscPosition,
                volume: kw.searchVolume,
                difficulty: kw.difficulty,
                ctr: kw.gscCtr,
              });

              return (
                <Tr
                  key={kw._id}
                  borderBottom="1px solid"
                  borderBottomColor="gray.100"
                  _hover={{ bg: 'gray.50' }}
                  transition="background 0.15s"
                >
                  <Td borderColor="transparent" py={3}>
                    <Checkbox
                      isChecked={selectedIds.includes(kw._id)}
                      onChange={() => toggleOne(kw._id)}
                      borderColor="gray.600"
                      sx={{ '[data-checked] > span': { bg: '#F99F2A', borderColor: '#F99F2A' } }}
                    />
                  </Td>
                  <Td borderColor="transparent" py={3} maxW="280px">
                    <Link
                      as={NextLink}
                      href={`/keywords/${kw._id}`}
                      color="gray.700"
                      _hover={{ color: '#F99F2A', textDecor: 'underline' }}
                      fontSize="sm"
                      fontWeight="medium"
                    >
                      <Text noOfLines={1}>{kw.keyword}</Text>
                    </Link>
                  </Td>
                  <Td borderColor="transparent" py={3}>
                    <IntentBadge intent={kw.intent} />
                  </Td>
                  <Td borderColor="transparent" py={3}>
                    {kw.isQuickWin ? (
                      <Badge
                        bg="rgba(52, 211, 153, 0.15)"
                        color="#34d399"
                        fontSize="9px"
                        fontWeight="bold"
                        px={2}
                        py={0.5}
                        borderRadius="4px"
                      >
                        QUICK WIN
                      </Badge>
                    ) : (
                      <Text color="gray.700" fontSize="10px">
                        &mdash;
                      </Text>
                    )}
                  </Td>
                  <Td borderColor="transparent" py={3}>
                    <PhooScoreBadge score={phooScore} />
                  </Td>
                  <Td borderColor="transparent" py={3} isNumeric>
                    <Text color="gray.600" fontSize="sm">
                      {kw.searchVolume !== null ? kw.searchVolume.toLocaleString() : '--'}
                    </Text>
                  </Td>
                  <Td borderColor="transparent" py={3} isNumeric>
                    <DifficultyBadge difficulty={kw.difficulty} />
                  </Td>
                  <Td borderColor="transparent" py={3} isNumeric>
                    <RankChangeCell position={kw.gscPosition} change={kw.rankChange} />
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
                        _hover={{ color: 'gray.700', bg: 'gray.100' }}
                        aria-label="Row actions"
                      />
                      <MenuList
                        bg="white"
                        borderColor="gray.200"
                        boxShadow="lg"
                        minW="160px"
                        py={1}
                      >
                        <MenuItem
                          icon={<FiLayers />}
                          fontSize="sm"
                          color="gray.600"
                          bg="transparent"
                          _hover={{ bg: 'gray.50', color: 'gray.800' }}
                          onClick={() => setClusterModalKeyword({ id: kw._id, text: kw.keyword })}
                        >
                          Add to Cluster
                        </MenuItem>
                        <MenuDivider borderColor="gray.200" />
                        <MenuItem
                          icon={<FiTrash2 />}
                          fontSize="sm"
                          color="#ef4444"
                          bg="transparent"
                          _hover={{ bg: 'rgba(239,68,68,0.1)' }}
                          onClick={() => onDelete?.([kw._id])}
                        >
                          Delete
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
      {/* Add to Cluster Modal */}
      <AddToClusterModal
        isOpen={!!clusterModalKeyword}
        onClose={() => setClusterModalKeyword(null)}
        projectId={projectId}
        keywordId={clusterModalKeyword?.id}
        keywordText={clusterModalKeyword?.text}
      />

      {/* Bulk Delete Confirm Dialog */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
        <AlertDialogOverlay bg="blackAlpha.700">
          <AlertDialogContent bg="white" border="1px solid" borderColor="gray.200">
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="gray.800">
              Delete {selectedIds.length} Keyword{selectedIds.length > 1 ? 's' : ''}
            </AlertDialogHeader>
            <AlertDialogBody color="gray.600">
              This action cannot be undone. The selected keywords will be permanently removed from
              your library.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onClose}
                variant="ghost"
                color="gray.400"
                _hover={{ color: 'gray.700' }}
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
    </Box>
  );
}

// Difficulty badge — colored word labels matching marketing screenshots
function DifficultyBadge({ difficulty }: { difficulty: number | null }) {
  if (difficulty === null) {
    return (
      <Text color="gray.400" fontSize="sm">
        --
      </Text>
    );
  }

  const label = difficulty <= 30 ? 'Easy' : difficulty <= 60 ? 'Medium' : 'Hard';
  const color = difficulty <= 30 ? '#22C55E' : difficulty <= 60 ? '#F7941E' : '#EF4444';
  const bg =
    difficulty <= 30
      ? 'rgba(34, 197, 94, 0.15)'
      : difficulty <= 60
        ? 'rgba(247, 148, 30, 0.15)'
        : 'rgba(239, 68, 68, 0.15)';

  return (
    <Tooltip
      label={`Difficulty: ${difficulty}/100`}
      bg="gray.800"
      color="gray.200"
      fontSize="xs"
      hasArrow
    >
      <Badge
        bg={bg}
        color={color}
        fontSize="11px"
        fontWeight="semibold"
        px={2.5}
        py={0.5}
        borderRadius="6px"
        cursor="default"
        textTransform="capitalize"
      >
        {label}
      </Badge>
    </Tooltip>
  );
}

// Rank & Change cell — shows current position with change pill.
function RankChangeCell({ position, change }: { position: number | null; change: number | null }) {
  if (position === null && change === null) {
    return (
      <Text color="gray.700" fontSize="sm">
        --
      </Text>
    );
  }

  const posStr = position !== null ? Math.round(position).toString() : '--';

  if (change === null || change === 0) {
    return (
      <HStack spacing={1} justify="flex-end">
        <Text color="gray.600" fontSize="sm">
          {posStr}
        </Text>
      </HStack>
    );
  }

  const improved = change < 0;
  const absChange = Math.abs(Math.round(change));
  const color = improved ? '#34d399' : '#ef4444';
  const arrow = improved ? '\u2191' : '\u2193';

  return (
    <HStack spacing={1.5} justify="flex-end">
      <Text color="gray.600" fontSize="sm">
        {posStr}
      </Text>
      <Badge
        bg={improved ? 'rgba(52,211,153,0.15)' : 'rgba(239,68,68,0.15)'}
        color={color}
        fontSize="10px"
        fontWeight="bold"
        px={1.5}
        py={0}
        borderRadius="4px"
        lineHeight="1.6"
      >
        {arrow}
        {absChange}
      </Badge>
    </HStack>
  );
}
