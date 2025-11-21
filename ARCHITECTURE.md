# MartAI Architecture

## High-Level Overview

MartAI is an AI-powered SEO automation platform that helps businesses improve their online presence through automated keyword research, site audits, rank tracking, and content generation with direct integration to WordPress and Shopify.

## Core Components

### 1. Frontend (Next.js 15)
- **Framework**: Next.js 15 with App Router
- **UI**: Chakra UI
- **State**: React hooks + sessionStorage (temporary), Convex (persistent)
- **Pages**:
  - `/` - Dashboard
  - `/onboarding` - Customer intake and initial SEO analysis
  - `/keywords` - Keyword research and management
  - `/integrations` - WordPress/Shopify OAuth connections
  - `/strategy` - SEO strategy dashboard
  - `/analytics` - Performance metrics

### 2. Backend (Convex)
- **Database**: Convex reactive database
- **Schema**: 
  - `clients` - Business/client information
  - `seoAudits` - SEO audit results and scores
  - `keywords` - Generated keyword suggestions
  - `oauthTokens` - WordPress/Shopify OAuth credentials
  - `generatedPages` - Automatically created pages
  - `rankings` - Keyword ranking history
  - `seoStatistics` - Aggregated SEO metrics

### 3. AI Agent (OpenAI)
- **Model**: GPT-4o
- **Capabilities**:
  - Site crawling and analysis
  - Keyword generation with intent analysis
  - SEO audit with scoring
  - Content suggestions
  - Social media post generation

### 4. Integrations

#### WordPress
- **Authentication**: Application Password (OAuth 1.0a supported)
- **API**: WordPress REST API
- **Actions**: Create/update pages with SEO-optimized content

#### Shopify
- **Authentication**: Private App Access Token
- **API**: Shopify Admin API
- **Actions**: Create/update pages with SEO-optimized content

## Data Flow

### Customer Onboarding
1. User fills intake form (company name, website, industry, target audience)
2. Data saved to Convex `clients` table
3. AI agent crawls website and performs analysis
4. Keywords generated based on business info
5. SEO audit results stored in `seoAudits`
6. Keywords saved to `keywords` table
7. Statistics calculated and stored in `seoStatistics`

### Keyword Generation
1. AI analyzes business context (industry, audience, website)
2. Generates 20-30 keyword suggestions with:
   - Search intent (informational, commercial, transactional)
   - Priority level (high, medium, low)
   - Estimated volume and difficulty
   - Reasoning for each keyword
3. Keywords stored in Convex
4. User can filter, approve, and implement keywords

### Page Automation
1. User connects WordPress/Shopify via OAuth
2. Credentials stored securely in `oauthTokens`
3. User selects keywords from generated list
4. AI generates SEO-optimized page content
5. Content includes:
   - Primary and secondary keywords
   - Proper heading structure (H1, H2)
   - Meta descriptions
   - Internal linking opportunities
   - Call-to-action elements
6. Page created via platform API
7. Page record saved in `generatedPages`

### Rank Tracking
1. Periodically check keyword rankings
2. Store position data in `rankings` table
3. Track changes over time
4. Display in analytics dashboard

## Key Features (Ahrefs-Inspired)

### Site Explorer (Site Audit)
- Technical SEO analysis
- On-page optimization review
- Content quality assessment
- Backlink analysis (basic)
- Page speed metrics
- Mobile-friendliness check
- SSL verification

### Keywords Explorer
- AI-powered keyword generation
- Intent classification
- Priority scoring
- Related keyword suggestions
- Search volume estimates
- Difficulty assessment

### Rank Tracker
- Keyword position monitoring
- Historical tracking
- Multi-search engine support
- Location-based tracking

### Site Audit
- Automated crawling
- Issue detection
- Priority recommendations
- Score calculation

### Content Automation
- AI-generated service pages
- Keyword-optimized content
- Platform-specific formatting
- Automatic publishing

## Security Considerations

1. **OAuth Tokens**: Stored encrypted in Convex
2. **API Keys**: Environment variables only
3. **WordPress**: Application Passwords (more secure than user passwords)
4. **Shopify**: Private App tokens with scoped permissions
5. **Rate Limiting**: Implemented in API routes
6. **Error Handling**: Comprehensive try-catch blocks

## Environment Variables

```env
OPENAI_API_KEY=              # Required for AI agent
NEXT_PUBLIC_CONVEX_URL=       # Required for database
SHOPIFY_API_KEY=              # Optional, for Shopify OAuth
SHOPIFY_API_SECRET=           # Optional, for Shopify OAuth
VERCEL_AI_GATEWAY_KEY=        # Optional, alternative to OpenAI
```

## Deployment

### Convex Setup
1. Run `npx convex dev` to initialize
2. Set `NEXT_PUBLIC_CONVEX_URL` in environment
3. Deploy with `npx convex deploy`

### Next.js Deployment
- Vercel (recommended)
- Set root directory to `martai` if needed
- Configure environment variables
- Build command: `npm run build`

## API Routes

- `POST /api/seo-agent` - Generate SEO analysis
- `POST /api/clients` - Create/update client
- `GET /api/clients` - Get clients by user
- `GET /api/oauth/wordpress` - WordPress OAuth flow
- `POST /api/oauth/wordpress` - WordPress connection test
- `GET /api/oauth/shopify` - Shopify OAuth flow
- `POST /api/oauth/shopify` - Shopify connection test
- `POST /api/automation/create-page` - Create page on WordPress/Shopify

## Future Enhancements

1. **Ahrefs API Integration**: Real keyword data, backlink analysis
2. **Advanced Rank Tracking**: Automated SERP monitoring
3. **Content Scheduling**: Queue page creation
4. **A/B Testing**: Test different page variations
5. **Multi-language Support**: International SEO
6. **Competitor Analysis**: Track competitor keywords
7. **Reporting**: Automated client reports
8. **Webhooks**: Real-time updates from platforms

