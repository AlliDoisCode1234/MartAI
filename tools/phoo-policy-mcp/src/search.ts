/**
 * Phoo Policy MCP Server — Search Engine
 *
 * Provides fuzzy text retrieval over the indexed policy corpus.
 * Uses fuse.js for lightweight, in-memory semantic-ish matching.
 *
 * Component Hierarchy:
 * tools/phoo-policy-mcp/src/search.ts
 */

import Fuse from 'fuse.js';
import type { PolicyChunk } from './indexer';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SearchResult {
  /** Chunk ID (filepath#anchor) */
  id: string;
  /** Source file path */
  filePath: string;
  /** Display-friendly source name */
  source: string;
  /** Category: rules | workflow | governance | architecture | security */
  category: string;
  /** Severity: critical | high | medium | low */
  severity: string;
  /** Section heading */
  heading: string;
  /** Matching content (trimmed) */
  content: string;
  /** Relevance score (0-1, lower is better match for fuse) */
  score: number;
}

export interface PreflightBrief {
  /** Task that was analyzed */
  taskDescription: string;
  /** Security rules that apply */
  securityRules: SearchResult[];
  /** Architectural constraints that apply */
  architecturalConstraints: SearchResult[];
  /** Workflow checklists that apply */
  workflowChecklists: SearchResult[];
  /** Governance/persona context that applies */
  governanceContext: SearchResult[];
  /** Total policy chunks found */
  totalPoliciesFound: number;
}

export interface CategorySummary {
  category: string;
  fileCount: number;
  chunkCount: number;
  severityCounts: Record<string, number>;
}

// ---------------------------------------------------------------------------
// Search Engine
// ---------------------------------------------------------------------------

export class PolicySearchEngine {
  private fuse: Fuse<PolicyChunk>;
  private chunks: PolicyChunk[];

  constructor(chunks: PolicyChunk[]) {
    this.chunks = chunks;
    this.fuse = new Fuse(chunks, {
      keys: [
        { name: 'content', weight: 0.5 },
        { name: 'heading', weight: 0.3 },
        { name: 'source', weight: 0.1 },
        { name: 'category', weight: 0.1 },
      ],
      threshold: 0.4,
      includeScore: true,
      ignoreLocation: true,
      minMatchCharLength: 3,
    });
  }

  /**
   * Search for policy chunks matching a query.
   */
  search(query: string, limit: number = 10): SearchResult[] {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const results = this.fuse.search(query, { limit });

    return results.map((r) => ({
      id: r.item.id,
      filePath: r.item.filePath,
      source: r.item.source,
      category: r.item.category,
      severity: r.item.severity,
      heading: r.item.heading,
      content: r.item.content.length > 500
        ? r.item.content.slice(0, 500) + '...'
        : r.item.content,
      score: r.score ?? 1,
    }));
  }

  /**
   * Generate a structured preflight brief for a task description.
   * Searches broadly, then categorizes results into buckets.
   */
  preflight(taskDescription: string): PreflightBrief {
    // Search with a generous limit to catch cross-cutting concerns
    const allResults = this.search(taskDescription, 25);

    const securityRules = allResults.filter(
      (r) => r.category === 'security' || r.category === 'rules'
    );
    const architecturalConstraints = allResults.filter(
      (r) => r.category === 'architecture'
    );
    const workflowChecklists = allResults.filter(
      (r) => r.category === 'workflow'
    );
    const governanceContext = allResults.filter(
      (r) => r.category === 'governance'
    );

    return {
      taskDescription,
      securityRules: securityRules.slice(0, 5),
      architecturalConstraints: architecturalConstraints.slice(0, 3),
      workflowChecklists: workflowChecklists.slice(0, 5),
      governanceContext: governanceContext.slice(0, 3),
      totalPoliciesFound: allResults.length,
    };
  }

  /**
   * List all indexed categories with file/chunk counts.
   */
  listCategories(): CategorySummary[] {
    const categoryMap = new Map<string, { files: Set<string>; chunks: number; severities: Record<string, number> }>();

    for (const chunk of this.chunks) {
      if (!categoryMap.has(chunk.category)) {
        categoryMap.set(chunk.category, { files: new Set(), chunks: 0, severities: {} });
      }

      const entry = categoryMap.get(chunk.category)!;
      entry.files.add(chunk.filePath);
      entry.chunks++;
      entry.severities[chunk.severity] = (entry.severities[chunk.severity] || 0) + 1;
    }

    const summaries: CategorySummary[] = [];
    for (const [category, data] of categoryMap) {
      summaries.push({
        category,
        fileCount: data.files.size,
        chunkCount: data.chunks,
        severityCounts: data.severities,
      });
    }

    return summaries.sort((a, b) => b.chunkCount - a.chunkCount);
  }
}
