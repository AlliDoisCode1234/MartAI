import axios from 'axios';

export interface WordPressPage {
  id?: number;
  title: string;
  content: string;
  slug?: string;
  status?: 'publish' | 'draft' | 'private';
  excerpt?: string;
  meta?: Record<string, any>;
}

export interface WordPressAuth {
  siteUrl: string;
  username: string;
  password: string; // Application password or OAuth token
}

export class WordPressClient {
  private siteUrl: string;
  private auth: WordPressAuth;
  private apiUrl: string;

  constructor(auth: WordPressAuth) {
    this.siteUrl = auth.siteUrl.replace(/\/$/, '');
    this.auth = auth;
    this.apiUrl = `${this.siteUrl}/wp-json/wp/v2`;
  }

  async createPage(page: WordPressPage): Promise<{ id: number; link: string }> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/pages`,
        {
          title: page.title,
          content: page.content,
          status: page.status || 'publish',
          slug: page.slug,
          excerpt: page.excerpt,
          meta: page.meta,
        },
        {
          auth: {
            username: this.auth.username,
            password: this.auth.password,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        id: response.data.id,
        link: response.data.link,
      };
    } catch (error) {
      console.error('WordPress API Error:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(`WordPress API error: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  async updatePage(pageId: number, page: Partial<WordPressPage>): Promise<{ id: number; link: string }> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/pages/${pageId}`,
        {
          title: page.title,
          content: page.content,
          status: page.status,
          slug: page.slug,
          excerpt: page.excerpt,
          meta: page.meta,
        },
        {
          auth: {
            username: this.auth.username,
            password: this.auth.password,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        id: response.data.id,
        link: response.data.link,
      };
    } catch (error) {
      console.error('WordPress API Error:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(`WordPress API error: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  async getPages(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/pages`, {
        auth: {
          username: this.auth.username,
          password: this.auth.password,
        },
        params: {
          per_page: 100,
        },
      });
      return response.data;
    } catch (error) {
      console.error('WordPress API Error:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await axios.get(`${this.apiUrl}/`, {
        auth: {
          username: this.auth.username,
          password: this.auth.password,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

// OAuth flow helpers
export function getWordPressOAuthUrl(siteUrl: string, clientId: string, redirectUri: string): string {
  // WordPress OAuth 1.0a flow
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'write',
  });
  
  return `${siteUrl}/wp-admin/admin.php?page=oauth1_authorize&${params.toString()}`;
}

export function generateServicesPageContent(
  companyName: string,
  industry: string,
  keywords: string[],
  targetAudience: string
): string {
  const primaryKeyword = keywords[0] || `${industry} services`;
  const secondaryKeywords = keywords.slice(1, 5).join(', ');
  
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
${keywords.slice(0, 8).map(kw => `  <li>${kw.charAt(0).toUpperCase() + kw.slice(1)}</li>`).join('\n')}
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

