/**
 * Phoo Policy MCP Server — Corpus Indexer
 *
 * Scans the policy corpus (workflows, rules, personas, architecture docs),
 * parses YAML frontmatter, chunks by heading boundaries, and holds
 * structured policy chunks in memory for retrieval.
 *
 * Component Hierarchy:
 * tools/phoo-policy-mcp/src/indexer.ts
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join, relative, basename, extname } from 'path';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PolicyChunk {
  /** Unique ID: filepath + heading anchor */
  id: string;
  /** Relative path from repo root */
  filePath: string;
  /** Display-friendly source name */
  source: string;
  /** Category: rules | workflow | governance | architecture | security */
  category: string;
  /** Severity: critical | high | medium | low */
  severity: string;
  /** H2/H3 heading this chunk belongs to (empty for preamble) */
  heading: string;
  /** The actual text content of this chunk */
  content: string;
  /** YAML frontmatter fields (if any) */
  frontmatter: Record<string, string>;
}

export interface CorpusManifest {
  directories: Array<{
    path: string;
    category: string;
    description: string;
  }>;
  files: Array<{
    path: string;
    category: string;
    severity: string;
    description: string;
  }>;
  excludePatterns: string[];
}

// ---------------------------------------------------------------------------
// Frontmatter Parser
// ---------------------------------------------------------------------------

function parseFrontmatter(raw: string): { frontmatter: Record<string, string>; body: string } {
  const fmRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
  const match = raw.match(fmRegex);

  if (!match) {
    return { frontmatter: {}, body: raw };
  }

  const fmBlock = match[1];
  const frontmatter: Record<string, string> = {};

  for (const line of fmBlock.split(/\r?\n/)) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim();
      frontmatter[key] = value;
    }
  }

  const body = raw.slice(match[0].length);
  return { frontmatter, body };
}

// ---------------------------------------------------------------------------
// Heading Chunker
// ---------------------------------------------------------------------------

