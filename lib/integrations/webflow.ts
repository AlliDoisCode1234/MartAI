// Webflow API client
export interface WebflowPage {
  name: string;
  slug: string;
  htmlContent?: string;
  seoTitle?: string;
  seoDescription?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  isDraft?: boolean;
}

export interface WebflowAuth {
  siteId: string;
  accessToken: string;
  collectionId?: string; // CMS collection ID for pages
}

export class WebflowClient {
  private siteId: string;
  private accessToken: string;
  private collectionId?: string;
  private apiUrl = 'https://api.webflow.com/v2';

  constructor(auth: WebflowAuth) {
    this.siteId = auth.siteId;
    this.accessToken = auth.accessToken;
    this.collectionId = auth.collectionId;
  }

  async testConnection(): Promise<{ valid: boolean; siteName?: string; error?: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/sites/${this.siteId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept-Version': '1.0.0',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return { valid: false, error: error.message || 'Failed to connect to Webflow' };
      }

      const data = await response.json();
      return { valid: true, siteName: data.displayName };
    } catch (error) {
      return { 
        valid: false, 
        error: error instanceof Error ? error.message : 'Connection failed' 
      };
    }
  }

  async checkPublishingRights(): Promise<{ canPublish: boolean; error?: string }> {
    try {
      // Check if we can list collections (requires publish rights)
      const response = await fetch(`${this.apiUrl}/sites/${this.siteId}/collections`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept-Version': '1.0.0',
        },
      });

      if (!response.ok) {
        return { canPublish: false, error: 'Insufficient permissions to publish' };
      }

      return { canPublish: true };
    } catch (error) {
      return { 
        canPublish: false, 
        error: error instanceof Error ? error.message : 'Failed to check permissions' 
      };
    }
  }

  async createPage(page: WebflowPage): Promise<{ id: string; slug: string; url: string }> {
    try {
      if (!this.collectionId) {
        throw new Error('Collection ID is required to create pages');
      }

      // Create CMS item (page) in collection
      const response = await fetch(
        `${this.apiUrl}/collections/${this.collectionId}/items`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
            'Accept-Version': '1.0.0',
          },
          body: JSON.stringify({
            fieldData: {
              name: page.name,
              slug: page.slug,
              'seo-title': page.seoTitle,
              'seo-description': page.seoDescription,
              'open-graph-title': page.openGraphTitle,
              'open-graph-description': page.openGraphDescription,
            },
            isDraft: page.isDraft !== false,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create Webflow page');
      }

      const data = await response.json();
      return {
        id: data.id,
        slug: data.fieldData?.slug || page.slug,
        url: `https://${this.siteId}.webflow.io/${data.fieldData?.slug || page.slug}`,
      };
    } catch (error) {
      console.error('Webflow API Error:', error);
      throw new Error(
        `Webflow API error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async updatePage(itemId: string, page: Partial<WebflowPage>): Promise<{ id: string; slug: string; url: string }> {
    try {
      if (!this.collectionId) {
        throw new Error('Collection ID is required to update pages');
      }

      const response = await fetch(
        `${this.apiUrl}/collections/${this.collectionId}/items/${itemId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
            'Accept-Version': '1.0.0',
          },
          body: JSON.stringify({
            fieldData: {
              ...(page.name && { name: page.name }),
              ...(page.slug && { slug: page.slug }),
              ...(page.seoTitle && { 'seo-title': page.seoTitle }),
              ...(page.seoDescription && { 'seo-description': page.seoDescription }),
            },
            isDraft: page.isDraft,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update Webflow page');
      }

      const data = await response.json();
      return {
        id: data.id,
        slug: data.fieldData?.slug || page.slug || '',
        url: `https://${this.siteId}.webflow.io/${data.fieldData?.slug || page.slug || ''}`,
      };
    } catch (error) {
      console.error('Webflow API Error:', error);
      throw new Error(
        `Webflow API error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async publishSite(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/sites/${this.siteId}/publish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'Accept-Version': '1.0.0',
        },
        body: JSON.stringify({
          domains: [], // Publish to default domain
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.message || 'Failed to publish site' };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Publish failed' 
      };
    }
  }
}

