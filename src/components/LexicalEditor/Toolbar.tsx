'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection } from 'lexical';
import { $isHeadingNode } from '@lexical/rich-text';
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from '@lexical/list';
import { Button, HStack, Box } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

export function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState('paragraph');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const node = selection.getNodes()[0];
          if (node) {
            const parent = node.getParent();
            if ($isHeadingNode(parent)) {
              setBlockType(parent.getTag());
            } else {
              setBlockType('paragraph');
            }
          }
        }
      });
    });
  }, [editor]);

  const formatHeading = (tag: 'h1' | 'h2' | 'h3') => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // Simple implementation - just insert heading
        selection.insertText('');
      }
    });
  };

  const formatBold = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.formatText('bold');
      }
    });
  };

  const formatItalic = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.formatText('italic');
      }
    });
  };

  const insertList = (listType: 'bullet' | 'number') => {
    if (listType === 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  return (
    <HStack spacing={2} p={2} borderBottom="1px" borderColor="gray.200" bg="gray.50">
      <Button
        size="sm"
        variant={blockType === 'h1' ? 'solid' : 'ghost'}
        onClick={() => formatHeading('h1')}
        fontSize="xs"
      >
        H1
      </Button>
      <Button
        size="sm"
        variant={blockType === 'h2' ? 'solid' : 'ghost'}
        onClick={() => formatHeading('h2')}
        fontSize="xs"
      >
        H2
      </Button>
      <Button
        size="sm"
        variant={blockType === 'h3' ? 'solid' : 'ghost'}
        onClick={() => formatHeading('h3')}
        fontSize="xs"
      >
        H3
      </Button>
      <Box w="1px" h="20px" bg="gray.300" />
      <Button
        size="sm"
        variant={isBold ? 'solid' : 'ghost'}
        onClick={formatBold}
        fontWeight="bold"
      >
        B
      </Button>
      <Button
        size="sm"
        variant={isItalic ? 'solid' : 'ghost'}
        onClick={formatItalic}
        fontStyle="italic"
      >
        I
      </Button>
      <Box w="1px" h="20px" bg="gray.300" />
      <Button
        size="sm"
        variant="ghost"
        onClick={() => insertList('bullet')}
        fontSize="xs"
      >
        • List
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => insertList('number')}
        fontSize="xs"
      >
        1. List
      </Button>
    </HStack>
  );
}

