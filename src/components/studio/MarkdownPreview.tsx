/**
 * MarkdownPreview Component
 *
 * Component Hierarchy:
 * App → StudioLayout → ContentEditorPage → MarkdownPreview
 *
 * Renders markdown content as styled HTML with syntax highlighting.
 * Uses react-markdown for parsing and rendering.
 */

import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';

interface Props {
  content: string;
}

export function MarkdownPreview({ content }: Props) {
  return (
    <Box
      className="markdown-preview"
      p={6}
      color="#2d3748"
      fontSize="md"
      lineHeight="1.8"
      sx={{
        '& h1': {
          fontSize: '2xl',
          fontWeight: 'bold',
          color: '#1a1a1a',
          mb: 4,
          mt: 6,
          pb: 2,
          borderBottom: '1px solid #e2e8f0',
        },
        '& h2': {
          fontSize: 'xl',
          fontWeight: 'bold',
          color: '#1a1a1a',
          mb: 3,
          mt: 5,
        },
        '& h3': {
          fontSize: 'lg',
          fontWeight: 'semibold',
          color: '#2d3748',
          mb: 2,
          mt: 4,
        },
        '& p': {
          mb: 4,
          color: '#4a5568',
        },
        '& ul, & ol': {
          pl: 6,
          mb: 4,
          color: '#4a5568',
        },
        '& li': {
          mb: 2,
          color: '#4a5568',
        },
        '& a': {
          color: '#D97706',
          textDecoration: 'underline',
          _hover: { opacity: 0.8 },
        },
        '& code': {
          bg: '#f7fafc',
          color: '#1a1a1a',
          px: 2,
          py: 0.5,
          borderRadius: 'md',
          fontSize: 'sm',
          fontFamily: 'mono',
        },
        '& pre': {
          bg: '#f7fafc',
          color: '#1a1a1a',
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
          color: '#718096',
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
          color: '#4a5568',
        },
        '& th': {
          bg: '#f7fafc',
          fontWeight: 'semibold',
          color: '#2d3748',
        },
        '& strong': {
          color: '#1a1a1a',
          fontWeight: 'bold',
        },
      }}
    >
      {content ? (
        <ReactMarkdown>{content}</ReactMarkdown>
      ) : (
        <Text color="gray.600" fontStyle="italic">
          Start writing to see preview...
        </Text>
      )}
    </Box>
  );
}

export default MarkdownPreview;
