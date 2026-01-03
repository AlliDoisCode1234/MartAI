# MartAI Product Feature Matrix

**Version**: 1.0  
**Date**: January 3, 2026  
**Status**: Production Ready (Private Beta)

---

## 1. Product Overview

**MartAI** is an AI-driven SEO & Lead Generation Platform that consolidates keyword research, content generation, and publishing into a unified Content Studio experience.

**Core Value Proposition**: "From keyword to published post in minutes—no SEO expertise required."

**Target Customer**: Small businesses under $500k annual revenue, solopreneurs, and small marketing teams.

---

## 2. Current Product Capabilities

### 2.1 Content Studio (Core Workspace)

| Feature           | Status  | Description                                            |
| ----------------- | ------- | ------------------------------------------------------ |
| **Strategy View** | ✅ Live | Keyword clustering, topic planning, MR Score dashboard |
| **Calendar View** | ✅ Live | Visual content calendar with drag-drop scheduling      |
| **Library View**  | ✅ Live | All content pieces with status filtering               |
| **Create View**   | ✅ Live | AI content generation with SEO optimization            |
| **Insights View** | ✅ Live | Analytics dashboards and recommendations               |
| **Settings View** | ✅ Live | Integrations and project configuration                 |

### 2.2 AI-Powered Features

| Feature                          | Status | Tier Limits                 |
| -------------------------------- | ------ | --------------------------- |
| **Keyword Clustering**           | ✅     | 250-2,000/mo by tier        |
| **Content Brief Generation**     | ✅     | 4-20/mo by tier             |
| **Full Article Generation**      | ✅     | 1,500-2,500 words per piece |
| **SEO Quality Scoring**          | ✅     | 90+ score guarantee         |
| **Meta Title/Description**       | ✅     | Included with briefs        |
| **H2 Outline Generation**        | ✅     | Included with briefs        |
| **Internal Linking Suggestions** | ✅     | Included with briefs        |

### 2.3 Analytics & Integrations

| Feature                  | Status  | Notes                       |
| ------------------------ | ------- | --------------------------- |
| **GA4 Integration**      | ✅ Live | OAuth + token refresh       |
| **GSC Integration**      | ✅ Live | OAuth + token refresh       |
| **WordPress Publishing** | ✅ Live | App password auth           |
| **MartAI Rating (MR)**   | ✅ Live | Composite 0-100 SEO score   |
| **Quick Wins Detection** | ✅ Live | Position 5-15 opportunities |
| **Keyword Snapshots**    | ✅ Live | Historical tracking         |

### 2.4 Platform Features

| Feature             | Status | Notes                           |
| ------------------- | ------ | ------------------------------- |
| **Multi-Project**   | ✅     | 1-10+ by tier                   |
| **Organizations**   | ✅     | Multi-tenancy support           |
| **Team Management** | ✅     | Invite flow with roles          |
| **RBAC**            | ✅     | Owner/Admin/Editor/Viewer       |
| **Rate Limiting**   | ✅     | Per-tier, per-operation         |
| **Webhooks**        | ✅     | HMAC signed + retry             |
| **Public API**      | 🔄     | Rate limiting done, docs needed |
| **Stripe Billing**  | ✅     | Migrated from Polar             |

### 2.5 Content Types Supported (17)

