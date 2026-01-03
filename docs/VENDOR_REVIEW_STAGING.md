# Third-Party Vendor Review: Staging Environment

**Date**: January 3, 2026  
**Reviewed By**: Board of Directors  
**Status**: Approved with Conditions

---

## 1. Vendors Required for Staging

| Vendor           | Purpose                        | Cost (Staging)                  | Risk Level |
| ---------------- | ------------------------------ | ------------------------------- | ---------- |
| **Convex**       | Backend database & functions   | $0 (included in plan)           | Low        |
| **Vercel**       | Frontend hosting               | $0 (Pro plan includes previews) | Low        |
| **Google Cloud** | OAuth provider                 | $0                              | Medium     |
| **Stripe**       | Payment processing (test mode) | $0                              | Low        |
| **GitHub**       | Source control, Actions        | $0 (included)                   | Low        |
| **OpenAI**       | AI features                    | ~$50-100/mo staging tests       | Medium     |

**Total Staging Cost**: ~$50-100/month (OpenAI only)

---

## 2. Board of Directors Review

### C-Suite Leadership

#### ALEX (CEO) says:

> Staging is a **P0 blocker** for security audit and enterprise launch. Approve immediately. The $50-100/mo OpenAI cost is negligible compared to the risk of shipping untested code. No second-guessing - get it done this week.

#### BILL (CFO) says:

> **Approved**. Cost analysis:
>
> - Convex: $0 additional (covered by existing plan)
> - Vercel: $0 additional (Pro plan includes preview deployments)
> - OpenAI: ~$100/mo = $1,200/yr - acceptable for QA/security
>
> **ROI**: Prevents costly security incidents post-launch. $1,200/yr << cost of one data breach response ($50K+).

#### OSCAR (COO) says:

> Process concerns:
>
> 1. **Who owns staging?** Need clear ownership (DevOps)
> 2. **When to refresh data?** Weekly wipe recommended for clean testing
> 3. **Access control?** Limit staging access to Engineering + QA only
>
> **Recommendation**: Add staging runbook to `docs/operations/`

#### TYLER (CTO) says:

> **Security Review**:
>
> - ✅ Separate Convex deployment = data isolation
> - ✅ Stripe TEST mode = no real money
> - ⚠️ **Concern**: OAuth credentials shared between staging/prod
>
> **Recommendation**: Consider separate Google OAuth client for staging (lower risk of credential leak affecting prod). For now, shared is acceptable given scope.
>
> **Architecture**: Multi-deployment pattern is correct approach. Convex handles this well.

---

### Product & Engineering

#### KATE (Product Owner) says:

> **Priority**: P0 - blocks security audit
> **Story Points**: 5 (2-3 days for DevOps)
> **Sprint Fit**: Must complete before pentest (Week of Jan 6)
>
> **Definition of Done**:
>
> - [ ] staging.phoo.ai loads
> - [ ] OAuth login works
> - [ ] Stripe test checkout works
> - [ ] CI/CD deploys on push to staging branch

#### KHANH (Dir Engineering) says:

> **Architecture approved**. Notes:
>
> - Multi-deployment is Convex best practice
> - Seed script should be idempotent (check if data exists)
> - Add `.env.staging` template to repo (gitignored)
>
> **Tech debt to avoid**: Don't hardcode staging URLs anywhere.

#### SAM (QA) says:

> **Testing concerns**:
>
> - Need test account credentials documented
> - Edge cases: What happens if staging Stripe webhook fails?
> - Add staging health check endpoint (`/api/health`)
>
> **Recommend**: Create `docs/STAGING_TESTING_GUIDE.md`

#### CONVEX (Platform Expert) says:

> **Convex-specific recommendations**:
>
> 1. Use `npx convex deploy --deployment staging` (not `--prod`)
> 2. Set `CONVEX_DEPLOYMENT` env var for CI
> 3. Staging deployment gets same index configurations automatically
> 4. Consider using Convex's preview deployments for PR previews later
>
> **No concerns** - this is standard multi-tenant pattern.

---

### Design & GTM

#### BARRY (Sales) says:

> **Demo value**: Staging can be used for client demos without risking prod data. This is a selling point for enterprise clients who want to see the platform before committing. **Strong approval**.

---

## 3. Risk Assessment

| Risk                                        | Likelihood | Impact | Mitigation                                           |
| ------------------------------------------- | ---------- | ------ | ---------------------------------------------------- |
| Staging URL leaked to search engines        | Low        | Low    | Add `robots.txt` noindex to staging                  |
| Test Stripe keys used in prod               | Low        | High   | Environment variable validation at startup           |
| Staging data accessed by unauthorized users | Medium     | Low    | IP allowlist or basic auth for staging               |
| OAuth credentials compromised               | Low        | High   | Monitor Google Cloud Console for suspicious activity |

---

## 4. Board Decision

**Decision**: **APPROVED** - Proceed with staging environment setup immediately

**Rationale**:

- P0 blocker for security audit (ALEX, KATE)
- Cost is minimal ($100/mo) vs. risk mitigation value (BILL)
- Architecture is sound and follows Convex best practices (KHANH, CONVEX, TYLER)
- Enables client demos (BARRY)

**Confidence**: **0.92** (High - full board consensus)

**Conditions**:

1. Add staging robots.txt to prevent indexing
2. Document test credentials securely
3. Create staging runbook in docs/operations/
4. Weekly staging data refresh schedule

---

**Approved By**: Full Board of Directors  
**Date**: January 3, 2026
