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
  Spinner,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Tooltip,
  Icon,
} from '@chakra-ui/react';
import { FiSearch, FiPlus, FiTrendingUp, FiZap } from 'react-icons/fi';
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { getDifficultyLabel, getVolumeLabel, getIntentLabel } from '@/src/lib/copyStrings';

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
            placeholder="Search by topic (e.g., 'content marketing')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            bg={cardBg}
            borderColor={borderColor}
          />
        </InputGroup>
        <Button colorScheme="purple" onClick={handleSearch} isLoading={loading} minW="100px">
          Discover
        </Button>
      </HStack>

      {/* Results */}
      {loading && (
        <HStack justify="center" py={4}>
          <Spinner size="sm" color="purple.500" />
          <Text fontSize="sm" color="gray.500">
            Finding related keywords...
          </Text>
        </HStack>
      )}

      {!loading && searched && results.length === 0 && (
        <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
          No related keywords found. Try a different topic.
        </Text>
      )}

      {!loading && results.length > 0 && (
        <VStack spacing={2} align="stretch" maxH="350px" overflowY="auto">
          {results.map((kw) => {
            const added = isAlreadyAdded(kw.keyword);
            const difficulty = getDifficultyLabel(kw.difficulty);
            const volume = getVolumeLabel(kw.searchVolume);
            const intent = getIntentLabel(kw.intent);

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
                <VStack align="start" spacing={1} flex="1">
                  <Text fontWeight="medium" fontSize="sm">
                    {kw.keyword}
                  </Text>
                  <HStack spacing={2} flexWrap="wrap">
                    {/* Difficulty - Human readable */}
                    <Tooltip label={difficulty.advice}>
                      <Badge
                        colorScheme={difficulty.color}
                        variant="subtle"
                        fontSize="2xs"
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >
                        <Icon as={FiZap} boxSize={2.5} />
                        {difficulty.label}
                      </Badge>
                    </Tooltip>

                    {/* Volume - Human readable */}
                    <Tooltip label={volume.description}>
                      <Badge
                        colorScheme="gray"
                        variant="outline"
                        fontSize="2xs"
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >
                        <Icon as={FiTrendingUp} boxSize={2.5} />
                        {volume.label}
                      </Badge>
                    </Tooltip>

                    {/* Intent - Human readable */}
                    <Tooltip label={intent.advice}>
                      <Badge colorScheme={intent.color} fontSize="2xs">
                        {intent.label}
                      </Badge>
                    </Tooltip>
                  </HStack>
                </VStack>
                <Tooltip label={added ? 'Already in your keywords' : 'Add to your keywords'}>
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
