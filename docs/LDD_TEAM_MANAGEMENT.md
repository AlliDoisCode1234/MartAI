# LDD: Team Management & Seat-Based Pricing

## Overview

Implement team management allowing users to invite team members based on subscription tier. Every signed-up user belongs to a "Team" (organization) from day one, enabling seamless upgrades.

## Tier-Based Seat Limits

| Tier       | Max Team Members       | Team Name            |
| ---------- | ---------------------- | -------------------- |
| Starter    | 0 (owner only)         | Convex-style slug    |
| Growth     | 3                      | Company name or slug |
| Enterprise | Custom (sales-defined) | Company name         |

---

## Board Review (Full Panel)

### C-Suite Leadership

#### ALEX (CEO)

> "Teams = retention multiplier. When a company embeds 3+ people, they rarely churn. This is P1 for enterprise readiness. The auto-create org pattern is smart—no friction for solopreneurs, but ready when they grow."

#### BILL (CFO)

> "Per-seat upsell is proven SaaS economics. Growth at $X/mo + $Y/seat unlocks healthy LTV expansion. Enterprise custom = margin protection. **Concern**: Make sure audit logs don't bloat storage—add retention policy (90 days for non-enterprise)."

#### CLARA (CMO)

> "The 'Your Team' branding is good. The Convex-style slug naming is quirky and memorable. Make sure the invite email feels premium, not transactional. Add MartAI branding to invite flow."

#### OSCAR (COO)

> "Process: Settings → Team → Invite. Owner-only for invites is correct. **Add**: Document the support flow for 'I can't access my team member's account' tickets. Who handles that?"

#### TYLER (CTO)

> "Schema already has `organizations`, `teamMembers`, `organizationInvitations`. Low TCO. **Security check**: Invite tokens should be cryptographically random (UUID v4) with 7-day expiry. Don't use predictable patterns."

---

### Product & Engineering

#### KATE (PO)

> "This is P1, 8 story points. Sprint capacity allows it. Definition of Done: Team page functional, invites work, seat limits enforced, audit logs recorded."

#### PAIGE (PM)

> "Problem validated—teams reduce churn. Success metric: 20% of Growth users add at least 1 team member within 30 days. Track invite-sent → invite-accepted conversion."

#### KHANH (Eng)

> "Auto-create org on signup is correct. **Edge case**: What if a user is invited to an org but already has their own? We need 'switch org' flow eventually, but for V1, just prevent the double-org scenario by checking email before invite."

#### SAM (QA)

> "Edge cases to test:
>
> 1. Invite same email twice → should fail gracefully
> 2. Invite expired token → clear error message
> 3. Owner tries to remove themselves → blocked
> 4. Last admin leaves → org should have at least one owner
> 5. Seat limit exactly reached, then one invite pending → should still block new invites"

#### THEO (TypeScript)

> "`v.union()` for roles is type-safe. Good. **Suggestion**: Create branded type `OrgRole = 'owner' | 'admin' | 'editor' | 'viewer'` and export from schema for frontend type-safety. No `as any` needed."

#### CONVEX (Platform)

> "Use `organizationInvitations` table correctly with `by_token` index. For invite acceptance, use a mutation (not action) since it's just DB writes. Token validation can be a query first, then mutation to accept."

---

### Design & GTM

#### MART (SEO Expert)

> "This feature helps agencies manage client work. Position it as 'Collaborate with your team on content strategy.' **Revenue impact**: Upsell path from Starter → Growth is seat-based, good trigger."

#### LAURA (UX)

> "Duolingo pattern is correct. **Accessibility check**: Role dropdown needs keyboard navigation. Remove button needs aria-label. Seat count badge should be high-contrast. Add loading states for invite send."

#### BARRY (Sales)

> "Enterprise 'Need more seats?' → Contact Sales is perfect. Custom seat counts = leverage. **Objection prep**: 'Why can't I just share logins?' Answer: Security, audit trail, role-based access."

---

## Common Sense Check

| Check                           | Status | Notes                                                   |
| ------------------------------- | ------ | ------------------------------------------------------- |
| Does this solve a real problem? | ✅     | Teams/agencies need collaboration                       |
| Is it simpler than competitors? | ✅     | Seats included, no per-seat add-on math                 |
| Can a new user understand it?   | ✅     | Settings → Team is intuitive                            |
| What could go wrong?            | ⚠️     | Invite token leaks (mitigate: short expiry, single-use) |
| Is there a rollback plan?       | ✅     | Feature flag the Team tab, org creation is additive     |
| Does it create tech debt?       | ⚠️     | Multi-org switching not in V1 (acceptable)              |
| Is the scope right for V1?      | ✅     | Focused on invite/remove/roles, not org switching       |

