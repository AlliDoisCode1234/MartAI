# Programmatic SEO Templates & Structure

**Status**: Backlog (Blocked on Originality.ai API key for quality checks)

---

## Overview

Programmatic SEO generates template-based pages at scale targeting long-tail keywords. Combined with pillar content for topical authority.

---

## Page Templates

### 1. Comparison Pages `/compare/[competitor]`

**URL Pattern**: `martai.co/compare/semrush`

**Template Variables**:

```typescript
interface ComparisonPage {
  competitor: string; // "SEMrush"
  competitorSlug: string; // "semrush"
  companySize: string; // "Enterprise", "Mid-market", "SMB"
  pricing: {
    ours: string; // "$49-199/mo"
    theirs: string; // "$119-449/mo"
  };
  features: FeatureComparison[];
  verdict: string; // "Best for SMBs who want..."
}
```

**Target Keywords**:

- `martai vs semrush`
- `semrush alternative`
- `semrush competitor`

**Estimated Pages**: 50+ (SEMrush, Ahrefs, Moz, Surfer, etc.)

---

### 2. Industry Pages `/for/[industry]`

**URL Pattern**: `martai.co/for/law-firms`

**Template Variables**:

```typescript
interface IndustryPage {
  industry: string; // "Law Firms"
  industrySlug: string; // "law-firms"
  painPoints: string[]; // ["Finding clients", "Local SEO"]
  useCases: UseCase[];
  testimonial?: Testimonial;
  keywords: string[]; // Industry-specific keywords
}
```

**Target Keywords**:

- `seo for law firms`
- `law firm marketing automation`
- `ai content for lawyers`

**Estimated Pages**: 30+ (Law firms, Dentists, Plumbers, Agencies, etc.)

---

### 3. Integration Pages `/integrations/[platform]`

**URL Pattern**: `martai.co/integrations/wordpress`

**Template Variables**:

```typescript
interface IntegrationPage {
  platform: string; // "WordPress"
  platformSlug: string; // "wordpress"
  setupSteps: Step[];
  features: string[]; // What you can do
  marketShare: string; // "43% of the web"
}
```

**Target Keywords**:

- `martai wordpress integration`
- `ai seo for wordpress`
- `publish content to wordpress`

**Estimated Pages**: 10+ (WordPress, Shopify, Webflow, Wix, etc.)

---

### 4. Feature Pages `/features/[feature]`

**URL Pattern**: `martai.co/features/keyword-clustering`

**Template Variables**:

```typescript
interface FeaturePage {
  feature: string; // "Keyword Clustering"
  featureSlug: string; // "keyword-clustering"
  problem: string; // What problem it solves
  howItWorks: Step[];
  benefits: string[];
  relatedFeatures: string[];
}
```

**Target Keywords**:

- `ai keyword clustering`
- `semantic keyword grouping`
- `automated topic clusters`

**Estimated Pages**: 20+ (All MartAI features)

---

## Pillar Content (Manual/High-Quality)

5 cornerstone pages with comprehensive content:

| Pillar                       | Target Keyword                 | Word Count |
| ---------------------------- | ------------------------------ | ---------- |
| AI SEO Complete Guide        | `ai seo guide`                 | 4,000+     |
| Content Marketing Automation | `content marketing automation` | 3,500+     |
| SEO for Small Business       | `seo for small business`       | 3,500+     |
| Topic Clusters Strategy      | `topic clusters seo`           | 3,000+     |
| AI Content That Ranks        | `ai content ranking`           | 3,000+     |

---

## Topic Cluster Structure

Each pillar links to 3-5 cluster articles:

```
AI SEO Complete Guide (Pillar)
├── What is AI SEO?
├── AI Content vs Human Content
├── How to Use AI for SEO
├── AI SEO Tools Comparison
└── AI SEO Case Studies
```

---

## Implementation Steps

1. **Create page templates** (Next.js dynamic routes)
2. **Build data layer** (Store page data in Convex)
3. **Generate content** (Use MartAI's AI pipeline)
4. **Quality checks** (Plagiarism + AI detection) ← BLOCKED
5. **Deploy pages** (Static generation for SEO)
6. **Submit sitemap** (GSC)
7. **Monitor rankings** (Use MartAI's rank tracking)

---

## Blocker

**Originality.ai API Key Required**

Before publishing 100+ AI-generated pages, we need:

- Plagiarism detection (< 5% duplicate content)
- AI detection scores (aim for < 30% AI-detected)
- Readability checks (grade 8 reading level)

This ensures E-E-A-T compliance and avoids Google penalties.
