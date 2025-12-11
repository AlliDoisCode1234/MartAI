/**
 * WordPress REST API Client
 *
 * Handles all WordPress API interactions for content publishing.
 */

export interface WordPressPage {
  id?: number;
  title: string;
  content: string;
  slug?: string;
  status?: 'publish' | 'draft' | 'private' | 'future';
  excerpt?: string;
  meta?: Record<string, unknown>;
  date?: string; // ISO date for scheduled posts
}

export interface WordPressPost extends WordPressPage {
  categories?: number[];
  tags?: number[];
  featured_media?: number;
}

export interface WordPressAuth {
  siteUrl: string;
  username: string;
  password: string; // Application password
}

export interface WordPressMedia {
  id: number;
  source_url: string;
  title: { rendered: string };
}

export interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WordPressTag {
  id: number;
  name: string;
  slug: string;
}

export class WordPressClient {
  private siteUrl: string;
  private auth: WordPressAuth;
  private apiUrl: string;
  private authHeader: string;

  constructor(auth: WordPressAuth) {
    this.siteUrl = auth.siteUrl.replace(/\/$/, '');
    this.auth = auth;
    this.apiUrl = `${this.siteUrl}/wp-json/wp/v2`;
    this.authHeader =
      'Basic ' + Buffer.from(`${auth.username}:${auth.password}`).toString('base64');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: this.authHeader,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(
        `WordPress API error: ${data.message || response.statusText} (${response.status})`
      );
    }

