/**
 * Wix Blog REST API Client
 *
 * Standalone client for Wix Blog API interactions.
 * Used for testing and direct API calls outside Convex actions.
 */

export interface WixDraftPost {
  title: string;
  richContent: object;
  excerpt?: string;
  slug?: string;
  tags?: string[];
  categoryIds?: string[];
}

export interface WixAuth {
  accessToken: string;
}

export interface WixCategory {
  id: string;
  label: string;
  slug?: string;
}

export interface WixPost {
  id: string;
  title: string;
  slug: string;
  url?: string;
  status: 'draft' | 'published';
}

export class WixBlogClient {
  private accessToken: string;
  private baseUrl = 'https://www.wixapis.com';

  constructor(auth: WixAuth) {
    this.accessToken = auth.accessToken;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: this.accessToken,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(`Wix API error: ${data.message || response.statusText} (${response.status})`);
    }

    return response.json();
  }

  // ============ Categories ============

  async getCategories(): Promise<WixCategory[]> {
    const data = await this.request<{ categories: WixCategory[] }>('/blog/v3/categories');
    return data.categories || [];
  }

  async createCategory(label: string): Promise<WixCategory> {
    const data = await this.request<{ category: WixCategory }>('/blog/v3/categories', {
      method: 'POST',
      body: JSON.stringify({ category: { label } }),
    });
    return data.category;
  }

  // ============ Draft Posts ============

  async getDraftPosts(): Promise<WixPost[]> {
    const data = await this.request<{ draftPosts: WixPost[] }>('/blog/v3/draft-posts');
    return data.draftPosts || [];
  }

  async createDraftPost(post: WixDraftPost): Promise<WixPost> {
    const data = await this.request<{ draftPost: WixPost }>('/blog/v3/draft-posts', {
      method: 'POST',
      body: JSON.stringify({ draftPost: post }),
    });
    return data.draftPost;
  }

  async publishDraft(draftId: string): Promise<WixPost> {
    const data = await this.request<{ post: WixPost }>(`/blog/v3/draft-posts/${draftId}/publish`, {
      method: 'POST',
    });
    return data.post;
  }

  // ============ Published Posts ============

  async getPublishedPosts(): Promise<WixPost[]> {
    const data = await this.request<{ posts: WixPost[] }>('/blog/v3/posts');
    return data.posts || [];
  }

  // ============ Full Publishing Flow ============

  async publishArticle(options: {
    title: string;
    richContent: object;
    excerpt?: string;
    slug?: string;
    tags?: string[];
    categoryIds?: string[];
    status?: 'draft' | 'publish';
  }): Promise<{ id: string; url?: string }> {
    // Create draft first
    const draft = await this.createDraftPost({
      title: options.title,
      richContent: options.richContent,
      excerpt: options.excerpt,
      slug: options.slug,
      tags: options.tags,
      categoryIds: options.categoryIds,
    });

    // If status is publish, publish the draft
    if (options.status === 'publish') {
      const published = await this.publishDraft(draft.id);
      return { id: published.id, url: published.url };
    }

    return { id: draft.id };
  }
}

// Content conversion helper
export function markdownToWixRichContent(markdown: string): object {
  const nodes: object[] = [];
  const lines = markdown.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('### ')) {
      nodes.push({
        type: 'HEADING',
        headingData: { level: 3 },
        nodes: [{ type: 'TEXT', textData: { text: line.slice(4) } }],
      });
    } else if (line.startsWith('## ')) {
      nodes.push({
        type: 'HEADING',
        headingData: { level: 2 },
        nodes: [{ type: 'TEXT', textData: { text: line.slice(3) } }],
      });
    } else if (line.startsWith('# ')) {
      nodes.push({
        type: 'HEADING',
        headingData: { level: 1 },
        nodes: [{ type: 'TEXT', textData: { text: line.slice(2) } }],
      });
    } else if (line.match(/^\s*[-*] /)) {
      const listItems: object[] = [];
      while (i < lines.length && lines[i].match(/^\s*[-*] /)) {
        listItems.push({
          type: 'LIST_ITEM',
          nodes: [{ type: 'TEXT', textData: { text: lines[i].replace(/^\s*[-*] /, '') } }],
        });
        i++;
      }
      nodes.push({ type: 'BULLETED_LIST', nodes: listItems });
      continue;
    } else if (line.trim()) {
      nodes.push({
        type: 'PARAGRAPH',
        nodes: [{ type: 'TEXT', textData: { text: line } }],
      });
    }

    i++;
  }

  return {
    nodes,
    metadata: {
      version: 1,
      createdTimestamp: Date.now(),
      updatedTimestamp: Date.now(),
    },
  };
}