```
┌─────────────────────────────────────────────────────────────┐
│ CORE PAGES          │ BLOG CONTENT        │ CONVERSION      │
│ • homepage          │ • blog              │ • leadMagnet    │
│ • about             │ • blogVersus        │ • paidProduct   │
│ • service           │ • blogVideo         │                 │
│ • landing           │ • contentRefresh    │                 │
├─────────────────────────────────────────────────────────────┤
│ LOCAL/GEO           │ SPECIALTY                             │
│ • areasWeServe      │ • employment  • donate  • partner     │
│                     │ • mentorship  • events  • program     │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Pricing Tiers

> [!IMPORTANT]
> **MartAI has NO FREE TIER.** All users are paying subscribers.

| Feature                   | Starter ($49/mo) | Growth ($149/mo) | Scale (Custom) |
| ------------------------- | ---------------- | ---------------- | -------------- |
| **Projects**              | 1 URL            | 3 URLs           | 10+ URLs       |
| **Keyword Analysis/mo**   | 250              | 1,000            | 2,000+         |
| **AI Reports/mo**         | 4                | 12               | 20+            |
| **Content Pieces/mo**     | 4                | 12               | 20+            |
| **WordPress Integration** | ❌               | ✅               | ✅             |
| **Competitor Analysis**   | ❌               | ✅               | ✅             |
| **White-Label Reports**   | ❌               | ❌               | ✅             |
| **Priority Support**      | ❌               | ❌               | ✅             |
| **API Access**            | ❌               | ❌               | ✅             |

**Annual Billing**: 20% discount (2 months free)

---

## 4. Upcoming Features

### 4.1 Q1 2026 (Immediate)

| Feature                   | Priority | Status         | ETA      |
| ------------------------- | -------- | -------------- | -------- |
| Staging environment setup | P0       | 📋 Planned     | Week 1   |
| Internal security audit   | P0       | 📋 Planned     | Week 1-2 |
| Full E2E flow testing     | P0       | 📋 Planned     | Week 2   |
| Public API documentation  | P1       | 🔄 In Progress | Week 2-3 |
| CSV export functionality  | P1       | 📋 Planned     | Week 3   |

### 4.2 Q1-Q2 2026 (Short-Term)

| Feature                   | Priority | Notes                       |
| ------------------------- | -------- | --------------------------- |
| Webflow adapter           | P1       | CMS integration #2          |
| Shopify adapter           | P2       | CMS integration #3          |
| Insight → Action workflow | P1       | "Apply Suggestion" button   |
| Plagiarism detection      | P1       | Requires Originality.ai API |
| AI detection scoring      | P1       | Requires Originality.ai API |

### 4.3 Q2-Q3 2026 (Medium-Term)

| Feature                         | Priority | Notes                   |
| ------------------------------- | -------- | ----------------------- |
| Multi-language support          | P2       | Non-English markets     |
| Custom AI training              | P2       | Brand voice fine-tuning |
| Advanced competitor tracking    | P2       | Domain monitoring       |
| Drag-drop calendar improvements | P2       | UX polish               |
| Team collaboration (comments)   | P2       | Enterprise feature      |

### 4.4 Q4 2026 (Long-Term)

| Feature                                | Priority | Notes                  |
| -------------------------------------- | -------- | ---------------------- |
| SOC 2 Type II certification            | P1       | Enterprise requirement |
| CRM integrations (HubSpot, Salesforce) | P2       | Enterprise feature     |
| Custom approval workflows              | P2       | Enterprise feature     |
| On-premise deployment option           | P3       | Large enterprise only  |

---

## 5. Current Blockers

### 5.1 Technical Blockers

| Blocker                                | Severity | Owner       | Resolution                 |
| -------------------------------------- | -------- | ----------- | -------------------------- |
| 2 TypeScript errors in `useProject.ts` | Medium   | Engineering | Fix type narrowing         |
| `qs` npm vulnerability (high)          | High     | Engineering | `npm audit fix`            |
| ~30 `as any` casts without docs        | Low      | Engineering | Add justification comments |
| No staging environment                 | High     | DevOps      | Deploy Vercel preview      |

### 5.2 Business Blockers

| Blocker                           | Severity | Owner      | Resolution                          |
| --------------------------------- | -------- | ---------- | ----------------------------------- |
| "Free" messaging in 4 files       | Critical | Marketing  | Fix verbiage immediately            |
| Pricing tier name inconsistencies | Medium   | Product    | Standardize to Starter/Growth/Scale |
| Originality.ai API key missing    | Medium   | Operations | Obtain API credentials              |

### 5.3 External Dependencies

| Dependency                   | Status         | Impact                      |
| ---------------------------- | -------------- | --------------------------- |
| Originality.ai API           | ⏳ Pending     | Blocks plagiarism detection |
| Third-party pentest firm     | 📋 To Schedule | Blocks enterprise launch    |
| Transactional email provider | 📋 To Evaluate | Blocks team invite emails   |

---

## 6. Go-To-Market Plan

### 6.1 Target Segments

| Segment      | Volume | Price   | CAC Target | LTV Estimate   |
| ------------ | ------ | ------- | ---------- | -------------- |
| Solopreneurs | High   | $49/mo  | $50        | $1,470 (2.5yr) |
| SMBs <$500k  | Medium | $149/mo | $100       | $5,364 (3yr)   |
| Agencies     | Low    | Custom  | $250       | $19,152 (4yr)  |

### 6.2 Competitive Positioning

```
┌──────────────────────────────────────────────────────────────────────┐
│ COMPETITOR LANDSCAPE                                                  │
├──────────────────────────────────────────────────────────────────────┤
│ Jasper ($39) + SurferSEO ($89) = $128/mo → MartAI Growth: $149/mo    │
│ MarketMuse = $600/mo → MartAI Scale: $399/mo (custom available)      │
│ Clearscope = $170/mo → MartAI Growth: $149/mo                        │
├──────────────────────────────────────────────────────────────────────┤
│ MartAI Advantage: All-in-one (keyword → content → publish)           │
│ 50-75% cheaper than buying separate tools                            │
└──────────────────────────────────────────────────────────────────────┘
```

### 6.3 Key Marketing Messages

| Audience             | Message                                             |
| -------------------- | --------------------------------------------------- |
| **All**              | "SEO + AI Content for $149/mo"                      |
| **SMBs**             | "Built for businesses under $500k revenue"          |
| **Non-SEO Users**    | "No SEO expertise required—Phoo handles everything" |
| **Budget-Conscious** | "Competitors charge $600+ for SEO tools alone"      |
| **Time-Strapped**    | "From keyword to published post in minutes"         |

### 6.4 Launch Timeline

```
┌─────────────────────────────────────────────────────────────────────┐
│ PHASE 0: INTERNAL (NOW - January 2026)                              │
│ • Fix marketing verbiage issues                                     │
│ • Complete internal security audit                                  │
│ • Set up staging environment                                        │
│ • Update PROJECT_STATUS.md and ROADMAP.md                          │
├─────────────────────────────────────────────────────────────────────┤
│ PHASE 1: PRIVATE BETA (Late January 2026)                          │
│ • Invite 50 SMB users                                               │
│ • Monitor pages/session, time-to-first-action                       │
│ • Gather feedback on Content Studio flow                            │
├─────────────────────────────────────────────────────────────────────┤
│ PHASE 2: PUBLIC LAUNCH (Mid-February 2026)                         │
│ • Marketing site live                                               │
│ • All pricing tiers active                                          │
│ • Third-party pentest completed                                     │
│ • ProductHunt launch                                                │
├─────────────────────────────────────────────────────────────────────┤
│ PHASE 3: ENTERPRISE (Q2 2026)                                       │
│ • SOC 2 Type I certification                                        │
│ • Dedicated sales team                                              │
│ • Custom integrations                                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 7. Third-Party Vendor Review

