'use client';

/**
 * DraftScoresCard Component
 *
 * Component Hierarchy:
 * App → Content → DraftTab → DraftScoresCard (this file)
 *
 * Quality/Tone scores, word count, SEO status.
 */

import { Card, CardBody, Grid, Box, Text, Progress, Badge } from '@chakra-ui/react';
import type { Draft } from '@/types';

type Props = {
  draft: Draft;
};

export function DraftScoresCard({ draft }: Props) {
  const wordCount =
    draft.wordCount ||
    (draft.content ? draft.content.split(/\s+/).filter((w: string) => w.length > 0).length : 0);

  return (
    <Card>
      <CardBody>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4}>
          <Box>
            <Text fontSize="sm" color="gray.600">
              Quality Score
            </Text>
            <Progress value={draft.qualityScore || 0} colorScheme="green" size="lg" mb={2} />
            <Text fontWeight="bold">{draft.qualityScore || 0}/100</Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.600">
              Tone Score
            </Text>
            <Progress value={draft.toneScore || 0} colorScheme="blue" size="lg" mb={2} />
            <Text fontWeight="bold">{draft.toneScore || 0}/100</Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.600">
              Word Count
            </Text>
            <Text fontSize="2xl" fontWeight="bold">
              {wordCount}
            </Text>
            <Text fontSize="xs" color={wordCount < 800 ? 'red.500' : 'green.500'}>
              {wordCount < 800 ? 'Below minimum (800)' : 'Good length'}
            </Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.600">
              SEO Status
            </Text>
            {draft.seoCheck && (
              <>
                <Badge
                  colorScheme={draft.seoCheck.valid ? 'green' : 'yellow'}
                  mb={2}
                  display="block"
                  w="fit-content"
                >
                  {draft.seoCheck.checklist?.filter((c: { passed: boolean }) => c.passed).length ||
                    0}
                  /{draft.seoCheck.checklist?.length || 0}
                </Badge>
                <Text fontSize="xs" color={draft.seoCheck.valid ? 'green.500' : 'yellow.500'}>
                  {draft.seoCheck.valid ? 'All checks passed' : 'Needs attention'}
                </Text>
              </>
            )}
          </Box>
        </Grid>
      </CardBody>
    </Card>
  );
}
