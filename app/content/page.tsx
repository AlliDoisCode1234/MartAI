'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container, VStack, Heading, Text, Box, Button, HStack, Card, CardBody, Badge, Alert, AlertIcon, Spinner, Input, Textarea, FormControl, FormLabel, Grid, GridItem, Tabs, TabList, TabPanels, Tab, TabPanel, Progress, Divider } from '@chakra-ui/react';
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

type Draft = {
  _id?: string;
  id?: string;
  content: string;
  qualityScore?: number;
  toneScore?: number;
  wordCount?: number;
  status: string;
  issues?: string[];
  strengths?: string[];
  seoCheck?: {
    valid: boolean;
    checklist: Array<{ item: string; passed: boolean; note?: string }>;
  };
};

function ContentContent() {
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const [brief, setBrief] = useState<Brief | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [saving, setSaving] = useState(false);
  const [regenerationNotes, setRegenerationNotes] = useState('');
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
      loadDraft(briefId);
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

  const loadDraft = async (briefId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/drafts?briefId=${briefId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setDraft(data.draft);
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  };

  const handleGenerateDraft = async () => {
    if (!briefId) return;

    setGeneratingDraft(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/drafts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          briefId,
          regenerationNotes: regenerationNotes || undefined,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setDraft(data.draft);
        setRegenerationNotes('');
        alert('Draft generated successfully!');
      } else {
        alert(data.error || 'Failed to generate draft');
      }
    } catch (error) {
      alert('Failed to generate draft');
    } finally {
      setGeneratingDraft(false);
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

  const handleSaveDraft = async () => {
    if (!draft?._id && !draft?.id) return;

    setSaving(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/drafts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          draftId: draft._id || draft.id,
          content: draft.content,
        }),
      });

      if (response.ok) {
        alert('Draft saved successfully!');
        if (briefId) await loadDraft(briefId);
      } else {
        alert('Failed to save draft');
      }
    } catch (error) {
      alert('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handleApproveDraft = async () => {
    if (!draft?._id && !draft?.id) return;

    if (!confirm('Approve this draft? It will be locked for editing.')) return;

    setSaving(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/drafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          draftId: draft._id || draft.id,
        }),
      });

      if (response.ok) {
        alert('Draft approved!');
        if (briefId) {
          await loadDraft(briefId);
          await loadBrief(briefId);
        }
      } else {
        alert('Failed to approve draft');
      }
    } catch (error) {
      alert('Failed to approve draft');
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
                Content Editor
              </Heading>
              {brief?.cluster && (
                <Text color="gray.600">
                  {brief.title} • {brief.cluster.clusterName} • {new Date(brief.scheduledDate || 0).toLocaleDateString()}
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
                size="sm"
              >
                Generate Brief
              </Button>
              <Button
                onClick={handleGenerateDraft}
                isLoading={generatingDraft}
                loadingText="Generating..."
                variant="outline"
                isDisabled={!briefId || !brief?.h2Outline || brief.h2Outline.length === 0}
                size="sm"
              >
                Generate Draft
              </Button>
              <Button
                bg="brand.orange"
                color="white"
                _hover={{ bg: '#E8851A' }}
                onClick={handleSave}
                isLoading={saving}
                loadingText="Saving..."
                size="sm"
              >
                Save
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

          <Tabs colorScheme="orange">
            <TabList>
              <Tab>Brief</Tab>
              <Tab>Draft {draft && `(${draft.status})`}</Tab>
            </TabList>

            <TabPanels>
              {/* Brief Tab */}
              <TabPanel px={0}>
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
        </TabPanel>

        {/* Draft Tab */}
        <TabPanel px={0}>
          {!draft ? (
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <VStack align="start" spacing={2}>
                <Text fontWeight="semibold">No draft yet</Text>
                <Text fontSize="sm">
                  Generate a draft from your brief to create the full content.
                </Text>
                <Button
                  onClick={handleGenerateDraft}
                  isLoading={generatingDraft}
                  size="sm"
                  bg="brand.orange"
                  color="white"
                  isDisabled={!brief?.h2Outline || brief.h2Outline.length === 0}
                >
                  Generate Draft
                </Button>
              </VStack>
            </Alert>
          ) : (
            <VStack spacing={6} align="stretch">
              {/* Draft Scores */}
              <Card>
                <CardBody>
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Quality Score</Text>
                      <Progress value={draft.qualityScore || 0} colorScheme="green" size="lg" mb={2} />
                      <Text fontWeight="bold">{draft.qualityScore || 0}/100</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Tone Score</Text>
                      <Progress value={draft.toneScore || 0} colorScheme="blue" size="lg" mb={2} />
                      <Text fontWeight="bold">{draft.toneScore || 0}/100</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Word Count</Text>
                      <Text fontSize="2xl" fontWeight="bold">{draft.wordCount || 0}</Text>
                      <Text fontSize="xs" color={draft.wordCount && draft.wordCount < 800 ? 'red.500' : 'green.500'}>
                        {draft.wordCount && draft.wordCount < 800 ? 'Below minimum (800)' : 'Good length'}
                      </Text>
                    </Box>
                  </Grid>
                </CardBody>
              </Card>

              {/* Issues & Strengths */}
              {(draft.issues && draft.issues.length > 0) || (draft.strengths && draft.strengths.length > 0) ? (
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                  {draft.issues && draft.issues.length > 0 && (
                    <Alert status="warning" borderRadius="md">
                      <AlertIcon />
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold">Issues</Text>
                        {draft.issues.map((issue, i) => (
                          <Text key={i} fontSize="sm">• {issue}</Text>
                        ))}
                      </VStack>
                    </Alert>
                  )}
                  {draft.strengths && draft.strengths.length > 0 && (
                    <Alert status="success" borderRadius="md">
                      <AlertIcon />
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold">Strengths</Text>
                        {draft.strengths.map((strength, i) => (
                          <Text key={i} fontSize="sm">• {strength}</Text>
                        ))}
                      </VStack>
                    </Alert>
                  )}
                </Grid>
              ) : null}

              {/* SEO Checklist */}
              {draft.seoCheck && (
                <Card>
                  <CardBody>
                    <VStack align="stretch" spacing={3}>
                      <Heading size="sm">SEO Checklist</Heading>
                      {draft.seoCheck.checklist.map((item, i) => (
                        <HStack key={i} justify="space-between">
                          <Text fontSize="sm">{item.item}</Text>
                          <Badge colorScheme={item.passed ? 'green' : 'red'}>
                            {item.passed ? '✓' : '✗'} {item.note || ''}
                          </Badge>
                        </HStack>
                      ))}
                    </VStack>
                  </CardBody>
                </Card>
              )}

              {/* Regeneration Notes */}
              <Card>
                <CardBody>
                  <VStack align="stretch" spacing={3}>
                    <FormLabel>Regeneration Notes (optional)</FormLabel>
                    <Textarea
                      value={regenerationNotes}
                      onChange={(e) => setRegenerationNotes(e.target.value)}
                      placeholder="Add notes for re-generation (e.g., 'Make it more technical', 'Add more examples')"
                      rows={3}
                    />
                  </VStack>
                </CardBody>
              </Card>

              {/* Draft Content Editor */}
              <Card>
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <HStack justify="space-between">
                      <Heading size="md">Draft Content (Markdown)</Heading>
                      <Badge colorScheme={draft.status === 'approved' ? 'green' : 'gray'}>
                        {draft.status}
                      </Badge>
                    </HStack>
                    <Textarea
                      value={draft.content || ''}
                      onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                      placeholder="Draft content will appear here..."
                      rows={20}
                      fontFamily="mono"
                      isReadOnly={draft.status === 'approved'}
                    />
                    <HStack>
                      <Button
                        onClick={handleSaveDraft}
                        isLoading={saving}
                        isDisabled={draft.status === 'approved'}
                      >
                        Save Draft
                      </Button>
                      <Button
                        onClick={handleGenerateDraft}
                        isLoading={generatingDraft}
                        variant="outline"
                      >
                        Re-generate
                      </Button>
                      <Button
                        onClick={handleApproveDraft}
                        bg="green.500"
                        color="white"
                        isDisabled={draft.status === 'approved'}
                      >
                        Approve Draft
                      </Button>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          )}
        </TabPanel>
      </TabPanels>
    </Tabs>
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
