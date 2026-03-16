/**
 * MarkdownPreview Component
 *
 * Component Hierarchy:
 * App -> StudioLayout -> ContentEditorPage -> MarkdownPreview
 *
 * Renders markdown content as styled HTML for article preview.
 * Uses react-markdown with explicit sanitization (rehype-sanitize)
 * as defense-in-depth against XSS from AI-generated or user content.
 *
 * SECURITY:
 * - rehype-sanitize strips ALL HTML tags, attributes, and event handlers
 * - No dangerouslySetInnerHTML, no rehype-raw
 * - Even if AI returns <script> or <img onerror=>, they're stripped
 */

import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

interface Props {
  readonly content: string;
}

export function MarkdownPreview({ content }: Props) {
  return (
    <Box
      className="markdown-preview"
      p={6}
      color="#2d3748"
      fontSize="16px"
      lineHeight="1.8"
      fontFamily="system-ui, -apple-system, sans-serif"
      sx={{
        '& h1': {
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#1a202c',
          mb: 4,
          mt: 6,
          pb: 2,
          borderBottom: '1px solid #e2e8f0',
          lineHeight: '1.2',
        },
        '& h2': {
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#1a202c',
          mb: 3,
          mt: 5,
          lineHeight: '1.3',
        },
        '& h3': {
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#2d3748',
          mb: 2,
          mt: 4,
          lineHeight: '1.4',
        },
        '& p': {
          mb: 4,
          color: '#2d3748',
          lineHeight: '1.8',
        },
        '& ul, & ol': {
          pl: 6,
          mb: 4,
          color: '#2d3748',
        },
        '& li': {
          mb: 2,
          color: '#2d3748',
          lineHeight: '1.6',
        },
        '& a': {
          color: '#D97706',
          textDecoration: 'underline',
          _hover: { opacity: 0.8 },
        },
        '& code': {
          bg: '#f7fafc',
          color: '#1a202c',
          px: 2,
          py: 0.5,
          borderRadius: 'md',
          fontSize: '0.9em',
          fontFamily: "'Courier New', monospace",
        },
        '& pre': {
          bg: '#f7fafc',
          color: '#1a202c',
          p: 4,
          borderRadius: 'lg',
          mb: 4,
          overflow: 'auto',
          border: '1px solid #e2e8f0',
        },
        '& pre code': {
          bg: 'transparent',
          p: 0,
        },
        '& blockquote': {
          borderLeft: '4px solid #F99F2A',
          pl: 4,
          py: 2,
          my: 4,
          bg: 'rgba(249, 159, 42, 0.06)',
          borderRadius: '0 8px 8px 0',
          fontStyle: 'italic',
          color: '#4a5568',
        },
        '& hr': {
          my: 6,
          borderColor: '#e2e8f0',
        },
        '& img': {
          maxW: '100%',
          borderRadius: 'lg',
          my: 4,
        },
        '& table': {
          width: '100%',
          mb: 4,
          borderCollapse: 'collapse',
        },
        '& th, & td': {
          border: '1px solid #e2e8f0',
          p: 2,
          textAlign: 'left',
          color: '#2d3748',
        },
        '& th': {
          bg: '#f7fafc',
          fontWeight: '600',
          color: '#1a202c',
        },
        '& strong': {
          color: '#1a202c',
          fontWeight: 'bold',
        },
        '& em': {
          fontStyle: 'italic',
        },
        '& del': {
          textDecoration: 'line-through',
          color: '#718096',
        },
      }}
    >
      {content ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSanitize]}
        >
          {content}
        </ReactMarkdown>
      ) : (
        <Text color="gray.600" fontStyle="italic">
          Start writing to see preview...
        </Text>
      )}
    </Box>
  );
}

export default MarkdownPreview;
