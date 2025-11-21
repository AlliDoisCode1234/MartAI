// Shopify API client - using REST API directly
const SHOPIFY_API_VERSION = '2024-01';

export interface ShopifyPage {
  title: string;
  body_html: string;
  handle?: string;
  published?: boolean;
  template_suffix?: string;
  metafields?: Array<{
    namespace: string;
    key: string;
    value: string;
    type: string;
  }>;
}

export interface ShopifyAuth {
  shopDomain: string;
  accessToken: string;
  apiVersion?: string;
}

export class ShopifyClient {
  private shopDomain: string;
  private accessToken: string;

  constructor(auth: ShopifyAuth) {
    this.shopDomain = auth.shopDomain.replace(/\.myshopify\.com$/, '');
    this.accessToken = auth.accessToken;
  }

  async createPage(page: ShopifyPage): Promise<{ id: number; handle: string; url: string }> {
    try {
      const response = await fetch(
        `https://${this.shopDomain}.myshopify.com/admin/api/${SHOPIFY_API_VERSION}/pages.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': this.accessToken,
          },
          body: JSON.stringify({
            page: {
              title: page.title,
              body_html: page.body_html,
              handle: page.handle,
              published: page.published !== false,
              template_suffix: page.template_suffix,
              metafields: page.metafields,
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errors || 'Failed to create Shopify page');
      }

      const data = await response.json();
      return {
        id: data.page.id,
        handle: data.page.handle,
        url: `https://${this.shopDomain}.myshopify.com/pages/${data.page.handle}`,
      };
    } catch (error) {
      console.error('Shopify API Error:', error);
      throw new Error(`Shopify API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updatePage(pageId: number, page: Partial<ShopifyPage>): Promise<{ id: number; handle: string; url: string }> {
    try {
      const response = await fetch(
        `https://${this.shopDomain}.myshopify.com/admin/api/${SHOPIFY_API_VERSION}/pages/${pageId}.json`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': this.accessToken,
          },
          body: JSON.stringify({
            page: {
              title: page.title,
              body_html: page.body_html,
              handle: page.handle,
              published: page.published,
              template_suffix: page.template_suffix,
              metafields: page.metafields,
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errors || 'Failed to update Shopify page');
      }

      const data = await response.json();
      return {
        id: data.page.id,
        handle: data.page.handle,
        url: `https://${this.shopDomain}.myshopify.com/pages/${data.page.handle}`,
      };
    } catch (error) {
      console.error('Shopify API Error:', error);
      throw new Error(`Shopify API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPages(): Promise<any[]> {
    try {
      const response = await fetch(
        `https://${this.shopDomain}.myshopify.com/admin/api/${SHOPIFY_API_VERSION}/pages.json`,
        {
          headers: {
            'X-Shopify-Access-Token': this.accessToken,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch Shopify pages');
      }

      const data = await response.json();
      return data.pages || [];
    } catch (error) {
      console.error('Shopify API Error:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(
        `https://${this.shopDomain}.myshopify.com/admin/api/${SHOPIFY_API_VERSION}/shop.json`,
        {
          headers: {
            'X-Shopify-Access-Token': this.accessToken,
          },
        }
      );
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// OAuth flow helpers
export function getShopifyOAuthUrl(shopDomain: string, clientId: string, redirectUri: string, scopes: string[] = ['write_content', 'read_content']): string {
  const params = new URLSearchParams({
    client_id: clientId,
    scope: scopes.join(','),
    redirect_uri: redirectUri,
  });
  
  return `https://${shopDomain}.myshopify.com/admin/oauth/authorize?${params.toString()}`;
}

export function generateServicesPageContent(
  companyName: string,
  industry: string,
  keywords: string[],
  targetAudience: string
): string {
  const primaryKeyword = keywords[0] || `${industry} services`;
  const secondaryKeywords = keywords.slice(1, 5).join(', ');
  
  return `<h1>${primaryKeyword.charAt(0).toUpperCase() + primaryKeyword.slice(1)}</h1>
<p>${companyName} provides comprehensive ${industry} solutions tailored for ${targetAudience}. Our expert team delivers results-driven strategies to help your business grow and succeed.</p>

<h2>Our ${industry} Services</h2>
<ul>
${keywords.slice(0, 8).map(kw => `  <li>${kw.charAt(0).toUpperCase() + kw.slice(1)}</li>`).join('\n')}
</ul>

<h2>Why Choose ${companyName}?</h2>
<p>With years of experience in ${industry}, we understand the unique challenges ${targetAudience} face. Our proven methodologies and data-driven approach ensure measurable results for your business.</p>

<h2>Get Started Today</h2>
<p>Ready to take your ${industry} strategy to the next level? Contact us today to discuss how we can help you achieve your goals.</p>`;
}

