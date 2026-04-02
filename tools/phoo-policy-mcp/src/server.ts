/**
 * Phoo Policy MCP Server — Main Entrypoint
 *
 * A lightweight Model Context Protocol server that gives coding agents
 * pre-generation access to Phoo's security rules, architectural standards,
 * workflow checklists, and Board of Directors governance policies.
 *
 * Transport: stdio (for IDE integration)
 * Dependencies: @modelcontextprotocol/sdk, fuse.js
 * Runtime: tsx (TypeScript execution via root devDeps)
 *
 * Component Hierarchy:
 * tools/phoo-policy-mcp/src/server.ts (this file)
 *   -> tools/phoo-policy-mcp/src/indexer.ts
 *   -> tools/phoo-policy-mcp/src/search.ts
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { resolve } from 'path';
import { indexCorpus } from './indexer.js';
import { PolicySearchEngine } from './search.js';

// ---------------------------------------------------------------------------
// Resolve repo root (this file lives at tools/phoo-policy-mcp/src/server.ts)
// ---------------------------------------------------------------------------

const REPO_ROOT = resolve(import.meta.dirname ?? __dirname, '..', '..', '..');

// ---------------------------------------------------------------------------
// Index corpus on startup
// ---------------------------------------------------------------------------

console.error('[PhooPolicy] Starting Phoo Policy MCP Server...');
console.error(`[PhooPolicy] Repo root: ${REPO_ROOT}`);

const chunks = indexCorpus(REPO_ROOT);
const searchEngine = new PolicySearchEngine(chunks);

console.error(`[PhooPolicy] Search engine ready with ${chunks.length} policy chunks`);

// ---------------------------------------------------------------------------
// MCP Server
// ---------------------------------------------------------------------------

const server = new McpServer({
  name: 'phoo-policy',
  version: '1.0.0',
});

// ---------------------------------------------------------------------------
// Tool: policy_preflight
// ---------------------------------------------------------------------------

server.tool(
  'policy_preflight',
  'Generate a structured preflight brief for a coding task. Returns relevant security rules, architectural constraints, workflow checklists, and governance context that should be followed BEFORE writing code.',
  {
    taskDescription: z.string().describe(
      'Description of the coding task to analyze. Example: "Add a new Convex mutation for updating user profiles"'
    ),
  },
  async ({ taskDescription }) => {
    const brief = searchEngine.preflight(taskDescription);

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(brief, null, 2),
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Tool: policy_search
// ---------------------------------------------------------------------------

server.tool(
  'policy_search',
  'Search the Phoo policy corpus for specific rules, standards, or guidelines. Returns ranked policy chunks matching the query.',
  {
    query: z.string().describe('Search query for policies. Example: "rate limiting" or "RLS security"'),
    limit: z.number().optional().default(10).describe('Maximum number of results to return (default: 10)'),
  },
  async ({ query, limit }) => {
    const results = searchEngine.search(query, limit);

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Tool: list_policy_categories
// ---------------------------------------------------------------------------

server.tool(
  'list_policy_categories',
  'List all indexed policy categories with file counts and severity distributions. Use this to understand what governance domains are available.',
  {},
  async () => {
    const categories = searchEngine.listCategories();

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(categories, null, 2),
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[PhooPolicy] MCP server connected via stdio');
}

main().catch((err) => {
  console.error('[PhooPolicy] Fatal error:', err);
  process.exit(1);
});