---

**Final Confidence**: 0.94

**Rationale**: All personas aligned. Minor concerns (audit log retention, multi-org switching) noted but acceptable for V1. Security patterns are industry-standard. UX follows proven Duolingo model.

---

## Proposed Architecture

### Data Model (Already Exists - Minor Updates)

```
organizations
├── name: string (company or auto-generated)
├── slug: string (convex-style: "adjective-animal-123")
├── plan: starter | growth | enterprise
├── maxMembers: number (enforced limit)
├── ownerId: users._id
└── seatsPurchased: number (for enterprise)

teamMembers
├── userId: users._id
├── organizationId: organizations._id
├── role: owner | admin | editor | viewer
└── status: pending | active | revoked

users (update)
└── organizationId: organizations._id (auto-set on signup)
```

### Auto-Create Organization on Signup

During onboarding:

1. Generate Convex-style slug: `adjective-animal-####`
2. Create organization with user as owner
3. Set `user.organizationId`

### RBAC Permissions

| Action         | Owner | Admin | Editor | Viewer |
| -------------- | ----- | ----- | ------ | ------ |
| Invite members | ✅    | ✅    | ❌     | ❌     |
| Remove members | ✅    | ✅    | ❌     | ❌     |
| Change roles   | ✅    | ❌    | ❌     | ❌     |
| Edit content   | ✅    | ✅    | ✅     | ❌     |
| View content   | ✅    | ✅    | ✅     | ✅     |
| Delete org     | ✅    | ❌    | ❌     | ❌     |
| Manage billing | ✅    | ❌    | ❌     | ❌     |

---

## Proposed Changes

### Backend

#### [MODIFY] `convex/schema.ts`

- Add `organizationId` to `users` table
- Add `seatsPurchased` to `organizations` (for enterprise)

#### [NEW] `convex/teams/teams.ts`

- `createOrganization` - auto-create on signup
- `inviteMember` - with seat limit check
- `removeMember`
- `updateMemberRole`
- `getTeamMembers`
- `getPendingInvites`
- `revokeInvite`

#### [NEW] `convex/teams/invitations.ts`

- `createInvitation` - generate token, send email
- `acceptInvitation` - validate token, add to org
- `declineInvitation`

#### [MODIFY] `convex/onboarding.ts`

- Auto-create org after `createProject`

### Frontend

#### [NEW] `app/settings/team/page.tsx`

- Team member list with roles
- Invite button (opens modal)
- Pending invites section
- Seat usage indicator

#### [NEW] `src/components/settings/TeamMemberRow.tsx`

- Avatar, name, email, role badge
- Remove button (for owner/admin)
- Role dropdown (for owner only)

#### [NEW] `src/components/settings/InviteModal.tsx`

- Email input
- Role selector (admin/editor/viewer)
- Send button
- Link copy option

### Admin Portal

#### [MODIFY] Admin → User Detail

- Show organization membership
- Show team members (expandable)

---

## Verification Plan

### Unit Tests

- Seat limit enforcement
- Role permission checks
- Invite token validation

### E2E Tests

1. New user → org auto-created
2. Invite → accept → appears in team
3. Hit seat limit → error + upgrade CTA

---

## UX Flow (Duolingo-Inspired)

```
Settings → Team
┌─────────────────────────────────────┐
│ Your Team                    2/3 seats │
├─────────────────────────────────────┤
│ 👤 John (you)         Owner    [You] │
│ 👤 Jane              Admin    [Remove]│
│                                      │
│ [+ Invite Team Member]               │
├─────────────────────────────────────┤
│ Pending Invites                      │
│ 📧 bob@company.com   Editor  [Cancel]│
└─────────────────────────────────────┘
│ Need more seats? [Upgrade Plan]      │
└─────────────────────────────────────┘
```

---

## Resolved Design Decisions

| Question           | Decision     | Rationale                              |
| ------------------ | ------------ | -------------------------------------- |
| Org name change    | ✅ Allow     | Just a display name, no impact on slug |
| Transfer ownership | ❌ Not V1    | Low priority, can add later            |
| Audit log          | ✅ All tiers | Track who changed roles, when, by whom |

