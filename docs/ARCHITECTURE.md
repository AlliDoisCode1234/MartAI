# Phoo.ai — Architecture & Codebase Guide

> **Last updated**: February 11, 2026
> **Audience**: Engineers, founders, and stakeholders who need to understand what this system is, how it's built, and why decisions were made.

---

## 1. What Is Phoo?

Phoo.ai is an AI-driven **SEO content intelligence platform** for small businesses. Users connect their website, and Phoo:

1. **Discovers** high-value keywords via Google Search Console + AI clustering
2. **Plans** a content calendar based on industry templates and competitive gaps
3. **Generates** optimized articles with AI writer personas fine-tuned to brand voice
4. **Publishes** directly to WordPress, Shopify, Wix, or Webflow
5. **Tracks** performance with integrated GA4 + GSC analytics

Target customer: **small businesses under $500k annual revenue** — solopreneurs and small marketing teams who need results, not SEO tools.

---

## 2. Technology Stack

### Frontend

| Layer       | Technology                  | Purpose                            |
| ----------- | --------------------------- | ---------------------------------- |
| Framework   | **Next.js 15** (App Router) | SSR, routing, middleware           |
| UI Library  | **Chakra UI v2**            | Component system, theming          |
| Animation   | **Framer Motion**           | Page transitions, micro-animations |
| Rich Editor | **Lexical**                 | Content editing in Studio          |
| Charts      | **Recharts**                | Analytics visualizations           |
| Forms       | **React Hook Form + Zod**   | Validation                         |
| State       | **Convex React**            | Real-time reactive queries         |

### Backend

| Layer     | Technology                          | Purpose                        |
| --------- | ----------------------------------- | ------------------------------ |
| Database  | **Convex**                          | Real-time backend-as-a-service |
| Auth      | **@convex-dev/auth**                | Google OAuth + Password        |
| AI        | **OpenAI, Anthropic, Gemini**       | Multi-model content generation |
| Payments  | **Stripe** (via @convex-dev/stripe) | Subscription billing           |
| Email     | **Resend**                          | Transactional emails           |
| CMS       | **WordPress REST API**              | Primary publishing target      |
| Analytics | **Google APIs** (GA4, GSC)          | Performance metrics            |

### Infrastructure

| Layer       | Technology         | Purpose                         |
| ----------- | ------------------ | ------------------------------- |
| Hosting     | **Vercel**         | Frontend deployment             |
| Backend     | **Convex Cloud**   | Database + serverless functions |
| Domain      | **phoo.ai**        | Production domain               |
| CI          | **GitHub Actions** | Lint + type-check               |
| Code Review | **Qodo AI**        | Automated PR reviews            |

---

## 3. Project Structure

```
MartAI/
├── app/                    # Next.js App Router (22 routes)
│   ├── page.tsx            # Landing page (/)
│   ├── join/               # Waitlist capture (/join)
│   ├── auth/               # Login, signup
│   ├── onboarding/         # 3-step onboarding flow
│   ├── dashboard/          # Executive summary
│   ├── keywords/           # Keyword library
│   ├── studio/             # Content Studio workspace
│   ├── admin/              # Admin portal
│   ├── settings/           # User settings
│   ├── api/                # Next.js API routes (22 dirs)
│   ├── resources/          # Help center articles
│   ├── pricing/            # Public pricing page
│   ├── about/              # Company page
│   └── how-it-works/       # Product explanation
│
├── convex/                 # Convex backend (27 modules)
│   ├── schema.ts           # 58-table schema (1766 lines)
│   ├── convex.config.ts    # 8 Convex components
│   ├── contentGeneration.ts# AI content pipeline
│   ├── integrations/       # Google, HubSpot, WordPress, Shopify
│   ├── ai/                 # AI subsystems
│   ├── phoo/               # AI assistant (PhooBrain)
│   ├── seo/                # SEO operations
│   ├── publishing/         # CMS publishing pipeline
│   ├── subscriptions/      # Stripe management
│   ├── lib/                # RBAC, RLS, encryption
│   └── testing/            # Test utilities
│
├── src/components/         # 33 directories, 196 files
│   ├── Navigation/         # Header, MobileNav, BottomTabBar
│   ├── studio/             # StudioLayout, StudioSidebar
│   ├── admin/              # AdminLayout, AdminSidebar
│   ├── dashboard/          # Dashboard widgets
│   ├── content/            # Content editing
│   ├── strategy/           # Strategy planning (21 files)
│   ├── LexicalEditor/      # Rich text editor
│   ├── phoo/               # AI assistant UI
│   └── shared/             # Reusable primitives
│
├── lib/                    # Shared logic (75 files)
│   ├── hooks/              # React hooks
│   ├── ai/                 # AI client utilities
│   ├── apiAuth.ts          # API key auth
│   ├── apiSecurity.ts      # Security middleware
│   └── exporters/          # Content export
│
├── __tests__/              # 37 test files
├── middleware.ts            # Edge security + routing
└── content/                # MDX for /resources
```

