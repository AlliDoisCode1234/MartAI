// Removed axios import
import * as cheerio from 'cheerio';

export interface SiteAnalysis {
  title: string;
  metaDescription: string;
  h1Tags: string[];
  h2Tags: string[];
  images: Array<{ src: string; alt: string }>;
  links: Array<{ href: string; text: string }>;
  hasSSL: boolean;
  loadTime?: number;
  mobileFriendly: boolean;
  wordCount: number;
  headings: string[];
  metaKeywords?: string;
  canonicalUrl?: string;
  ogTags: Record<string, string>;
  schemaMarkup: boolean;
  issues: string[];
}

export async function crawlWebsite(url: string): Promise<SiteAnalysis> {
  try {
    const startTime = Date.now();
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      maxRedirects: 5,
    });

    const loadTime = Date.now() - startTime;
    const $ = cheerio.load(response.data);

    const issues: string[] = [];
    const h1Tags: string[] = [];
    const h2Tags: string[] = [];
    const headings: string[] = [];
    const images: Array<{ src: string; alt: string }> = [];
    const links: Array<{ href: string; text: string }> = [];
    const ogTags: Record<string, string> = {};

    // Extract title
    const title = $('title').first().text().trim() || '';
    if (!title) issues.push('Missing title tag');

    // Extract meta description
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    if (!metaDescription) issues.push('Missing meta description');
    if (metaDescription && metaDescription.length < 120) {
      issues.push('Meta description too short (recommended 120-160 characters)');
    }

    // Extract H1 tags
    $('h1').each((_, el) => {
      const text = $(el).text().trim();
      if (text) h1Tags.push(text);
    });
    if (h1Tags.length === 0) issues.push('Missing H1 tag');
    if (h1Tags.length > 1) issues.push('Multiple H1 tags found');

    // Extract H2 tags
    $('h2').each((_, el) => {
      const text = $(el).text().trim();
      if (text) h2Tags.push(text);
    });

    // Extract all headings
    $('h1, h2, h3, h4, h5, h6').each((_, el) => {
      const text = $(el).text().trim();
      if (text) headings.push(text);
    });

    // Extract images
    $('img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src') || '';
      const alt = $(el).attr('alt') || '';
      if (src) {
        images.push({ src, alt });
        if (!alt) issues.push(`Image missing alt text: ${src.substring(0, 50)}`);
      }
    });

    // Extract links
    $('a').each((_, el) => {
      const href = $(el).attr('href') || '';
      const text = $(el).text().trim();
      if (href) links.push({ href, text });
    });

    // Check SSL
    const hasSSL = url.startsWith('https://');
    if (!hasSSL) issues.push('Site not using HTTPS');

    // Extract meta keywords
    const metaKeywords = $('meta[name="keywords"]').attr('content');

    // Extract canonical URL
    const canonicalUrl = $('link[rel="canonical"]').attr('href');
    if (!canonicalUrl) issues.push('Missing canonical URL');

    // Extract OG tags
    $('meta[property^="og:"]').each((_, el) => {
      const property = $(el).attr('property');
      const content = $(el).attr('content');
      if (property && content) {
        ogTags[property] = content;
      }
    });

    // Check for schema markup
    const schemaMarkup = $('script[type="application/ld+json"]').length > 0;
    if (!schemaMarkup) issues.push('No schema markup found');

    // Check mobile-friendly (viewport meta tag)
    const viewport = $('meta[name="viewport"]').attr('content');
    const mobileFriendly = !!viewport;
    if (!mobileFriendly) issues.push('Missing viewport meta tag (not mobile-friendly)');

    // Calculate word count
    const bodyText = $('body').text();
    const wordCount = bodyText.split(/\s+/).filter((word) => word.length > 0).length;
    if (wordCount < 300) issues.push('Low word count (recommended 300+ words)');

    return {
      title,
      metaDescription,
      h1Tags,
      h2Tags,
      images,
      links,
      hasSSL,
      loadTime,
      mobileFriendly,
      wordCount,
      headings,
      metaKeywords,
      canonicalUrl,
      ogTags,
      schemaMarkup,
      issues,
    };
  } catch (error) {
    console.error('Error crawling website:', error);
    throw new Error(
      `Failed to crawl website: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function analyzeMultiplePages(
  baseUrl: string,
  paths: string[] = ['/', '/about', '/services', '/contact']
): Promise<SiteAnalysis[]> {
  const analyses: SiteAnalysis[] = [];

  for (const path of paths) {
    try {
      const fullUrl = new URL(path, baseUrl).toString();
      const analysis = await crawlWebsite(fullUrl);
      analyses.push(analysis);
      // Rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Failed to analyze ${path}:`, error);
    }
  }

  return analyses;
}