### Team Audit Log Schema

```typescript
teamAuditLogs: defineTable({
  organizationId: v.id('organizations'),
  actorId: v.id('users'), // Who performed the action
  targetUserId: v.optional(v.id('users')), // Who was affected
  action: v.union(
    v.literal('member_invited'),
    v.literal('member_joined'),
    v.literal('member_removed'),
    v.literal('role_changed'),
    v.literal('invite_revoked'),
    v.literal('org_name_changed')
  ),
  details: v.optional(
    v.object({
      previousRole: v.optional(v.string()),
      newRole: v.optional(v.string()),
      previousName: v.optional(v.string()),
      newName: v.optional(v.string()),
      email: v.optional(v.string()),
    })
  ),
  createdAt: v.number(),
})
  .index('by_org', ['organizationId'])
  .index('by_org_date', ['organizationId', 'createdAt']);
```

---

## Competitive Vendor Analysis

_Analyzing as if we were a competitor evaluating MartAI's team feature_

### Industry Benchmarks

| Tool                  | Base Price   | Per-Seat Cost             | Seats in Plan |
| --------------------- | ------------ | ------------------------- | ------------- |
| **SEMrush**           | $140-500/mo  | $45-100/seat              | 1 included    |
| **Ahrefs**            | $129-1499/mo | $20-50/seat (usage-based) | 1 included    |
| **Surfer SEO**        | $89-299/mo   | Included                  | 2-10 by tier  |
| **MartAI (Proposed)** | TBD          | Included                  | 0-3+ by tier  |

### What Competitors Do Well

1. **Ahrefs**: Usage-based pricing = no charge for inactive users
2. **Surfer**: Generous seat counts included (10 on Max plan)
3. **SEMrush**: Granular API access for enterprise integrations

### Gaps in MartAI's Current Approach

| Gap                       | Risk                              | Mitigation                             |
| ------------------------- | --------------------------------- | -------------------------------------- |
| No activity-based pricing | Paying for idle seats             | Track last_active, show usage stats    |
| No SSO for enterprise     | Security objection                | Roadmap for SAML SSO                   |
| No audit logs             | Compliance concerns               | Add for enterprise tier                |
| No guest/client view      | Agencies can't share with clients | Add "client" role (read-only, branded) |

### Recommendations

1. **Add "Observer" role** - For clients who just need to view reports
2. **Show seat utilization** - "2 of 3 active this month" to justify value
3. **Enterprise: SSO + Audit logs** - Table stakes for B2B

---

## Image Storage Optimization

> **Question**: The `users.image` field - should we store images ourselves?

### Current State

```typescript
users: defineTable({
  image: v.optional(v.string()), // Currently stores URL from OAuth
  ...
})
```

### Analysis

| Approach                             | Pros                             | Cons                                   |
| ------------------------------------ | -------------------------------- | -------------------------------------- |
| **Store OAuth avatar URL** (current) | Zero storage cost, auto-updates  | Breaks if user changes provider avatar |
| **Convex File Storage**              | Full control, offline resilience | Storage costs, upload UI needed        |
| **External (Gravatar/Cloudinary)**   | CDN, transformations             | Third-party dependency                 |

### Recommendation: **Keep OAuth URLs Only**

1. **Why**: OAuth providers (Google, GitHub) already host avatars
2. **The `image` field already stores the OAuth URL** (not base64 data)
3. **No database bloat** - just a string URL reference
4. **Fallback**: Show initials if URL fails (already common pattern)

```typescript
// Avatar component pattern
const Avatar = ({ user }) => (
  <img
    src={user.image}
    onError={(e) => e.target.src = getInitialsAvatar(user.name)}
  />
);
```

### Action Items

- [x] Confirm `image` field is URL-only (✅ yes, from OAuth)
- [ ] Add initials fallback in avatar components
- [ ] Consider Gravatar fallback for email-based users

---

## Summary

**Schema**: Foundation exists, minor updates needed for `organizationId` on users  
**RBAC**: Owner/Admin/Editor/Viewer covers 95% of use cases  
**Image Storage**: Keep as-is (OAuth URLs), no bloat concern  
**Competitive Position**: Stronger than Surfer on AI, weaker than SEMrush on enterprise features
