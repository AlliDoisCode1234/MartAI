'use client';

/**
 * AppBreadcrumb Component
 *
 * Component Hierarchy:
 * App → PageLayout → AppBreadcrumb (this file)
 *
 * WCAG 2.2 AA accessible breadcrumb navigation.
 * Uses semantic HTML with proper ARIA attributes.
 */

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Text, HStack, Icon } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FiChevronRight, FiHome } from 'react-icons/fi';

interface Props {
  /**
   * Custom labels for path segments
   * Keys are the path segment, values are the display label
   * Example: { 'abc123': 'My Project Name' }
   */
  labels?: Record<string, string>;
  /**
   * Hide home breadcrumb (useful for dashboard itself)
   */
  hideHome?: boolean;
}

/**
 * Format a path segment into a readable label
 * Handles common patterns like kebab-case and IDs
 */
function formatSegment(segment: string): string {
  // Check if it looks like an ID (contains no letters or is very long)
  if (/^[a-z0-9]{20,}$/i.test(segment)) {
    return '...';
  }

  // Convert kebab-case or snake_case to Title Case
  return segment.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Segments to skip in breadcrumb trail
 * (route groups, dynamic parameter names, etc.)
 */
const SKIP_SEGMENTS = new Set(['(dashboard)', '(auth)', '(public)']);

export function AppBreadcrumb({ labels = {}, hideHome = false }: Props) {
  const pathname = usePathname();

  if (!pathname || pathname === '/') {
    return null;
  }

  // Split path and filter empty/skipped segments
  const rawSegments = pathname.split('/').filter(Boolean);
  const segments = rawSegments.filter((s) => !SKIP_SEGMENTS.has(s));

  // Build breadcrumb items with cumulative hrefs
  const crumbs = segments.map((segment, index) => {
    // Build href from all segments up to and including current
    const href = '/' + segments.slice(0, index + 1).join('/');
    // Use custom label if provided, otherwise format the segment
    const label = labels[segment] || formatSegment(segment);
    const isCurrent = index === segments.length - 1;

    return { segment, href, label, isCurrent };
  });

  // Don't show breadcrumb for single-level pages
  if (crumbs.length === 0 || (crumbs.length === 1 && hideHome)) {
    return null;
  }

  return (
    <Breadcrumb
      as="nav"
      aria-label="Breadcrumb navigation"
      separator={<Icon as={FiChevronRight} color="gray.400" boxSize={3} aria-hidden />}
      fontSize="sm"
      color="gray.500"
      mb={4}
    >
      {/* Home link */}
      {!hideHome && (
        <BreadcrumbItem>
          <BreadcrumbLink
            as={Link}
            href="/dashboard"
            display="flex"
            alignItems="center"
            _hover={{ color: 'brand.orange' }}
          >
            <Icon as={FiHome} boxSize={3.5} mr={1} />
            <Text as="span" display={{ base: 'none', md: 'inline' }}>
              Home
            </Text>
          </BreadcrumbLink>
        </BreadcrumbItem>
      )}

      {/* Dynamic breadcrumbs */}
      {crumbs.map((crumb) => (
        <BreadcrumbItem key={crumb.href} isCurrentPage={crumb.isCurrent}>
          {crumb.isCurrent ? (
            <Text
              as="span"
              aria-current="page"
              color="gray.700"
              fontWeight="medium"
              noOfLines={1}
              maxW={{ base: '120px', md: '200px' }}
            >
              {crumb.label}
            </Text>
          ) : (
            <BreadcrumbLink
              as={Link}
              href={crumb.href}
              _hover={{ color: 'brand.orange' }}
              noOfLines={1}
              maxW={{ base: '80px', md: '150px' }}
            >
              {crumb.label}
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
}

export default AppBreadcrumb;
