---
description: Security rules checklist - use before any mutation/query implementation
---

# Security Rules Checklist

Use this checklist for every mutation/query you write or modify.

## Before Writing Any Mutation

- [ ] **Auth Check**: Does it start with `auth.getUserId(ctx)` and throw if null?
- [ ] **Ownership Check**: Does caller own the resource or have RBAC access?
- [ ] **Rate Limiting**: Is this an expensive operation that needs rate limiting?
- [ ] **Input Validation**: Are all inputs validated beyond Convex validators?
- [ ] **Return Filtering**: Does it return only fields the UI needs?

## Before Writing Any Query

- [ ] **Auth Check**: Does it verify caller is authenticated?
- [ ] **Access Control**: Can caller only access their own data (or admin)?
- [ ] **Data Filtering**: Are sensitive fields excluded from response?

## Console.log Rules

**NEVER log:**

- Full user objects
- Email addresses
- Passwords or tokens
- API keys or secrets
- Full request `args` objects
- Stack traces with user data

**OK to log:**

- Document IDs (`userId`, `projectId`)
- Operation names (`[CreateProject] Starting...`)
- Error messages (sanitized)
- Counts and metrics

## Rate Limiting Pattern

```typescript
// 1. Get user tier
const tier = user.membershipTier ?? 'free';
const key = getRateLimitKey('generateBrief', tier);

// 2. Check limit BEFORE expensive operation
const limitResult = await rateLimits.limit(ctx, key, { key: userId });
if (!limitResult.ok) {
  throw new Error('Rate limit exceeded. Please try again later.');
}
```

## RBAC Pattern

```typescript
// For project operations
await requireProjectAccess(ctx, args.projectId, 'editor');

// For org operations
await requireOrgRole(ctx, args.organizationId, 'admin');

// For admin operations
await requireAdmin(ctx);

// For super admin operations
await requireSuperAdmin(ctx);
```

## Quick Reference

| Operation Type  | Required Check                 |
| --------------- | ------------------------------ |
| User's own data | `auth.getUserId()` + ownership |
| Project data    | `requireProjectAccess()`       |
| Org data        | `requireOrgRole()`             |
| Admin portal    | `requireAdmin()`               |
| Sensitive admin | `requireSuperAdmin()`          |

---

## Operational Security

### Secrets Management

- **NEVER** hardcode secrets in code
- Use `process.env.SECRET_NAME` for server-side secrets
- Use Convex dashboard for secret storage
- Rotate secrets after any suspected compromise
- Use different secrets for dev/staging/production

### Environment Variables

- Prefix client-exposed vars with `NEXT_PUBLIC_`
- Never log environment variables
- Document all required vars in `.env.example`

### Deployment Security

- Never deploy with default/placeholder secrets
- Verify `CRON_SECRET` is set before production
- Use HTTPS for all external API calls
- Validate webhook signatures before processing

### Incident Response

1. **Detect**: Monitor for unusual patterns
2. **Contain**: Revoke compromised keys immediately
3. **Investigate**: Trace data flow to identify scope
4. **Remediate**: Patch vulnerability, rotate secrets
5. **Document**: Log in `docs/SECURITY_INCIDENTS.md`
