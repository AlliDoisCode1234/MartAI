# HubSpot Multi-Organization Architecture (LDD)

This Lead Driven Design outlines the architectural evolution of the Phoo.ai to HubSpot sync pipeline. It addresses the migration from a B2C "User=Account" structure to a B2B SaaS "Organization=Company, User=Contact" structure, while simultaneously executing HUBSPOT-001 (Timestamped Funnel Velocity Tracking).

## User Review Required

> [!IMPORTANT]  
> Upgrading boolean funnel milestones to `datetime` will fundamentally change how HubSpot receives funnel data. This means previous boolean values will be deprecated. Please review the **HubSpot Operations Checklist** below before approving.

---

## Board Review: HubSpot Multi-Org Sync Architecture

**Context**: As Phoo scales into Team and Agency tiers, users no longer map 1:1 to a single project. Users may belong to multiple organizations or manage dozens of projects within an Org. The current HubSpot sync code (`convex/integrations/hubspot.ts`) naively assumes `projects[0]` is the primary project for a user.

### C-Suite Leadership

#### ALEX (CEO) says:
> This matches our Agency & Team GTM motion. Agencies are "Organizations", and their clients are "Projects". If HubSpot doesn't map those correctly, we can't accurately value the LTV of an Agency Lead versus a Solo Lead.

#### CLARA (CMO) says:
> **HUBSPOT-001 Execution**: YES! Upgrading the boolean funnel checks (e.g., `phoo_funnel_gsc_connected: true`) to `datetime` (e.g., `phoo_funnel_gsc_connected_at: 1711200000`) is critical. I cannot run "Time-to-Value" reports or measure onboarding friction if I only have true/false booleans. 

#### TYLER (CTO) says:
> To achieve multi-org, we must introduce the HubSpot Companies API (`/crm/v3/objects/companies`) and the Associations API. We map a Convex `Organization` to a HubSpot `Company`, and map the `User` to a `Contact`, then associate them.

---

### Product & Engineering

#### KATE (Product Owner) says:
> This is a P0 launch blocker for scaling the $299 Team tier. Scope includes updating Convex models, updating the `hubspotMapper`, creating the new Company sync functions, and adjusting the funnel endpoints.

#### DANE (Data Engineer) says:
> **Data Lineage Rule**: We must roll up `Project` data to the `Organization` level before sending it to HubSpot. Thus, an Agency Org with 10 projects should have its `phoo_project_count` on the **Company** object in HubSpot, not just scattered across users. 
> 
> **Data Contract**:
> - Convex `organizations` → HubSpot `Company`
> - Convex `users` → HubSpot `Contact`
> - Convex `projects` → Aggregated metrics on HubSpot `Company`

#### CONVEX (Platform Expert) says:
> We will continue to use `internalAction` driven by the Chron scheduler so HubSpot API rate limits (10/sec) are not exceeded during mass syncs. The `schema.ts` users table already cleanly stores `engagementMilestones` with timestamps. We just need to map them correctly.

---

## Blast Radius Assessment

**1. Waitlist Users (Zero Impact)**
Current waitlist users are stored in the Convex `waitlist` table and only sync basic lead data (email, UTMs, `phoo_waitlist_signup: 'signed_up'`). Waitlist users do **NOT** belong to Organizations and do **NOT** trigger funnel milestones yet. The current `syncWaitlistToHubspot` action will continue to create independent HubSpot Contacts without triggering the new Company Association API. They are perfectly safe.

**2. HubSpot Marketing Reports (High Impact)**
By deliberately asking you to delete the `phoo_funnel_*` `booleancheckbox` properties in HubSpot and recreate them as `datetime` fields, **any existing active HubSpot Lists, Active Campaigns, or Custom Reports querying those old boolean fields will break instantly**. Marketing must rebuild those reports using the new timestamp logic.

**3. Active SaaS Users (Medium Impact)**
On their next data-sync or login, existing Users will have HubSpot `Companies` generated for their respective `Organizations`, and their `Contact` profiles will be seamlessly associated with that Company. Existing contact data will not be overwritten (thanks to our idempotent `upsertContact`), merely enriched.

---

## Proposed Changes

### 1. `convex/integrations/hubspot.ts`

- **[MODIFY]** Update `syncUserToHubspot` to synchronize the associated Organization.
- **[NEW]** Add `upsertCompany(orgId, properties)` using HubSpot `/crm/v3/objects/companies` to define Organizations.
- **[NEW]** Add `associateContactToCompany(contactId, companyId)` to create the mapping.
- **[MODIFY]** Refactor `syncFunnelEventToHubspot` to accept `datetime` values instead of strictly resolving to `true`.

### 2. `convex/integrations/hubspotMapper.ts`

- **[MODIFY]** Overhaul the `HUBSPOT_CUSTOM_PROPERTIES` registry, altering the funnel endpoints from `booleancheckbox` to `datetime`.
- **[MODIFY]** Update `mapUserToHubSpot` to map the exact `user.engagementMilestones` timestamps into the corresponding HubSpot fields instead of converting them to raw booleans.
- **[NEW]** Introduce `mapOrganizationToHubSpot` for aggregating project counts and highest MR scores across an organization's portfolio.

### 3. HubSpot Operations Checklist (Manual Steps)

> [!WARNING]  
> HubSpot Custom Properties are strictly typed and **cannot be converted** via API. Before this code ships to production, an Admin must log into the HubSpot UI and physically alter the properties or recreate them.

1. Archive or delete all `booleancheckbox` properties starting with `phoo_funnel_`.
2. Recreate them explicitly as `datetime` properties via the HubSpot Settings > Properties panel, ensuring their internal naming matches the new payload (e.g., `phoo_funnel_signup_completed_at`).

---

## Execution Tickets

To deploy this safely without crashing the backend, we will execute in these distinct tickets:

- [ ] **TICKET-1 (Schema & Types)**: Reconfigure `HUBSPOT_CUSTOM_PROPERTIES` inside `hubspotMapper.ts` to switch funnels to `datetime` mapping, and add the new `Organization` specific mapping function.
- [ ] **TICKET-2 (Company API Expansion)**: Update `convex/integrations/hubspot.ts` to include the `upsertCompany` and `associateContactToCompany` functions reaching out to HubSpot.
- [ ] **TICKET-3 (Sync Orchestration)**: Wire `syncUserToHubspot` to fetch the user's `organizationId`, create the Company, and trigger the association linking.
- [ ] **TICKET-4 (Migration/Backfill)**: Create an `internalAction` backfill script in Convex to gracefully crawl all existing Users and create their counterpart Companies in HubSpot without violating the 10/sec API limit.

## Verification Plan

### Automated Tests
- Run `npm test` on `convex/integrations/hubspotMapper.test.ts` to ensure the mapping logic correctly passes `datetime` values matching HubSpot's epoch millisecond requirements.

### Manual Verification
- We will trigger an E2E sync function in the Convex Dashboard on a staging user to verify that:
  - 1 HubSpot Company is created.
  - 1 HubSpot Contact is created.
  - The Contact is linked to the Company.
  - The `datetime` values populate in the HubSpot timeline seamlessly.
