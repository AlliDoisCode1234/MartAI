'use client';

/**
 * KeywordPagination
 *
 * Component Hierarchy:
 * App -> Keywords -> KeywordsPage -> KeywordPagination (this file)
 *
 * Numbered page buttons + prev/next navigation.
 * Client-side pagination of loaded results.
 */

import { HStack, Button, Text, IconButton } from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

type Props = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsShown: number;
  onPageChange: (page: number) => void;
};

export function KeywordPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsShown,
  onPageChange,
}: Props) {
  if (totalPages <= 1) {
    return (
      <HStack justify="center" py={3}>
        <Text color="gray.500" fontSize="xs">
          Showing {itemsShown} of {totalItems} keywords loaded
        </Text>
      </HStack>
    );
  }

  // Build visible page numbers (max 5 around current)
  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  const btnStyle = {
    size: 'sm' as const,
    bg: '#1a1230',
    color: 'gray.400',
    border: '1px solid rgba(255,255,255,0.08)',
    _hover: { bg: 'rgba(255,255,255,0.1)', color: 'white' },
  };

  const activeBtnStyle = {
    ...btnStyle,
    bg: 'rgba(249, 159, 42, 0.2)',
    color: '#F99F2A',
    border: '1px solid rgba(249, 159, 42, 0.3)',
    _hover: { bg: 'rgba(249, 159, 42, 0.3)' },
  };

  return (
    <HStack justify="space-between" py={3} flexWrap="wrap" spacing={4}>
      <Text color="gray.500" fontSize="xs">
        Showing {itemsShown} of {totalItems} keywords loaded
      </Text>

      <HStack spacing={1}>
        <IconButton
          aria-label="First page"
          icon={<FiChevronsLeft />}
          onClick={() => onPageChange(1)}
          isDisabled={currentPage === 1}
          {...btnStyle}
        />
        <IconButton
          aria-label="Previous page"
          icon={<FiChevronLeft />}
          onClick={() => onPageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
          {...btnStyle}
        />

        {pages.map((p) => (
          <Button
            key={p}
            onClick={() => onPageChange(p)}
            {...(p === currentPage ? activeBtnStyle : btnStyle)}
            minW="32px"
          >
            {p}
          </Button>
        ))}

        <IconButton
          aria-label="Next page"
          icon={<FiChevronRight />}
          onClick={() => onPageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
          {...btnStyle}
        />
        <IconButton
          aria-label="Last page"
          icon={<FiChevronsRight />}
          onClick={() => onPageChange(totalPages)}
          isDisabled={currentPage === totalPages}
          {...btnStyle}
        />
      </HStack>
    </HStack>
  );
}
