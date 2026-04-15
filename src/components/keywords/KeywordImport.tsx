'use client';

/**
 * KeywordImport
 *
 * Component Hierarchy:
 * App -> Keywords -> KeywordsPage -> KeywordImport (this file)
 *
 * Import keywords from GSC (connection-aware) or manual CSV upload.
 * Inline panel — rendered via display:none toggle, not a separate route.
 */

import { useState, useRef } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Icon,
  SimpleGrid,
  HStack,
  Badge,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { FiUpload, FiDatabase, FiPlus, FiRefreshCw, FiCheck } from 'react-icons/fi';
import { useQuery, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useProjectContext } from '@/src/providers/ProjectProvider';
import { Id } from '@/convex/_generated/dataModel';

export function KeywordImport() {
  const { projectId } = useProjectContext();
  const toast = useToast();
  const [isSyncingGsc, setIsSyncingGsc] = useState(false);
  const [isSyncingAi, setIsSyncingAi] = useState(false);
  const [isUploadingCsv, setIsUploadingCsv] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check GSC connection status
  const gscConnection = useQuery(
    api.integrations.gscConnections.getGSCConnection,
    projectId ? { projectId: projectId as Id<'projects'> } : 'skip'
  );

  const generateClusters = useAction(api.seo.keywordActions.generateClusters);
  const generateFromUrl = useAction(api.seo.keywordActions.generateKeywordsFromUrl);

  const isGscConnected = !!gscConnection;

  const handleGscSync = async () => {
    if (!projectId) return;
    setIsSyncingGsc(true);
    try {
      const result = await generateClusters({
        projectId: projectId as Id<'projects'>,
        importFromGSC: true,
      });

      if (!result.success && 'error' in result) {
        throw new Error((result as any).error);
      }

      toast({
        title: 'GSC Sync Complete',
        description: `Imported and clustered ${result.count} keyword groups from Google Search Console.`,
        status: 'success',
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: 'Sync failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSyncingGsc(false);
    }
  };

  const handleGenerateFromUrl = async () => {
    if (!projectId) return;
    setIsSyncingAi(true);
    try {
      const result = await generateFromUrl({
        projectId: projectId as Id<'projects'>,
        limit: 50,
      });

      if (!result.success && 'error' in result) {
        throw new Error((result as Extract<typeof result, { error?: string }>).error || 'Generation failed');
      }

      toast({
        title: 'Keywords Generated',
        description: `Discovered ${result.count} keywords from your website profile.`,
        status: 'success',
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: 'Generation failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSyncingAi(false);
    }
  };

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !projectId) return;

    setIsUploadingCsv(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) throw new Error("Empty file");

        const lines = text.split('\n').filter(l => l.trim() !== '');
        if (lines.length < 2) throw new Error("File must contain a header and at least one keyword row");

        // Simple CSV parser assuming: Keyword, Volume, Difficulty
        const keywords = lines.slice(1).map(line => {
          const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
          const keyword = cols[0];
          const volume = parseInt(cols[1], 10) || 500;
          const difficulty = parseInt(cols[2], 10) || 40;
          
          return {
            keyword,
            volume,
            difficulty,
            intent: 'informational' // default intent
          };
        }).filter(k => k.keyword.length > 0);

        if (keywords.length === 0) throw new Error("No valid keywords found in CSV");

        const result = await generateClusters({
          projectId: projectId as Id<'projects'>,
          keywords
        });

        if (!result.success && 'error' in result) {
          throw new Error((result as any).error);
        }

        toast({
          title: 'CSV Imported',
          description: `Imported and clustered ${result.count} keyword groups.`,
          status: 'success',
          duration: 5000,
        });

      } catch (error) {
        toast({
          title: 'Upload failed',
          description: error instanceof Error ? error.message : 'Invalid CSV format',
          status: 'error',
          duration: 5000,
        });
      } finally {
        setIsUploadingCsv(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    
    reader.onerror = () => {
      toast({ title: 'Error reading file', status: 'error', duration: 3000 });
      setIsUploadingCsv(false);
    };

    reader.readAsText(file);
  };

  return (
    <VStack spacing={8} align="stretch">
      <Box>
        <Heading size="md" color="white" mb={2}>
          Import Keywords
        </Heading>
        <Text color="gray.500">
          {isGscConnected
            ? 'Sync keywords from your connected Google Search Console or upload a CSV file.'
            : 'Connect Google Search Console for real search data, or upload a CSV file.'}
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {/* GSC Import — connection-aware */}
        <Box
          bg={isGscConnected ? 'rgba(52,211,153,0.04)' : 'rgba(255,255,255,0.03)'}
          p={6}
          borderRadius="16px"
          border={
            isGscConnected ? '1px solid rgba(52,211,153,0.2)' : '1px solid rgba(255,255,255,0.1)'
          }
          _hover={{ borderColor: isGscConnected ? '#34d399' : '#FF9D00', cursor: 'pointer' }}
          transition="all 0.2s"
        >
          <VStack spacing={4} align="start">
            <HStack spacing={3} w="100%" justify="space-between">
              <Icon as={FiDatabase} boxSize={8} color={isGscConnected ? '#34d399' : '#FF9D00'} />
              {isGscConnected && (
                <Badge
                  bg="rgba(52,211,153,0.15)"
                  color="#34d399"
                  fontSize="10px"
                  fontWeight="bold"
                  px={2}
                  py={0.5}
                  borderRadius="4px"
                >
                  <HStack spacing={1}>
                    <Icon as={FiCheck} boxSize={3} />
                    <Text>CONNECTED</Text>
                  </HStack>
                </Badge>
              )}
            </HStack>
            <Heading size="sm" color="white">
              Google Search Console
            </Heading>
            <Text color="gray.500" fontSize="sm">
              {isGscConnected
                ? `Connected to ${gscConnection.siteUrl}. Sync to pull your latest keywords with real impressions and click data.`
                : 'Connect your GSC account to import keywords with real search data, impressions, and click metrics.'}
            </Text>
            {isGscConnected ? (
              <Button
                leftIcon={isSyncingGsc ? <Spinner size="xs" /> : <FiRefreshCw />}
                bg="#34d399"
                color="black"
                _hover={{ bg: '#2bc48a' }}
                size="sm"
                fontWeight="semibold"
                isDisabled={isSyncingGsc}
                onClick={handleGscSync}
              >
                {isSyncingGsc ? 'Syncing...' : 'Sync from GSC'}
              </Button>
            ) : (
              <Button
                leftIcon={<FiPlus />}
                bg="#FF9D00"
                color="black"
                _hover={{ bg: '#E68A00' }}
                size="sm"
                onClick={() => (window.location.href = '/settings?tab=integrations')}
              >
                Connect GSC
              </Button>
            )}
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
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleCsvUpload}
            />
            <Button
              leftIcon={isUploadingCsv ? <Spinner size="xs" /> : <FiUpload />}
              bg="rgba(255,255,255,0.1)"
              color="white"
              _hover={{ bg: 'rgba(255,255,255,0.15)' }}
              size="sm"
              isDisabled={isUploadingCsv}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploadingCsv ? 'Uploading...' : 'Choose File'}
            </Button>
          </VStack>
        </Box>

        {/* AI Discovery */}
        <Box
          bg="rgba(167,139,250,0.04)"
          p={6}
          borderRadius="16px"
          border="1px solid rgba(167,139,250,0.15)"
          _hover={{ borderColor: '#a78bfa', cursor: 'pointer' }}
          transition="all 0.2s"
        >
          <VStack spacing={4} align="start">
            <Icon as={FiRefreshCw} boxSize={8} color="#a78bfa" />
            <Heading size="sm" color="white">
              AI Keyword Discovery
            </Heading>
            <Text color="gray.500" fontSize="sm">
              Let AI analyze your website and industry to discover high-value keywords
              automatically.
            </Text>
            <Button
              leftIcon={isSyncingAi ? <Spinner size="xs" /> : <FiPlus />}
              bg="rgba(167,139,250,0.2)"
              color="#a78bfa"
              border="1px solid rgba(167,139,250,0.3)"
              _hover={{ bg: 'rgba(167,139,250,0.3)' }}
              size="sm"
              fontWeight="semibold"
              isDisabled={isSyncingAi}
              onClick={handleGenerateFromUrl}
            >
              {isSyncingAi ? 'Discovering...' : 'Discover Keywords'}
            </Button>
          </VStack>
        </Box>
      </SimpleGrid>
    </VStack>
  );
}
