# Final Go-To-Market (GTM) Launch Checklist

This checklist represents the exact sequence of remaining tasks required to launch Phoo.ai to the public. 

> [!WARNING]  
> Do not attempt to run the `bulkSyncUsers` Convex backfill until the **HubSpot Schema Rewrite** is physically completed in the HubSpot UI, otherwise active data will be corrupted.

---

## 🟥 Phase 1: High-Priority Operational Blockers

- [ ] **HubSpot Schema Rewrite (Manual UI Task)**
  - Archive/delete the existing `booleancheckbox` custom properties in HubSpot starting with `phoo_funnel_` (e.g., `phoo_funnel_signup_started`).
  - Recreate them natively as `datetime` objects using the exact new names outputted from the integration (e.g., `phoo_funnel_signup_started_at`).
  - *Why: If this is ignored, the backend code deployed today will fail to map data into HubSpot.*
- [ ] **Delete Waitlist Routing Intercepts**
  - Remove the middleware/routing logic that forces new users into the `/join` Waitlist flow.
  - Route high-intent leads straight into the active product and the Stripe monetization loop.
- [ ] **Google OAuth Verification Approval**
  - Await Google Trust & Safety manual review of exactly how our app uses OAuth scopes (specifically Youtube demos). 
  - *Why: We cannot launch publicly with a red "Unverified App" warning scaring away leads.*

## 🟨 Phase 2: Feature Completeness & Integrity

- [ ] **DataForSEO API Hookup**
  - Finalize production credentials and connection logic to ingest live search keyword volumes.
- [ ] **Stripe Coupon Implementation**
  - Configure coupon/discount capability on the frontend and ensure Convex properly honors Stripe promotion codes.
- [ ] **Fallback Authentication Flow (Optional but Recommended)**
  - Ensure standard Email/Password authentication flow operates smoothly in the event of Google API rate limits or extended verification delays.

## 🟩 Phase 3: Final Verification Sandbox

- [ ] **Day-0 Incognito E2E Test**
  - Launch an Incognito Browser.
  - Register with a brand new, unseen test email.
  - Complete the Stripe checkout (using a Stripe test card or 100% off code).
  - Create the first Project Org.
  - Connect a property (GA4/GSC) or bypass.
  - Generate the first piece of AI content. 
  - Verify visually that the `walkthrough` flow doesn't stutter or crash.
- [ ] **Production Secret/Key Rotation**
  - Rotate all JWT secrets, live database credentials, and Stripe Live Keys before pointing public DNS traffic to the application.
- [ ] **HubSpot Historic Backfill**
  - From the Convex Dashboard, execute the `bulkSyncUsers` administrative function to crawl the system and retroactively populate Company > Contact multi-org trees inside HubSpot.
