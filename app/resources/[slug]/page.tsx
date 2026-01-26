'use client';

/**
 * Resource Detail Page
 *
 * Component Hierarchy:
 * App → Resources → [slug] → page.tsx (this file)
 *
 * Individual resource view with view tracking.
 */

import {
  Box,
  Container,
  Heading,
  Text,
  HStack,
  VStack,
  Badge,
  Avatar,
  Divider,
  Button,
  Spinner,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
} from '@chakra-ui/react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { FiClock, FiEye, FiChevronRight, FiArrowLeft, FiShare2 } from 'react-icons/fi';
import { MDXContent } from '@/src/components/resources/MDXContent';

// Category config
const CATEGORY_CONFIG = {
  guide: { label: 'Guide', color: 'blue' },
  tutorial: { label: 'Tutorial', color: 'green' },
  'case-study': { label: 'Case Study', color: 'purple' },
  insight: { label: 'Insight', color: 'orange' },
  news: { label: 'News', color: 'gray' },
} as const;

export default function ResourceDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const resource = useQuery(api.resources.getBySlug, slug ? { slug } : 'skip');
  const incrementViews = useMutation(api.resources.incrementViews);

  // Track view on mount (once per session per article)
  useEffect(() => {
    if (slug && resource) {
      // Session-based deduplication: only count one view per session per article
      const viewedKey = `resource-viewed-${slug}`;
      const hasViewed = typeof window !== 'undefined' && sessionStorage.getItem(viewedKey);

      if (!hasViewed) {
        incrementViews({ slug });
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(viewedKey, 'true');
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, resource?._id]);

  if (resource === undefined) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="brand.orange" />
      </Box>
    );
  }

  if (resource === null) {
    return (
      <Box minH="100vh" py={12}>
        <Container maxW="4xl" textAlign="center">
          <Heading mb={4}>Resource Not Found</Heading>
          <Text color="gray.600" mb={8}>
            The resource you're looking for doesn't exist or has been removed.
          </Text>
          <Button as={Link} href="/resources" colorScheme="orange" leftIcon={<FiArrowLeft />}>
            Back to Resources
          </Button>
        </Container>
      </Box>
    );
  }

  const config = CATEGORY_CONFIG[resource.category as keyof typeof CATEGORY_CONFIG];

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="4xl">
        {/* Breadcrumb */}
        <Breadcrumb
          spacing={2}
          separator={<FiChevronRight color="gray.500" />}
          mb={8}
          fontSize="sm"
        >
          <BreadcrumbItem>
            <BreadcrumbLink
              as={Link}
              href="/resources"
              color="gray.500"
              _hover={{ color: 'brand.orange' }}
            >
              Resources
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink
              as={Link}
              href={`/resources?category=${resource.category}`}
              color="gray.500"
              _hover={{ color: 'brand.orange' }}
            >
              {config.label}s
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <Text color="gray.700" fontWeight="medium" noOfLines={1} maxW="200px">
              {resource.title}
            </Text>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Article Header */}
        <VStack align="stretch" spacing={4} mb={8}>
          <HStack>
            <Badge colorScheme={config.color}>{config.label}</Badge>
            {resource.phooRating && (
              <Badge colorScheme="green" variant="subtle">
                Phoo Rating: {resource.phooRating}%
              </Badge>
            )}
          </HStack>

          <Heading as="h1" size="2xl" color="gray.800" lineHeight={1.2}>
            {resource.title}
          </Heading>

          <Text fontSize="xl" color="gray.600">
            {resource.description}
          </Text>

          <HStack spacing={6} pt={2}>
            {/* Author */}
            <HStack>
              <Avatar size="sm" name={resource.authorName} src={resource.authorImage} />
              <VStack spacing={0} align="start">
                <Text fontSize="sm" fontWeight="medium">
                  {resource.authorName}
                </Text>
                {resource.authorTitle && (
                  <Text fontSize="xs" color="gray.500">
                    {resource.authorTitle}
                  </Text>
                )}
              </VStack>
            </HStack>

            {/* Meta */}
            <HStack fontSize="sm" color="gray.500" spacing={4}>
              <HStack>
                <FiClock />
                <Text>{resource.readTimeMinutes} min read</Text>
              </HStack>
              <HStack>
                <FiEye />
                <Text>{resource.views.toLocaleString()} views</Text>
              </HStack>
            </HStack>
          </HStack>
        </VStack>

        <Divider my={8} />

        {/* Article Content */}
        <Box
          bg="white"
          p={8}
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.200"
          minH="400px"
        >
          <MDXContent slug={slug} />
        </Box>

        {/* Actions */}
        <HStack justify="space-between" mt={8}>
          <Button as={Link} href="/resources" variant="ghost" leftIcon={<FiArrowLeft />}>
            Back to Resources
          </Button>
          <Button
            variant="outline"
            leftIcon={<FiShare2 />}
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: resource.title,
                  text: resource.description,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
          >
            Share
          </Button>
        </HStack>
      </Container>
    </Box>
  );
}
