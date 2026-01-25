/**
 * WordPress XML (WXR) Exporter
 *
 * Generates WordPress eXtended RSS (WXR) format for content export.
 * Compatible with:
 * - WordPress native import
 * - Wix blog import (accepts WordPress XML)
 * - Shopify Blog Importer app
 */

export interface WXRItem {
  title: string;
  content: string;
  excerpt?: string;
  slug?: string;
  postType: 'post' | 'page';
  status?: 'publish' | 'draft';
  publishDate?: Date;
  categories?: string[];
  tags?: string[];
  author?: string;
}

export interface WXRExportOptions {
  siteName?: string;
  siteUrl?: string;
  items: WXRItem[];
}

/**
 * Escape XML special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Wrap content in CDATA section
 */
function cdata(text: string): string {
  // Escape any ]]> sequences that would break CDATA
  const escaped = text.replace(/\]\]>/g, ']]]]><![CDATA[>');
  return `<![CDATA[${escaped}]]>`;
}

/**
 * Format date as WordPress-compatible string
 */
function formatWpDate(date: Date): string {
  return date
    .toISOString()
    .replace('T', ' ')
    .replace(/\.\d{3}Z$/, '');
}

/**
 * Generate WordPress XML (WXR) export
 */
export function toWordPressXML(options: WXRExportOptions): string {
  const { siteName = 'MartAI Export', siteUrl = 'https://example.com', items } = options;

  const now = new Date();

  // Collect unique categories and tags
  const allCategories = new Set<string>();
  const allTags = new Set<string>();
  items.forEach((item) => {
    item.categories?.forEach((cat) => allCategories.add(cat));
    item.tags?.forEach((tag) => allTags.add(tag));
  });

  // Build XML
  let xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
  xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:wfw="http://wellformedweb.org/CommentAPI/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:wp="http://wordpress.org/export/1.2/"
>
<channel>
  <title>${escapeXml(siteName)}</title>
  <link>${escapeXml(siteUrl)}</link>
  <description>Content exported from MartAI</description>
  <pubDate>${now.toUTCString()}</pubDate>
  <language>en-US</language>
  <wp:wxr_version>1.2</wp:wxr_version>
  <wp:base_site_url>${escapeXml(siteUrl)}</wp:base_site_url>
  <wp:base_blog_url>${escapeXml(siteUrl)}</wp:base_blog_url>

  <wp:author>
    <wp:author_id>1</wp:author_id>
    <wp:author_login>${cdata('admin')}</wp:author_login>
    <wp:author_email>${cdata('admin@example.com')}</wp:author_email>
    <wp:author_display_name>${cdata('Admin')}</wp:author_display_name>
  </wp:author>

`;

  // Add categories
  let catNicename = 1;
  allCategories.forEach((cat) => {
    xml += `  <wp:category>
    <wp:term_id>${catNicename}</wp:term_id>
    <wp:category_nicename>${cdata(cat.toLowerCase().replace(/\s+/g, '-'))}</wp:category_nicename>
    <wp:category_parent></wp:category_parent>
    <wp:cat_name>${cdata(cat)}</wp:cat_name>
  </wp:category>
`;
    catNicename++;
  });

  // Add tags
  let tagId = 1;
  allTags.forEach((tag) => {
    xml += `  <wp:tag>
    <wp:term_id>${tagId + 1000}</wp:term_id>
    <wp:tag_slug>${cdata(tag.toLowerCase().replace(/\s+/g, '-'))}</wp:tag_slug>
    <wp:tag_name>${cdata(tag)}</wp:tag_name>
  </wp:tag>
`;
    tagId++;
  });

  // Add items
  let postId = 1;
  items.forEach((item) => {
    const pubDate = item.publishDate || now;
    const postName = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    xml += `
  <item>
    <title>${escapeXml(item.title)}</title>
    <link>${escapeXml(siteUrl)}/${item.postType === 'post' ? 'blog/' : ''}${postName}/</link>
    <pubDate>${pubDate.toUTCString()}</pubDate>
    <dc:creator>${cdata(item.author || 'admin')}</dc:creator>
    <guid isPermaLink="false">${escapeXml(siteUrl)}/?p=${postId}</guid>
    <description></description>
    <content:encoded>${cdata(item.content)}</content:encoded>
    <excerpt:encoded>${cdata(item.excerpt || '')}</excerpt:encoded>
    <wp:post_id>${postId}</wp:post_id>
    <wp:post_date>${formatWpDate(pubDate)}</wp:post_date>
    <wp:post_date_gmt>${formatWpDate(pubDate)}</wp:post_date_gmt>
    <wp:post_modified>${formatWpDate(now)}</wp:post_modified>
    <wp:post_modified_gmt>${formatWpDate(now)}</wp:post_modified_gmt>
    <wp:comment_status>closed</wp:comment_status>
    <wp:ping_status>closed</wp:ping_status>
    <wp:post_name>${cdata(postName)}</wp:post_name>
    <wp:status>${item.status || 'publish'}</wp:status>
    <wp:post_parent>0</wp:post_parent>
    <wp:menu_order>0</wp:menu_order>
    <wp:post_type>${item.postType}</wp:post_type>
    <wp:post_password></wp:post_password>
    <wp:is_sticky>0</wp:is_sticky>
`;

    // Add categories
    item.categories?.forEach((cat) => {
      xml += `    <category domain="category" nicename="${cat.toLowerCase().replace(/\s+/g, '-')}">${cdata(cat)}</category>
`;
    });

    // Add tags
    item.tags?.forEach((tag) => {
      xml += `    <category domain="post_tag" nicename="${tag.toLowerCase().replace(/\s+/g, '-')}">${cdata(tag)}</category>
`;
    });

    xml += `  </item>
`;
    postId++;
  });

  xml += `</channel>
</rss>`;

  return xml;
}

/**
 * Export a single content piece to WordPress XML
 */
export function contentPieceToWXR(piece: {
  title: string;
  content: string;
  excerpt?: string;
  slug?: string;
  contentType: string;
  tags?: string[];
}): string {
  // Determine if it's a post or page based on content type
  const postTypes = ['blog', 'blogVersus', 'blogVideo', 'contentRefresh'];
  const postType = postTypes.includes(piece.contentType) ? 'post' : 'page';

  return toWordPressXML({
    items: [
      {
        title: piece.title,
        content: piece.content,
        excerpt: piece.excerpt,
        slug: piece.slug,
        postType,
        tags: piece.tags,
        categories: [piece.contentType],
      },
    ],
  });
}
