'use client';

import { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $isTextNode, $isElementNode, LexicalNode } from 'lexical';
import { $isHeadingNode } from '@lexical/rich-text';
import { VStack, HStack, Text, Badge, Box } from '@chakra-ui/react';

interface SEOCheck {
  item: string;
  passed: boolean;
  note?: string;
  value?: number;
  target?: number;
}

export function useSEOValidation(content: string): SEOCheck[] {
  const [editor] = useLexicalComposerContext();
  const [checks, setChecks] = useState<SEOCheck[]>([]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        let wordCount = 0;
        let h1Count = 0;
        let h2Count = 0;
        let h3Count = 0;
        let text = '';
        let internalLinks = 0;

        function traverse(node: LexicalNode) {
          if ($isTextNode(node)) {
            const textContent = node.getTextContent();
            text += textContent + ' ';
            // Count internal link placeholders
            const matches = textContent.match(/\[\[([^\]]+)\]\]/g);
            if (matches) {
              internalLinks += matches.length;
            }
          } else if ($isHeadingNode(node)) {
            const tag = node.getTag();
            if (tag === 'h1') h1Count++;
            else if (tag === 'h2') h2Count++;
            else if (tag === 'h3') h3Count++;
          }

          if ($isElementNode(node)) {
            const children = node.getChildren();
            for (const child of children) {
              traverse(child);
            }
          }
        }

        traverse(root);

        // Count words
        const wordArray = text
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0);
        wordCount = wordArray.length;

        // Calculate H2 density
        const h2Density = wordCount > 0 ? (h2Count / wordCount) * 1000 : 0;

        const newChecks: SEOCheck[] = [
          {
            item: 'Word count ≥ 800',
            passed: wordCount >= 800,
            note: `${wordCount} words`,
            value: wordCount,
            target: 800,
          },
          {
            item: 'H1 title present',
            passed: h1Count === 1,
            note: `${h1Count} H1${h1Count !== 1 ? ' (should be 1)' : ''}`,
            value: h1Count,
            target: 1,
          },
          {
            item: 'H2 sections ≥ 5',
            passed: h2Count >= 5,
            note: `${h2Count} H2 sections`,
            value: h2Count,
            target: 5,
          },
          {
            item: 'H2 density (per 1000 words)',
            passed: h2Density >= 4 && h2Density <= 10,
            note: `${h2Density.toFixed(1)} H2s per 1000 words`,
            value: h2Density,
            target: 5,
          },
          {
            item: 'Internal links ≥ 3',
            passed: internalLinks >= 3,
            note: `${internalLinks} internal link placeholders`,
            value: internalLinks,
            target: 3,
          },
        ];

        setChecks(newChecks);
      });
    });
  }, [editor, content]);

  return checks;
}

export function SEOValidationPlugin({ content }: { content: string }) {
  const checks = useSEOValidation(content);
  const allPassed = checks.every((c) => c.passed);
  const passedCount = checks.filter((c) => c.passed).length;

  return (
    <VStack align="stretch" spacing={2}>
      <HStack justify="space-between">
        <Text fontSize="sm" fontWeight="semibold">
          SEO Checklist
        </Text>
        <Badge colorScheme={allPassed ? 'green' : 'yellow'}>
          {passedCount}/{checks.length}
        </Badge>
      </HStack>
      <VStack align="stretch" spacing={1}>
        {checks.map((check, i) => (
          <HStack key={i} justify="space-between" fontSize="xs">
            <Text color={check.passed ? 'green.600' : 'red.600'}>
              {check.passed ? '✓' : '✗'} {check.item}
            </Text>
            {check.note && (
              <Text color="gray.500" fontSize="xs">
                {check.note}
              </Text>
            )}
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
}
