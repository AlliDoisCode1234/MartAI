'use client';

import { useState, useEffect } from 'react';
import { Container, VStack, Heading, Text, Box, Button, HStack, Grid, GridItem, Badge, Input, Select, Table, Thead, Tbody, Tr, Th, Td, Alert, AlertIcon, Spinner } from '@chakra-ui/react';
import { sessionStorageUtil } from '@/lib/storage';

type Keyword = {
  _id: string;
  keyword: string;
  searchVolume?: number;
  difficulty?: number;
  cpc?: number;
  intent?: string;
  priority?: string;
  status: string;
  reasoning?: string;
};

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: 'all', priority: 'all' });
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  useEffect(() => {
    loadKeywords();
  }, []);

  const loadKeywords = async () => {
    try {
      // In production, fetch from Convex
      const stored = sessionStorageUtil.getSeoAnalysis<any>();
      if (stored) {
        const analysis = stored;
        const keywordResults = analysis.toolResults?.find((r: any) => r.toolName === 'generateKeywords')?.result || [];
        setKeywords(keywordResults.map((kw: any, i: number) => ({
          _id: `kw-${i}`,
          keyword: kw.keyword,
          searchVolume: kw.searchVolume,
          difficulty: kw.difficulty,
          cpc: kw.cpc,
          intent: kw.intent,
          priority: kw.priority,
          status: 'suggested',
          reasoning: kw.reasoning,
        })));
      }
    } catch (error) {
      console.error('Error loading keywords:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = async (platform: 'wordpress' | 'shopify') => {
    const stored = sessionStorageUtil.getSeoAnalysis<any>();
    if (!stored) return;

    const analysis = stored;
    const businessInfo = analysis.businessInfo;
    const selectedKws = selectedKeywords.length > 0 
      ? keywords.filter(k => selectedKeywords.includes(k._id)).map(k => k.keyword)
      : keywords.slice(0, 10).map(k => k.keyword);

    // Show OAuth flow
    if (platform === 'wordpress') {
      const siteUrl = prompt('Enter your WordPress site URL:');
      if (!siteUrl) return;
      
      const username = prompt('Enter WordPress username:');
      const password = prompt('Enter WordPress Application Password:');
      
      if (!username || !password) return;

      try {
        const response = await fetch('/api/automation/create-page', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            platform: 'wordpress',
            companyName: businessInfo.companyName,
            industry: businessInfo.industry,
            targetAudience: businessInfo.targetAudience,
            keywords: selectedKws,
            siteUrl,
            username,
            password,
          }),
        });

        const result = await response.json();
        if (result.success) {
          alert(`Page created successfully! ${result.pageUrl}`);
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        alert('Failed to create page');
      }
    } else if (platform === 'shopify') {
      const shopDomain = prompt('Enter your Shopify shop domain (e.g., mystore.myshopify.com):');
      if (!shopDomain) return;
      
      const accessToken = prompt('Enter Shopify Access Token:');
      if (!accessToken) return;

      try {
        const response = await fetch('/api/automation/create-page', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            platform: 'shopify',
            companyName: businessInfo.companyName,
            industry: businessInfo.industry,
            targetAudience: businessInfo.targetAudience,
            keywords: selectedKws,
            shopDomain,
            password: accessToken,
          }),
        });

        const result = await response.json();
        if (result.success) {
          alert(`Page created successfully! ${result.pageUrl}`);
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        alert('Failed to create page');
      }
    }
  };

  const filteredKeywords = keywords.filter(kw => {
    if (filter.status !== 'all' && kw.status !== filter.status) return false;
    if (filter.priority !== 'all' && kw.priority !== filter.priority) return false;
    return true;
  });

  const getIntentColor = (intent?: string) => {
    switch (intent) {
      case 'transactional': return 'red';
      case 'commercial': return 'orange';
      case 'informational': return 'blue';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <Box minH="calc(100vh - 64px)" bg="brand.light" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="brand.orange" />
      </Box>
    );
  }

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container maxW="container.xl" py={{ base: 8, md: 12 }} px={{ base: 4, sm: 6, md: 8, lg: 12 }}>
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between">
            <Heading size="2xl" fontWeight="bold" fontFamily="heading" color="gray.800">
              Keyword Research
            </Heading>
            <HStack>
              <Button 
                bg="brand.orange" 
                color="white" 
                onClick={() => handleCreatePage('wordpress')}
                isDisabled={keywords.length === 0}
              >
                Create WordPress Page
              </Button>
              <Button 
                bg="brand.teal" 
                color="white" 
                onClick={() => handleCreatePage('shopify')}
                isDisabled={keywords.length === 0}
              >
                Create Shopify Page
              </Button>
            </HStack>
          </HStack>

          {keywords.length === 0 ? (
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              No keywords found. Please complete the onboarding process first.
            </Alert>
          ) : (
            <>
              <HStack spacing={4}>
                <Select 
                  value={filter.status} 
                  onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                  maxW="200px"
                >
                  <option value="all">All Status</option>
                  <option value="suggested">Suggested</option>
                  <option value="approved">Approved</option>
                  <option value="implemented">Implemented</option>
                </Select>
                <Select 
                  value={filter.priority} 
                  onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
                  maxW="200px"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </Select>
                <Text color="gray.600">
                  {filteredKeywords.length} keywords
                </Text>
              </HStack>

              <Box bg="white" p={6} borderRadius="lg" shadow="md" overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>
                        <input 
                          type="checkbox" 
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedKeywords(filteredKeywords.map(k => k._id));
                            } else {
                              setSelectedKeywords([]);
                            }
                          }}
                        />
                      </Th>
                      <Th>Keyword</Th>
                      <Th>Intent</Th>
                      <Th>Priority</Th>
                      <Th>Volume</Th>
                      <Th>Difficulty</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredKeywords.map((keyword) => (
                      <Tr key={keyword._id}>
                        <Td>
                          <input 
                            type="checkbox" 
                            checked={selectedKeywords.includes(keyword._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedKeywords([...selectedKeywords, keyword._id]);
                              } else {
                                setSelectedKeywords(selectedKeywords.filter(id => id !== keyword._id));
                              }
                            }}
                          />
                        </Td>
                        <Td>
                          <Text fontWeight="medium">{keyword.keyword}</Text>
                          {keyword.reasoning && (
                            <Text fontSize="xs" color="gray.600">{keyword.reasoning}</Text>
                          )}
                        </Td>
                        <Td>
                          <Badge colorScheme={getIntentColor(keyword.intent)}>
                            {keyword.intent || 'N/A'}
                          </Badge>
                        </Td>
                        <Td>
                          <Badge colorScheme={getPriorityColor(keyword.priority)}>
                            {keyword.priority || 'medium'}
                          </Badge>
                        </Td>
                        <Td>{keyword.searchVolume ? keyword.searchVolume.toLocaleString() : 'N/A'}</Td>
                        <Td>{keyword.difficulty ? `${keyword.difficulty}/100` : 'N/A'}</Td>
                        <Td>
                          <Badge>{keyword.status}</Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </>
          )}
        </VStack>
      </Container>
    </Box>
  );
}