---

## 4. Database Schema (58 Tables)

Organized into 12 domain sections:

### Key Table Relationships

| Parent     | Child                 | Relationship                        |
| ---------- | --------------------- | ----------------------------------- |
| `users`    | `projects`            | 1:many                              |
| `users`    | `organizations`       | many:many via `organizationMembers` |
| `projects` | `contentPieces`       | 1:many                              |
| `projects` | `keywords`            | 1:many                              |
| `projects` | `platformConnections` | 1:many (CMS integrations)           |
| `keywords` | `keywordClusters`     | many:many                           |

### Schema Sections

| Section             | Tables                            | Purpose                     |
| ------------------- | --------------------------------- | --------------------------- |
| Auth & Users        | `users`, authTables               | Identity, roles, onboarding |
| Clients & Legacy    | `clients`, legacy\*               | Deprecated, pending removal |
| Prospects & Leads   | `prospects`, details              | Waitlist, lead capture      |
| Projects & Orgs     | `projects`, `organizations`       | Multi-tenancy               |
| SEO & Keywords      | `keywords`, `keywordClusters`     | Keyword research            |
| Content Creation    | `contentPieces`, calendar         | Content lifecycle           |
| Analytics           | `analyticsData`, `gscData`        | Performance tracking        |
| AI & Generation     | `aiReports`, `writerPersonas`     | AI subsystems               |
| Billing             | `subscriptions`, `apiKeys`        | Stripe integration          |
| Platform & Webhooks | `webhooks`, `platformConnections` | CMS connections             |
| Organizations       | `orgs`, `teams`, `invites`        | Team management             |
| Deprecated          | `legacyUsers`, `briefs`, `drafts` | Pending cleanup             |

---

## 5. Convex Components (8 installed)

| Component        | Package                    | Purpose                              |
| ---------------- | -------------------------- | ------------------------------------ |
| **Auth**         | `@convex-dev/auth`         | Google OAuth + Password              |
| **Rate Limiter** | `@convex-dev/rate-limiter` | Per-user, per-tier limits            |
| **Action Cache** | `@convex-dev/action-cache` | 30-day TTL caching                   |
| **Workflow**     | `@convex-dev/workflow`     | Durable multi-step pipelines         |
| **RAG**          | `@convex-dev/rag`          | Retrieval-augmented generation       |
| **Stripe**       | `@convex-dev/stripe`       | Payment processing                   |
| **Agent**        | `@convex-dev/agent`        | Conversational AI framework          |
| **Aggregate**    | `@convex-dev/aggregate`    | Efficient KPI counting (3 instances) |

---

## 6. Authentication & Authorization

### Auth Flow

```
User visits phoo.ai
  -> Middleware: security headers, domain routing
  -> Click "Sign In"
  -> Google OAuth redirect
  -> Callback with tokens -> Convex creates/updates user
  -> Session cookie set
  -> Redirect to /onboarding or /dashboard
```

### Authorization Layers

| Layer             | Implementation                              | File                       |
| ----------------- | ------------------------------------------- | -------------------------- |
| **Roles**         | super_admin > admin > sales > user > viewer | `convex/lib/rbac.ts`       |
| **RLS**           | 58/58 tables covered (100%)                 | `convex/lib/rls.ts`        |
| **Rate Limiting** | Per-user token buckets by tier              | `convex/rateLimits.ts`     |
| **API Keys**      | SHA-256 hashed, project-scoped              | `convex/apiKeys.ts`        |
| **Encryption**    | AES-256-GCM for OAuth tokens                | `convex/lib/encryption.ts` |
| **Middleware**    | Security headers, beta password             | `middleware.ts`            |

