/**
 * Content Mappers
 *
 * Utilities for converting content between formats (Markdown → Gutenberg, etc.)
 */

/**
 * Convert Markdown to WordPress Gutenberg block format
 */
export function markdownToGutenberg(markdown: string): string {
  if (!markdown) return '';

  let gutenberg = '';
  const lines = markdown.split('\n');
  let inCodeBlock = false;
  let codeBlockContent = '';
  let codeBlockLang = '';
  let inList = false;
  let listItems: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        gutenberg += `<!-- wp:code -->\n<pre class="wp-block-code"><code${codeBlockLang ? ` class="language-${codeBlockLang}"` : ''}>${escapeHtml(codeBlockContent.trim())}</code></pre>\n<!-- /wp:code -->\n\n`;
        inCodeBlock = false;
        codeBlockContent = '';
        codeBlockLang = '';
      } else {
        inCodeBlock = true;
        codeBlockLang = line.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent += line + '\n';
      continue;
    }

    // Flush list if we hit a non-list line
    if (inList && !line.match(/^[-*]\s/)) {
      gutenberg += `<!-- wp:list -->\n<ul>\n${listItems.map((item) => `<li>${item}</li>`).join('\n')}\n</ul>\n<!-- /wp:list -->\n\n`;
      inList = false;
      listItems = [];
    }

    // Headings
    const h1Match = line.match(/^#\s+(.+)$/);
    const h2Match = line.match(/^##\s+(.+)$/);
    const h3Match = line.match(/^###\s+(.+)$/);
    const h4Match = line.match(/^####\s+(.+)$/);

    if (h1Match) {
      gutenberg += `<!-- wp:heading {"level":1} -->\n<h1>${processInlineFormatting(h1Match[1])}</h1>\n<!-- /wp:heading -->\n\n`;
    } else if (h2Match) {
      gutenberg += `<!-- wp:heading -->\n<h2>${processInlineFormatting(h2Match[1])}</h2>\n<!-- /wp:heading -->\n\n`;
    } else if (h3Match) {
      gutenberg += `<!-- wp:heading {"level":3} -->\n<h3>${processInlineFormatting(h3Match[1])}</h3>\n<!-- /wp:heading -->\n\n`;
    } else if (h4Match) {
      gutenberg += `<!-- wp:heading {"level":4} -->\n<h4>${processInlineFormatting(h4Match[1])}</h4>\n<!-- /wp:heading -->\n\n`;
    }
    // List items
    else if (line.match(/^[-*]\s+(.+)$/)) {
      inList = true;
      const listMatch = line.match(/^[-*]\s+(.+)$/);
      if (listMatch) {
        listItems.push(processInlineFormatting(listMatch[1]));
      }
    }
    // Blockquotes
    else if (line.startsWith('>')) {
      const quoteContent = line.replace(/^>\s?/, '');
      gutenberg += `<!-- wp:quote -->\n<blockquote class="wp-block-quote"><p>${processInlineFormatting(quoteContent)}</p></blockquote>\n<!-- /wp:quote -->\n\n`;
    }
    // Horizontal rule
    else if (line.match(/^---+$/)) {
      gutenberg += `<!-- wp:separator -->\n<hr class="wp-block-separator"/>\n<!-- /wp:separator -->\n\n`;
    }
    // Regular paragraph
    else if (line.trim()) {
      gutenberg += `<!-- wp:paragraph -->\n<p>${processInlineFormatting(line)}</p>\n<!-- /wp:paragraph -->\n\n`;
    }
  }

  // Flush any remaining list
  if (inList && listItems.length > 0) {
    gutenberg += `<!-- wp:list -->\n<ul>\n${listItems.map((item) => `<li>${item}</li>`).join('\n')}\n</ul>\n<!-- /wp:list -->\n\n`;
  }

  return gutenberg.trim();
}

/**
 * Process inline formatting (bold, italic, links, code)
 */
function processInlineFormatting(text: string): string {
  return (
    text
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.+?)__/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/_(.+?)_/g, '<em>$1</em>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  );
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generate URL-friendly slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Spaces to dashes
    .replace(/-+/g, '-') // Multiple dashes to single
    .replace(/^-|-$/g, ''); // Trim dashes from ends
}

/**
 * Extract excerpt from content (first paragraph, max 160 chars)
 */
export function extractExcerpt(content: string, maxLength: number = 160): string {
  if (!content) return '';

  // Remove markdown formatting
  const plainText = content
    .replace(/#+\s+/g, '') // Headers
    .replace(/\*\*(.+?)\*\*/g, '$1') // Bold
    .replace(/\*(.+?)\*/g, '$1') // Italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
    .replace(/`([^`]+)`/g, '$1') // Inline code
    .replace(/```[\s\S]*?```/g, '') // Code blocks
    .replace(/>\s+/g, '') // Blockquotes
    .replace(/[-*]\s+/g, '') // List items
    .trim();

  // Get first paragraph
  const firstParagraph = plainText.split('\n\n')[0] || plainText;

  // Truncate if needed
  if (firstParagraph.length <= maxLength) {
    return firstParagraph;
  }

  // Find last space before maxLength to avoid cutting words
  const truncated = firstParagraph.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
}

/**
 * Convert Gutenberg blocks to Markdown
 */
export function gutenbergToMarkdown(gutenberg: string): string {
  if (!gutenberg) return '';

  return (
    gutenberg
      // Headings
      .replace(
        /<!-- wp:heading \{?"level":1\}? -->\n?<h1>(.+?)<\/h1>\n?<!-- \/wp:heading -->/gi,
        '# $1\n\n'
      )
      .replace(
        /<!-- wp:heading( \{"level":2\})? -->\n?<h2>(.+?)<\/h2>\n?<!-- \/wp:heading -->/gi,
        '## $2\n\n'
      )
      .replace(
        /<!-- wp:heading \{"level":3\} -->\n?<h3>(.+?)<\/h3>\n?<!-- \/wp:heading -->/gi,
        '### $1\n\n'
      )
      .replace(
        /<!-- wp:heading \{"level":4\} -->\n?<h4>(.+?)<\/h4>\n?<!-- \/wp:heading -->/gi,
        '#### $1\n\n'
      )
      // Paragraphs
      .replace(/<!-- wp:paragraph -->\n?<p>(.+?)<\/p>\n?<!-- \/wp:paragraph -->/gi, '$1\n\n')
      // Lists
      .replace(/<!-- wp:list -->\n?<ul>\n?([\s\S]*?)<\/ul>\n?<!-- \/wp:list -->/gi, (_, items) => {
        return items.replace(/<li>(.+?)<\/li>/gi, '- $1\n') + '\n';
      })
      // Quotes
      .replace(
        /<!-- wp:quote -->\n?<blockquote[^>]*><p>(.+?)<\/p><\/blockquote>\n?<!-- \/wp:quote -->/gi,
        '> $1\n\n'
      )
      // Separators
      .replace(/<!-- wp:separator -->\n?<hr[^>]*\/>\n?<!-- \/wp:separator -->/gi, '---\n\n')
      // Code blocks
      .replace(
        /<!-- wp:code -->\n?<pre[^>]*><code[^>]*>(.+?)<\/code><\/pre>\n?<!-- \/wp:code -->/gis,
        '```\n$1\n```\n\n'
      )
      // Inline formatting - reverse
      .replace(/<strong>(.+?)<\/strong>/gi, '**$1**')
      .replace(/<em>(.+?)<\/em>/gi, '*$1*')
      .replace(/<code>(.+?)<\/code>/gi, '`$1`')
      .replace(/<a href="([^"]+)">(.+?)<\/a>/gi, '[$2]($1)')
      // Clean up
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  );
}
