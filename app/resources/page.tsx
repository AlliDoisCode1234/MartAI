'use client';

/**
 * Resources Listing Page
 *
 * Component Hierarchy:
 * App → Resources → page.tsx (this file)
 *
 * Public page for viewing educational content.
 * SEO-optimized with proper meta tags.
 */

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Badge,
  HStack,
  VStack,
  Button,
  Tabs,
  TabList,
  Tab,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Icon,
} from '@chakra-ui/react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { FiSearch, FiClock, FiEye, FiStar } from 'react-icons/fi';
import { useState } from 'react';

// Category labels and colors
const CATEGORY_CONFIG = {
  guide: { label: 'Guide', color: 'blue' },
  tutorial: { label: 'Tutorial', color: 'green' },
  'case-study': { label: 'Case Study', color: 'purple' },
  insight: { label: 'Insight', color: 'orange' },
  news: { label: 'News', color: 'gray' },
} as const;

type CategoryKey = keyof typeof CATEGORY_CONFIG;

// Resource type from Convex
type Resource = {
  _id: string;
  slug: string;
  title: string;
  description: string;
  category: CategoryKey;
  readTimeMinutes: number;
  views: number;
  phooRating?: number;
  publishedAt?: number;
};

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const resources = useQuery(api.resources.listPublished, {
    category: activeCategory === 'all' ? undefined : activeCategory,
  });

  const featuredResources = useQuery(api.resources.listFeatured, { limit: 3 });

  // Filter by search query
  const filteredResources = resources?.filter(
    (r: Resource) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box minH="100vh" bg="gray.50" pt={24} pb={12}>
      <Container maxW="6xl">
        {/* Header */}
        <VStack spacing={4} textAlign="center" mb={12}>
          <Heading as="h1" size="2xl" color="gray.800">
            Resources
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="2xl">
            Learn SEO content strategy from the team building the tools. Guides, tutorials, and
            insights to help you create content that ranks.
          </Text>
        </VStack>

        {/* Featured Section */}
        {featuredResources && featuredResources.length > 0 && (
          <Box mb={12}>
            <HStack mb={4}>
              <Icon as={FiStar} color="brand.orange" />
              <Heading as="h2" size="md" color="gray.700">
                Featured
              </Heading>
            </HStack>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              {featuredResources.map((resource: Resource) => (
                <ResourceCard key={resource._id} resource={resource} featured />
              ))}
            </SimpleGrid>
          </Box>
        )}

        {/* Search and Filter */}
        <HStack mb={8} flexWrap="wrap" gap={4}>
          <InputGroup maxW="300px">
            <InputLeftElement>
              <FiSearch color="gray" />
            </InputLeftElement>
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              bg="white"
            />
          </InputGroup>

          <Tabs
            variant="soft-rounded"
            colorScheme="orange"
            onChange={(index) => {
              const categories: (CategoryKey | 'all')[] = [
                'all',
                'guide',
                'tutorial',
                'case-study',
                'insight',
                'news',
              ];
              setActiveCategory(categories[index]);
            }}
          >
            <TabList>
              <Tab>All</Tab>
              <Tab>Guides</Tab>
              <Tab>Tutorials</Tab>
              <Tab>Case Studies</Tab>
              <Tab>Insights</Tab>
              <Tab>News</Tab>
            </TabList>
          </Tabs>
        </HStack>

        {/* Resource Grid */}
        {!resources ? (
          <Box textAlign="center" py={12}>
            <Spinner size="xl" color="brand.orange" />
          </Box>
        ) : filteredResources && filteredResources.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {filteredResources.map((resource: Resource) => (
              <ResourceCard key={resource._id} resource={resource} />
            ))}
          </SimpleGrid>
        ) : (
          <Box textAlign="center" py={12}>
            <Text color="gray.500">No resources found. Check back soon!</Text>
          </Box>
        )}
      </Container>
    </Box>
  );
}

// Resource Card Component
interface ResourceCardProps {
  resource: {
    _id: string;
    slug: string;
    title: string;
    description: string;
    category: CategoryKey;
    readTimeMinutes: number;
    views: number;
    phooRating?: number;
    publishedAt?: number;
  };
  featured?: boolean;
}

function ResourceCard({ resource, featured }: ResourceCardProps) {
  const config = CATEGORY_CONFIG[resource.category];

  return (
    <Card
      as={Link}
      href={`/resources/${resource.slug}`}
      _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
      transition="all 0.2s"
      bg={featured ? 'white' : 'white'}
      border={featured ? '2px solid' : '1px solid'}
      borderColor={featured ? 'brand.orange' : 'gray.200'}
    >
      <CardBody>
        <VStack align="stretch" spacing={3}>
          <HStack justify="space-between">
            <Badge colorScheme={config.color}>{config.label}</Badge>
            {resource.phooRating && (
              <Badge colorScheme="green" variant="subtle">
                Phoo: {resource.phooRating}%
              </Badge>
            )}
          </HStack>

          <Heading as="h3" size="sm" noOfLines={2}>
            {resource.title}
          </Heading>

          <Text fontSize="sm" color="gray.600" noOfLines={3}>
            {resource.description}
          </Text>

          <HStack fontSize="xs" color="gray.500" pt={2}>
            <HStack>
              <FiClock />
              <Text>{resource.readTimeMinutes} min read</Text>
            </HStack>
            <HStack>
              <FiEye />
              <Text>{resource.views.toLocaleString()} views</Text>
            </HStack>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
}
