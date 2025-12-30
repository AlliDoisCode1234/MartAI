# MartAI Board Decisions Log

This document logs significant decisions made through Board of Directors consultation.

---

## Decision #001: No Reverse Proxy for Public API

**Date**: 2025-12-27
**Confidence**: 0.85 (High)
**Status**: Approved

### Context

MartAI is developing a public API (`/api/v1/*`) for enterprise integrations. The question was whether to add a reverse proxy / API gateway (e.g., Nginx, Kong, AWS API Gateway, Cloudflare).

### Decision

**No reverse proxy at this stage.** Implement API gateway _pattern_ in Next.js middleware instead.

### Board Consensus

| Board Member      | Vote | Rationale                                        |
| ----------------- | ---- | ------------------------------------------------ |
| ALEX (CEO)        | No   | Violates "start simple, scale smart" principle   |
| BILL (CFO)        | No   | Cost/benefit ratio unfavorable (0 API customers) |
| CLARA (CMO)       | No   | Focus on API experience, not infrastructure      |
| OSCAR (COO)       | No   | Operationalize existing tools first              |
| TYLER (CTO)       | No   | Vercel/Convex already provide needed security    |
| KATE (PO)         | No   | Not in scope for MVP                             |
| PAIGE (PM)        | No   | Doesn't solve user problems                      |
| KHANH (Eng Dir)   | No   | Security foundation is solid                     |
| SAM (QA)          | No   | Focus on test coverage first                     |
| THEO (TS)         | No   | Fix type safety issues first                     |
| CONVEX (Platform) | No   | Convex-native security is sufficient             |
| MART (SEO)        | No   | Zero direct revenue impact                       |
| LAURA (UX)        | No   | Focus on API documentation                       |
| BARRY (Sales)     | No   | Enterprise cares about compliance, not proxies   |

### What We WILL Do Instead

1. Implement structured API logging
2. Set up security event monitoring
3. Define API SLA (99.9% uptime target)
4. Schedule penetration testing
5. Update security workflows (done)

### When to Revisit

- 10+ enterprise API customers with specific requirements
- SOC 2 Type II or HIPAA compliance mandated
- Multi-region requirements beyond Vercel's edge
- Custom WAF rules needed for industry-specific threats

### Related Documents

