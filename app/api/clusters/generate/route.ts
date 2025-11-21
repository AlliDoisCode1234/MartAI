import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { generateKeywordClusters, importKeywordsFromGSC } from '@/lib/keywordClustering';
import { callConvexMutation, callConvexQuery, api } from '@/lib/convexClient';
import { assertProjectId } from '@/lib/typeGuards';
import type { ProjectId } from '@/types';

// Import api dynamically for routes that need it
let apiLocal: typeof api = api;
if (typeof window === 'undefined') {
  if (!apiLocal) {
    try {
      apiLocal = require('@/convex/_generated/api')?.api;
    } catch {
      apiLocal = null as any;
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { projectId, keywords, importFromGSC } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId is required' },
        { status: 400 }
      );
    }

    let keywordInputs = keywords || [];

    // Validate required field first
    const projectIdTyped = assertProjectId(projectId);

    // Import from GSC if requested
    if (importFromGSC && apiLocal) {
      try {
        const connection = await callConvexQuery(apiLocal.gscConnections.getGSCConnection, {
          projectId: projectIdTyped,
        });

        if (connection && connection.accessToken) {
          // Fetch GSC data
          const gscResponse = await fetch(
            `${request.nextUrl.origin}/api/gsc/data?projectId=${projectId}&startDate=30daysAgo&endDate=today&rowLimit=100`,
            {
              headers: {
                'Authorization': request.headers.get('authorization') || '',
              },
            }
          );

          if (gscResponse.ok) {
            const gscData = await gscResponse.json();
            const importedKeywords = importKeywordsFromGSC(gscData.data);
            keywordInputs = [...keywordInputs, ...importedKeywords];
          }
        }
      } catch (error) {
        console.warn('Failed to import from GSC:', error);
      }
    }

    if (keywordInputs.length === 0) {
      return NextResponse.json(
        { error: 'No keywords provided' },
        { status: 400 }
      );
    }

    // Get project details for context
    let websiteUrl = '';
    let industry = '';
    
    if (apiLocal) {
      try {
        const project = await callConvexQuery(apiLocal.projects.getProjectById, {
          projectId: projectIdTyped,
        });
        if (project) {
          websiteUrl = project.websiteUrl || '';
          industry = project.industry || '';
        }
      } catch (error) {
        console.warn('Failed to get project details:', error);
      }
    }

    // Generate clusters
    const clusters = await generateKeywordClusters(keywordInputs, websiteUrl, industry);

    // Store clusters in Convex
    const storedClusters = [];
    if (apiLocal) {
      for (const cluster of clusters) {
        try {
          const clusterId = await callConvexMutation(apiLocal.keywordClusters.createCluster, {
            projectId: projectIdTyped,
            clusterName: cluster.clusterName,
            keywords: cluster.keywords,
            intent: cluster.intent,
            difficulty: cluster.difficulty,
            volumeRange: cluster.volumeRange,
            impactScore: cluster.impactScore,
            topSerpUrls: cluster.topSerpUrls,
            status: 'active',
            createdAt: Date.now(),
          });
          storedClusters.push({ ...cluster, id: clusterId });
        } catch (error) {
          console.error('Failed to store cluster:', error);
          storedClusters.push(cluster);
        }
      }
    } else {
      storedClusters.push(...clusters);
    }

    return NextResponse.json({
      success: true,
      clusters: storedClusters,
      count: storedClusters.length,
    });
  } catch (error) {
    console.error('Generate clusters error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate clusters' },
      { status: 500 }
    );
  }
}

