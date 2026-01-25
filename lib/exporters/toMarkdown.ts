/**
 * Markdown Exporter
 *
 * Generates Markdown format for content export.
 * Compatible with:
 * - Static site generators (Hugo, Jekyll, Gatsby, Astro)
 * - Git-based workflows
 * - Developer documentation
 */

export interface MarkdownExportOptions {
  title: string;
  content: string;
  excerpt?: string;
  slug?: string;
  contentType?: string;
  tags?: string[];
  categories?: string[];
  author?: string;
  publishDate?: Date;
  includeYamlFrontmatter?: boolean;
  customFrontmatter?: Record<string, string | number | boolean | string[]>;
}

/**
 * Generate YAML frontmatter block
 */
function generateFrontmatter(
  options: Omit<MarkdownExportOptions, 'content' | 'includeYamlFrontmatter'>
): string {
  const lines: string[] = ['---'];

  // Title
  lines.push(`title: "${options.title.replace(/"/g, '\\"')}"`);

  // Slug
  if (options.slug) {
    lines.push(`slug: "${options.slug}"`);
  }

  // Excerpt/Description
  if (options.excerpt) {
    lines.push(`description: "${options.excerpt.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`);
  }

  // Date
  if (options.publishDate) {
    lines.push(`date: ${options.publishDate.toISOString()}`);
  } else {
    lines.push(`date: ${new Date().toISOString()}`);
  }

  // Author
  if (options.author) {
    lines.push(`author: "${options.author}"`);
  }

  // Content Type
  if (options.contentType) {
    lines.push(`content_type: "${options.contentType}"`);
  }

  // Tags
  if (options.tags && options.tags.length > 0) {
    lines.push('tags:');
    options.tags.forEach((tag) => {
      lines.push(`  - "${tag}"`);
    });
  }

  // Categories
  if (options.categories && options.categories.length > 0) {
    lines.push('categories:');
    options.categories.forEach((cat) => {
      lines.push(`  - "${cat}"`);
    });
  }

  // Custom frontmatter
  if (options.customFrontmatter) {
    Object.entries(options.customFrontmatter).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        lines.push(`${key}:`);
        value.forEach((v) => lines.push(`  - "${v}"`));
      } else if (typeof value === 'string') {
        lines.push(`${key}: "${value.replace(/"/g, '\\"')}"`);
      } else {
        lines.push(`${key}: ${value}`);
      }
    });
  }

  lines.push('---');
  lines.push('');

  return lines.join('\n');
}

/**
 * Convert HTML content to Markdown (basic conversion)
 */
function htmlToMarkdown(html: string): string {
  let md = html;

  // Headings
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
  md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n');
  md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n');

  // Paragraphs
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');

  // Bold and italic
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
  md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

  // Links
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

  // Images
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)');
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)');

  // Lists
  md = md.replace(/<ul[^>]*>(.*?)<\/ul>/gis, (_, content) => {
    return content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n') + '\n';
  });
  md = md.replace(/<ol[^>]*>(.*?)<\/ol>/gis, (_, content) => {
    let index = 1;
    return (
      content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => {
        return `${index++}. $1\n`;
      }) + '\n'
    );
  });

  // Blockquotes
  md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (_, content) => {
    return (
      content
        .split('\n')
        .map((line: string) => `> ${line}`)
        .join('\n') + '\n\n'
    );
  });

  // Code blocks
  md = md.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n\n');
  md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

  // Horizontal rules
  md = md.replace(/<hr[^>]*\/?>/gi, '\n---\n\n');

  // Line breaks
  md = md.replace(/<br[^>]*\/?>/gi, '\n');

  // Remove remaining HTML tags
  md = md.replace(/<[^>]+>/g, '');

  // Decode HTML entities
  md = md.replace(/&nbsp;/g, ' ');
  md = md.replace(/&amp;/g, '&');
  md = md.replace(/&lt;/g, '<');
  md = md.replace(/&gt;/g, '>');
  md = md.replace(/&quot;/g, '"');

  // Clean up extra whitespace
  md = md.replace(/\n{3,}/g, '\n\n');
  md = md.trim();

  return md;
}

/**
 * Generate Markdown export
 */
export function toMarkdown(options: MarkdownExportOptions): string {
  const { content, includeYamlFrontmatter = true } = options;

  // Convert HTML to Markdown if it looks like HTML
  const isHtml = content.includes('<') && content.includes('>');
  const markdownContent = isHtml ? htmlToMarkdown(content) : content;

  if (includeYamlFrontmatter) {
    const frontmatter = generateFrontmatter(options);
    return frontmatter + markdownContent;
  }

  return markdownContent;
}

/**
 * Export a single content piece to Markdown
 */
export function contentPieceToMarkdown(piece: {
  title: string;
  content: string;
  excerpt?: string;
  slug?: string;
  contentType: string;
  tags?: string[];
}): string {
  return toMarkdown({
    title: piece.title,
    content: piece.content,
    excerpt: piece.excerpt,
    slug: piece.slug,
    contentType: piece.contentType,
    tags: piece.tags,
    includeYamlFrontmatter: true,
  });
}