- [implementation_plan.md](file:///C:/Users/josia/.gemini/antigravity/brain/aa645da8-c56c-4e1b-801c-6c85f8f5c499/implementation_plan.md) - Full Board consultation
- [network-security.md](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/.agent/workflows/network-security.md) - Network security workflow
- [security-audit.md](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/.agent/workflows/security-audit.md) - Updated security audit
- [security-rules.md](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/.agent/workflows/security-rules.md) - Updated security rules

---

## Decision #002: Seamless User Flow LDD

**Date**: 2024-12-29
**Confidence**: 0.78 (Good)
**Status**: Conditionally Approved

### Context

The LDD proposes a "Guided Autopilot" pattern to ensure users never see blank pages and always have clear next steps. Implementation requires schema changes (`generationStatus` in projects), new components (`GeneratingBanner`, `PhaseProgress`), and new hooks (`useFlowState`).

### Decision

**Conditionally Approved.** Proceed with P0 items after addressing conditions.

### Board Consensus

| Board Member | Vote | Key Concern                                 |
| ------------ | ---- | ------------------------------------------- |
| ALEX (CEO)   | ✅   | Validate problem with real users first      |
| BILL (CFO)   | ⚠️   | Need baseline metrics before implementing   |
| KHANH (Eng)  | ✅   | Consider merging hooks to reduce complexity |
| SAM (QA)     | ⚠️   | Edge cases not fully enumerated             |
| LAURA (UX)   | ✅   | Add accessibility requirements              |

### Conditions Before Implementation

1. Measure current time-to-value baseline
2. Reduce scope to MUST-haves only (generationStatus + GeneratingBanner)
3. Add edge case handling for SAM's list
4. Specify ARIA accessibility requirements
5. Consider merging `useFlowState` with existing `useUserPhase`

### Related Documents

- [LDD_SEAMLESS_USER_FLOW.md](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/docs/LDD_SEAMLESS_USER_FLOW.md)
- [BOARD_REVIEW_SEAMLESS_FLOW.md](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/docs/BOARD_REVIEW_SEAMLESS_FLOW.md)

---

## Decision #003: Content Editor Redesign

**Date**: 2024-12-30
**Confidence**: 0.88 (High)
**Status**: Approved

### Context

The Content Editor LDD proposes refactoring the 798-line page.tsx into modular components and adding a Clearscope + Craft inspired design with floating toolbar and SEO grade badge.

### Decision

**Approved.** Proceed with implementation in 4 phases.

### Board Consensus

| Board Member  | Vote | Key Input                       |
| ------------- | ---- | ------------------------------- |
| ALEX (CEO)    | ✅   | Core value loop, P0 priority    |
| BILL (CFO)    | ✅   | ROI positive at 53 drafts       |
| KHANH (Eng)   | ✅   | Refactor-first is correct       |
| BARRY (Sales) | ✅   | Demo bottleneck, 20% close rate |
| THEO (TS)     | ⚠️   | Fix `as any` during refactor    |

### Conditions

1. Fix `as any` casts during refactor
2. Add SAM's edge case test plan
3. Add ARIA accessibility labels
4. Track draft completion rate before/after

### Related Documents

- [LDD_CONTENT_EDITOR.md](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/docs/LDD_CONTENT_EDITOR.md)
- [BOARD_REVIEW_CONTENT_EDITOR.md](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/docs/BOARD_REVIEW_CONTENT_EDITOR.md)

---

## Decision #004: Content Studio Redesign

**Date**: 2024-12-30
**Confidence**: 0.91 (Very High)
**Status**: Approved

### Context

Complete redesign of content creation flow from confusing 6-click Brief→Draft process to plug-and-play "Content Studio" with one-click generation, content library warehouse, and 90+ quality guarantee.

### Decision

**Approved for phased implementation.**

### Triple Review Process

| Pass | Reviewer           | Verdict                            |
| ---- | ------------------ | ---------------------------------- |
| 1    | Third-Party Vendor | ⚠️ Conditional (5 gaps identified) |
| 2    | Phoo Internal      | ✅ Addressed all gaps              |
| 3    | Third-Party Final  | ✅ Unanimous approval              |

### Key Concerns Addressed

1. **Scope** → Split into 3 phases
2. **Cost** → Added $1,300/mo estimate
3. **Edge Cases** → Added handling table
4. **Rollback** → Feature flag + migration plan

### Conditions

1. Follow phased delivery (Phase 1: Schema + Library, Phase 2: Quality Loop, Phase 3: Full Dashboard)
2. Feature flag for gradual rollout
3. User testing before Phase 3
4. Quality score threshold: 90+ on all auto-generated content

### Related Documents

- [LDD_CONTENT_STUDIO.md](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/docs/LDD_CONTENT_STUDIO.md)
- [BOARD_REVIEW_CONTENT_STUDIO.md](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/docs/BOARD_REVIEW_CONTENT_STUDIO.md)

---

## Decision #005: Convex Database Cleanup

**Date**: 2024-12-30
**Confidence**: 0.95 (Very High)
**Status**: Approved

### Context

High rate limits during testing revealed database bloat. 55 tables in schema, legacy auth tables unused, duplicate content models, and log tables without TTL.

### Decision

**Approved for 3-phase cleanup.**

### Phase Plan

| Phase | Scope                                           | Timeline |
| ----- | ----------------------------------------------- | -------- |
| 1     | Delete legacy tables, clear test data, add TTLs | Day 1    |
| 2     | Migrate briefs+drafts → contentPieces           | Week 1   |
| 3     | Split schema.ts by domain                       | Week 2   |

### Security Issues Found

- `oauthTokens`: Needs encryption review
- `legacySessions`: Contains stale tokens (delete)
- `aiRoutingLogs`: May contain PII (add TTL)

### Tables to Delete

- `legacyUsers` (unused)
- `legacySessions` (unused)

### Tables to Add TTL

- `aiRoutingLogs` (7 days)
- `webhookDeliveries` (30 days)
- `aiProviderHealth` (24 hours)

### Related Documents

- [LDD_DATABASE_CLEANUP.md](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/docs/LDD_DATABASE_CLEANUP.md)

---

## Decision #006: Content Studio Phase 2

**Date**: 2024-12-30
**Confidence**: 0.92 (Very High)
**Status**: Approved

### Context

Content Studio Phase 1 complete (one-click generation, SEO scoring, editor). Phase 2 proposes: AI generation (real GPT/Claude), calendar integration, quality guarantee loop, platform publish.

### Decision

**Approved.** Proceed in priority order:

| Priority | Feature                         | Effort | Impact           |
| -------- | ------------------------------- | ------ | ---------------- |
| **P0**   | AI Generation (real GPT/Claude) | 2h     | Core value       |
| **P1**   | Calendar Integration            | 1h     | Workflow closure |
| **P2**   | Quality Guarantee Loop          | 1h     | A+ guarantee     |
| **P3**   | Platform Publish (stretch)      | 2h     | Full automation  |

### Board Consensus

All 14 personas approve. Key highlights:

| Board Member | Key Input                                 |
| ------------ | ----------------------------------------- |
| ALEX (CEO)   | Vision-aligned, highest-leverage          |
| BILL (CFO)   | ROI excellent (~$0.02/article)            |
| CLARA (CMO)  | "A+ content guaranteed" = demo killer     |
| TYLER (CTO)  | Fits existing ai/ patterns                |
| KATE (PO)    | AI + Calendar = MUST, others SHOULD/COULD |
| KHANH (Eng)  | Low-medium complexity                     |

### Related Documents

- [LDD_CONTENT_STUDIO.md](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/docs/LLD_CONTENT_STUDIO.md)

---

## Template for Future Decisions

```markdown
## Decision #XXX: [Title]

**Date**: YYYY-MM-DD
**Confidence**: 0.X
**Status**: Pending/Approved/Revisited

### Context

[Brief description of the decision needed]

### Decision

[The decision that was made]

### Board Consensus

[Summary of board input]

### Rationale

[Why this decision was made]

### When to Revisit

[Conditions that would trigger reconsideration]
```
