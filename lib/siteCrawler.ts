/**
 * Basic site crawler for SEO analysis
 * Extracts key SEO metadata from a webpage
 */

export interface SiteAnalysisResult {
  url: string;
  title: string | null;
  metaDescription: string | null;
  h1Tags: string[];
  h2Tags: string[];
  wordCount: number;
  loadTime: number;
  mobileFriendly: boolean;
  issues: string[];
  images: {
    total: number;
    withoutAlt: number;
  };
  links: {
    internal: number;
    external: number;
  };
}

/**
 * Crawl a website and extract SEO-relevant data
 * Uses fetch + regex-based extraction (no cheerio dependency)
 */
export async function crawlWebsite(url: string): Promise<SiteAnalysisResult> {
  const startTime = Date.now();
  const issues: string[] = [];

  // Normalize URL
  const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;

  try {
    const response = await fetch(normalizedUrl, {
      headers: {
        'User-Agent': 'MartAI-SEO-Crawler/1.0',
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const loadTime = Date.now() - startTime;

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : null;
    if (!title) {
      issues.push('Missing page title');
    } else if (title.length < 30) {
      issues.push('Title too short (< 30 chars)');
    } else if (title.length > 60) {
      issues.push('Title too long (> 60 chars)');
    }

    // Extract meta description
    const metaDescMatch =
      html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
      html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
    const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : null;
    if (!metaDescription) {
      issues.push('Missing meta description');
    } else if (metaDescription.length < 120) {
      issues.push('Meta description too short (< 120 chars)');
    } else if (metaDescription.length > 160) {
      issues.push('Meta description too long (> 160 chars)');
    }

    // Extract H1 tags
    const h1Matches = html.matchAll(/<h1[^>]*>([^<]*)<\/h1>/gi);
    const h1Tags = Array.from(h1Matches, (m) => m[1].trim()).filter(Boolean);
    if (h1Tags.length === 0) {
      issues.push('Missing H1 tag');
    } else if (h1Tags.length > 1) {
      issues.push(`Multiple H1 tags found (${h1Tags.length})`);
    }

    // Extract H2 tags
    const h2Matches = html.matchAll(/<h2[^>]*>([^<]*)<\/h2>/gi);
    const h2Tags = Array.from(h2Matches, (m) => m[1].trim()).filter(Boolean);

    // Calculate word count (strip HTML, count words)
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const wordCount = textContent.split(/\s+/).filter((w) => w.length > 0).length;
    if (wordCount < 300) {
      issues.push('Thin content (< 300 words)');
    }

    // Check for mobile viewport
    const hasViewport = /<meta[^>]*name=["']viewport["'][^>]*>/i.test(html);
    if (!hasViewport) {
      issues.push('Missing viewport meta tag (mobile-unfriendly)');
    }

    // Count images and check for alt tags
    const imgMatches = html.matchAll(/<img[^>]*>/gi);
    const images = Array.from(imgMatches);
    const imagesWithoutAlt = images.filter(
      (img) => !img[0].includes('alt=') || /alt=["']\s*["']/i.test(img[0])
    ).length;
    if (imagesWithoutAlt > 0) {
      issues.push(`${imagesWithoutAlt} image(s) missing alt text`);
    }

    // Count links
    const linkMatches = html.matchAll(/<a[^>]*href=["']([^"']*)["'][^>]*>/gi);
    const links = Array.from(linkMatches);
    const urlHost = new URL(normalizedUrl).hostname;
    let internalLinks = 0;
    let externalLinks = 0;
    for (const link of links) {
      try {
        const href = link[1];
        if (href.startsWith('#') || href.startsWith('javascript:')) continue;
        if (href.startsWith('/') || href.includes(urlHost)) {
          internalLinks++;
        } else if (href.startsWith('http')) {
          externalLinks++;
        }
      } catch {
        // Skip malformed URLs
      }
    }

    // Load time check
    if (loadTime > 3000) {
      issues.push(`Slow page load (${(loadTime / 1000).toFixed(1)}s)`);
    }

    return {
      url: normalizedUrl,
      title,
      metaDescription,
      h1Tags,
      h2Tags,
      wordCount,
      loadTime,
      mobileFriendly: hasViewport,
      issues,
      images: {
        total: images.length,
        withoutAlt: imagesWithoutAlt,
      },
      links: {
        internal: internalLinks,
        external: externalLinks,
      },
    };
  } catch (error: any) {
    // Return a minimal result with the error as an issue
    return {
      url: normalizedUrl,
      title: null,
      metaDescription: null,
      h1Tags: [],
      h2Tags: [],
      wordCount: 0,
      loadTime: Date.now() - startTime,
      mobileFriendly: false,
      issues: [`Crawl failed: ${error.message}`],
      images: { total: 0, withoutAlt: 0 },
      links: { internal: 0, external: 0 },
    };
  }
}
