/**
 * MarkdownContent - Renders markdown text as styled HTML
 *
 * Component Hierarchy:
 * src/components/shared/MarkdownContent.tsx (this file)
 *
 * Use this for rendering AI responses, content previews, etc.
 */

'use client';

import ReactMarkdown from 'react-markdown';
import { Box, Text, Heading, UnorderedList, OrderedList, ListItem, Code } from '@chakra-ui/react';

interface Props {
  content: string;
  fontSize?: string;
  color?: string;
}

export default function MarkdownContent({ content, fontSize = 'sm', color = 'gray.800' }: Props) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => (
          <Text fontSize={fontSize} color={color} mb={2}>
            {children}
          </Text>
        ),
        h1: ({ children }) => (
          <Heading size="md" color={color} mb={2} mt={3}>
            {children}
          </Heading>
        ),
        h2: ({ children }) => (
          <Heading size="sm" color={color} mb={2} mt={3}>
            {children}
          </Heading>
        ),
        h3: ({ children }) => (
          <Heading size="xs" color={color} mb={2} mt={2}>
            {children}
          </Heading>
        ),
        ul: ({ children }) => (
          <UnorderedList pl={4} mb={2} spacing={1}>
            {children}
          </UnorderedList>
        ),
        ol: ({ children }) => (
          <OrderedList pl={4} mb={2} spacing={1}>
            {children}
          </OrderedList>
        ),
        li: ({ children }) => (
          <ListItem fontSize={fontSize} color={color}>
            {children}
          </ListItem>
        ),
        strong: ({ children }) => (
          <Text as="strong" fontWeight="bold">
            {children}
          </Text>
        ),
        em: ({ children }) => (
          <Text as="em" fontStyle="italic">
            {children}
          </Text>
        ),
        code: ({ children }) => (
          <Code fontSize={fontSize} px={1} borderRadius="sm">
            {children}
          </Code>
        ),
        pre: ({ children }) => (
          <Box as="pre" bg="gray.100" p={3} borderRadius="md" overflow="auto" mb={2} fontSize="xs">
            {children}
          </Box>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
