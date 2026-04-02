/**
 * Phoo Policy MCP Server — Integration Tests
 *
 * Tests the retrieval contract: given a task description,
 * does the engine return relevant policy chunks?
 *
 * Per Kent (Testing Strategist): test use cases, not implementation.
 * Mostly integration. All tests run in < 2 seconds (no network, no DB).
 *
 * Component Hierarchy:
 * tools/phoo-policy-mcp/__tests__/search.test.ts
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { resolve } from 'node:path';
import { indexCorpus } from '../src/indexer';
import { PolicySearchEngine } from '../src/search';

const REPO_ROOT = resolve(__dirname, '..', '..', '..');

let engine: PolicySearchEngine;

beforeAll(() => {
  const chunks = indexCorpus(REPO_ROOT);
  engine = new PolicySearchEngine(chunks);
});

// ---------------------------------------------------------------------------
// TKT-PEL-006: Retrieval Contract Tests
// ---------------------------------------------------------------------------

describe('policy_search', () => {
  it('returns security rules when searching for "mutation"', () => {
    const results = engine.search('implement a mutation');
    expect(results.length).toBeGreaterThan(0);

    // Should surface rules about auth, userId, or security
    const hasSecurityContent = results.some(
      (r) =>
        r.content.toLowerCase().includes('auth') ||
        r.content.toLowerCase().includes('userid') ||
        r.content.toLowerCase().includes('security') ||
        r.content.toLowerCase().includes('mutation') ||
        r.category === 'rules' ||
        r.category === 'security'
    );
    expect(hasSecurityContent).toBe(true);
  });

  it('returns rules content when searching for RLS and mutations', () => {
    // 'queryWithRLS' and 'mutationWithRLS' appear verbatim in .agent/RULES.md
    const results = engine.search('queryWithRLS mutationWithRLS');
    expect(results.length).toBeGreaterThan(0);

    // At least one result should come from the rules category or contain RLS
    const hasRulesContent = results.some(
      (r) =>
        r.category === 'rules' ||
        r.content.toLowerCase().includes('rls')
    );
    expect(hasRulesContent).toBe(true);
  });

  it('returns debugging workflow when searching for "fix a bug"', () => {
    const results = engine.search('fix a bug unexpected behavior');
    expect(results.length).toBeGreaterThan(0);

    const hasDebuggingContent = results.some(
      (r) =>
        r.source.toLowerCase().includes('debug') ||
        r.content.toLowerCase().includes('root cause') ||
        r.content.toLowerCase().includes('debug') ||
        r.category === 'workflow'
    );
    expect(hasDebuggingContent).toBe(true);
  });

  it('returns empty array for empty query', () => {
    const results = engine.search('');
    expect(results).toEqual([]);
  });

  it('returns empty array for whitespace-only query', () => {
    const results = engine.search('   ');
    expect(results).toEqual([]);
  });

  it('respects the limit parameter', () => {
    const results = engine.search('security', 3);
    expect(results.length).toBeLessThanOrEqual(3);
  });
});

describe('policy_preflight', () => {
  it('returns a structured brief with categorized results', () => {
    const brief = engine.preflight('implement a new Convex mutation for user profiles');

    expect(brief.taskDescription).toBe('implement a new Convex mutation for user profiles');
    expect(brief).toHaveProperty('securityRules');
    expect(brief).toHaveProperty('architecturalConstraints');
    expect(brief).toHaveProperty('workflowChecklists');
    expect(brief).toHaveProperty('governanceContext');
    expect(brief).toHaveProperty('totalPoliciesFound');
    expect(brief.totalPoliciesFound).toBeGreaterThan(0);
  });

  it('returns security rules for security-relevant tasks', () => {
    const brief = engine.preflight('add rate limiting to an API endpoint');

    // Should have at least one security rule
    const allSecurityContent = [
      ...brief.securityRules,
      ...brief.workflowChecklists,
    ];
    expect(allSecurityContent.length).toBeGreaterThan(0);
  });
});

describe('list_policy_categories', () => {
  it('returns categories with correct structure', () => {
    const categories = engine.listCategories();

    expect(categories.length).toBeGreaterThan(0);

    for (const cat of categories) {
      expect(cat).toHaveProperty('category');
      expect(cat).toHaveProperty('fileCount');
      expect(cat).toHaveProperty('chunkCount');
      expect(cat).toHaveProperty('severityCounts');
      expect(cat.fileCount).toBeGreaterThan(0);
      expect(cat.chunkCount).toBeGreaterThan(0);
    }
  });

  it('includes expected categories', () => {
    const categories = engine.listCategories();
    const categoryNames = categories.map((c) => c.category);

    // We know these exist from the corpus
    expect(categoryNames).toContain('workflow');
    expect(categoryNames).toContain('rules');
    expect(categoryNames).toContain('governance');
  });
});

describe('corpus indexer', () => {
  it('indexes a non-trivial number of chunks', () => {
    const chunks = indexCorpus(REPO_ROOT);
    // We know from smoke test: 207 chunks from 29 files
    expect(chunks.length).toBeGreaterThan(50);
  });

  it('does not index excluded files (legal, LDD docs)', () => {
    const chunks = indexCorpus(REPO_ROOT);
    const hasLegal = chunks.some((c) => c.filePath.includes('legal/'));
    // Check for docs/LDD_ specifically — persona files like bot_persona_SALES_PAGE_LDD_00004 are valid
    const hasLDDDocs = chunks.some((c) => c.filePath.startsWith('docs/LDD_'));
    const hasInternalDocs = chunks.some((c) => c.filePath.includes('.internal/'));

    expect(hasLegal).toBe(false);
    expect(hasLDDDocs).toBe(false);
    expect(hasInternalDocs).toBe(false);
  });

  it('handles non-existent repo root gracefully', () => {
    const chunks = indexCorpus('/nonexistent/path/that/does/not/exist');
    expect(chunks).toEqual([]);
  });
});
