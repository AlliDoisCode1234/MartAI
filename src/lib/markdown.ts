/**
 * Markdown to HTML Conversion Utilities
 *
 * Provides utilities for converting markdown content to HTML for publishing
 * to external platforms like WordPress.
 *
 * WordPress REST API expects HTML content, not markdown.
 * This module handles the conversion with proper sanitization.
 */

import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

// Configure marked for WordPress-compatible output
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert \n to <br>
});

/**
 * Convert markdown to sanitized HTML for WordPress publishing
 *
 * @param markdown - The markdown content to convert
 * @returns Sanitized HTML string ready for WordPress REST API
 *
 * @example
 * const html = markdownToHtml('# Hello World\n\nThis is **bold** text.');
 * // Returns: '<h1>Hello World</h1>\n<p>This is <strong>bold</strong> text.</p>'
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown) return '';

  // Convert markdown to HTML
  const rawHtml = marked.parse(markdown) as string;

  // Sanitize to prevent XSS (WordPress also sanitizes, but defense in depth)
  const cleanHtml = DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'br',
      'hr',
      'strong',
      'b',
      'em',
      'i',
      'u',
      's',
      'del',
      'a',
      'img',
      'ul',
      'ol',
      'li',
      'blockquote',
      'pre',
      'code',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'div',
      'span',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel'],
  });

  return cleanHtml;
}

/**
 * Convert markdown to WordPress Gutenberg block format
 *
 * For newer WordPress sites using Gutenberg, content should be wrapped
 * in block comments for proper rendering.
 *
 * @param markdown - The markdown content to convert
 * @returns Gutenberg-compatible HTML with block comments
 */
export function markdownToGutenberg(markdown: string): string {
  if (!markdown) return '';

  const html = markdownToHtml(markdown);

  // Wrap in a classic block for compatibility
  // This ensures the HTML renders correctly in Gutenberg editor
  return `<!-- wp:freeform -->\n${html}\n<!-- /wp:freeform -->`;
}

/**
 * Extract plain text from markdown (for excerpts/summaries)
 *
 * @param markdown - The markdown content
 * @param maxLength - Maximum length of excerpt (default: 160 for SEO)
 * @returns Plain text excerpt
 */
export function markdownToExcerpt(markdown: string, maxLength = 160): string {
  if (!markdown) return '';

  // Remove markdown syntax
  let text = markdown
    // Remove headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    // Remove links but keep text
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    // Remove images
    .replace(/!\[.*?\]\(.+?\)/g, '')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`(.+?)`/g, '$1')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove list markers
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim();

  // Truncate
  if (text.length > maxLength) {
    text = text.substring(0, maxLength - 3).trim() + '...';
  }

  return text;
}

/**
 * Prepare content for WordPress REST API
 *
 * Returns an object ready to be sent to WordPress /posts endpoint
 */
export function prepareForWordPress(
  markdown: string,
  options: {
    title: string;
    status?: 'draft' | 'publish' | 'pending';
    categories?: number[];
    tags?: number[];
    featuredMediaId?: number;
    useGutenberg?: boolean;
  }
): Record<string, unknown> {
  const {
    title,
    status = 'draft',
    categories,
    tags,
    featuredMediaId,
    useGutenberg = false,
  } = options;

  const content = useGutenberg ? markdownToGutenberg(markdown) : markdownToHtml(markdown);
  const excerpt = markdownToExcerpt(markdown);

  const post: Record<string, unknown> = {
    title,
    content,
    excerpt,
    status,
  };

  if (categories?.length) post.categories = categories;
  if (tags?.length) post.tags = tags;
  if (featuredMediaId) post.featured_media = featuredMediaId;

  return post;
}
