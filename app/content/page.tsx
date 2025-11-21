'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container, VStack, Heading, Text, Box, Button, HStack, Card, CardBody, Badge, Alert, AlertIcon, Spinner, Input, Textarea, FormControl, FormLabel, Grid, GridItem } from '@chakra-ui/react';
import { useAuth } from '@/lib/useAuth';

type Brief = {
  _id?: string;
  id?: string;
  title: string;
  scheduledDate: number;
  clusterId?: string;
  status: string;
  titleOptions?: string[];
  h2Outline?: string[];
  faqs?: Array<{ question: string; answer: string }>;
  metaTitle?: string;
  metaDescription?: string;
  internalLinks?: string[];
  schemaSuggestion?: string;
  cluster?: {
    clusterName: string;
    keywords: string[];
  };
  seoCheck?: {
    valid: boolean;
    issues: string[];
  };
};

function ContentContent() {
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const [brief, setBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const briefId = searchParams?.get('briefId');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    titleOptions: [] as string[],
    h2Outline: [] as string[],
    faqs: [] as Array<{ question: string; answer: string }>,
    metaTitle: '',
    metaDescription: '',
    internalLinks: [] as string[],
    schemaSuggestion: '',
  });

  useEffect(() => {
    if (briefId) {
      loadBrief(briefId);
    }
  }, [briefId]);

  const loadBrief = async (id: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/briefs?briefId=${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setBrief(data.brief);
        setFormData({
          title: data.brief.title || '',
          titleOptions: data.brief.titleOptions || [],
          h2Outline: data.brief.h2Outline || [],
          faqs: data.brief.faqs || [],
          metaTitle: data.brief.metaTitle || '',
          metaDescription: data.brief.metaDescription || '',
          internalLinks: data.brief.internalLinks || [],
          schemaSuggestion: data.brief.schemaSuggestion || '',
        });
      }
    } catch (error) {
      console.error('Error loading brief:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBrief = async () => {
    if (!briefId) return;

    setGenerating(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/briefs/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ briefId }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        await loadBrief(briefId);
        alert('Brief details generated successfully!');
      } else {
        alert(data.error || 'Failed to generate brief');
      }
    } catch (error) {
      alert('Failed to generate brief');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!briefId) return;

    setSaving(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/briefs', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          briefId,
          ...formData,
        }),
      });

      if (response.ok) {
        alert('Brief saved successfully!');
        await loadBrief(briefId);
      } else {
        alert('Failed to save brief');
      }
    } catch (error) {
      alert('Failed to save brief');
    } finally {
      setSaving(false);
    }
  };

  const addTitleOption = () => {
    setFormData({
      ...formData,
      titleOptions: [...formData.titleOptions, ''],
    });
  };

  const updateTitleOption = (index: number, value: string) => {
    const updated = [...formData.titleOptions];
    updated[index] = value;
    setFormData({ ...formData, titleOptions: updated });
  };

  const addH2Section = () => {
    setFormData({
      ...formData,
      h2Outline: [...formData.h2Outline, ''],
    });
  };

  const updateH2Section = (index: number, value: string) => {
    const updated = [...formData.h2Outline];
    updated[index] = value;
    setFormData({ ...formData, h2Outline: updated });
  };

  const addFAQ = () => {
    setFormData({
      ...formData,
      faqs: [...formData.faqs, { question: '', answer: '' }],
    });
  };

  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...formData.faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, faqs: updated });
  };

  const addInternalLink = () => {
    setFormData({
      ...formData,
      internalLinks: [...formData.internalLinks, ''],
    });
  };

  const updateInternalLink = (index: number, value: string) => {
    const updated = [...formData.internalLinks];
    updated[index] = value;
    setFormData({ ...formData, internalLinks: updated });
  };

  if (!isAuthenticated) {
    return (
      <Box minH="calc(100vh - 64px)" bg="brand.light" display="flex" alignItems="center" justifyContent="center">
        <Alert status="warning" maxW="md">
          <AlertIcon />
          Please sign in to view content briefs
        </Alert>
      </Box>
    );
  }

  if (!briefId) {
    return (
      <Box minH="calc(100vh - 64px)" bg="brand.light">
        <Container maxW="container.xl" py={12}>
          <Alert status="info">
            <AlertIcon />
            Select a brief from your quarterly plan to edit
          </Alert>
        </Container>
      </Box>
    );
  }

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
            <VStack align="start" spacing={2}>
              <Heading size="2xl" fontWeight="bold" fontFamily="heading" color="gray.800">
                Content Brief Editor
              </Heading>
              {brief?.cluster && (
                <Text color="gray.600">
                  Cluster: {brief.cluster.clusterName} • Scheduled: {new Date(brief.scheduledDate || 0).toLocaleDateString()}
                </Text>
              )}
            </VStack>
            <HStack>
              <Button
                onClick={handleGenerateBrief}
                isLoading={generating}
                loadingText="Generating..."
                variant="outline"
                isDisabled={!briefId}
              >
                Generate Brief Details
              </Button>
              <Button
                bg="brand.orange"
                color="white"
                _hover={{ bg: '#E8851A' }}
                onClick={handleSave}
                isLoading={saving}
                loadingText="Saving..."
              >
                Save Brief
              </Button>
            </HStack>
          </HStack>

          {/* SEO Checklist */}
          {brief?.seoCheck && (
            <Alert status={brief.seoCheck.valid ? 'success' : 'warning'} borderRadius="md">
              <AlertIcon />
              <VStack align="start" spacing={1}>
                <Text fontWeight="semibold">
                  SEO Checklist: {brief.seoCheck.valid ? '✓ Complete' : '⚠ Needs Attention'}
                </Text>
                {brief.seoCheck.issues.length > 0 && (
                  <Box>
                    {brief.seoCheck.issues.map((issue, i) => (
                      <Text key={i} fontSize="sm">• {issue}</Text>
                    ))}
                  </Box>
                )}
              </VStack>
            </Alert>
          )}

          <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
            {/* Main Brief Editor */}
            <VStack spacing={6} align="stretch">
              {/* Title Options */}
              <Card>
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <HStack justify="space-between">
                      <Heading size="md">Title Options</Heading>
                      <Button size="sm" onClick={addTitleOption}>+ Add</Button>
                    </HStack>
                    {formData.titleOptions.map((title, index) => (
                      <Input
                        key={index}
                        value={title}
                        onChange={(e) => updateTitleOption(index, e.target.value)}
                        placeholder={`Title option ${index + 1}`}
                      />
                    ))}
                    {formData.titleOptions.length === 0 && (
                      <Text color="gray.500" fontSize="sm" fontStyle="italic">
                        Click "Generate Brief Details" or add title options manually
                      </Text>
                    )}
                  </VStack>
                </CardBody>
              </Card>

              {/* H2 Outline */}
              <Card>
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <HStack justify="space-between">
                      <Heading size="md">H2 Outline</Heading>
                      <Button size="sm" onClick={addH2Section}>+ Add</Button>
                    </HStack>
                    {formData.h2Outline.map((section, index) => (
                      <Input
                        key={index}
                        value={section}
                        onChange={(e) => updateH2Section(index, e.target.value)}
                        placeholder={`H2 Section ${index + 1}`}
                      />
                    ))}
                    {formData.h2Outline.length === 0 && (
                      <Text color="gray.500" fontSize="sm" fontStyle="italic">
                        Add main content sections
                      </Text>
                    )}
                  </VStack>
                </CardBody>
              </Card>

              {/* FAQs */}
              <Card>
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <HStack justify="space-between">
                      <Heading size="md">FAQs</Heading>
                      <Button size="sm" onClick={addFAQ}>+ Add</Button>
                    </HStack>
                    {formData.faqs.map((faq, index) => (
                      <VStack key={index} align="stretch" spacing={2}>
                        <Input
                          value={faq.question}
                          onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                          placeholder="Question"
                        />
                        <Textarea
                          value={faq.answer}
                          onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                          placeholder="Answer"
                          rows={2}
                        />
                      </VStack>
                    ))}
                    {formData.faqs.length === 0 && (
                      <Text color="gray.500" fontSize="sm" fontStyle="italic">
                        Add frequently asked questions
                      </Text>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            </VStack>

            {/* Sidebar - Meta & Links */}
            <VStack spacing={6} align="stretch">
              {/* Meta Tags */}
              <Card>
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <Heading size="md">Meta Tags</Heading>
                    <FormControl>
                      <FormLabel>Meta Title</FormLabel>
                      <Input
                        value={formData.metaTitle}
                        onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                        placeholder="50-60 characters"
                      />
                      <Text fontSize="xs" color={formData.metaTitle.length > 60 ? 'red.500' : 'gray.500'}>
                        {formData.metaTitle.length}/60
                      </Text>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Meta Description</FormLabel>
                      <Textarea
                        value={formData.metaDescription}
                        onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                        placeholder="150-160 characters"
                        rows={3}
                      />
                      <Text fontSize="xs" color={formData.metaDescription.length > 160 ? 'red.500' : 'gray.500'}>
                        {formData.metaDescription.length}/160
                      </Text>
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>

              {/* Internal Links */}
              <Card>
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <HStack justify="space-between">
                      <Heading size="md">Internal Links</Heading>
                      <Button size="sm" onClick={addInternalLink}>+ Add</Button>
                    </HStack>
                    {formData.internalLinks.map((link, index) => (
                      <Input
                        key={index}
                        value={link}
                        onChange={(e) => updateInternalLink(index, e.target.value)}
                        placeholder="Related topic or page"
                      />
                    ))}
                    {formData.internalLinks.length === 0 && (
                      <Text color="gray.500" fontSize="sm" fontStyle="italic">
                        Suggest related content to link to
                      </Text>
                    )}
                  </VStack>
                </CardBody>
              </Card>

              {/* Schema Suggestion */}
              <Card>
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <Heading size="md">Schema Suggestion</Heading>
                    <Input
                      value={formData.schemaSuggestion}
                      onChange={(e) => setFormData({ ...formData, schemaSuggestion: e.target.value })}
                      placeholder="e.g., FAQPage, HowTo, Article"
                    />
                    <Text fontSize="sm" color="gray.600">
                      Recommended schema.org type for this content
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}

export default function ContentPage() {
  return (
    <Suspense fallback={
      <Box minH="calc(100vh - 64px)" bg="brand.light" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="brand.orange" />
      </Box>
    }>
      <ContentContent />
    </Suspense>
  );
}
