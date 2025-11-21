# MartAI - AI-Powered SEO Automation

**Automate your SEO content workflow from keyword research to publishing.**

## What It Does

MartAI helps businesses create and publish SEO-optimized content automatically:

1. **Connect** your Google Analytics, Search Console, and CMS (WordPress/Shopify/Webflow)
2. **Generate** AI-powered keyword clusters and a 12-week content plan
3. **Create** SEO-optimized content briefs and drafts with AI
4. **Publish** automatically to your CMS on schedule
5. **Track** performance with analytics dashboard and insights

## How Users Use It

**Marketer Max** (in-house marketer):
- Connects GA4/GSC to see current performance
- Generates keyword clusters from top queries
- Creates quarterly content plan (e.g., 2 posts/week)
- AI generates briefs with titles, H2s, FAQs, meta tags
- Reviews and approves AI-generated drafts
- Schedules publishing to WordPress
- Monitors traffic growth and applies AI insights

**Agency Amy** (multi-client):
- Onboards clients with business info
- Connects each client's GA4/GSC/CMS
- Generates client-specific keyword strategies
- Manages content calendars across clients
- Automated publishing reduces manual work
- Client dashboards show ROI

## Quick Start

```bash
npm install
cp .env.example .env.local  # Add your keys
npx convex dev              # Initialize backend
npm run dev                 # Start dev server
```

## Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design, tech stack, data flow
- **[DOCS.md](DOCS.md)** - API reference, features, implementation
- **[DEV_WORKFLOW.md](DEV_WORKFLOW.md)** - Setup, development, deployment

## Tech Stack

Next.js 15 • Convex • OpenAI GPT-4o • Chakra UI • Lexical
