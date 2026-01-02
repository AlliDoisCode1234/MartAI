# LDD: Google Analytics & Search Console Integration

## Overview

**Vendor**: Google LLC (GA4 Data API, GSC API, Admin API)
**Purpose**: Pull real keywords, traffic metrics, and ranking data from user's connected Google properties into MartAI's intelligence layer.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER ONBOARDING                          │
│   User enters websiteUrl → Stored in projects table             │
└─────────────────────────────────────┬───────────────────────────┘
                                      │
┌─────────────────────────────────────▼───────────────────────────┐
│                     /integrations PAGE                          │
│   1. Click "Connect Analytics"                                  │
│   2. OAuth redirect → Google consent screen                     │
│   3. Callback with tokens → listGA4Properties / listGSCSites    │
│   4. User selects property from dropdown (GA4)                  │
│   5. Auto-match GSC site to websiteUrl                          │
│   6. Save connections                                           │
└─────────────────────────────────────┬───────────────────────────┘
                                      │
┌─────────────────────────────────────▼───────────────────────────┐
│                      CRON: analytics/sync.ts                    │
│   Runs every 6 hours → Fetches GA4 + GSC data → Stores locally  │
└─────────────────────────────────────┬───────────────────────────┘
                                      │
┌─────────────────────────────────────▼───────────────────────────┐
│                     INTELLIGENCE LAYER                          │
│   • generateCalendar.ts → Uses GSC keywords                     │
│   • martaiRating.ts → Quick-win keyword detection               │
│   • insights.ts → SEO opportunity analysis                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## API Endpoints Used

| API       | Endpoint                                            | Scope Required        | Data Retrieved                          |
| --------- | --------------------------------------------------- | --------------------- | --------------------------------------- |
| GA4 Admin | `/v1beta/accountSummaries`                          | `analytics.edit`      | Property list                           |
| GA4 Data  | `/v1beta/properties/{id}:runReport`                 | `analytics.readonly`  | Sessions, users, bounce rate            |
| GSC       | `/webmasters/v3/sites`                              | `webmasters.readonly` | Verified site list                      |
| GSC       | `/webmasters/v3/sites/{site}/searchAnalytics/query` | `webmasters.readonly` | Keywords, impressions, clicks, position |

---

## Changes Required

### Backend

| File                            | Change                                                                      |
| ------------------------------- | --------------------------------------------------------------------------- |
| `convex/integrations/google.ts` | Add `analytics.edit` scope, add `listGA4Properties`, `listGSCSites` actions |

### Frontend

| File                        | Change                                      |
| --------------------------- | ------------------------------------------- |
| `app/integrations/page.tsx` | Replace manual input with property dropdown |

---

## Board of Directors: Vendor Risk Assessment

### ALEX (CEO) says:

> "Google is our primary data source for SEO intelligence. This is strategic infrastructure - without it, we're guessing at keywords instead of using real data. Proceed, but monitor for API changes."

### BILL (CFO) says:

> "Google APIs are free up to 50K requests/day (GA4) and 1,200 requests/day (GSC). At current scale, $0 cost. Even at 10K users, we'd stay under limits with our 6-hour sync window. **Cost: $0. ROI: Critical enabler.**"

### TYLER (CTO) says:

> "Security review:
>
> - ✅ OAuth 2.0 with refresh tokens (industry standard)
> - ✅ Tokens stored server-side in Convex (not browser)
> - ✅ Scopes are read-only except Admin API listing
> - ⚠️ **Risk**: Google API Terms require OAuth verification for production. We need to submit for verification before launch.
> - ⚠️ **Risk**: API deprecation (Google deprecated UA, could change GA4)
> - **Mitigation**: Abstract data layer, don't couple tightly to API response shapes"

### OSCAR (COO) says:

> "Process documented in `GOOGLE_INTEGRATION_SETUP.md`. Owner: Engineering. Scales well - cron-based batch sync, no real-time dependencies."

### KHANH (Engineering) says:

> "Architecture is solid. Token refresh pattern handles expiry. One concern: If Google rate-limits us, we need exponential backoff. Recommend adding retry logic with jitter."

### SAM (QA) says:

> "Test cases needed:
>
> - OAuth success/failure paths
> - Token refresh when expired
> - Handle user with 0 properties
> - Handle mismatched GSC site URL
> - API rate limit handling"

### LAURA (UX) says:

> "Property picker dropdown is much better UX than manual ID entry. Here's the ideal user journey:"

#### User Journey (Step by Step)

```
Step 1: User lands on /integrations
        └─ Sees "Connect Google Analytics" card with benefits listed
        └─ Button: "Connect with Google" (Google branding)

Step 2: OAuth Flow (external)
        └─ Google consent screen (we control nothing here)
        └─ User grants access → redirects back

Step 3: Property Selection Modal (NEW)
        ┌─────────────────────────────────────────────────┐
        │  🔗 Select Your Analytics Property              │
        │                                                 │
        │  We found 3 GA4 properties:                     │
        │                                                 │
        │  ○ My Business Website (Account: Main Corp)     │
        │  ● My Store (Account: Main Corp)  ← matches URL │
        │  ○ Test Property (Account: Sandbox)             │
        │                                                 │
        │  ──────────────────────────────────────────     │
        │                                                 │
        │  Search Console Site:                           │
        │  ✓ https://mysite.com (auto-detected)           │
        │                                                 │
        │  [Cancel]                    [Connect Both]     │
        └─────────────────────────────────────────────────┘

Step 4: Success State
        └─ Cards show "Connected" with property name
        └─ "Last synced: Just now"
        └─ "Next sync in: 6 hours"
```

#### UX Guidelines

| Element        | Guideline                                         |
| -------------- | ------------------------------------------------- |
| Property names | Show human-readable name, not numeric ID          |
| Auto-match     | Highlight property matching project URL           |
| Empty state    | "No properties found" with help link              |
| Error state    | "Connection failed - try again" with retry button |
| Loading        | Skeleton cards while fetching properties          |

### MART (SEO Expert) says:

> "GSC keywords are gold for content strategy. Competitors charge $50-200/mo just for this data. We're giving it free as part of our platform - major differentiator."

### BARRY (Sales) says:

> "This is a key selling point: 'Connect your Google Analytics in 30 seconds and we'll automatically find your best keyword opportunities.' Easy win."

---

## Decision

| Aspect                   | Verdict                                     |
| ------------------------ | ------------------------------------------- |
| Proceed with integration | ✅ Yes                                      |
| Vendor risk acceptable   | ✅ Yes (Google is stable)                   |
| Cost risk                | ✅ None (free tier sufficient)              |
| Security risk            | ✅ Low (OAuth, read-only scopes)            |
| Action items             | Submit for OAuth verification before launch |

**Confidence: 0.92**

---

## Implementation Checklist

- [ ] Add `analytics.edit` scope to SCOPES array
- [ ] Create `listGA4Properties` action
- [ ] Create `listGSCSites` action
- [ ] Update frontend with property dropdown
- [ ] Add retry/backoff logic for rate limits
- [ ] Submit OAuth consent screen for Google verification
- [ ] E2E test the full flow
