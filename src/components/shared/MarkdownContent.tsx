/**
 * MarkdownContent - Renders markdown text as styled HTML
 *
 * Component Hierarchy:
 * src/components/shared/MarkdownContent.tsx (this file)
 *
 * Use this for rendering AI responses, content previews, article drafts, etc.
 * Supports both light and dark themes for consistent rendering across the app.
 */

'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Box,
  Text,
  Heading,
  UnorderedList,
  OrderedList,
  ListItem,
  Code,
  Link,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import type { FC, ReactNode } from 'react';

interface Props {
  content: string;
  fontSize?: string;
  theme?: 'light' | 'dark';
  /** Compact mode reduces spacing for inline previews */
  compact?: boolean;
  /** @deprecated Use theme prop instead. Kept for backwards compatibility. */
  color?: string;
}

export const MarkdownRenderer: FC<Props> = ({
  content,
  fontSize = 'md',
  theme = 'light',
  compact = false,

  color, // Legacy prop - ignored, use theme instead
}) => {
  const isDark = theme === 'dark';

  // Theme-aware colors
  const colors = {
    text: isDark ? 'gray.200' : 'gray.800',
    heading: isDark ? 'white' : 'gray.900',
    link: isDark ? 'orange.300' : 'orange.600',
    code: isDark ? 'gray.100' : 'gray.800',
    codeBg: isDark ? 'rgba(255, 255, 255, 0.1)' : 'gray.100',
    preBg: isDark ? 'rgba(0, 0, 0, 0.3)' : 'gray.50',
    border: isDark ? 'rgba(255, 255, 255, 0.1)' : 'gray.200',
    tableBg: isDark ? 'rgba(255, 255, 255, 0.02)' : 'gray.50',
  };

  const spacing = compact ? { mb: 1, mt: 1 } : { mb: 3, mt: 4 };

  return (
    <Box className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Paragraphs
          p: ({ children }) => (
            <Text fontSize={fontSize} color={colors.text} mb={compact ? 2 : 4} lineHeight="tall">
              {children}
            </Text>
          ),

          // Headings
          h1: ({ children }) => (
            <Heading as="h1" size="xl" color={colors.heading} {...spacing} fontFamily="heading">
              {children}
            </Heading>
          ),
          h2: ({ children }) => (
            <Heading as="h2" size="lg" color={colors.heading} {...spacing} fontFamily="heading">
              {children}
            </Heading>
          ),
          h3: ({ children }) => (
            <Heading as="h3" size="md" color={colors.heading} {...spacing} fontFamily="heading">
              {children}
            </Heading>
          ),
          h4: ({ children }) => (
            <Heading as="h4" size="sm" color={colors.heading} {...spacing} fontFamily="heading">
              {children}
            </Heading>
          ),

          // Lists
          ul: ({ children }) => (
            <UnorderedList pl={4} mb={compact ? 2 : 4} spacing={1} color={colors.text}>
              {children}
            </UnorderedList>
          ),
          ol: ({ children }) => (
            <OrderedList pl={4} mb={compact ? 2 : 4} spacing={1} color={colors.text}>
              {children}
            </OrderedList>
          ),
          li: ({ children }) => (
            <ListItem fontSize={fontSize} color={colors.text}>
              {children}
            </ListItem>
          ),

          // Inline formatting
          strong: ({ children }) => (
            <Text as="strong" fontWeight="bold" color={colors.heading}>
              {children}
            </Text>
          ),
          em: ({ children }) => (
            <Text as="em" fontStyle="italic">
              {children}
            </Text>
          ),

          // Code
          code: ({ children, className }) => {
            // Check if this is a code block (has language class) or inline code
            const isBlock = className?.startsWith('language-');
            if (isBlock) {
              return (
                <Box
                  as="pre"
                  bg={colors.preBg}
                  p={4}
                  borderRadius="md"
                  overflow="auto"
                  mb={compact ? 2 : 4}
                  borderWidth="1px"
                  borderColor={colors.border}
                >
                  <Code
                    fontSize="sm"
                    bg="transparent"
                    color={colors.code}
                    display="block"
                    whiteSpace="pre"
                  >
                    {children}
                  </Code>
                </Box>
              );
            }
            return (
              <Code
                fontSize={fontSize}
                px={1.5}
                py={0.5}
                borderRadius="sm"
                bg={colors.codeBg}
                color={colors.code}
              >
                {children}
              </Code>
            );
          },
          pre: ({ children }) => <>{children}</>,

          // Links
          a: ({ children, href }) => (
            <Link
              href={href}
              color={colors.link}
              textDecoration="underline"
              _hover={{ color: isDark ? 'orange.200' : 'orange.700' }}
              isExternal={href?.startsWith('http')}
            >
              {children}
            </Link>
          ),

          // Blockquote
          blockquote: ({ children }) => (
            <Box
              borderLeftWidth="4px"
              borderLeftColor={isDark ? 'orange.400' : 'orange.500'}
              pl={4}
              py={2}
              my={compact ? 2 : 4}
              bg={colors.tableBg}
              borderRadius="0 4px 4px 0"
            >
              <Text fontStyle="italic" color={colors.text}>
                {children}
              </Text>
            </Box>
          ),

          // Horizontal rule
          hr: () => <Divider my={compact ? 2 : 6} borderColor={colors.border} />,

          // Tables (GFM)
          table: ({ children }) => (
            <Box overflowX="auto" my={compact ? 2 : 4}>
              <Table size="sm" variant="simple">
                {children}
              </Table>
            </Box>
          ),
          thead: ({ children }) => <Thead bg={colors.tableBg}>{children}</Thead>,
          tbody: ({ children }) => <Tbody>{children}</Tbody>,
          tr: ({ children }) => <Tr>{children}</Tr>,
          th: ({ children }) => (
            <Th color={colors.heading} borderColor={colors.border}>
              {children}
            </Th>
          ),
          td: ({ children }) => (
            <Td color={colors.text} borderColor={colors.border}>
              {children}
            </Td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};

// Legacy export for backwards compatibility
export default MarkdownRenderer;
