'use client';

import { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $isTextNode, $isElementNode, LexicalNode } from 'lexical';
import { Box, VStack, HStack, Text, Progress } from '@chakra-ui/react';

interface ToneMetrics {
  score: number; // 0-100
  activeVoice: number; // 0-100
  engagement: number; // 0-100
  specificity: number; // 0-100
}

export function useToneMetrics(): ToneMetrics {
  const [editor] = useLexicalComposerContext();
  const [metrics, setMetrics] = useState<ToneMetrics>({
    score: 70,
    activeVoice: 70,
    engagement: 70,
    specificity: 70,
  });

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        let text = '';
        let sentenceCount = 0;
        let wordCount = 0;

        function traverse(node: LexicalNode) {
          if ($isTextNode(node)) {
            const content = node.getTextContent();
            text += content + ' ';
            // Count sentences
            sentenceCount += (content.match(/[.!?]+/g) || []).length;
          }

          if ($isElementNode(node)) {
            const children = node.getChildren();
            for (const child of children) {
              traverse(child);
            }
          }
        }

        traverse(root);

        const words = text
          .trim()
          .split(/\s+/)
          .filter((w) => w.length > 0);
        wordCount = words.length;

        if (wordCount === 0) {
          setMetrics({ score: 70, activeVoice: 70, engagement: 70, specificity: 70 });
          return;
        }

        // Active voice detection (simplified)
        const passiveVoicePattern = /\b(is|are|was|were|been|being)\s+\w+ed\b/gi;
        const passiveMatches = (text.match(passiveVoicePattern) || []).length;
        const activeVoiceScore = Math.max(0, 100 - (passiveMatches / sentenceCount) * 100);

        // Engagement (use of "you", "we", action words)
        const engagingWords = (
          text.match(/\b(you|your|we|our|let's|discover|learn|explore|try|see|find)\b/gi) || []
        ).length;
        const engagementScore = Math.min(100, (engagingWords / wordCount) * 1000);

        // Specificity (numbers, examples, specific details)
        const hasNumbers = /\d+/.test(text);
        const hasExamples = /(for example|such as|like|including)/gi.test(text);
        const specificityScore = (hasNumbers ? 50 : 0) + (hasExamples ? 50 : 0);

        // Overall score (weighted average)
        const overallScore =
          activeVoiceScore * 0.4 + engagementScore * 0.3 + specificityScore * 0.3;

        setMetrics({
          score: Math.round(overallScore),
          activeVoice: Math.round(activeVoiceScore),
          engagement: Math.round(engagementScore),
          specificity: Math.round(specificityScore),
        });
      });
    });
  }, [editor]);

  return metrics;
}

export function ToneMeterPlugin() {
  const metrics = useToneMetrics();
  const colorScheme = metrics.score >= 80 ? 'green' : metrics.score >= 60 ? 'yellow' : 'red';

  return (
    <VStack align="stretch" spacing={2}>
      <HStack justify="space-between">
        <Text fontSize="sm" fontWeight="semibold">
          Brand Tone
        </Text>
        <Text fontSize="sm" fontWeight="bold" color={`${colorScheme}.600`}>
          {metrics.score}/100
        </Text>
      </HStack>
      <Progress value={metrics.score} colorScheme={colorScheme} size="sm" />
      <VStack align="stretch" spacing={1} fontSize="xs">
        <HStack justify="space-between">
          <Text color="gray.600">Active Voice</Text>
          <Text color="gray.600">{metrics.activeVoice}%</Text>
        </HStack>
        <HStack justify="space-between">
          <Text color="gray.600">Engagement</Text>
          <Text color="gray.600">{metrics.engagement}%</Text>
        </HStack>
        <HStack justify="space-between">
          <Text color="gray.600">Specificity</Text>
          <Text color="gray.600">{metrics.specificity}%</Text>
        </HStack>
      </VStack>
    </VStack>
  );
}
