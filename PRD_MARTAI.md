# MartAI Product Requirements (PRD + User Stories + Mockup Specs)

**Product:** MartAI — AI SEO & Lead Generation Platform

**Owner:** Helps2

**Audience:** Dev team, Designer, QA

**Scope:** MVP through V1

## 0) Personas

**Owner Olivia (SMB owner):** Wants traffic that turns into leads/revenue without micromanaging.

**Marketer Max (in-house marketer):** Needs a repeatable SEO content system and clear KPIs.

**Agency Amy (Helps2 team):** Needs scalable implementation across multiple clients.

## 1) Product Goals (MVP)

- Intake business details and connect GA4 + GSC
- Generate a quarterly SEO plan (keyword clusters → briefs → calendar)
- Produce on-brand content drafts
- Enable approve/schedule/publish to CMS
- Track traffic/leads and generate insights

**Non-goals (MVP):** off-site link building, complex technical SEO fixes, multi-language

## 2) Epics

1. **Onboarding & Auth**
2. **Data Connections** (GA4, GSC, CMS)
3. **SEO Intelligence** (keywords, competitors)
4. **Planning** (Quarterly plan & calendar)
5. **Content Creation** (briefs → drafts)
6. **Publishing** (approval & scheduling)
7. **Analytics & Insights** (traffic → leads)
8. **AI Assistant** (optimization & Q&A)
9. **Admin/Billing** (plans, quotas)

## 3) User Stories & Acceptance Criteria (MVP)

### Epic 1: Onboarding & Auth

**US-1.1** As a new user, I can create an account so I can access MartAI.
- **AC:** Given I submit email and password, when I click Sign Up, then an account is created and I'm logged in
- Password rules: ≥8 chars
- Error states shown inline

**US-1.2** As a user, I can create a project with my business info.
- **AC:** Required: Business Name, Website URL, Industry
- Optional: Competitors (up to 5), Goals, Brand Voice samples (URLs/text)
- On save, a project is created and I land on "Connect Data"

### Epic 2: Data Connections

**US-2.1** As a user, I can connect GA4 via Google OAuth.
- **AC:** OAuth flow lists my GA4 properties; I select one
- Connection status shows Connected with property name
- Token stored securely; failure shown with retry

**US-2.2** As a user, I can connect Search Console.
- **AC:** OAuth flow lists verified sites; I select one
- Daily sync job created
- Status card shows last sync time

**US-2.3** As a user, I can connect a CMS (WordPress/Webflow).
- **AC:** Provide credentials/API token
- Test connection validates publishing rights
- On success, status = Connected; on failure, actionable error

### Epic 3: SEO Intelligence

**US-3.1** As a user, I can import baseline keywords and competitors.
- **AC:** From GSC and provider API, show top queries and competitor domains
- I can add/remove and mark priority

**US-3.2** As a user, I can generate keyword clusters.
- **AC:** Click Generate Clusters → returns cluster list with intent, difficulty proxy, volume range, top SERP URLs
- I can re-rank clusters by impact, hide, or favorite

### Epic 4: Planning

**US-4.1** As a user, I can generate a Quarterly Plan.
- **AC:** Input: desired content velocity (e.g., 1–4 posts/week)
- Output: 12-week calendar with brief placeholders and dates
- Plan summary shows goals (traffic, leads) and assumptions
- I can drag-drop items to reschedule

**US-4.2** As a user, I can open a brief.
- **AC:** Brief shows title options, H2 outline, FAQs, meta title/desc, internal link recs, schema suggestion
- I can edit any field and save versions

### Epic 5: Content Creation

**US-5.1** As a user, I can generate a draft from a brief.
- **AC:** Click Generate Draft → job starts; status shown; upon completion, a markdown draft appears
- Draft includes headings, transparent sections (cost/problems/comparisons where applicable), and internal link placeholders
- Quality/tone score displayed; I can re-generate with notes

**US-5.2** As a user, I can edit and approve a draft.
- **AC:** Rich editor with word count, SEO checklist, brand tone meter
- Approve locks draft; status = Approved

### Epic 6: Publishing

**US-6.1** As a user, I can schedule or publish approved content to my CMS.
- **AC:** Choose publish date/time; set tags/categories/slug
- On success, I see CMS URL and status = Scheduled/Published
- On failure, I see error and Retry

### Epic 7: Analytics & Insights

**US-7.1** As a user, I can view KPIs and growth trends.
- **AC:** Dashboard shows Sessions, Clicks, CTR, Avg Position, Leads (if provided), Est Revenue
- Time filters: 7/30/90 days; compare vs previous period

**US-7.2** As a user, I receive actionable insights.
- **AC:** Cards like "Top Gainers," "Underperformers," "Quick Wins"
- Each card has Apply Suggestion which adjusts plan or drafts a task

### Epic 8: AI Assistant

**US-8.1** As a user, I can ask optimization questions.
- **AC:** Chat accepts text; responses reference my data; actions: Use Draft, Add to Plan

