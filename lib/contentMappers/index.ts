import { marked } from 'marked';

/**
 * Content Mappers - Markdown to Platform-Specific Formats
 *
 * Converts MartAI draft content (Markdown) to WordPress-compatible formats.
 */

// Configure marked for WordPress-friendly output
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert \n to <br>
});

export interface ArticleContent {
  title: string;
  content: string; // Markdown
  excerpt?: string;
  slug?: string;
  categories?: string[];
  tags?: string[];
  featuredImageUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface WordPressPayload {
  title: string;
  content: string; // HTML or Gutenberg blocks
  excerpt: string;
  slug: string;
  status: 'draft' | 'publish' | 'future' | 'private';
  categories?: number[];
  tags?: number[];
  featured_media?: number;
  date?: string; // ISO date for scheduled posts
  meta?: {
    // Yoast SEO
    _yoast_wpseo_title?: string;
    _yoast_wpseo_metadesc?: string;
    // RankMath
    rank_math_title?: string;
    rank_math_description?: string;
  };
}

/**
 * Convert Markdown to HTML
 */
export function markdownToHtml(markdown: string): string {
  return marked.parse(markdown) as string;
}

/**
 * Convert Markdown to WordPress Gutenberg blocks
 */
export function markdownToGutenberg(markdown: string): string {
  const html = markdownToHtml(markdown);

  // Wrap elements in Gutenberg block comments
  let gutenberg = html
    // Paragraphs
    .replace(/<p>([\s\S]*?)<\/p>/g, '<!-- wp:paragraph -->\n<p>$1</p>\n<!-- /wp:paragraph -->\n')
    // Headings - handle all levels
    .replace(
      /<h1>([\s\S]*?)<\/h1>/g,
      '<!-- wp:heading {"level":1} -->\n<h1>$1</h1>\n<!-- /wp:heading -->\n'
    )
    .replace(
      /<h2>([\s\S]*?)<\/h2>/g,
      '<!-- wp:heading {"level":2} -->\n<h2>$1</h2>\n<!-- /wp:heading -->\n'
    )
    .replace(
      /<h3>([\s\S]*?)<\/h3>/g,
      '<!-- wp:heading {"level":3} -->\n<h3>$1</h3>\n<!-- /wp:heading -->\n'
    )
    .replace(
      /<h4>([\s\S]*?)<\/h4>/g,
      '<!-- wp:heading {"level":4} -->\n<h4>$1</h4>\n<!-- /wp:heading -->\n'
    )
    .replace(
      /<h5>([\s\S]*?)<\/h5>/g,
      '<!-- wp:heading {"level":5} -->\n<h5>$1</h5>\n<!-- /wp:heading -->\n'
    )
    .replace(
      /<h6>([\s\S]*?)<\/h6>/g,
      '<!-- wp:heading {"level":6} -->\n<h6>$1</h6>\n<!-- /wp:heading -->\n'
    )
    // Unordered lists
    .replace(/<ul>([\s\S]*?)<\/ul>/g, '<!-- wp:list -->\n<ul>$1</ul>\n<!-- /wp:list -->\n')
    // Ordered lists
    .replace(
      /<ol>([\s\S]*?)<\/ol>/g,
      '<!-- wp:list {"ordered":true} -->\n<ol>$1</ol>\n<!-- /wp:list -->\n'
    )
    // Blockquotes
    .replace(
      /<blockquote>([\s\S]*?)<\/blockquote>/g,
      '<!-- wp:quote -->\n<blockquote>$1</blockquote>\n<!-- /wp:quote -->\n'
    )
    // Code blocks
    .replace(
      /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
      '<!-- wp:code {"language":"$1"} -->\n<pre class="wp-block-code"><code>$2</code></pre>\n<!-- /wp:code -->\n'
    )
    .replace(
      /<pre><code>([\s\S]*?)<\/code><\/pre>/g,
      '<!-- wp:code -->\n<pre class="wp-block-code"><code>$1</code></pre>\n<!-- /wp:code -->\n'
    )
    // Images
    .replace(
      /<img src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/g,
      '<!-- wp:image -->\n<figure class="wp-block-image"><img src="$1" alt="$2"/></figure>\n<!-- /wp:image -->\n'
    )
    // Horizontal rules
    .replace(
      /<hr\s*\/?>/g,
      '<!-- wp:separator -->\n<hr class="wp-block-separator"/>\n<!-- /wp:separator -->\n'
    );

  return gutenberg;
}

/**
 * Generate URL-safe slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Spaces to hyphens
    .replace(/-+/g, '-') // Multiple hyphens to single
    .replace(/^-|-$/g, '') // Trim hyphens
    .slice(0, 60); // Limit length
}

/**
 * Extract first heading as title
 */
export function extractTitle(markdown: string): string {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : 'Untitled';
}

/**
 * Extract excerpt from content (first paragraph)
 */
export function extractExcerpt(markdown: string, maxLength: number = 160): string {
  // Remove headings
  const withoutHeadings = markdown.replace(/^#+\s+.+$/gm, '');
  // Get first paragraph
  const paragraphs = withoutHeadings.split(/\n\n+/).filter((p) => p.trim());
  const firstParagraph = paragraphs[0] || '';
  // Clean and truncate
  const clean = firstParagraph
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .replace(/[*_`]/g, '') // Remove formatting
    .trim();

  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength - 3) + '...';
}

/**
 * Convert article content to WordPress payload
 */
export function toWordPressPayload(
  article: ArticleContent,
  options?: {
    useGutenberg?: boolean;
    status?: 'draft' | 'publish' | 'future' | 'private';
    scheduledDate?: Date;
    categoryIds?: number[];
    tagIds?: number[];
    featuredMediaId?: number;
  }
): WordPressPayload {
  const useGutenberg = options?.useGutenberg ?? true;

  const content = useGutenberg
    ? markdownToGutenberg(article.content)
    : markdownToHtml(article.content);

  const payload: WordPressPayload = {
    title: article.title,
    content,
    excerpt: article.excerpt || extractExcerpt(article.content),
    slug: article.slug || generateSlug(article.title),
    status: options?.status || 'draft',
  };

  // Add scheduled date if publishing in future
  if (options?.scheduledDate && options.status === 'future') {
    payload.date = options.scheduledDate.toISOString();
  }

  // Add categories and tags
  if (options?.categoryIds?.length) {
    payload.categories = options.categoryIds;
  }
  if (options?.tagIds?.length) {
    payload.tags = options.tagIds;
  }

  // Add featured image
  if (options?.featuredMediaId) {
    payload.featured_media = options.featuredMediaId;
  }

  // Add SEO meta
  if (article.metaTitle || article.metaDescription) {
    payload.meta = {
      _yoast_wpseo_title: article.metaTitle,
      _yoast_wpseo_metadesc: article.metaDescription,
      rank_math_title: article.metaTitle,
      rank_math_description: article.metaDescription,
    };
  }

  return payload;
}

/**
 * Shopify article format (for future use)
 */
export interface ShopifyArticlePayload {
  blog_id: number;
  article: {
    title: string;
    body_html: string;
    summary_html?: string;
    handle: string;
    tags?: string;
    published?: boolean;
    image?: { src: string };
  };
}

/**
 * Convert article content to Shopify payload
 */
export function toShopifyPayload(
  article: ArticleContent,
  blogId: number,
  options?: {
    published?: boolean;
  }
): ShopifyArticlePayload {
  return {
    blog_id: blogId,
    article: {
      title: article.title,
      body_html: markdownToHtml(article.content),
      summary_html: article.excerpt
        ? `<p>${article.excerpt}</p>`
        : `<p>${extractExcerpt(article.content)}</p>`,
      handle: article.slug || generateSlug(article.title),
      tags: article.tags?.join(', '),
      published: options?.published ?? false,
      image: article.featuredImageUrl ? { src: article.featuredImageUrl } : undefined,
    },
  };
}
