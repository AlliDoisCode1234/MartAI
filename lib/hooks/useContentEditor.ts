'use client';

/**
 * useContentEditor Hook
 *
 * Extracts data fetching and mutation logic from Content page.
 * Handles brief/draft loading, generation, and saving.
 */

import { useState, useEffect, useCallback } from 'react';
import { useConvex, useAction, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Brief, Draft } from '@/types';
// Note: Using string + as unknown + as Id pattern for ID conversions
// because types/index.ts defines custom branded types that don't match Convex's internal Id type
import type { Id } from '@/convex/_generated/dataModel';
import { trackEvent, ANALYTICS_EVENTS } from '@/src/lib/analyticsEvents';
import { sanitizeErrorMessage } from '../errorSanitizer';

// Helper to convert string briefId to typed Id<'briefs'>
const asBriefId = (id: string): Id<'briefs'> => id as unknown as Id<'briefs'>;
const asProjectId = (id: string): Id<'projects'> => id as unknown as Id<'projects'>;
const asDraftId = (id: string): Id<'drafts'> => id as unknown as Id<'drafts'>;

interface ContentEditorState {
  brief: Brief | null;
  draft: Draft | null;
  loading: boolean;
  generating: boolean;
  generatingDraft: boolean;
  saving: boolean;
  formData: BriefFormData;
  regenerationNotes: string;
}

interface BriefFormData {
  title: string;
  titleOptions: string[];
  h2Outline: string[];
  faqs: Array<{ question: string; answer: string }>;
  metaTitle: string;
  metaDescription: string;
  internalLinks: string[];
  schemaSuggestion: string;
}

const initialFormData: BriefFormData = {
  title: '',
  titleOptions: [],
  h2Outline: [],
  faqs: [],
  metaTitle: '',
  metaDescription: '',
  internalLinks: [],
  schemaSuggestion: '',
};