### Role Hierarchy

```
super_admin (Level 100) - Full system access
  admin (Level 80) - User management, billing
    sales (Level 60) - Subscription provisioning
      user (Level 40) - Standard member
        viewer (Level 20) - Read-only
```

---

## 7. Integration Architecture

### Google (GA4 + GSC)

```
User clicks "Connect Google"
  -> /api/oauth/google/connect (OAuth consent)
  -> Google returns auth code
  -> Exchange for tokens
  -> Store encrypted refresh token in Convex
  -> platformConnections.google created
  -> User selects GA4/GSC property
  -> Metrics flow into dashboard
```

**Key files**: `convex/integrations/google.ts`, `lib/googleAuth.ts`, `app/api/oauth/`

### WordPress Publishing

```
User clicks "Publish to WordPress"
  -> Convex publishToWordPress action
  -> Validate content status
  -> Map content type to WP post_type:
       blog, listicle, tutorial -> Posts
       landingPage, productPage -> Pages
  -> POST /wp-json/wp/v2/posts
  -> Store WP post ID + URL on contentPiece
```

**Key files**: `convex/publishing/`, `convex/integrations/wordpress.ts`

### Stripe Billing

```
User selects plan -> Stripe Checkout -> Webhook -> Convex updates subscription
                                                        |
                                                  Tier-based gating
                                                  Rate limit enforcement
                                                  API key access
```

**Pricing**: Solo ($59) | Growth ($149) | Team ($299) | Enterprise (custom)

**Key files**: `convex/subscriptions/`, `convex/stripe/`, `convex/webhooks/`

### HubSpot (Lead Capture)

Waitlist form -> Convex `waitlist` table -> HubSpot contact sync via `convex/integrations/hubspot.ts`

---

## 8. AI Intelligence Layer

### Multi-Model Router (PhooBrain)

```
User Request
  -> PhooBrain Router
  -> Provider Health Check
  -> Route to: OpenAI GPT-4o | Anthropic Claude | Google Gemini
  -> Writer Persona applied
  -> Content generated
  -> Quality check
  -> Rate limit verified (per-user keyed)
  -> contentPiece created
```

| Subsystem          | Files                         | Purpose                   |
| ------------------ | ----------------------------- | ------------------------- |
| Content Generation | `convex/contentGeneration.ts` | Full pipeline (776 lines) |
| Provider Health    | `convex/ai/health/`           | Availability monitoring   |
| Writer Personas    | `convex/ai/writerPersonas/`   | Brand-voice tuning        |
| Analysis           | `convex/ai/analysis.ts`       | SEO scoring               |
| Phoo Assistant     | `convex/phoo/agent/`          | Conversational AI + RAG   |

### Content Generation Pipeline

1. User clicks "Generate" in Studio
2. Frontend calls `generateContent` mutation
3. Backend resolves user tier, checks rate limit (per-user keyed)
4. Get/create Writer Persona for project
5. Build prompt with persona + industry template
6. Route to AI provider (OpenAI primary, fallback chain)
7. Generate content with structured output
8. Create `contentPiece` with "generating" status
9. Update to "draft" when complete
10. User reviews, approves, publishes to CMS

---

## 9. Content Lifecycle

```
[idea] -> [planned] -> [generating] -> [draft] -> [review]
                                                      |
                                          [approved] -> [scheduled] -> [published]
                                              |
                                        [needs revision] -> back to [draft]
```

### 17 Content Types

| Category  | Types                                                  |
| --------- | ------------------------------------------------------ |
| Written   | blog, listicle, howTo, tutorial, comparison, caseStudy |
| Visual    | infographic, socialMedia, emailNewsletter              |
| Strategic | pillarContent, contentBrief, pressRelease              |
| Technical | whitepaperAbstract, productPage, landingPage           |
| Media     | podcast, blogVideo (YouTube)                           |

Each type maps to a WordPress primitive (Post or Page) and has word targets in `convex/phoo/contentTypes.ts`.

