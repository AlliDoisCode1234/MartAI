'use client';

/**
 * KeywordSettings
 *
 * Component Hierarchy:
 * App -> Keywords -> KeywordsPage -> KeywordSettings (this file)
 *
 * Keyword preferences and configuration.
 * Inline panel — rendered via display:none toggle, not a separate route.
 */

import { Box, VStack, Heading, Text, Switch, HStack, Divider } from '@chakra-ui/react';

export function KeywordSettings() {
  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="md" color="gray.800" mb={2}>
          Keyword Settings
        </Heading>
        <Text color="gray.600">Configure how keywords are managed and displayed.</Text>
      </Box>

      <Box
        bg="white"
        p={6}
        borderRadius="16px"
        border="1px solid"
        borderColor="gray.200"
        boxShadow="sm"
      >
        <VStack
          spacing={6}
          align="stretch"
          divider={<Divider borderColor="gray.200" />}
        >
          <HStack justify="space-between">
            <VStack align="start" spacing={0}>
              <Text color="gray.800" fontWeight="medium">
                Auto-assign Phase
              </Text>
              <Text color="gray.600" fontSize="sm">
                Automatically assign keywords to Foundation, Authority, or Conversion phase based on
                intent.
              </Text>
            </VStack>
            <Switch colorScheme="orange" defaultChecked />
          </HStack>

          <HStack justify="space-between">
            <VStack align="start" spacing={0}>
              <Text color="gray.800" fontWeight="medium">
                Show Difficulty Score
              </Text>
              <Text color="gray.600" fontSize="sm">
                Display keyword difficulty as a percentage in the library table.
              </Text>
            </VStack>
            <Switch colorScheme="orange" defaultChecked />
          </HStack>

          <HStack justify="space-between">
            <VStack align="start" spacing={0}>
              <Text color="gray.800" fontWeight="medium">
                Sync with GSC Weekly
              </Text>
              <Text color="gray.600" fontSize="sm">
                Automatically refresh keyword metrics from Google Search Console every week.
              </Text>
            </VStack>
            <Switch colorScheme="orange" />
          </HStack>
        </VStack>
      </Box>
    </VStack>
  );
}
