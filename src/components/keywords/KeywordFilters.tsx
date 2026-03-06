'use client';

/**
 * KeywordFilters
 *
 * Component Hierarchy:
 * App -> Keywords -> KeywordsPage -> KeywordFilters (this file)
 *
 * Sort, status filter, cluster filter, and full-width search bar.
 * Sort dropdown shows selected value in orange accent.
 * Search input fills all remaining horizontal space.
 */

import {
  HStack,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Text,
  Button,
} from '@chakra-ui/react';
import { FiSearch, FiZap } from 'react-icons/fi';

type Props = {
  sortBy: string;
  onSortChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  clusterFilter: string;
  onClusterChange: (value: string) => void;
  quickWinFilter: boolean;
  onQuickWinChange: (value: boolean) => void;
  search: string;
  onSearchChange: (value: string) => void;
  clusterNames: string[];
  quickWinCount?: number;
};

const baseSelectStyles = {
  bg: 'white',
  border: '1px solid',
  borderColor: 'gray.200',
  fontSize: 'sm',
  _hover: { borderColor: 'gray.300' },
  _focus: { borderColor: '#F99F2A', boxShadow: '0 0 0 1px #F99F2A' },
  sx: { option: { bg: 'white', color: 'gray.800' } },
};

export function KeywordFilters({
  sortBy,
  onSortChange,
  statusFilter,
  onStatusChange,
  clusterFilter,
  onClusterChange,
  quickWinFilter,
  onQuickWinChange,
  search,
  onSearchChange,
  clusterNames,
  quickWinCount,
}: Props) {
  return (
    <HStack spacing={3} w="100%" align="center">
      {/* Sort by — highlighted orange text for selected value */}
      <HStack spacing={2} flexShrink={0}>
        <Text color="gray.500" fontSize="sm" whiteSpace="nowrap">
          Sort by
        </Text>
        <Select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          minW="230px"
          color="#F99F2A"
          fontWeight="semibold"
          {...baseSelectStyles}
        >
          <option value="revenue">Most Revenue Potential</option>
          <option value="quickwins">Quick Wins First</option>
          <option value="volume">Search Volume</option>
          <option value="difficulty">Difficulty</option>
          <option value="rank">Position</option>
          <option value="recent">Most Recent</option>
        </Select>
      </HStack>

      {/* Status filter */}
      <Select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        w="160px"
        flexShrink={0}
        color="gray.700"
        {...baseSelectStyles}
      >
        <option value="all">All Statuses</option>
        <option value="suggested">Suggested</option>
        <option value="approved">Approved</option>
        <option value="implemented">Implemented</option>
      </Select>

      {/* Cluster filter */}
      <Select
        value={clusterFilter}
        onChange={(e) => onClusterChange(e.target.value)}
        w="180px"
        flexShrink={0}
        color="gray.700"
        {...baseSelectStyles}
      >
        <option value="all">All Clusters</option>
        {clusterNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </Select>

      {/* Quick Win toggle */}
      <Button
        size="sm"
        variant="outline"
        flexShrink={0}
        bg={quickWinFilter ? 'rgba(52,211,153,0.2)' : 'transparent'}
        color={quickWinFilter ? '#34d399' : 'gray.500'}
        borderColor={quickWinFilter ? '#34d399' : 'gray.200'}
        _hover={{
          bg: quickWinFilter ? 'rgba(52,211,153,0.3)' : 'gray.50',
          color: quickWinFilter ? '#34d399' : 'gray.700',
        }}
        fontWeight="semibold"
        fontSize="xs"
        onClick={() => onQuickWinChange(!quickWinFilter)}
      >
        <Icon as={FiZap} boxSize={3} mr={1} />
        Quick Wins{quickWinCount !== undefined ? ` (${quickWinCount})` : ''}
      </Button>

      {/* Search — fills remaining space */}
      <InputGroup flex={1} minW="200px">
        <InputLeftElement pointerEvents="none">
          <Icon as={FiSearch} color="gray.500" boxSize={4} />
        </InputLeftElement>
        <Input
          placeholder="Search keywords..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          color="gray.800"
          fontSize="sm"
          _placeholder={{ color: 'gray.400' }}
          _hover={{ borderColor: 'gray.300' }}
          _focus={{ borderColor: '#F99F2A', boxShadow: '0 0 0 1px #F99F2A' }}
        />
      </InputGroup>
    </HStack>
  );
}
