# Global Security & Operational Security Rules

## Board of Directors Consultation

**Decision**: Define permanent global security rules for MartAI

### C-Suite Leadership

#### TYLER (CTO) says:

> "Security is non-negotiable. Every mutation must have auth, every log must be sanitized, every secret must be managed in environment variables. Defense in depth - multiple layers of protection."

#### OSCAR (COO) says:

> "Process matters. Security rules must be documented, enforced in code review, and checked automatically. Ownership is clear: every security violation is a P0 fix."

#### ALEX (CEO) says:

> "Security breaches destroy trust. A single data leak can end the company. These rules are policy, not guidelines."

---

### Product & Engineering

#### KHANH (Dir Engineering) says:

> "Security is 'Pay Now' tech debt. Every shortcut creates exposure. Use existing RBAC helpers, never roll your own auth checks."

#### SAM (QA) says:

> "Every mutation needs the 'who can do this?' question answered. If you can't answer it, you can't merge it."

#### THEO (TypeScript Wizard) says:

> "Type-safe security patterns prevent mistakes. Use `requireProjectAccess`, `requireAdmin`, `requireSuperAdmin` - they're type-safe and throw if unauthorized."

---

**Decision**: Implement the following global rules  
**Confidence**: 0.95 (unanimous Board agreement)

---

## GLOBAL SECURITY RULES (Add to GEMINI.md)

### Authentication Rules

- Every mutation MUST call `auth.getUserId(ctx)` and throw 'Unauthorized' if null
- Every query accessing user data MUST verify the caller is authenticated
- Never bypass auth checks for "convenience" or "testing"
- Test endpoints MUST be gated behind `requireSuperAdmin()`

### Authorization Rules

- Every mutation MUST verify caller owns the resource OR has RBAC access
- Use existing helpers: `requireProjectAccess()`, `requireOrgRole()`, `requireAdmin()`, `requireSuperAdmin()`
- Project operations require `requireProjectAccess(ctx, projectId, 'editor'|'viewer'|'admin')`
- Admin operations require `requireAdmin(ctx)` or `requireSuperAdmin(ctx)`
- Never trust client-provided userId - always derive from `auth.getUserId(ctx)`

### Data Protection Rules

- Never return more data than the UI requires - use field filtering
- Never return sensitive fields: passwords, tokens, keyHash, internal IDs
- Never expose private data to unauthorized users
- Filter data based on caller's access level

### Logging Rules

- NEVER log: passwords, tokens, API keys, secrets, emails, full user objects, full args
- OK to log: document IDs, operation names, sanitized error messages, counts
- Remove all `console.log(args)` or `console.log(user)` patterns
- Use structured logging with clear prefixes: `[Module] Action: id`

### Rate Limiting Rules

- Expensive operations (AI generation, external API calls) MUST check rate limits
- Use `rateLimits.limit(ctx, key, { key: userId })` before expensive operations
- Throw user-friendly error if rate limited

### Input Validation Rules

- Use Convex validators for type safety
- Add business logic validation beyond type checking
- Validate URLs, emails, and other formatted strings
- Sanitize all user input before storage

### Secrets Management Rules

- NEVER hardcode secrets in code
- Use `process.env.SECRET_NAME` for server-side secrets
- Prefix client-exposed vars with `NEXT_PUBLIC_`
- Document all required env vars in `.env.example`
- Use different secrets for dev/staging/production
- Rotate secrets after any suspected compromise

### Deployment Rules

- Never deploy with default/placeholder secrets
- Verify all required env vars are set before deployment
- Use HTTPS for all external API calls
- Validate webhook signatures before processing

### Code Review Security Checklist

Before approving any PR:

- [ ] Auth check present in all mutations
- [ ] Ownership/RBAC check present
- [ ] No secrets in code or comments
- [ ] No sensitive data in console.log
- [ ] Rate limits on expensive operations
- [ ] Input validation present
- [ ] Error messages don't leak internal details
- [ ] Return data is filtered to safe fields

---

## Implementation

These rules should be added to:

1. `GEMINI.md` (global user rules)
2. `.agent/workflows/security-rules.md` (already done)
3. `docs/SECURITY_POLICY.md` (new document for team reference)
