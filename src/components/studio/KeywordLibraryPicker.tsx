'use client';

/**
 * KeywordLibraryPicker
 *
 * Component Hierarchy:
 * App → StudioLayout → CreateContentPage → KeywordLibraryPicker
 *
 * Modal to select keywords from the project's keyword library.
 */

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
  Checkbox,
  Input,
  InputGroup,
  InputLeftElement,
  Badge,
  Box,
  Spinner,
  Icon,
} from '@chakra-ui/react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState, useMemo } from 'react';
import { FiSearch, FiTarget } from 'react-icons/fi';
import type { Id, Doc } from '@/convex/_generated/dataModel';

// Use Convex Doc type for proper schema-synced typing
type Keyword = Doc<'keywords'>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: Id<'projects'> | null;
  onSelect: (keywords: string[]) => void;
  selectedKeywords?: string[];
}

export function KeywordLibraryPicker({
  isOpen,
  onClose,
  projectId,
  onSelect,
  selectedKeywords = [],
}: Props) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>(selectedKeywords);

  // Fetch keywords from library
  const keywords = useQuery(
    api.seo.keywords.getKeywordsByProject,
    projectId ? { projectId } : 'skip'
  );

  // Filter by search
  const filteredKeywords = useMemo((): Keyword[] => {
    if (!keywords) return [];
    if (!search.trim()) return keywords;
    const searchLower = search.toLowerCase();
    return keywords.filter((kw: Keyword) => kw.keyword.toLowerCase().includes(searchLower));
  }, [keywords, search]);

  const handleToggle = (keyword: string) => {
    setSelected((prev) =>
      prev.includes(keyword) ? prev.filter((k) => k !== keyword) : [...prev, keyword]
    );
  };

  const handleConfirm = () => {
    onSelect(selected);
    onClose();
  };

  const handleSelectAll = () => {
    setSelected(filteredKeywords.map((kw) => kw.keyword));
  };

  const handleClearAll = () => {
    setSelected([]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.700" />
      <ModalContent bg="gray.900" borderColor="whiteAlpha.200" borderWidth="1px">
        <ModalHeader color="white">
          <HStack spacing={3}>
            <Icon as={FiTarget} color="#FF9D00" />
            <Text>Select Keywords from Library</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton color="gray.400" />

        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Search */}
            <InputGroup>
              <InputLeftElement>
                <Icon as={FiSearch} color="gray.500" />
              </InputLeftElement>
              <Input
                placeholder="Search keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                bg="whiteAlpha.100"
                border="1px solid"
                borderColor="whiteAlpha.200"
                color="white"
                _placeholder={{ color: 'gray.500' }}
              />
            </InputGroup>

            {/* Quick actions */}
            <HStack justify="space-between">
              <Text color="gray.400" fontSize="sm">
                {selected.length} selected
              </Text>
              <HStack>
                <Button size="xs" variant="ghost" color="gray.400" onClick={handleSelectAll}>
                  Select All
                </Button>
                <Button size="xs" variant="ghost" color="gray.400" onClick={handleClearAll}>
                  Clear
                </Button>
              </HStack>
            </HStack>

            {/* Keywords list */}
            {!keywords ? (
              <Box textAlign="center" py={8}>
                <Spinner color="#FF9D00" />
              </Box>
            ) : filteredKeywords.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Text color="gray.500">No keywords found</Text>
              </Box>
            ) : (
              <VStack align="stretch" spacing={2} maxH="300px" overflowY="auto">
                {filteredKeywords.slice(0, 50).map((kw: Keyword) => (
                  <HStack
                    key={kw._id}
                    p={3}
                    bg={selected.includes(kw.keyword) ? 'rgba(255, 157, 0, 0.1)' : 'whiteAlpha.50'}
                    borderRadius="md"
                    cursor="pointer"
                    onClick={() => handleToggle(kw.keyword)}
                    _hover={{ bg: 'whiteAlpha.100' }}
                    transition="all 0.2s"
                  >
                    <Checkbox
                      isChecked={selected.includes(kw.keyword)}
                      onChange={() => handleToggle(kw.keyword)}
                      colorScheme="orange"
                    />
                    <Text color="white" flex={1}>
                      {kw.keyword}
                    </Text>
                    {kw.searchVolume && (
                      <Badge colorScheme="blue" fontSize="xs">
                        {kw.searchVolume.toLocaleString()} vol
                      </Badge>
                    )}
                    {kw.priority && (
                      <Badge
                        colorScheme={
                          kw.priority === 'high'
                            ? 'red'
                            : kw.priority === 'medium'
                              ? 'orange'
                              : 'green'
                        }
                        fontSize="xs"
                      >
                        {kw.priority}
                      </Badge>
                    )}
                  </HStack>
                ))}
              </VStack>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter borderTop="1px solid" borderColor="whiteAlpha.100">
          <Button variant="ghost" color="gray.400" onClick={onClose} mr={3}>
            Cancel
          </Button>
          <Button
            bg="linear-gradient(135deg, #FF9D00, #FF6B00)"
            color="white"
            onClick={handleConfirm}
            isDisabled={selected.length === 0}
          >
            Use {selected.length} Keyword{selected.length !== 1 ? 's' : ''}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
