import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authMiddleware';
import { generateKeywordClusters, importKeywordsFromGSC } from '@/lib/keywordClustering';
import { callConvexMutation, callConvexQuery } from '@/lib/convexClient';

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
    const { projectId, keywords, importFromGSC } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId is required' },
        { status: 400 }
      );
    }

    let keywordInputs = keywords || [];

    // Import from GSC if requested
    if (importFromGSC && api) {
      try {
        const connection = await callConvexQuery(api.gscConnections.getGSCConnection, {
          projectId: projectId as any,
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
    
    if (api) {
      try {
        const project = await callConvexQuery(api.projects.getProjectById, {
          projectId: projectId as any,
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
    if (api) {
      for (const cluster of clusters) {
        try {
          const clusterId = await callConvexMutation(api.keywordClusters.createCluster, {
            projectId: projectId as any,
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

