'use client';

/**
 * Toolbar
 *
 * Component Hierarchy:
 * App -> StudioLayout -> ContentEditorPage -> LexicalEditorComponent -> Toolbar
 *
 * Rich text formatting toolbar for the Lexical editor.
 * Supports headings (H1-H3), bold, italic, and list formatting.
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
} from 'lexical';
import { $isHeadingNode, $createHeadingNode, type HeadingTagType } from '@lexical/rich-text';
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from '@lexical/list';
import { $setBlocksType } from '@lexical/selection';
import { Button, HStack, Box, Icon, Tooltip } from '@chakra-ui/react';
import { useState, useEffect, useCallback } from 'react';
import {
  FiBold,
  FiItalic,
  FiList,
} from 'react-icons/fi';

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
          setIsBold(selection.hasFormat('bold'));
          setIsItalic(selection.hasFormat('italic'));

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

  const formatHeading = useCallback((tag: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (blockType === tag) {
          // Toggle off: convert back to paragraph
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          // Convert to heading
          $setBlocksType(selection, () => $createHeadingNode(tag));
        }
      }
    });
  }, [editor, blockType]);

  const formatBold = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.formatText('bold');
      }
    });
  }, [editor]);

  const formatItalic = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.formatText('italic');
      }
    });
  }, [editor]);

  const insertBulletList = useCallback(() => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  }, [editor]);

  const insertNumberedList = useCallback(() => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  }, [editor]);

  return (
    <HStack
      spacing={1}
      px={3}
      py={2}
      borderBottom="1px"
      borderColor="gray.200"
      bg="gray.50"
      flexWrap="wrap"
    >
      <Tooltip label="Heading 1" fontSize="xs">
        <Button
          size="xs"
          variant={blockType === 'h1' ? 'solid' : 'ghost'}
          colorScheme={blockType === 'h1' ? 'purple' : 'gray'}
          onClick={() => formatHeading('h1')}
          fontSize="xs"
          fontWeight="bold"
        >
          H1
        </Button>
      </Tooltip>
      <Tooltip label="Heading 2" fontSize="xs">
        <Button
          size="xs"
          variant={blockType === 'h2' ? 'solid' : 'ghost'}
          colorScheme={blockType === 'h2' ? 'purple' : 'gray'}
          onClick={() => formatHeading('h2')}
          fontSize="xs"
          fontWeight="bold"
        >
          H2
        </Button>
      </Tooltip>
      <Tooltip label="Heading 3" fontSize="xs">
        <Button
          size="xs"
          variant={blockType === 'h3' ? 'solid' : 'ghost'}
          colorScheme={blockType === 'h3' ? 'purple' : 'gray'}
          onClick={() => formatHeading('h3')}
          fontSize="xs"
          fontWeight="bold"
        >
          H3
        </Button>
      </Tooltip>

      <Box w="1px" h="20px" bg="gray.300" mx={1} />

      <Tooltip label="Bold (Ctrl+B)" fontSize="xs">
        <Button
          size="xs"
          variant={isBold ? 'solid' : 'ghost'}
          colorScheme={isBold ? 'purple' : 'gray'}
          onClick={formatBold}
        >
          <Icon as={FiBold} boxSize={3.5} />
        </Button>
      </Tooltip>
      <Tooltip label="Italic (Ctrl+I)" fontSize="xs">
        <Button
          size="xs"
          variant={isItalic ? 'solid' : 'ghost'}
          colorScheme={isItalic ? 'purple' : 'gray'}
          onClick={formatItalic}
        >
          <Icon as={FiItalic} boxSize={3.5} />
        </Button>
      </Tooltip>

      <Box w="1px" h="20px" bg="gray.300" mx={1} />

      <Tooltip label="Bullet List" fontSize="xs">
        <Button
          size="xs"
          variant="ghost"
          onClick={insertBulletList}
        >
          <Icon as={FiList} boxSize={3.5} />
        </Button>
      </Tooltip>
      <Tooltip label="Numbered List" fontSize="xs">
        <Button
          size="xs"
          variant="ghost"
          onClick={insertNumberedList}
          fontSize="xs"
        >
          1.
        </Button>
      </Tooltip>
    </HStack>
  );
}
