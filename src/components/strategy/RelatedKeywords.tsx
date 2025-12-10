'use client';

/**
 * Component Hierarchy:
 * app/strategy/page.tsx
 *   └── StrategyDashboard
 *       └── KeywordsSection
 *           └── RelatedKeywords (this file)
 */

import { useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Input,
  Button,
  Badge,
  Wrap,
  WrapItem,
  Spinner,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Tooltip,
  Icon,
} from '@chakra-ui/react';
import { FiSearch, FiPlus, FiTrendingUp, FiTarget } from 'react-icons/fi';
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface SimilarKeyword {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  intent: string;
  similarityScore: number;
}

interface Props {
  onAddKeyword: (keyword: string) => void;
  existingKeywords?: string[];
}

export function RelatedKeywords({ onAddKeyword, existingKeywords = [] }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SimilarKeyword[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const getSimilar = useAction(api.seo.keywordActions.getSimilarKeywords);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('purple.50', 'purple.900');

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const similar = await getSimilar({
        query: query.trim(),
        limit: 15,
      });
      setResults(similar);
    } catch (error) {
      console.error('Failed to search similar keywords:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getIntentColor = (intent: string): string => {
    switch (intent) {
      case 'transactional':
        return 'red';
      case 'commercial':
        return 'orange';
      case 'informational':
        return 'blue';
      case 'navigational':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const formatVolume = (volume: number): string => {
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  const isAlreadyAdded = (keyword: string): boolean => {
    return existingKeywords.some((k) => k.toLowerCase() === keyword.toLowerCase());
  };

  return (
    <VStack spacing={4} align="stretch">
      {/* Search Input */}
      <HStack>
        <InputGroup size="md">
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search for related keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            bg={cardBg}
            borderColor={borderColor}
          />
        </InputGroup>
        <Button colorScheme="purple" onClick={handleSearch} isLoading={loading} minW="100px">
          Search
        </Button>
      </HStack>

      {/* Results */}
      {loading && (
        <HStack justify="center" py={4}>
          <Spinner size="sm" color="purple.500" />
          <Text fontSize="sm" color="gray.500">
            Finding similar keywords...
          </Text>
        </HStack>
      )}

      {!loading && searched && results.length === 0 && (
        <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
          No similar keywords found. Try a different search term.
        </Text>
      )}

      {!loading && results.length > 0 && (
        <VStack spacing={2} align="stretch" maxH="300px" overflowY="auto">
          {results.map((kw) => {
            const added = isAlreadyAdded(kw.keyword);

            return (
              <HStack
                key={kw.keyword}
                p={3}
                bg={cardBg}
                borderRadius="md"
                borderWidth="1px"
                borderColor={borderColor}
                justify="space-between"
                _hover={{ bg: hoverBg }}
                transition="background 0.2s"
              >
                <VStack align="start" spacing={0} flex="1">
                  <Text fontWeight="medium" fontSize="sm">
                    {kw.keyword}
                  </Text>
                  <HStack spacing={2} mt={1}>
                    <Tooltip label="Search Volume">
                      <HStack spacing={1}>
                        <Icon as={FiTrendingUp} boxSize={3} color="gray.400" />
                        <Text fontSize="xs" color="gray.500">
                          {formatVolume(kw.searchVolume)}
                        </Text>
                      </HStack>
                    </Tooltip>
                    <Tooltip label="Difficulty">
                      <HStack spacing={1}>
                        <Icon as={FiTarget} boxSize={3} color="gray.400" />
                        <Text fontSize="xs" color="gray.500">
                          {kw.difficulty}%
                        </Text>
                      </HStack>
                    </Tooltip>
                    <Badge colorScheme={getIntentColor(kw.intent)} size="sm" fontSize="2xs">
                      {kw.intent}
                    </Badge>
                  </HStack>
                </VStack>
                <Tooltip label={added ? 'Already added' : 'Add to project'}>
                  <Button
                    size="xs"
                    leftIcon={<FiPlus />}
                    colorScheme="purple"
                    variant={added ? 'ghost' : 'solid'}
                    isDisabled={added}
                    onClick={() => onAddKeyword(kw.keyword)}
                  >
                    {added ? 'Added' : 'Add'}
                  </Button>
                </Tooltip>
              </HStack>
            );
          })}
        </VStack>
      )}

      {/* Hint */}
      {!searched && (
        <Text fontSize="xs" color="gray.400" textAlign="center">
          Search by topic to discover related keywords from our library
        </Text>
      )}
    </VStack>
  );
}
