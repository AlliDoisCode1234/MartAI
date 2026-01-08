'use client';

import { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $isTextNode, $isElementNode, type LexicalNode } from 'lexical';
import { Text } from '@chakra-ui/react';

export function useWordCount(): number {
  const [editor] = useLexicalComposerContext();
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        let text = '';

        function traverse(node: LexicalNode) {
          if ($isTextNode(node)) {
            text += node.getTextContent() + ' ';
          } else if ($isElementNode(node)) {
            const children = node.getChildren();
            for (const child of children) {
              traverse(child);
            }
          }
        }

        traverse(root);

        // Count words (split by whitespace, filter empty)
        const wordArray = text
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0);
        const words = wordArray.length;

        setWordCount(words);
      });
    });
  }, [editor]);

  return wordCount;
}

export function WordCountPlugin({
  onWordCountChange,
}: {
  onWordCountChange?: (count: number) => void;
}) {
  const wordCount = useWordCount();

  useEffect(() => {
    if (onWordCountChange) {
      onWordCountChange(wordCount);
    }
  }, [wordCount, onWordCountChange]);

  return (
    <Text fontSize="sm" color="gray.600">
      {wordCount} words
    </Text>
  );
}
