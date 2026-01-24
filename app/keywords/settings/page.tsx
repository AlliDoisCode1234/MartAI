'use client';

/**
 * Keywords Settings Page
 *
 * Component Hierarchy:
 * App → KeywordsLayout → KeywordsSettings (this file)
 *
 * Keyword preferences and configuration.
 */

import { Box, VStack, Heading, Text, Switch, HStack, Divider } from '@chakra-ui/react';
import { KeywordsLayout } from '@/src/components/keywords';

export default function KeywordsSettingsPage() {
  return (
    <KeywordsLayout>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="md" color="white" mb={2}>
            Keyword Settings
          </Heading>
          <Text color="gray.500">Configure how keywords are managed and displayed.</Text>
        </Box>

        <Box
          bg="rgba(255,255,255,0.03)"
          p={6}
          borderRadius="16px"
          border="1px solid rgba(255,255,255,0.1)"
        >
          <VStack
            spacing={6}
            align="stretch"
            divider={<Divider borderColor="rgba(255,255,255,0.1)" />}
          >
            <HStack justify="space-between">
              <VStack align="start" spacing={0}>
                <Text color="white" fontWeight="medium">
                  Auto-assign Phase
                </Text>
                <Text color="gray.500" fontSize="sm">
                  Automatically assign keywords to Foundation, Authority, or Conversion phase based
                  on intent.
                </Text>
              </VStack>
              <Switch colorScheme="orange" defaultChecked />
            </HStack>

            <HStack justify="space-between">
              <VStack align="start" spacing={0}>
                <Text color="white" fontWeight="medium">
                  Show Difficulty Score
                </Text>
                <Text color="gray.500" fontSize="sm">
                  Display keyword difficulty as a percentage in the library table.
                </Text>
              </VStack>
              <Switch colorScheme="orange" defaultChecked />
            </HStack>

            <HStack justify="space-between">
              <VStack align="start" spacing={0}>
                <Text color="white" fontWeight="medium">
                  Sync with GSC Weekly
                </Text>
                <Text color="gray.500" fontSize="sm">
                  Automatically refresh keyword metrics from Google Search Console every week.
                </Text>
              </VStack>
              <Switch colorScheme="orange" />
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </KeywordsLayout>
  );
}
