'use client';

/**
 * MDX Content Loader
 *
 * Component Hierarchy:
 * App → Resources → [slug] → MDXContent (this file)
 *
 * Dynamically loads and renders MDX content for resources.
 */

import { Box, Text, VStack } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { Suspense, useMemo } from 'react';

interface Props {
  slug: string;
}

// MDX content mapping - add new articles here
const MDX_CONTENT: Record<string, React.ComponentType> = {
  'what-is-geo-generative-engine-optimization': dynamic(
    () => import('@/content/resources/what-is-geo-generative-engine-optimization.mdx'),
    { loading: () => <ContentLoading /> }
  ),
  // Add more articles as they are created:
  // 'seo-content-strategy-guide': dynamic(
  //   () => import('@/content/resources/seo-content-strategy-guide.mdx'),
  //   { loading: () => <ContentLoading /> }
  // ),
};

function ContentLoading() {
  return (
    <VStack spacing={4} py={8}>
      <Text color="gray.400">Loading content...</Text>
    </VStack>
  );
}

function ComingSoon({ slug }: { slug: string }) {
  return (
    <VStack spacing={4} py={12} textAlign="center">
      <Text color="gray.400" fontSize="lg">
        📝 This article is coming soon!
      </Text>
      <Text color="gray.400" fontSize="sm">
        Content file: content/resources/{slug}.mdx
      </Text>
    </VStack>
  );
}

export function MDXContent({ slug }: Props) {
  const Content = useMemo(() => MDX_CONTENT[slug], [slug]);

  if (!Content) {
    return <ComingSoon slug={slug} />;
  }

  return (
    <Suspense fallback={<ContentLoading />}>
      <Box
        className="mdx-content"
        sx={{
          // MDX prose styling
          'h1, h2, h3, h4, h5, h6': {
            fontWeight: 'bold',
            mt: 6,
            mb: 3,
          },
          h1: { fontSize: '2xl' },
          h2: { fontSize: 'xl' },
          h3: { fontSize: 'lg' },
          p: { mb: 4, lineHeight: 1.7 },
          ul: { pl: 6, mb: 4 },
          ol: { pl: 6, mb: 4 },
          li: { mb: 2 },
          blockquote: {
            borderLeft: '4px solid',
            borderColor: 'orange.400',
            pl: 4,
            py: 2,
            my: 4,
            bg: 'orange.50',
            fontStyle: 'italic',
          },
          code: {
            bg: 'gray.100',
            p: 1,
            borderRadius: 'sm',
            fontSize: 'sm',
          },
          pre: {
            bg: 'gray.800',
            color: 'white',
            p: 4,
            borderRadius: 'md',
            overflow: 'auto',
            my: 4,
          },
          'pre code': {
            bg: 'transparent',
            p: 0,
          },
          table: {
            width: '100%',
            my: 4,
            borderCollapse: 'collapse',
          },
          'th, td': {
            border: '1px solid',
            borderColor: 'gray.200',
            p: 3,
            textAlign: 'left',
          },
          th: {
            bg: 'gray.50',
            fontWeight: 'bold',
          },
          a: {
            color: 'orange.500',
            textDecoration: 'underline',
            _hover: { color: 'orange.600' },
          },
          hr: {
            my: 8,
            borderColor: 'gray.200',
          },
          strong: { fontWeight: 'bold' },
          em: { fontStyle: 'italic' },
        }}
      >
        <Content />
      </Box>
    </Suspense>
  );
}
