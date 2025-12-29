'use client';

/**
 * Content Page
 *
 * Component Hierarchy:
 * App → Content (this file)
 *
 * Brief editor and draft generator for content creation.
 * Uses extracted card components for modularity.
 */

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  VStack,
  Heading,
  Text,
  Box,
  Button,
  HStack,
  Card,
  CardBody,
  Alert,
  AlertIcon,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Grid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
} from '@chakra-ui/react';
import { useAuth } from '@/lib/useAuth';
import { useAction, useMutation, useQuery, useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { LexicalEditorComponent } from '@/src/components/LexicalEditor';
import type { Brief, Draft } from '@/types';
import { useProject } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import type { ContentTemplate } from '@/lib/constants/contentTemplates';
import type { Id } from '@/convex/_generated/dataModel';

import {
  TitleOptionsCard,
  H2OutlineCard,
  FAQsCard,
  MetaTagsCard,
  DraftScoresCard,
  ContentSkeleton,
  ContentStudioLanding,
} from '@/src/components/content';
import { trackEvent, ANALYTICS_EVENTS } from '@/src/lib/analyticsEvents';
import { sanitizeErrorMessage } from '@/lib/errorSanitizer';
import { CONTENT_TEMPLATES } from '@/lib/constants/contentTemplates';

// Template-based brief creation component
function TemplateBasedBriefCreator({ template }: { template: ContentTemplate }) {
  const router = useRouter();
  const { projectId } = useProject(null, { autoSelect: true });
  const [title, setTitle] = useState('');
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const clusters = useQuery(
    api.seo.keywordClusters.getActiveClusters,
    projectId ? { projectId: projectId as Id<'projects'> } : 'skip'
  );

  const createBrief = useMutation(api.content.briefs.createBrief);

  const handleCreate = async () => {
    if (!projectId || !title.trim()) return;
    setCreating(true);
    try {
      const briefId = await createBrief({
        projectId: projectId as Id<'projects'>,
        clusterId: selectedClusterId ? (selectedClusterId as Id<'keywordClusters'>) : undefined,
        title: title.trim(),
        scheduledDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // Default: 1 week from now
        status: 'in_progress',
        h2Outline: template.structure, // Pre-populate with template structure
      });
      trackEvent(ANALYTICS_EVENTS.BRIEF_CREATED, { briefId, templateId: template.id });
      router.push(`/content?briefId=${briefId}`);
    } catch (error) {
      console.error('Failed to create brief:', error);
      alert('Failed to create brief. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container maxW="container.lg" py={{ base: 8, md: 12 }} px={{ base: 4, md: 8 }}>
        <VStack spacing={8} align="stretch">
          <VStack spacing={2} textAlign="center">
            <Badge colorScheme={template.color} fontSize="sm" px={3} py={1}>
              {template.useCase}
            </Badge>
            <Heading size="xl">Create {template.name}</Heading>
            <Text color="gray.600">{template.description}</Text>
          </VStack>

          <Card>
            <CardBody>
              <VStack align="stretch" spacing={6}>
                <FormControl isRequired>
                  <FormLabel>Content Title</FormLabel>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., How to Improve Your SEO Strategy"
                    size="lg"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Link to Cluster (Optional)</FormLabel>
                  <Box
                    as="select"
                    w="full"
                    p={2}
                    borderWidth={1}
                    borderRadius="md"
                    value={selectedClusterId || ''}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setSelectedClusterId(e.target.value || null)
                    }
                  >
                    <option value="">No cluster - standalone content</option>
                    {clusters?.map(
                      (cluster: { _id: string; clusterName?: string; keywords?: string[] }) => (
                        <option key={cluster._id} value={cluster._id}>
                          {cluster.clusterName} ({cluster.keywords?.length || 0} keywords)
                        </option>
                      )
                    )}
                  </Box>
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    Linking to a cluster helps with SEO targeting
                  </Text>
                </FormControl>

                <Box>
                  <Text fontWeight="medium" mb={2}>
                    Template Structure (H2 Outline)
                  </Text>
                  <VStack align="stretch" spacing={2}>
                    {template.structure.map((section, i) => (
                      <HStack key={i} spacing={3} p={2} bg="gray.50" borderRadius="md">
                        <Badge colorScheme="gray">{i + 1}</Badge>
                        <Text>{section}</Text>
                      </HStack>
                    ))}
                  </VStack>
                  <Text fontSize="sm" color="gray.500" mt={2}>
                    You can edit this structure after creating the brief
                  </Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          <HStack spacing={4} justify="flex-end">
            <Button variant="ghost" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button
              bg="brand.orange"
              color="white"
              _hover={{ bg: '#E8851A' }}
              onClick={handleCreate}
              isLoading={creating}
              loadingText="Creating..."
              isDisabled={!title.trim() || !projectId}
              size="lg"
            >
              Create Brief
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}

function ContentContent() {
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const convex = useConvex();
  const [brief, setBrief] = useState<Brief | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [saving, setSaving] = useState(false);
  const [regenerationNotes, setRegenerationNotes] = useState('');
  const briefId = searchParams?.get('briefId');
  const templateId = searchParams?.get('templateId');
  const selectedTemplate = templateId ? CONTENT_TEMPLATES.find((t) => t.id === templateId) : null;

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

  const generateBriefAction = useAction((api as any).content.briefActions.generateBrief);
  const generateDraftAction = useAction((api as any).content.draftActions.generateDraft);
  const updateBriefMutation = useMutation((api as any).content.briefs.updateBrief);
  const updateDraftMutation = useMutation((api as any).content.drafts.updateDraft);

  useEffect(() => {
    if (briefId) {
      loadBrief(briefId);
      loadDraft(briefId);
    }
  }, [briefId]);

  const loadBrief = async (id: string) => {
    setLoading(true);
    try {
      // Use direct Convex query (avoids 401 auth issues with REST API)
      const briefData = await convex.query(api.content.briefs.getBriefById, {
        briefId: id as any,
      });

      if (briefData) {
        setBrief(briefData as Brief);
        setFormData({
          title: briefData.title || '',
          titleOptions: briefData.titleOptions || [],
          h2Outline: briefData.h2Outline || [],
          faqs: briefData.faqs || [],
          metaTitle: briefData.metaTitle || '',
          metaDescription: briefData.metaDescription || '',
          internalLinks: briefData.internalLinks || [],
          schemaSuggestion: briefData.schemaSuggestion || '',
        });

        // AUTO-GENERATE if brief is empty (no h2Outline means never generated)
        if (!briefData.h2Outline || briefData.h2Outline.length === 0) {
          console.log('[CONTENT EDITOR] Brief is empty, auto-generating...');
          setGenerating(true);
          try {
            const result = await generateBriefAction({
              briefId: id as any,
              projectId: briefData.projectId as any,
              clusterId: briefData.clusterId || undefined,
            });
            if (result.success) {
              console.log('[CONTENT EDITOR] Auto-generation complete, reloading brief...');
              // Reload the brief with generated content
              const refreshData = await convex.query(api.content.briefs.getBriefById, {
                briefId: id as any,
              });
              if (refreshData) {
                setBrief(refreshData as Brief);
                setFormData({
                  title: refreshData.title || '',
                  titleOptions: refreshData.titleOptions || [],
                  h2Outline: refreshData.h2Outline || [],
                  faqs: refreshData.faqs || [],
                  metaTitle: refreshData.metaTitle || '',
                  metaDescription: refreshData.metaDescription || '',
                  internalLinks: refreshData.internalLinks || [],
                  schemaSuggestion: refreshData.schemaSuggestion || '',
                });
              }
            }
          } catch (autoGenError) {
            console.warn('[CONTENT EDITOR] Auto-generation failed:', autoGenError);
          } finally {
            setGenerating(false);
          }
        }
      }
    } catch (error) {
      console.error('Error loading brief:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDraft = async (briefId: string) => {
    try {
      // Use direct Convex query
      const draftData = await convex.query(api.content.drafts.getDraftByBrief, {
        briefId: briefId as any,
      });
      if (draftData) {
        setDraft(draftData as Draft);
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  };

  const handleGenerateBrief = async () => {
    if (!briefId || !brief) return;
    setGenerating(true);
    try {
      const result = await generateBriefAction({
        briefId: briefId as any,
        projectId: brief.projectId as any,
        clusterId: brief.clusterId as any,
      });
      if (result.success) {
        await loadBrief(briefId);
        trackEvent(ANALYTICS_EVENTS.BRIEF_CREATED, { briefId });
        alert('Brief details generated successfully!');
      }
    } catch (error: any) {
      console.error('Error generating brief:', error);
      alert(sanitizeErrorMessage(error, 'Failed to generate brief'));
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateDraft = async () => {
    if (!briefId) return;
    setGeneratingDraft(true);
    try {
      const result = await generateDraftAction({
        briefId: briefId as any,
        regenerationNotes: regenerationNotes || undefined,
      });
      if (result.success) {
        setDraft(result);
        setRegenerationNotes('');
        alert('Draft generated successfully!');
      }
    } catch (error: any) {
      console.error('Error generating draft:', error);
      alert(sanitizeErrorMessage(error, 'Failed to generate draft'));
    } finally {
      setGeneratingDraft(false);
    }
  };

  const handleSave = async () => {
    if (!briefId) return;
    setSaving(true);
    try {
      // Use Convex mutation directly
      await updateBriefMutation({
        briefId: briefId as any,
        ...formData,
      });
      alert('Brief saved successfully!');
      await loadBrief(briefId);
    } catch (error: any) {
      console.error('Save brief error:', error);
      // Check if it's an auth error - redirect to login
      if (error?.message?.includes('Unauthorized') || error?.message?.includes('Not logged in')) {
        alert('Session expired. Please log in again.');
        window.location.href = '/auth/login';
        return;
      }
      alert('Failed to save brief: ' + (error?.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!draft?._id) return;
    setSaving(true);
    try {
      // Use Convex mutation directly
      await updateDraftMutation({
        draftId: draft._id as any,
        content: draft.content,
      });
      alert('Draft saved successfully!');
      if (briefId) await loadDraft(briefId);
    } catch (error) {
      console.error('Save draft error:', error);
      alert('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handleApproveDraft = async () => {
    if (!draft?._id || !confirm('Approve this draft? It will be locked for editing.')) return;
    setSaving(true);
    try {
      // Use Convex mutation directly
      await updateDraftMutation({
        draftId: draft._id as any,
        status: 'approved',
      });
      trackEvent(ANALYTICS_EVENTS.BRIEF_COMPLETED, { briefId });
      alert('Draft approved!');
      if (briefId) {
        await loadDraft(briefId);
        await loadBrief(briefId);
      }
    } catch (error) {
      console.error('Approve draft error:', error);
      alert('Failed to approve draft');
    } finally {
      setSaving(false);
    }
  };

  // Array update helpers
  const updateArray = <T,>(arr: T[], index: number, value: T) => {
    const updated = [...arr];
    updated[index] = value;
    return updated;
  };

  if (!isAuthenticated)
    return (
      <Box
        minH="calc(100vh - 64px)"
        bg="brand.light"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Alert status="warning" maxW="md">
          <AlertIcon />
          Please sign in to view content briefs
        </Alert>
      </Box>
    );

  // No briefId and no templateId - show landing
  if (!briefId && !templateId) return <ContentStudioLanding />;

  // Template selected - show template-based brief creation form
  if (!briefId && selectedTemplate) {
    return <TemplateBasedBriefCreator template={selectedTemplate} />;
  }

  // Show skeleton during loading OR generating (prevents empty state flash)
  if (loading || generating) return <ContentSkeleton />;

  return (
    <Box minH="calc(100vh - 64px)" bg="brand.light">
      <Container
        maxW="container.xl"
        py={{ base: 8, md: 12 }}
        px={{ base: 4, sm: 6, md: 8, lg: 12 }}
      >
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between">
            <VStack align="start" spacing={2}>
              <Heading size="2xl" fontWeight="bold" fontFamily="heading" color="gray.800">
                Content Editor
              </Heading>
              {brief?.cluster && (
                <Text color="gray.600">
                  {brief.title} • {brief.cluster.clusterName} •{' '}
                  {new Date(brief.scheduledDate || 0).toLocaleDateString()}
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

          {/* SEO Checklist Alert */}
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
                      <Text key={i} fontSize="sm">
                        • {issue}
                      </Text>
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
                  <VStack spacing={6} align="stretch">
                    <TitleOptionsCard
                      titles={formData.titleOptions}
                      onAdd={() =>
                        setFormData({ ...formData, titleOptions: [...formData.titleOptions, ''] })
                      }
                      onUpdate={(i, v) =>
                        setFormData({
                          ...formData,
                          titleOptions: updateArray(formData.titleOptions, i, v),
                        })
                      }
                    />
                    <H2OutlineCard
                      sections={formData.h2Outline}
                      onAdd={() =>
                        setFormData({ ...formData, h2Outline: [...formData.h2Outline, ''] })
                      }
                      onUpdate={(i, v) =>
                        setFormData({
                          ...formData,
                          h2Outline: updateArray(formData.h2Outline, i, v),
                        })
                      }
                    />
                    <FAQsCard
                      faqs={formData.faqs}
                      onAdd={() =>
                        setFormData({
                          ...formData,
                          faqs: [...formData.faqs, { question: '', answer: '' }],
                        })
                      }
                      onUpdate={(i, f, v) => {
                        const updated = [...formData.faqs];
                        updated[i] = { ...updated[i], [f]: v };
                        setFormData({ ...formData, faqs: updated });
                      }}
                    />
                  </VStack>
                  <VStack spacing={6} align="stretch">
                    <MetaTagsCard
                      metaTitle={formData.metaTitle}
                      metaDescription={formData.metaDescription}
                      onMetaTitleChange={(v) => setFormData({ ...formData, metaTitle: v })}
                      onMetaDescriptionChange={(v) =>
                        setFormData({ ...formData, metaDescription: v })
                      }
                    />
                    <Card>
                      <CardBody>
                        <VStack align="stretch" spacing={4}>
                          <HStack justify="space-between">
                            <Heading size="md">Internal Links</Heading>
                            <Button
                              size="sm"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  internalLinks: [...formData.internalLinks, ''],
                                })
                              }
                            >
                              + Add
                            </Button>
                          </HStack>
                          {formData.internalLinks.map((link, index) => (
                            <Input
                              key={index}
                              value={link}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  internalLinks: updateArray(
                                    formData.internalLinks,
                                    index,
                                    e.target.value
                                  ),
                                })
                              }
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
                    <Card>
                      <CardBody>
                        <VStack align="stretch" spacing={4}>
                          <Heading size="md">Schema Suggestion</Heading>
                          <Input
                            value={formData.schemaSuggestion}
                            onChange={(e) =>
                              setFormData({ ...formData, schemaSuggestion: e.target.value })
                            }
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
                    <DraftScoresCard draft={draft} />
                    {(draft.issues?.length || draft.strengths?.length) && (
                      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                        {(draft.issues?.length ?? 0) > 0 && (
                          <Alert status="warning" borderRadius="md">
                            <AlertIcon />
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="semibold">Issues</Text>
                              {draft.issues?.map((issue, i) => (
                                <Text key={i} fontSize="sm">
                                  • {issue}
                                </Text>
                              ))}
                            </VStack>
                          </Alert>
                        )}
                        {(draft.strengths?.length ?? 0) > 0 && (
                          <Alert status="success" borderRadius="md">
                            <AlertIcon />
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="semibold">Strengths</Text>
                              {draft.strengths?.map((strength, i) => (
                                <Text key={i} fontSize="sm">
                                  • {strength}
                                </Text>
                              ))}
                            </VStack>
                          </Alert>
                        )}
                      </Grid>
                    )}
                    {draft.seoCheck && (
                      <Card>
                        <CardBody>
                          <VStack align="stretch" spacing={3}>
                            <Heading size="sm">SEO Checklist</Heading>
                            {draft.seoCheck.checklist?.map((item, i) => (
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
                    <Card>
                      <CardBody>
                        <VStack align="stretch" spacing={4}>
                          <HStack justify="space-between">
                            <Heading size="md">Draft Content Editor</Heading>
                            <Badge colorScheme={draft.status === 'approved' ? 'green' : 'gray'}>
                              {draft.status}
                            </Badge>
                          </HStack>
                          <LexicalEditorComponent
                            value={draft.content || ''}
                            onChange={(markdown) => setDraft({ ...draft, content: markdown })}
                            placeholder="Draft content will appear here..."
                            minHeight="500px"
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
    <Suspense fallback={<ContentSkeleton />}>
      <ContentContent />
    </Suspense>
  );
}
