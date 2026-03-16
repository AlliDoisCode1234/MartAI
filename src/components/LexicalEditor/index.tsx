'use client';

/**
 * LexicalEditorComponent
 *
 * Component Hierarchy:
 * App -> StudioLayout -> ContentEditorPage -> LexicalEditorComponent
 *
 * Rich text editor with markdown I/O, built on Meta's Lexical framework.
 * Supports programmatic content updates via onEditorReady callback,
 * enabling AI revision flows (Phoo Coach) with full undo/redo support.
 *
 * ARCHITECTURE NOTE:
 * This editor uses a "semi-controlled" pattern:
 * - value prop loads content INITIALLY and when EXTERNAL sources change
 * - onChange syncs editor changes OUT to the parent
 * - The editor tracks its own output to avoid reload loops
 * - For AI revision, use editor.update() directly (not the value prop)
 */

import { useEffect, useRef, useCallback } from 'react';
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
import { $getRoot, EditorState, type LexicalEditor } from 'lexical';
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from '@lexical/markdown';
import { Box, VStack } from '@chakra-ui/react';
import { Toolbar } from './Toolbar';
import './editor.css';

// Re-export type for parent component usage
export type { LexicalEditor } from 'lexical';

// Re-export markdown utilities for use in parent (AI revision flow)
export { $getRoot } from 'lexical';
export { $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';

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
  console.error('[LexicalEditor] Error:', error);
}

interface Props {
  readonly value: string;
  readonly onChange: (markdown: string) => void;
  readonly placeholder?: string;
  readonly isReadOnly?: boolean;
  readonly minHeight?: string;
  /** Called once when the editor instance is ready. Use this to get a ref for programmatic updates (e.g., AI revision). */
  readonly onEditorReady?: (editor: LexicalEditor) => void;
}

export function LexicalEditorComponent({
  value,
  onChange,
  placeholder = 'Start typing...',
  isReadOnly = false,
  minHeight = '400px',
  onEditorReady,
}: Props) {
  const initialConfig = {
    namespace: 'MartAIContentEditor',
    theme,
    onError,
    editable: !isReadOnly,
    nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, LinkNode],
  };

  /**
   * Ref to track the last markdown string the editor outputted via OnChangePlugin.
   * Used by ExternalContentSyncPlugin to distinguish "sync-back" changes
   * (from the editor itself) vs genuine external changes (Convex data load).
   * This prevents the reload loop where:
   *   user types → OnChangePlugin → setContent → value prop updates
   *   → sync plugin tries to reload → cursor resets → infinite loop
   */
  const lastEditorOutputRef = useRef<string>('');

  const handleChange = useCallback((editorState: EditorState) => {
    editorState.read(() => {
      try {
        const markdown = $convertToMarkdownString(TRANSFORMERS);
        lastEditorOutputRef.current = markdown;
        onChange(markdown);
      } catch (error) {
        console.error('[LexicalEditor] Error converting to markdown:', error);
        const root = $getRoot();
        const text = root.getTextContent();
        lastEditorOutputRef.current = text;
        onChange(text);
      }
    });
  }, [onChange]);

  return (
    <VStack align="stretch" spacing={0} flex={1}>
      <Box
        border="none"
        borderRadius="md"
        overflow="hidden"
        bg="transparent"
        flex={1}
        display="flex"
        flexDirection="column"
      >
        <LexicalComposer initialConfig={initialConfig}>
          {!isReadOnly && <Toolbar />}
          <Box position="relative" flex={1}>
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  style={{
                    minHeight,
                    padding: '24px',
                    outline: 'none',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontSize: '16px',
                    lineHeight: '1.8',
                    color: '#1a202c',
                  }}
                  className="lexical-content-editable"
                  aria-label="Content editor"
                />
              }
              placeholder={
                <Box
                  position="absolute"
                  top="24px"
                  left="24px"
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
            <ExternalContentSyncPlugin
              markdown={value}
              lastEditorOutputRef={lastEditorOutputRef}
            />
            <EditorReadyPlugin onEditorReady={onEditorReady} />
          </Box>
        </LexicalComposer>
      </Box>
    </VStack>
  );
}

export default LexicalEditorComponent;

/**
 * Plugin to sync external content (from Convex/props) into the editor.
 *
 * CRITICAL: This plugin solves the bidirectional sync loop:
 * - When the user types, OnChangePlugin fires → parent calls setContent → value prop changes
 * - This plugin sees the new value BUT recognizes it came from the editor (matches lastEditorOutputRef)
 * - So it SKIPS reloading, preventing cursor reset and infinite loops
 *
 * - When Convex sends new content (initial load, server refresh), the value is DIFFERENT
 *   from what the editor last outputted → this plugin DOES reload
 */
function ExternalContentSyncPlugin({
  markdown,
  lastEditorOutputRef,
}: {
  readonly markdown: string;
  readonly lastEditorOutputRef: React.RefObject<string>;
}) {
  const [editor] = useLexicalComposerContext();
  const hasLoadedInitialRef = useRef(false);

  useEffect(() => {
    // UX-042: Allow empty string '' to propagate (clears editor).
    // Only skip null/undefined — empty string is a legitimate "clear content" signal.
    if (markdown == null || !editor) return;

    // Skip if this markdown came from the editor itself (OnChangePlugin sync-back)
    if (markdown === lastEditorOutputRef.current) return;

    // For initial load: always load
    // For subsequent changes: only load if it's genuinely external content
    if (!hasLoadedInitialRef.current) {
      hasLoadedInitialRef.current = true;
    }

    editor.update(() => {
      try {
        $getRoot().clear();
        // UX-042: Only convert non-empty markdown; empty '' just clears.
        if (markdown) {
          $convertFromMarkdownString(markdown, TRANSFORMERS);
        }
      } catch (error) {
        console.error('[LexicalEditor] Error loading markdown:', error);
      }
    });
  }, [markdown, editor, lastEditorOutputRef]);

  return null;
}

/**
 * Plugin to expose the editor instance to the parent component.
 * Fires onEditorReady once when mounted, giving the parent a ref
 * for programmatic updates (e.g., AI revision via editor.update()).
 */
function EditorReadyPlugin({
  onEditorReady,
}: {
  readonly onEditorReady?: (editor: LexicalEditor) => void;
}) {
  const [editor] = useLexicalComposerContext();
  const calledRef = useRef(false);

  useEffect(() => {
    if (onEditorReady && !calledRef.current) {
      calledRef.current = true;
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  return null;
}