---

## 10. Key Decisions & Rationale

### Architecture Decisions

| Decision                     | Rationale                             | Date     |
| ---------------------------- | ------------------------------------- | -------- |
| Convex over Supabase         | Real-time reactivity, integrated auth | Dec 2025 |
| Content Studio consolidation | Unified workspace > separate routes   | Dec 2025 |
| No free tier                 | Unit economics demand paid-only       | Jan 2026 |
| Per-user rate limiting       | Prevents cross-user throttling        | Feb 2026 |
| Route-segmented landing      | Prevents barrel export drift          | Feb 2026 |
| WordPress primary CMS        | 43% market share                      | Feb 2026 |

### Board Governance

Major decisions go through 15-member virtual Board of Directors (`docs/personas/`):

| Code    | Decision                                    | Confidence |
| ------- | ------------------------------------------- | ---------- |
| GTM-036 | Truth in Marketing (no free tier messaging) | 0.9        |
| GTM-040 | CMS Primitive Mapping (Posts vs Pages)      | 0.95       |
| GTM-041 | "Cited, Not Ranked" branding                | 0.85       |
| GTM-042 | Solo tier quota lift (5 articles/mo)        | 0.9        |
| GTM-043 | Route-segmented landing architecture        | 0.9        |

---

## 11. Security Architecture

### Defense in Depth (5 Layers)

```
L1: Edge Middleware (security headers, CSP, domain routing)
  L2: Next.js API routes (CSRF, API key auth, input validation)
    L3: Convex mutations (RBAC role checks)
      L4: Row-Level Security (RLS on every table)
        L5: Data encryption (AES-256-GCM, SHA-256)
```

| Standard              | Status           | File                       |
| --------------------- | ---------------- | -------------------------- |
| RLS coverage          | 100% (58/58)     | `convex/lib/rls.ts`        |
| Credential encryption | AES-256-GCM      | `convex/lib/encryption.ts` |
| Token hashing         | SHA-256          | `convex/lib/hashing.ts`    |
| Rate limiting         | Per-user buckets | `convex/rateLimits.ts`     |
| API auth              | HMAC-based keys  | `lib/apiAuth.ts`           |
| Input sanitization    | DOMPurify + Zod  | `lib/apiSecurity.ts`       |
| Secret scanning       | Pre-commit hook  | `.husky/`                  |

---

## 12. Testing Strategy

| Type        | Framework        | Count     |
| ----------- | ---------------- | --------- |
| Unit        | Vitest           | ~20       |
| Integration | convex-test      | ~10       |
| E2E         | Browser (manual) | On demand |

**Philosophy**: Testing Trophy — mostly integration tests. Mock at boundaries, not internals.

**Commands**: `npm test` | `npm run type-check`

---

## 13. Vendor Matrix

| Vendor    | Purpose         | Compliance      |
| --------- | --------------- | --------------- |
| Convex    | Database        | SOC 2 Type II   |
| Vercel    | Hosting         | SOC 2 Type II   |
| OpenAI    | Primary AI      | SOC 2 Type II   |
| Anthropic | Fallback AI     | SOC 2 Type II   |
| Google    | OAuth/Analytics | ISO 27001       |
| Stripe    | Payments        | PCI DSS Level 1 |
| Resend    | Email           | SOC 2 Type II   |
| HubSpot   | CRM/Waitlist    | SOC 2 Type II   |

---

## 14. Known Technical Debt

| Issue                                               | Severity |
| --------------------------------------------------- | -------- |
| ~30 `as any` casts without justification            | Medium   |
| Pricing tier naming inconsistency (solo vs starter) | Medium   |
| `free` tier in rate limits (no free tier exists)    | Low      |
| Deprecated contentBriefs/contentDrafts tables       | Low      |
| Deprecated legacyUsers/legacySessions tables        | Low      |
| Phase 3 schema cleanup not started                  | Medium   |

---

## 15. Port & URL Reference

| Environment | Frontend       | Backend           | Domain  |
| ----------- | -------------- | ----------------- | ------- |
| Development | localhost:3000 | Convex dev cloud  | -       |
| Production  | Vercel         | Convex production | phoo.ai |

---

_Update this doc when architectural decisions change._
