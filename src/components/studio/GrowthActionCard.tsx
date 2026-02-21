'use client';

/**
 * GrowthActionCard
 *
 * Component Hierarchy:
 * App → StudioLayout → InsightsPage → GrowthActionCard
 *
 * Displays actionable growth recommendations with colored indicators.
 * Each action has a title, description, and optional urgency color.
 */

import { Box, VStack, HStack, Text, Heading } from '@chakra-ui/react';
import { STUDIO_COLORS, STUDIO_CARD } from '@/lib/constants/studioTokens';

interface GrowthAction {
  title: string;
  description: string;
  color?: string;
}

interface Props {
  title?: string;
  actions: GrowthAction[];
}

export function GrowthActionCard({ title = 'Next 3 Growth Actions', actions }: Props) {
  if (actions.length === 0) {
    return (
      <Box {...STUDIO_CARD} p={6}>
        <Heading size="sm" color="white" mb={4}>
          {title}
        </Heading>
        <Text color={STUDIO_COLORS.textMuted} fontSize="sm">
          No actions available yet. Create some content to get started.
        </Text>
      </Box>
    );
  }

  return (
    <Box {...STUDIO_CARD} p={6} h="100%">
      <Heading size="sm" color="white" mb={5}>
        {title}
      </Heading>
      <VStack spacing={5} align="stretch">
        {actions.map((action, idx) => (
          <HStack key={idx} align="flex-start" spacing={3}>
            {/* Colored dot indicator */}
            <Box
              w="8px"
              h="8px"
              borderRadius="full"
              bg={action.color || STUDIO_COLORS.amber}
              flexShrink={0}
              mt="6px"
              boxShadow={`0 0 8px ${action.color || STUDIO_COLORS.amber}40`}
            />
            <Box flex={1}>
              <Text fontSize="sm" fontWeight="semibold" color="white" mb={0.5}>
                {action.title}
              </Text>
              <Text fontSize="xs" color={STUDIO_COLORS.textMuted} lineHeight="tall">
                {action.description}
              </Text>
            </Box>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}
