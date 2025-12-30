'use client';

/**
 * Content Studio Home Page
 *
 * Component Hierarchy:
 * App → StudioLayout → StudioHome
 *
 * Dashboard landing page with quick stats, quick create, and recent content.
 */

import {
  Box,
  Grid,
  Heading,
  Text,
  HStack,
  VStack,
  Button,
  SimpleGrid,
  Icon,
  Skeleton,
} from '@chakra-ui/react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { StudioLayout } from '@/src/components/studio';
import { ContentCard } from '@/src/components/studio/ContentCard';
import { FiPlus, FiTrendingUp, FiTarget } from 'react-icons/fi';
import Link from 'next/link';

interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
}

function StatCard({ label, value, color = 'white' }: StatCardProps) {
  return (
    <Box
      bg="rgba(255, 255, 255, 0.03)"
      border="1px solid rgba(255, 255, 255, 0.08)"
      borderRadius="16px"
      p={6}
      textAlign="center"
    >
      <Text
        fontSize="3xl"
        fontWeight="bold"
        color={color}
        textShadow={color !== 'white' ? `0 0 20px ${color}40` : 'none'}
      >
        {value}
      </Text>
      <Text fontSize="sm" color="gray.500" mt={1}>
        {label}
      </Text>
    </Box>
  );
}

interface QuickCreateCardProps {
  title: string;
  subtitle: string;
  icon: typeof FiPlus;
  href: string;
  recommended?: boolean;
}

function QuickCreateCard({ title, subtitle, icon, href, recommended }: QuickCreateCardProps) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <Box
        bg={recommended ? 'rgba(255, 157, 0, 0.1)' : 'rgba(255, 255, 255, 0.03)'}
        border={
          recommended ? '1px solid rgba(255, 157, 0, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)'
        }
        borderRadius="16px"
        p={5}
        cursor="pointer"
        transition="all 0.2s ease"
        position="relative"
        overflow="hidden"
        _hover={{
          transform: 'translateY(-2px)',
          boxShadow: recommended
            ? '0 0 40px rgba(255, 157, 0, 0.2)'
            : '0 0 20px rgba(255, 255, 255, 0.05)',
        }}
      >
        {recommended && (
          <Box
            position="absolute"
            top={2}
            right={2}
            bg="#FF9D00"
            color="black"
            fontSize="xs"
            fontWeight="bold"
            px={2}
            py={0.5}
            borderRadius="4px"
          >
            Recommended
          </Box>
        )}
        <VStack align="start" spacing={2}>
          <Icon as={icon} boxSize={6} color={recommended ? '#FF9D00' : 'gray.400'} />
          <Text fontWeight="semibold" color="white">
            {title}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {subtitle}
          </Text>
        </VStack>
      </Box>
    </Link>
  );
}

export default function StudioHomePage() {
  // TODO: Replace with real query when contentPieces CRUD is ready
  const recentContent: Array<{
    _id: string;
    title: string;
    contentType: string;
    status: string;
    wordCount?: number;
    seoScore?: number;
    updatedAt: number;
  }> = [];

  return (
    <StudioLayout>
      <VStack align="stretch" spacing={8}>
        {/* Header */}
        <Box>
          <Heading size="lg" bgGradient="linear(to-r, white, gray.400)" bgClip="text">
            Welcome to Content Studio
          </Heading>
          <Text color="gray.500" mt={1}>
            Your AI-powered content generation machine
          </Text>
        </Box>

        {/* Quick Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          <StatCard label="Total Content" value={recentContent.length || 0} />
          <StatCard label="Drafts" value={0} />
          <StatCard label="Published" value={0} />
          <StatCard label="Avg Score" value="A+" color="#22C55E" />
        </SimpleGrid>

        {/* Quick Create */}
        <Box>
          <HStack justify="space-between" mb={4}>
            <Heading size="md" color="white">
              Quick Create
            </Heading>
            <Link href="/studio/create">
              <Button
                size="sm"
                bg="linear-gradient(135deg, #FF9D00, #FF6B00)"
                color="white"
                _hover={{ opacity: 0.9 }}
                leftIcon={<Icon as={FiPlus} />}
              >
                New Content
              </Button>
            </Link>
          </HStack>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <QuickCreateCard
              title="Blog Post"
              subtitle="Standard SEO-optimized article"
              icon={FiPlus}
              href="/studio/create?type=blog"
            />
            <QuickCreateCard
              title="Pillar Post"
              subtitle="Comprehensive topic authority"
              icon={FiTrendingUp}
              href="/studio/create?type=pillar"
            />
            <QuickCreateCard
              title="From Strategy"
              subtitle="AI picks best opportunity"
              icon={FiTarget}
              href="/studio/create?fromStrategy=true"
              recommended
            />
          </SimpleGrid>
        </Box>

        {/* Recent Content */}
        <Box>
          <HStack justify="space-between" mb={4}>
            <Heading size="md" color="white">
              Recent Content
            </Heading>
            <Link href="/studio/library">
              <Button size="sm" variant="ghost" color="gray.400" _hover={{ color: 'white' }}>
                View All
              </Button>
            </Link>
          </HStack>
          {recentContent.length === 0 ? (
            <Box
              bg="rgba(255, 255, 255, 0.03)"
              border="1px dashed rgba(255, 255, 255, 0.1)"
              borderRadius="16px"
              p={12}
              textAlign="center"
            >
              <Text color="gray.500" mb={4}>
                No content yet. Create your first piece!
              </Text>
              <Link href="/studio/create?fromStrategy=true">
                <Button
                  bg="linear-gradient(135deg, #FF9D00, #FF6B00)"
                  color="white"
                  _hover={{ opacity: 0.9 }}
                >
                  Create from Strategy
                </Button>
              </Link>
            </Box>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              {recentContent.slice(0, 6).map((piece) => (
                <ContentCard key={piece._id} contentPiece={piece} />
              ))}
            </SimpleGrid>
          )}
        </Box>
      </VStack>
    </StudioLayout>
  );
}