    return response.json();
  }

  // ============ Connection Testing ============

  async testConnection(): Promise<{ valid: boolean; siteName?: string; error?: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/`, {
        headers: { Authorization: this.authHeader },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        return {
          valid: false,
          error: data.message || `HTTP error ${response.status}`,
        };
      }

      const data = await response.json();
      return { valid: true, siteName: data.name || 'WordPress Site' };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Connection failed';
      return { valid: false, error: message };
    }
  }

  async checkPublishingRights(): Promise<{ canPublish: boolean; error?: string }> {
    try {
      const data = await this.request<{ capabilities?: Record<string, boolean> }>(
        '/users/me?context=edit'
      );
      const capabilities = data.capabilities || {};
      const canPublish =
        capabilities.publish_pages || capabilities.publish_posts || capabilities.edit_pages;

      if (!canPublish) {
        return { canPublish: false, error: 'User does not have publishing permissions' };
      }

      return { canPublish: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to check permissions';
      return { canPublish: false, error: message };
    }
  }

  // ============ Pages ============

  async createPage(page: WordPressPage): Promise<{ id: number; link: string }> {
    const data = await this.request<{ id: number; link: string }>('/pages', {
      method: 'POST',
      body: JSON.stringify({
        title: page.title,
        content: page.content,
        status: page.status || 'publish',
        slug: page.slug,
        excerpt: page.excerpt,
        meta: page.meta,
        date: page.date,
      }),
    });

    return { id: data.id, link: data.link };
  }

  async updatePage(
    pageId: number,
    page: Partial<WordPressPage>
  ): Promise<{ id: number; link: string }> {
    const data = await this.request<{ id: number; link: string }>(`/pages/${pageId}`, {
      method: 'POST',
      body: JSON.stringify(page),
    });

    return { id: data.id, link: data.link };
  }

  async getPages(perPage: number = 100): Promise<WordPressPage[]> {
    return this.request<WordPressPage[]>(`/pages?per_page=${perPage}`);
  }

  // ============ Posts ============

  async createPost(post: WordPressPost): Promise<{ id: number; link: string }> {
    const data = await this.request<{ id: number; link: string }>('/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: post.title,
        content: post.content,
        status: post.status || 'draft',
        slug: post.slug,
        excerpt: post.excerpt,
        categories: post.categories,
        tags: post.tags,
        featured_media: post.featured_media,
        meta: post.meta,
        date: post.date,
      }),
    });

    return { id: data.id, link: data.link };
  }

  async updatePost(
    postId: number,
    post: Partial<WordPressPost>
  ): Promise<{ id: number; link: string }> {
    const data = await this.request<{ id: number; link: string }>(`/posts/${postId}`, {
      method: 'POST',
      body: JSON.stringify(post),
    });

    return { id: data.id, link: data.link };
  }

  async getPosts(perPage: number = 100): Promise<WordPressPost[]> {
    return this.request<WordPressPost[]>(`/posts?per_page=${perPage}`);
  }

  // ============ Media ============

  async uploadMedia(imageUrl: string, filename: string): Promise<{ id: number; url: string }> {
    // Fetch the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }

    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    const imageBuffer = await imageResponse.arrayBuffer();

    // Upload to WordPress
    const response = await fetch(`${this.apiUrl}/media`, {
      method: 'POST',
      headers: {
        Authorization: this.authHeader,
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
      body: imageBuffer,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(`Media upload failed: ${data.message || response.statusText}`);
    }

    const data = await response.json();
    return {
      id: data.id,
      url: data.source_url,
    };
  }

  async getMedia(mediaId: number): Promise<WordPressMedia> {
    return this.request<WordPressMedia>(`/media/${mediaId}`);
  }

  // ============ Categories ============

  async getCategories(): Promise<WordPressCategory[]> {
    return this.request<WordPressCategory[]>('/categories?per_page=100');
  }

  async createCategory(name: string): Promise<WordPressCategory> {
    return this.request<WordPressCategory>('/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async getOrCreateCategory(name: string): Promise<number> {
    const categories = await this.getCategories();
    const existing = categories.find((c) => c.name.toLowerCase() === name.toLowerCase());

    if (existing) return existing.id;

    const newCategory = await this.createCategory(name);
    return newCategory.id;
  }

  async getOrCreateCategories(names: string[]): Promise<number[]> {
    const ids: number[] = [];
    for (const name of names) {
      const id = await this.getOrCreateCategory(name);
      ids.push(id);
    }
    return ids;
  }

  // ============ Tags ============

  async getTags(): Promise<WordPressTag[]> {
    return this.request<WordPressTag[]>('/tags?per_page=100');
  }

  async createTag(name: string): Promise<WordPressTag> {
    return this.request<WordPressTag>('/tags', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async getOrCreateTag(name: string): Promise<number> {
    const tags = await this.getTags();
    const existing = tags.find((t) => t.name.toLowerCase() === name.toLowerCase());

    if (existing) return existing.id;

    const newTag = await this.createTag(name);
    return newTag.id;
  }

  async getOrCreateTags(names: string[]): Promise<number[]> {
    const ids: number[] = [];
    for (const name of names) {
      const id = await this.getOrCreateTag(name);
      ids.push(id);
    }
    return ids;
  }

  // ============ Full Publishing Flow ============

  async publishArticle(options: {
    title: string;
    content: string;
    excerpt?: string;
    slug?: string;
    status?: 'draft' | 'publish' | 'future' | 'private';
    categories?: string[];
    tags?: string[];
    featuredImageUrl?: string;
    scheduledDate?: Date;
    meta?: Record<string, unknown>;
    postType?: 'post' | 'page';
  }): Promise<{ id: number; link: string; featuredMediaId?: number }> {
    let featuredMediaId: number | undefined;

    // Upload featured image if provided
    if (options.featuredImageUrl) {
      try {
        const filename = `featured-${Date.now()}.jpg`;
        const media = await this.uploadMedia(options.featuredImageUrl, filename);
        featuredMediaId = media.id;
      } catch (error) {
        console.error('Failed to upload featured image:', error);
        // Continue without featured image
      }
    }

    // Get/create categories
    let categoryIds: number[] = [];
    if (options.categories?.length) {
      categoryIds = await this.getOrCreateCategories(options.categories);
    }

    // Get/create tags
    let tagIds: number[] = [];
    if (options.tags?.length) {
      tagIds = await this.getOrCreateTags(options.tags);
    }

    // Prepare post data
    const postData: WordPressPost = {
      title: options.title,
      content: options.content,
      excerpt: options.excerpt,
      slug: options.slug,
      status: options.status || 'draft',
      categories: categoryIds.length ? categoryIds : undefined,
      tags: tagIds.length ? tagIds : undefined,
      featured_media: featuredMediaId,
      meta: options.meta,
      date: options.scheduledDate?.toISOString(),
    };

    // Create post or page
    const result =
      options.postType === 'page'
        ? await this.createPage(postData)
        : await this.createPost(postData);

    return {
      ...result,
      featuredMediaId,
    };
  }
}

// OAuth flow helpers (for future WordPress.com hosted sites)
export function getWordPressOAuthUrl(
  siteUrl: string,
  clientId: string,
  redirectUri: string
): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'write',
  });

  return `${siteUrl}/wp-admin/admin.php?page=oauth1_authorize&${params.toString()}`;
}

// Template generator
export function generateServicesPageContent(
  companyName: string,
  industry: string,
  keywords: string[],
  targetAudience: string
): string {
  const primaryKeyword = keywords[0] || `${industry} services`;

  return `<!-- wp:heading {"level":1} -->
<h1>${primaryKeyword.charAt(0).toUpperCase() + primaryKeyword.slice(1)}</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>${companyName} provides comprehensive ${industry} solutions tailored for ${targetAudience}. Our expert team delivers results-driven strategies to help your business grow and succeed.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2} -->
<h2>Our ${industry} Services</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul>
${keywords
  .slice(0, 8)
  .map((kw) => `  <li>${kw.charAt(0).toUpperCase() + kw.slice(1)}</li>`)
  .join('\n')}
</ul>
<!-- /wp:list -->

<!-- wp:heading {"level":2} -->
<h2>Why Choose ${companyName}?</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>With years of experience in ${industry}, we understand the unique challenges ${targetAudience} face. Our proven methodologies and data-driven approach ensure measurable results for your business.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2} -->
<h2>Get Started Today</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Ready to take your ${industry} strategy to the next level? Contact us today to discuss how we can help you achieve your goals.</p>
<!-- /wp:paragraph -->`;
}