function chunkByHeadings(body: string): Array<{ heading: string; content: string }> {
  const lines = body.split(/\r?\n/);
  const chunks: Array<{ heading: string; content: string }> = [];

  let currentHeading = '';
  let currentLines: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^#{2,3}\s+(.+)/);

    if (headingMatch) {
      // Flush previous chunk
      if (currentLines.length > 0) {
        const content = currentLines.join('\n').trim();
        if (content.length > 20) {
          chunks.push({ heading: currentHeading, content });
        }
      }
      currentHeading = headingMatch[1].trim();
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  // Flush final chunk
  if (currentLines.length > 0) {
    const content = currentLines.join('\n').trim();
    if (content.length > 20) {
      chunks.push({ heading: currentHeading, content });
    }
  }

  return chunks;
}

// ---------------------------------------------------------------------------
// Category Inference
// ---------------------------------------------------------------------------

function inferCategory(filePath: string): string {
  if (filePath.includes('workflow')) return 'workflow';
  if (filePath.includes('rules') || filePath.includes('RULES')) return 'rules';
  if (filePath.includes('persona') || filePath.includes('PERSONA')) return 'governance';
  if (filePath.includes('security') || filePath.includes('SECURITY')) return 'security';
  if (filePath.includes('ARCHITECTURE')) return 'architecture';
  return 'general';
}

function inferSeverity(filePath: string, frontmatter: Record<string, string>): string {
  if (frontmatter.severity) return frontmatter.severity;
  if (filePath.includes('RULES') || filePath.includes('security')) return 'critical';
  if (filePath.includes('workflow')) return 'high';
  if (filePath.includes('ARCHITECTURE')) return 'high';
  if (filePath.includes('persona')) return 'medium';
  return 'medium';
}

// ---------------------------------------------------------------------------
// File Scanner
// ---------------------------------------------------------------------------

function scanDirectory(dirPath: string, repoRoot: string): string[] {
  const files: string[] = [];

  if (!existsSync(dirPath)) {
    console.warn(`[PhooPolicy] Directory not found, skipping: ${dirPath}`);
    return files;
  }

  try {
    const entries = readdirSync(dirPath);
    for (const entry of entries) {
      const fullPath = join(dirPath, entry);
      const stat = statSync(fullPath);

      if (stat.isFile() && extname(entry) === '.md') {
        files.push(fullPath);
      } else if (stat.isDirectory()) {
        files.push(...scanDirectory(fullPath, repoRoot));
      }
    }
  } catch (err) {
    console.warn(`[PhooPolicy] Error scanning ${dirPath}:`, err);
  }

  return files;
}

function shouldExclude(filePath: string, excludePatterns: string[]): boolean {
  const normalized = filePath.replace(/\\/g, '/');
  for (const pattern of excludePatterns) {
    // 1. Escape all regex metacharacters EXCEPT * (used for globs)
    const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&');
    // 2. Apply glob expansions: ** = any depth, * = single segment
    const regexStr = escaped
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*');
    // 3. Anchor to match full path
    if (new RegExp(`^${regexStr}$`).test(normalized)) {
      return true;
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function indexCorpus(repoRoot: string): PolicyChunk[] {
  const manifestPath = join(repoRoot, 'tools', 'phoo-policy-mcp', 'corpus-manifest.json');
  let manifest: CorpusManifest;

  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  } catch {
    console.warn('[PhooPolicy] No corpus-manifest.json found, using defaults');
    manifest = {
      directories: [
        { path: '.agent/workflows', category: 'workflow', description: '' },
        { path: '.agent/rules', category: 'rules', description: '' },
        { path: 'docs/personas', category: 'governance', description: '' },
      ],
      files: [
        { path: '.agent/RULES.md', category: 'rules', severity: 'critical', description: '' },
        { path: 'docs/ARCHITECTURE.md', category: 'architecture', severity: 'high', description: '' },
      ],
      excludePatterns: ['docs/legal/**', 'docs/LDD_*', 'docs/.internal/**'],
    };
  }

  const allFiles: string[] = [];

  // Scan directories
  for (const dir of manifest.directories) {
    const dirPath = join(repoRoot, dir.path);
    allFiles.push(...scanDirectory(dirPath, repoRoot));
  }

  // Add explicit files
  for (const file of manifest.files) {
    const filePath = join(repoRoot, file.path);
    if (existsSync(filePath) && !allFiles.includes(filePath)) {
      allFiles.push(filePath);
    }
  }

  // Index each file
  const chunks: PolicyChunk[] = [];

  for (const fullPath of allFiles) {
    const relPath = relative(repoRoot, fullPath).replace(/\\/g, '/');

    if (shouldExclude(relPath, manifest.excludePatterns)) {
      continue;
    }

    try {
      const raw = readFileSync(fullPath, 'utf-8');
      const { frontmatter, body } = parseFrontmatter(raw);
      const category = frontmatter.category || inferCategory(relPath);
      const severity = inferSeverity(relPath, frontmatter);
      const source = basename(relPath, '.md');

      const headingChunks = chunkByHeadings(body);

      if (headingChunks.length === 0) {
        // Entire file is a single chunk
        if (body.trim().length > 20) {
          chunks.push({
            id: `${relPath}#root`,
            filePath: relPath,
            source,
            category,
            severity,
            heading: '',
            content: body.trim(),
            frontmatter,
          });
        }
      } else {
        for (const chunk of headingChunks) {
          const anchor = chunk.heading
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-');

          chunks.push({
            id: `${relPath}#${anchor || 'preamble'}`,
            filePath: relPath,
            source,
            category,
            severity,
            heading: chunk.heading,
            content: chunk.content,
            frontmatter,
          });
        }
      }
    } catch (err) {
      console.warn(`[PhooPolicy] Failed to index ${relPath}:`, err);
    }
  }

  console.error(`[PhooPolicy] Indexed ${chunks.length} chunks from ${allFiles.length} files`);
  return chunks;
}