export function useContentEditor(briefId: string | null) {
  const convex = useConvex();
  const [state, setState] = useState<ContentEditorState>({
    brief: null,
    draft: null,
    loading: false,
    generating: false,
    generatingDraft: false,
    saving: false,
    formData: initialFormData,
    regenerationNotes: '',
  });

  const generateBriefAction = useAction(api.content.briefActions.generateBrief);
  const generateDraftAction = useAction(api.content.draftActions.generateDraft);
  const updateBriefMutation = useMutation(api.content.briefs.updateBrief);
  const updateDraftMutation = useMutation(api.content.drafts.updateDraft);

  // Load brief data
  const loadBrief = useCallback(
    async (id: string) => {
      setState((s) => ({ ...s, loading: true }));
      try {
        const briefData = await convex.query(api.content.briefs.getBriefById, {
          briefId: id as Id<'briefs'>,
        });

        if (briefData) {
          setState((s) => ({
            ...s,
            brief: briefData as Brief,
            formData: {
              title: briefData.title || '',
              titleOptions: briefData.titleOptions || [],
              h2Outline: briefData.h2Outline || [],
              faqs: briefData.faqs || [],
              metaTitle: briefData.metaTitle || '',
              metaDescription: briefData.metaDescription || '',
              internalLinks: briefData.internalLinks || [],
              schemaSuggestion: briefData.schemaSuggestion || '',
            },
          }));

          // Auto-generate if brief is empty
          if (!briefData.h2Outline || briefData.h2Outline.length === 0) {
            setState((s) => ({ ...s, generating: true }));
            try {
              const result = await generateBriefAction({
                briefId: id as Id<'briefs'>,
                projectId: briefData.projectId as Id<'projects'>,
                clusterId: briefData.clusterId || undefined,
              });
              if (result.success) {
                // Reload after generation
                const refreshData = await convex.query(api.content.briefs.getBriefById, {
                  briefId: id as Id<'briefs'>,
                });
                if (refreshData) {
                  setState((s) => ({
                    ...s,
                    brief: refreshData as Brief,
                    formData: {
                      title: refreshData.title || '',
                      titleOptions: refreshData.titleOptions || [],
                      h2Outline: refreshData.h2Outline || [],
                      faqs: refreshData.faqs || [],
                      metaTitle: refreshData.metaTitle || '',
                      metaDescription: refreshData.metaDescription || '',
                      internalLinks: refreshData.internalLinks || [],
                      schemaSuggestion: refreshData.schemaSuggestion || '',
                    },
                  }));
                }
              }
            } catch (autoGenError) {
              console.warn('Auto-generation failed:', autoGenError);
            } finally {
              setState((s) => ({ ...s, generating: false }));
            }
          }
        }
      } catch (error) {
        console.error('Error loading brief:', error);
      } finally {
        setState((s) => ({ ...s, loading: false }));
      }
    },
    [convex, generateBriefAction]
  );

  // Load draft data
  const loadDraft = useCallback(
    async (briefId: string) => {
      try {
        const draftData = await convex.query(api.content.drafts.getDraftByBrief, {
          briefId: briefId as Id<'briefs'>,
        });
        if (draftData) {
          setState((s) => ({ ...s, draft: draftData as Draft }));
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    },
    [convex]
  );

  // Load on mount
  useEffect(() => {
    if (briefId) {
      loadBrief(briefId);
      loadDraft(briefId);
    }
  }, [briefId, loadBrief, loadDraft]);

  // Generate brief
  const handleGenerateBrief = useCallback(async () => {
    if (!briefId || !state.brief?.projectId) return;
    setState((s) => ({ ...s, generating: true }));
    try {
      await generateBriefAction({
        briefId: asBriefId(briefId),
        projectId: asProjectId(String(state.brief.projectId)),
        clusterId: state.brief.clusterId || undefined,
      });
      await loadBrief(briefId);
    } catch (error) {
      console.error('Error generating brief:', error);
      alert(sanitizeErrorMessage(error, 'Failed to generate brief'));
    } finally {
      setState((s) => ({ ...s, generating: false }));
    }
  }, [briefId, state.brief, generateBriefAction, loadBrief]);

  // Generate draft
  const handleGenerateDraft = useCallback(async () => {
    if (!briefId) return;
    setState((s) => ({ ...s, generatingDraft: true }));
    try {
      const result = await generateDraftAction({
        briefId: briefId as Id<'briefs'>,
        regenerationNotes: state.regenerationNotes || undefined,
      });
      if (result.success) {
        setState((s) => ({ ...s, draft: result, regenerationNotes: '' }));
      }
    } catch (error) {
      console.error('Error generating draft:', error);
      alert(sanitizeErrorMessage(error, 'Failed to generate draft'));
    } finally {
      setState((s) => ({ ...s, generatingDraft: false }));
    }
  }, [briefId, state.regenerationNotes, generateDraftAction]);

  // Save brief
  const handleSaveBrief = useCallback(async () => {
    if (!briefId) return;
    setState((s) => ({ ...s, saving: true }));
    try {
      await updateBriefMutation({
        briefId: briefId as Id<'briefs'>,
        ...state.formData,
      });
      alert('Brief saved successfully!');
      await loadBrief(briefId);
    } catch (error) {
      console.error('Save brief error:', error);
      alert('Failed to save brief');
    } finally {
      setState((s) => ({ ...s, saving: false }));
    }
  }, [briefId, state.formData, updateBriefMutation, loadBrief]);

  // Save draft
  const handleSaveDraft = useCallback(async () => {
    if (!state.draft?._id) return;
    setState((s) => ({ ...s, saving: true }));
    try {
      await updateDraftMutation({
        draftId: asDraftId(String(state.draft._id)),
        content: state.draft.content,
      });
      alert('Draft saved successfully!');
      if (briefId) await loadDraft(briefId);
    } catch (error) {
      console.error('Save draft error:', error);
      alert('Failed to save draft');
    } finally {
      setState((s) => ({ ...s, saving: false }));
    }
  }, [state.draft, briefId, updateDraftMutation, loadDraft]);

  // Approve draft
  const handleApproveDraft = useCallback(async () => {
    if (!state.draft?._id || !confirm('Approve this draft?')) return;
    setState((s) => ({ ...s, saving: true }));
    try {
      await updateDraftMutation({
        draftId: asDraftId(String(state.draft._id)),
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
      setState((s) => ({ ...s, saving: false }));
    }
  }, [state.draft, briefId, updateDraftMutation, loadDraft, loadBrief]);

  // Update form data
  const setFormData = useCallback((data: BriefFormData) => {
    setState((s) => ({ ...s, formData: data }));
  }, []);

  // Update draft content
  const setDraftContent = useCallback((content: string) => {
    setState((s) => ({
      ...s,
      draft: s.draft ? { ...s.draft, content } : null,
    }));
  }, []);

  // Update regeneration notes
  const setRegenerationNotes = useCallback((notes: string) => {
    setState((s) => ({ ...s, regenerationNotes: notes }));
  }, []);

  return {
    ...state,
    setFormData,
    setDraftContent,
    setRegenerationNotes,
    handleGenerateBrief,
    handleGenerateDraft,
    handleSaveBrief,
    handleSaveDraft,
    handleApproveDraft,
  };
}
