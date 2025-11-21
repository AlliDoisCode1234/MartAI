'use client';

import { useEffect, useRef } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';
import { $getRoot, EditorState, $isTextNode } from 'lexical';
import { $convertFromMarkdownString, $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { Box, VStack, HStack, Text } from '@chakra-ui/react';
import './editor.css';

// Export hooks for use in parent
export { useWordCount } from './plugins/WordCountPlugin';
export { useSEOValidation } from './plugins/SEOValidationPlugin';
export { useToneMetrics } from './plugins/ToneMeterPlugin';

const theme = {
  heading: {
    h1: 'text-3xl font-bold my-4',
    h2: 'text-2xl font-bold my-3',
    h3: 'text-xl font-semibold my-2',
  },
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
  },
  list: {
    ul: 'list-disc ml-6',
    ol: 'list-decimal ml-6',
    listitem: 'my-1',
  },
  link: 'text-blue-600 underline',
  paragraph: 'my-2',
};

function onError(error: Error) {
  console.error('Lexical error:', error);
}

interface LexicalEditorProps {
  value: string; // Markdown content
  onChange: (markdown: string) => void;
  placeholder?: string;
  isReadOnly?: boolean;
  minHeight?: string;
}

export function LexicalEditorComponent({
  value,
  onChange,
  placeholder = 'Start typing...',
  isReadOnly = false,
  minHeight = '400px',
}: LexicalEditorProps) {
  const initialConfig = {
    namespace: 'MartAIContentEditor',
    theme,
    onError,
    editable: !isReadOnly,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      LinkNode,
    ],
  };

  const handleChange = (editorState: EditorState) => {
    editorState.read(() => {
      try {
        const markdown = $convertToMarkdownString(TRANSFORMERS);
        onChange(markdown);
      } catch (error) {
        console.error('Error converting to markdown:', error);
        // Fallback: get text content
        const root = $getRoot();
        const text = root.getTextContent();
        onChange(text);
      }
    });
  };

  return (
    <VStack align="stretch" spacing={0}>
      <Box border="1px" borderColor="gray.300" borderRadius="md" overflow="hidden" bg="white">
        <LexicalComposer initialConfig={initialConfig}>
          <Box position="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  style={{
                    minHeight,
                    padding: '12px',
                    outline: 'none',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontSize: '16px',
                    lineHeight: '1.6',
                  }}
                  className="lexical-content-editable"
                />
              }
              placeholder={
                <Box
                  position="absolute"
                  top="12px"
                  left="12px"
                  color="gray.400"
                  pointerEvents="none"
                  className="lexical-placeholder"
                  style={{ userSelect: 'none' }}
                >
                  {placeholder}
                </Box>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <ListPlugin />
            <LinkPlugin />
            <OnChangePlugin onChange={handleChange} />
            <LoadMarkdownPlugin markdown={value} />
          </Box>
        </LexicalComposer>
      </Box>
      {/* Metrics below editor */}
      <EditorMetrics content={value} />
    </VStack>
  );
}

// Component to show metrics outside the editor
function EditorMetrics({ content }: { content: string }) {
  // Calculate word count from markdown
  const wordCount = content ? content.split(/\s+/).filter(w => w.length > 0).length : 0;
  
  // Calculate H2 count
  const h2Count = (content.match(/^##\s/gm) || []).length;
  const h1Count = (content.match(/^#\s/gm) || []).length;
  
  // Internal links
  const internalLinks = (content.match(/\[\[([^\]]+)\]\]/g) || []).length;
  
  // Simple tone score (placeholder)
  const toneScore = 75; // Would calculate from content
  
  const seoChecks = [
    { item: 'Word count ≥ 800', passed: wordCount >= 800, note: `${wordCount} words` },
    { item: 'H1 present', passed: h1Count === 1, note: `${h1Count} H1` },
    { item: 'H2 sections ≥ 5', passed: h2Count >= 5, note: `${h2Count} H2s` },
    { item: 'Internal links ≥ 3', passed: internalLinks >= 3, note: `${internalLinks} links` },
  ];
  
  const passedCount = seoChecks.filter(c => c.passed).length;
  
  return (
    <HStack spacing={4} p={3} bg="gray.50" borderRadius="md" fontSize="sm">
      <Text fontWeight="semibold">Word Count: {wordCount}</Text>
      <Text>SEO: {passedCount}/{seoChecks.length}</Text>
      <Text>Tone: {toneScore}/100</Text>
    </HStack>
  );
}

// Export the main component
export default LexicalEditorComponent;

// Plugin to load markdown content
function LoadMarkdownPlugin({ markdown }: { markdown: string }) {
  const [editor] = useLexicalComposerContext();
  const loadedRef = useRef<string>('');

  useEffect(() => {
    if (markdown && markdown !== loadedRef.current && editor) {
      editor.update(() => {
        try {
          const root = $getRoot();
          const currentText = root.getTextContent();
          
          // Only load if content is different
          if (currentText.trim() === '' || markdown !== loadedRef.current) {
            root.clear();
            $convertFromMarkdownString(markdown, TRANSFORMERS);
            loadedRef.current = markdown;
          }
        } catch (error) {
          console.error('Error loading markdown:', error);
        }
      });
    }
  }, [markdown, editor]);

  return null;
}

