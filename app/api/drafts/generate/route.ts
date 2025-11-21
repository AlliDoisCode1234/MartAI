import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { generateDraftFromBrief } from '@/lib/draftGenerator';
import { callConvexQuery, callConvexMutation } from '@/lib/convexClient';

// Import api dynamically
let api: any = null;
if (typeof window === 'undefined') {
  try {
    api = require('@/convex/_generated/api')?.api;
  } catch {
    api = null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { briefId, regenerationNotes } = body;

    if (!briefId) {
      return NextResponse.json(
        { error: 'briefId is required' },
        { status: 400 }
      );
    }

    if (!api) {
      return NextResponse.json(
        { error: 'Convex not configured' },
        { status: 503 }
      );
    }

    // Get brief with details
    const brief = await callConvexQuery(api.briefs.getBriefById, {
      briefId: briefId as any,
    });

    if (!brief) {
      return NextResponse.json(
        { error: 'Brief not found' },
        { status: 404 }
      );
    }

    // Check if brief has required details
    if (!brief.h2Outline || brief.h2Outline.length === 0) {
      return NextResponse.json(
        { error: 'Brief details not generated. Please generate brief details first.' },
        { status: 400 }
      );
    }

    // Get cluster info
    let cluster = null;
    if (brief.clusterId) {
      try {
        const clusters = await callConvexQuery(api.keywordClusters.getClustersByProject, {
          projectId: brief.projectId,
        });
        cluster = clusters?.find((c: any) => c._id === brief.clusterId);
      } catch (error) {
        console.warn('Failed to get cluster:', error);
      }
    }

    // Get project details
    const project = await callConvexQuery(api.projects.getProjectById, {
      projectId: brief.projectId,
    });

    // Generate draft
    const draftResult = await generateDraftFromBrief(
      {
        title: brief.title,
        titleOptions: brief.titleOptions,
        h2Outline: brief.h2Outline,
        faqs: brief.faqs,
        metaTitle: brief.metaTitle,
        metaDescription: brief.metaDescription,
        internalLinks: brief.internalLinks,
        schemaSuggestion: brief.schemaSuggestion,
        cluster: cluster ? {
          clusterName: cluster.clusterName,
          keywords: cluster.keywords,
          intent: cluster.intent,
        } : undefined,
      },
      project?.websiteUrl,
      project?.industry,
      undefined, // brandVoice can be added later
      regenerationNotes
    );

    // Check if draft already exists
    const existingDraft = await callConvexQuery(api.drafts.getDraftByBrief, {
      briefId: briefId as any,
    });

    let draftId;
    if (existingDraft) {
      // Update existing draft
      await callConvexMutation(api.drafts.updateDraft, {
        draftId: existingDraft._id,
        content: draftResult.content,
        qualityScore: draftResult.qualityScore,
        toneScore: draftResult.toneScore,
        wordCount: draftResult.wordCount,
        status: 'draft',
        notes: regenerationNotes,
      });
      draftId = existingDraft._id;
    } else {
      // Create new draft
      draftId = await callConvexMutation(api.drafts.createDraft, {
        briefId: briefId as any,
        projectId: brief.projectId,
        content: draftResult.content,
        qualityScore: draftResult.qualityScore,
        toneScore: draftResult.toneScore,
        wordCount: draftResult.wordCount,
        status: 'draft',
        notes: regenerationNotes,
      });
    }

    // Update brief status
    await callConvexMutation(api.briefs.updateBrief, {
      briefId: briefId as any,
      status: 'in_progress',
    });

    return NextResponse.json({
      success: true,
      draft: {
        _id: draftId,
        ...draftResult,
        status: 'draft',
      },
    });
  } catch (error) {
    console.error('Generate draft error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate draft' },
      { status: 500 }
    );
  }
}

