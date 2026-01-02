'use client';

/**
 * useInfiniteScroll Hook
 *
 * Provides IntersectionObserver-based infinite scroll for paginated lists.
 * Used with Convex's usePaginatedQuery.
 */

import { useEffect, useRef, useCallback } from 'react';

interface Props {
  loadMore: (numItems: number) => void;
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
  numItems?: number;
}

export function useInfiniteScroll({
  loadMore,
  hasMore,
  isLoading,
  threshold = 200,
  numItems = 12,
}: Props) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();

      if (node && hasMore && !isLoading) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              loadMore(numItems);
            }
          },
          { rootMargin: `${threshold}px` }
        );
        observerRef.current.observe(node);
      }
    },
    [loadMore, hasMore, isLoading, threshold, numItems]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  return { sentinelRef };
}