### 7.1 Current Vendors (All Approved)

| Vendor     | Purpose            | Security        | Risk |
| ---------- | ------------------ | --------------- | ---- |
| **Convex** | Database + Backend | SOC 2 Type II   | Low  |
| **Vercel** | Hosting + Edge     | SOC 2 Type II   | Low  |
| **OpenAI** | AI Generation      | SOC 2 Type II   | Low  |
| **Stripe** | Payments           | PCI DSS Level 1 | Low  |
| **Google** | OAuth + Analytics  | ISO 27001       | Low  |

### 7.2 Pending Vendors

| Vendor             | Purpose                 | Status            | Decision |
| ------------------ | ----------------------- | ----------------- | -------- |
| **Originality.ai** | Plagiarism/AI detection | ⏳ API key needed | APPROVED |
| **Resend**         | Transactional email     | 📋 Evaluating     | TBD      |
| **Postmark**       | Transactional email     | 📋 Evaluating     | TBD      |

---

## 8. Penetration Testing Plan

### 8.1 Approach

| Phase          | Timeline | Scope                      | Owner       |
| -------------- | -------- | -------------------------- | ----------- |
| Internal Audit | Week 1-2 | OWASP ZAP automated scan   | Engineering |
| Remediation    | Week 3   | Fix critical/high findings | Engineering |
| Third-Party    | Week 4   | External firm engagement   | Security    |
| Re-test        | Week 5   | Verify fixes               | Security    |

### 8.2 Scope

**In Scope:**

- API endpoints (`/api/v1/*`)
- Authentication flows (password, OAuth)
- RBAC boundary testing
- Rate limit bypass attempts
- CSRF/XSS vectors
- API key management

**Out of Scope:**

- Convex infrastructure (managed)
- Vercel edge network (managed)
- Third-party OAuth providers

### 8.3 Budget

| Item                               | Cost         |
| ---------------------------------- | ------------ |
| Internal tools (OWASP ZAP, Nuclei) | $0           |
| Burp Suite Pro (optional)          | $449/year    |
| Third-party basic pentest          | $2,000-5,000 |
| **Total Budget**                   | **$5,000**   |

---

## 9. Success Metrics

### 9.1 MVP Launch Criteria

| Metric                | Target | Status          |
| --------------------- | ------ | --------------- |
| P0 features complete  | 100%   | ✅              |
| API response time p95 | <600ms | 📋 To Measure   |
| Uptime                | 99.5%  | 📋 To Measure   |
| Security audit        | Pass   | 📋 Pending      |
| WCAG AA accessibility | Pass   | 📋 Pending      |
| Zero "free" messaging | 100%   | ❌ 4 violations |

### 9.2 Growth Metrics (Post-Launch)

| Metric                           | Target  |
| -------------------------------- | ------- |
| Signups/month                    | 100+    |
| Trial → Paid conversion          | 30%+    |
| Pages per session                | 5+      |
| Time to first content generation | <10 min |
| 30-day retention                 | 60%+    |
| NPS                              | 40+     |

---

## 10. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                                 │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│ MARKETING SITE                                                       │
│ Landing → Pricing → How It Works → Signup                           │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│ ONBOARDING                                                           │
│ Step 1: Organization → Step 2: Plan → Step 3: Project → Studio      │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│ CONTENT STUDIO (Core Workspace)                                      │
│ ┌─────────┬──────────┬─────────┬────────┬──────────┬──────────┐    │
│ │ Strategy│ Calendar │ Library │ Create │ Insights │ Settings │    │
│ └─────────┴──────────┴─────────┴────────┴──────────┴──────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│ DASHBOARD (Executive Glance)                                         │
│ Quick stats → "Open Content Studio" CTA                              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 11. Contact & Ownership

| Area        | Owner            |
| ----------- | ---------------- |
| Product     | Product Team     |
| Engineering | Engineering Team |
| Security    | CTO              |
| Marketing   | CMO              |
| Sales       | Sales Manager    |

---

**Last Updated**: January 3, 2026