### Epic 9: Admin/Billing

**US-9.1** As an owner, I can select a plan and see quotas.
- **AC:** Plans: Starter/Growth/Pro with limits on briefs/drafts/month
- Usage meter visible; hard limit shows friendly upsell

## 4) Functional Requirements (by Module)

### Onboarding
- Form validation; autosave; progress indicator

### Connections
- OAuth tokens encrypted; connection status cards; background sync jobs; error logs

### SEO Intelligence
- Provider abstraction: Ahrefs/SEMrush/Moz; fallback to GSC/Trends; cache SERP snapshots 24h

### Planning
- Ranking model: Impact = volume_weight*volume + intent_weight*intent - difficulty_weight*difficulty (weights configurable)
- Calendar drag-drop; collision checks; version history (v1 only)

### Content
- LLM prompts versioned; JSON schema validation; plagiarism and toxicity checks; brand voice profile applied
- SEO checklist: title length, H2 density, FAQs, internal links, schema presence

### Publishing
- WordPress/Webflow adapters; rollback on failure; media upload support
- Internal link resolver maps [[slug]] to URL at publish time

### Analytics
- Nightly GA4/GSC ingest; derived metrics; alerts on anomalies; export CSV

### AI Assistant
- Context window includes plan, clusters, briefs, and KPIs; safe-response filters; action buttons

### Billing
- Plan limits enforced server-side; upgrade path; Stripe checkout (V1)

## 5) Workflow Diagrams (Text)

### A) Setup → Plan → Draft → Publish → Measure
1. User creates project → connects GA/GSC/CMS
2. Generate clusters → generate quarterly plan
3. Open brief → generate draft → edit → approve
4. Schedule/publish to CMS
5. Nightly ingest updates KPIs → insights → adjust plan

### B) Insight-Driven Optimization
System flags underperforming page → suggests alternative keyword or internal link → User clicks Apply → plan updated + new brief created

## 6) Mockup Specs (for Figma)

**Global:** Top nav (logo, Dashboard, Strategy, Content, Analytics, Assistant, Settings)

**Palette:** 
- #F7941E (CTA/orange) - matches current brand.orange
- #E0183C (alert/red)
- #40DEC7 (active/positive/teal) - matches current brand.teal
- #F4EDED (bg/light)
- #DEC1FF (accent/lavender) - matches current brand.lavender

**Type:** Poppins (H1/H2), Inter (body) - already in use

**Components:** Button (md/lg), Card, Table Row, Progress Ring, Chart (line/bar), Badge, Chat Bubble, Modal

### Screens
- **Onboarding:** left illustration; right form; CTA "Generate My SEO Growth Plan"
- **Strategy Dashboard:** three KPI cards on top; calendar grid below; sidebar with clusters
- **Brief Editor:** left brief meta; right outline; bottom action bar (Generate Draft)
- **Draft Editor:** side-by-side brief + markdown editor; tone meter; SEO checklist; Approve
- **Publishing:** schedule modal (date/time/timezone); preview URL; status chip
- **Analytics:** traffic line chart, leads bar chart, ROI by content; insight cards with Apply
- **AI Assistant:** chat window with prompt chips; right panel with suggested actions

## 7) Acceptance Test Matrix (samples)

- **AT-A1:** Creating a project without a website URL shows inline error and disables Next
- **AT-C3:** Generating a draft under 800 words fails the SEO checklist and blocks approval
- **AT-P2:** Publishing without CMS connection shows modal to connect or cancel
- **AT-AN1:** GA/GSC unavailable → UI shows "last successful sync" and retry option

## 8) Non-Functional Requirements

- **Performance:** p95 API < 600ms for read ops; background jobs isolated from request path
- **Reliability:** 99.5% uptime target; retries with exponential backoff for providers
- **Security:** OAuth scopes minimal; tokens encrypted; RLS by workspace
- **Accessibility:** WCAG AA; keyboard navigation; color contrast checked
- **Internationalization:** date/timezone aware; copy externalized (V1)

## 9) Analytics & Events

`project_created`, `connection_success`, `plan_generated`, `brief_generated`, `draft_generated`, `draft_approved`, `post_published`, `kpi_ingested`, `insight_applied` (properties: project_id, user_id, timestamps)

## 10) Definition of Done (DoD)

Unit/integration tests pass; QA validates AC; accessibility checks; analytics events firing; logs/metrics instrumented; documentation updated

## 11) Backlog & Priorities

**MVP P0:** Onboarding, GA/GSC, Plan generation, Briefs/Drafts, Publish to WP, Analytics basics

**P1:** Webflow adapter, AI Assistant actions, Insights → Apply

**P2:** Billing/Stripe, version history, advanced calendars

## 12) Open Questions

- Which SEO provider for v0 (Ahrefs vs SEMrush) based on budget?
- Exact lead capture integration (form tool or CRM?) for lead attribution v1?
- Content length defaults per industry?

