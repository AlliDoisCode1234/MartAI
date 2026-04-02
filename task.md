# Execution Tickets: HubSpot Multi-Organization Sync (HUBSPOT-001)

- [x] **TICKET-1 (Schema & Types)**: Reconfigure `HUBSPOT_CUSTOM_PROPERTIES` inside `hubspotMapper.ts` to switch funnels to `datetime` mapping, and add the new `Organization` specific mapping function.
- [x] **TICKET-2 (Company API Expansion)**: Update `convex/integrations/hubspot.ts` to include the `upsertCompany` and `associateContactToCompany` functions reaching out to HubSpot.
- [x] **TICKET-3 (Sync Orchestration)**: Wire `syncUserToHubspot` to fetch the user's `organizationId`, create the Company, and trigger the association linking.
- [x] **TICKET-4 (Migration/Backfill)**: Verify that `bulkSyncUsers` works recursively using the newly wired logic, requiring no additional scripting.
