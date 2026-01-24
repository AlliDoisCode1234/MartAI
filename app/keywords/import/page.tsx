'use client';

/**
 * Keywords Import Page
 *
 * Component Hierarchy:
 * App → KeywordsLayout → KeywordsImport (this file)
 *
 * Import keywords from GSC or manual CSV upload.
 */

import { Box, VStack, Heading, Text, Button, HStack, Icon, SimpleGrid } from '@chakra-ui/react';
import { FiUpload, FiDatabase, FiPlus } from 'react-icons/fi';
import { KeywordsLayout } from '@/src/components/keywords';

export default function KeywordsImportPage() {
  return (
    <KeywordsLayout>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="md" color="white" mb={2}>
            Import Keywords
          </Heading>
          <Text color="gray.500">
            Add keywords from Google Search Console or upload a CSV file.
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {/* GSC Import */}
          <Box
            bg="rgba(255,255,255,0.03)"
            p={6}
            borderRadius="16px"
            border="1px solid rgba(255,255,255,0.1)"
            _hover={{ borderColor: '#FF9D00', cursor: 'pointer' }}
            transition="all 0.2s"
          >
            <VStack spacing={4} align="start">
              <Icon as={FiDatabase} boxSize={8} color="#FF9D00" />
              <Heading size="sm" color="white">
                Google Search Console
              </Heading>
              <Text color="gray.500" fontSize="sm">
                Connect your GSC account to import keywords with real search data, impressions, and
                click metrics.
              </Text>
              <Button
                leftIcon={<FiPlus />}
                bg="#FF9D00"
                color="black"
                _hover={{ bg: '#E68A00' }}
                size="sm"
              >
                Connect GSC
              </Button>
            </VStack>
          </Box>

          {/* CSV Upload */}
          <Box
            bg="rgba(255,255,255,0.03)"
            p={6}
            borderRadius="16px"
            border="1px solid rgba(255,255,255,0.1)"
            _hover={{ borderColor: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}
            transition="all 0.2s"
          >
            <VStack spacing={4} align="start">
              <Icon as={FiUpload} boxSize={8} color="gray.400" />
              <Heading size="sm" color="white">
                Upload CSV
              </Heading>
              <Text color="gray.500" fontSize="sm">
                Import a list of keywords from a CSV file. Include columns for keyword, volume, and
                difficulty.
              </Text>
              <Button
                leftIcon={<FiUpload />}
                bg="rgba(255,255,255,0.1)"
                color="white"
                _hover={{ bg: 'rgba(255,255,255,0.15)' }}
                size="sm"
              >
                Choose File
              </Button>
            </VStack>
          </Box>
        </SimpleGrid>
      </VStack>
    </KeywordsLayout>
  );
}
