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
import {
  Box,
  Heading,
  Text,
  Link,
  Image,
  Code,
  Divider,
  UnorderedList,
  OrderedList,
  ListItem,
} from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';

interface Props {
  content: string;
}

export function MarkdownPreview({ content }: Props) {
  return (
    <Box
      className="markdown-preview"
      p={6}
      color="gray.200"
      fontSize="md"
      lineHeight="1.8"
      sx={{
        '& h1': {
          fontSize: '2xl',
          fontWeight: 'bold',
          color: 'white',
          mb: 4,
          mt: 6,
          pb: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '& h2': {
          fontSize: 'xl',
          fontWeight: 'bold',
          color: 'white',
          mb: 3,
          mt: 5,
        },
        '& h3': {
          fontSize: 'lg',
          fontWeight: 'semibold',
          color: 'gray.100',
          mb: 2,
          mt: 4,
        },
        '& p': {
          mb: 4,
          color: 'gray.300',
        },
        '& ul, & ol': {
          pl: 6,
          mb: 4,
        },
        '& li': {
          mb: 2,
        },
        '& a': {
          color: '#FF9D00',
          textDecoration: 'underline',
          _hover: { opacity: 0.8 },
        },
        '& code': {
          bg: 'rgba(255, 255, 255, 0.1)',
          px: 2,
          py: 0.5,
          borderRadius: 'md',
          fontSize: 'sm',
          fontFamily: 'mono',
        },
        '& pre': {
          bg: 'rgba(255, 255, 255, 0.05)',
          p: 4,
          borderRadius: 'lg',
          mb: 4,
          overflow: 'auto',
        },
        '& pre code': {
          bg: 'transparent',
          p: 0,
        },
        '& blockquote': {
          borderLeft: '4px solid #FF9D00',
          pl: 4,
          py: 2,
          my: 4,
          bg: 'rgba(255, 157, 0, 0.05)',
          borderRadius: '0 8px 8px 0',
          fontStyle: 'italic',
          color: 'gray.400',
        },
        '& hr': {
          my: 6,
          borderColor: 'rgba(255, 255, 255, 0.1)',
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
          border: '1px solid rgba(255, 255, 255, 0.1)',
          p: 2,
          textAlign: 'left',
        },
        '& th': {
          bg: 'rgba(255, 255, 255, 0.05)',
          fontWeight: 'semibold',
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
