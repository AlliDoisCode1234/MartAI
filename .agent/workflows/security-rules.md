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

---

## API Endpoint Security

> [!IMPORTANT]
> Convex backends are already public APIs. A reverse proxy is NOT required.
> Vercel/Convex provide DDoS protection, SSL termination, and auto-scaling.
> Security MUST be enforced within Convex functions, not at network edge.

### Before Writing Any HTTP Action / API Route

- [ ] **API Key OR Session Auth**: Does it check for valid authentication?
- [ ] **Permission Check**: Does it verify the caller has required permissions?
- [ ] **Rate Limiting**: Is `checkApiRateLimit` called before expensive operations?
- [ ] **Input Validation**: Are all inputs validated (Convex validators + additional)?
- [ ] **Response Filtering**: Does it return only safe fields (no keyHash, etc.)?

### API Key Authentication Pattern

```typescript
// 1. Extract API key from request
const apiKey = extractApiKey(request);
if (!apiKey) {
  return unauthorizedResponse('Missing API key', requestId);
}

// 2. Hash key for lookup (NEVER store raw keys)
const keyHash = hashApiKey(apiKey);

// 3. Validate against database
const validation = await ctx.runQuery(api.apiKeys.validateApiKey, { keyHash });
if (!validation) {
  return unauthorizedResponse('Invalid API key', requestId);
}

// 4. Check specific permission
if (!hasPermission(validation, 'write')) {
  return forbiddenResponse('Insufficient permissions', requestId);
}

// 5. Record usage for analytics
await ctx.runMutation(api.apiKeys.recordApiKeyUsage, { keyId: validation.keyId });
```

### API Response Standards

```typescript
// Success response format
{
  success: true,
  data: { ... },
  meta: {
    requestId: "req_1234...",
    timestamp: "2025-12-27T..."
  }
}

// Error response format
{
  success: false,
  error: {
    code: "unauthorized" | "forbidden" | "not_found" | "rate_limited" | "validation_error",
    message: "Human-readable message"
  },
  meta: {
    requestId: "req_1234...",
    timestamp: "2025-12-27T..."
  }
}
```

### Required Security Headers

All API responses MUST include:

| Header                      | Value                                 | Purpose                   |
| --------------------------- | ------------------------------------- | ------------------------- |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Force HTTPS               |
| `X-Content-Type-Options`    | `nosniff`                             | Prevent MIME sniffing     |
| `X-Frame-Options`           | `DENY`                                | Prevent clickjacking      |
| `X-XSS-Protection`          | `1; mode=block`                       | Legacy XSS protection     |
| `X-Request-ID`              | `req_...`                             | Request tracing           |
| `X-RateLimit-Limit`         | `100`                                 | Rate limit info           |
| `X-RateLimit-Remaining`     | `99`                                  | Remaining requests        |
| `Cache-Control`             | `no-store`                            | Don't cache API responses |

### API Logging Rules

**Log these (structured, no PII)**:

- Request ID
- Endpoint path
- HTTP method
- Response status code
- Response time (ms)
- API key ID (not the key itself)
- Rate limit status

**NEVER log**:

- Full API key
- Request body with user data
- Response body with sensitive data
- User emails or identifiers

### Defense in Depth Architecture

```text
Client Request
     ↓
Vercel Edge (DDoS protection, SSL termination)
     ↓
Next.js Middleware (Security headers, CORS)
     ↓
API Route (API key extraction, rate limit check)
     ↓
Convex Function (Auth, RBAC, input validation)
     ↓
Data Layer (Ownership check, field filtering)
```

Each layer adds protection. Never skip inner layers because outer layers "should" catch issues.
