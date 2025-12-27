---
description: Network and API security patterns for MartAI - use when implementing public API endpoints or reviewing security architecture
---

# Network Security Patterns

## When to Use

- Implementing new public API endpoints
- Reviewing API security architecture
- Evaluating need for reverse proxy / API gateway
- Preparing for security audit or penetration testing

## Key Principle

> [!IMPORTANT]
> **Convex backends are public APIs. Security is enforced within functions, not at network edge.**
>
> A reverse proxy is NOT required for MartAI. Vercel/Convex provide:
>
> - DDoS protection
> - SSL termination
> - Global edge distribution
> - Auto-scaling

---

## Defense in Depth Architecture

```text
Client Request
     ↓
Vercel Edge (DDoS, SSL, CDN)
     ↓
Next.js Middleware (Headers, CORS)
     ↓
API Route (Auth, Rate Limits)
     ↓
Convex Function (RBAC, Validation)
     ↓
Data Layer (Ownership, Filtering)
```

Each layer provides protection. Never skip inner layers.

---

## Network Security Types (Reference)

| Type            | Status           | Implementation                 |
| --------------- | ---------------- | ------------------------------ |
| SSL/TLS         | ✅ Vercel        | Automatic HTTPS                |
| DDoS Protection | ✅ Vercel/Convex | Edge protection                |
| Rate Limiting   | ✅ Implemented   | `@convex-dev/rate-limiter`     |
| Access Control  | ✅ Implemented   | API keys + RBAC                |
| Firewall        | N/A              | Serverless (no infrastructure) |
| VPN             | N/A              | Not applicable                 |
| IDS/IPS         | ⚠️ Partial       | Anomaly detection needed       |
| WAF             | ⚠️ Optional      | Cloudflare if needed later     |

---

## API Gateway Pattern (Without Gateway Product)

Implement these patterns in Next.js middleware instead of deploying a separate gateway:

### 1. Authentication Middleware

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  // Only check API routes
  if (request.nextUrl.pathname.startsWith('/api/v1')) {
    const apiKey = request.headers.get('Authorization');
    if (!apiKey?.startsWith('Bearer mart_')) {
      return new Response('Unauthorized', { status: 401 });
    }
  }
  return NextResponse.next();
}
```

### 2. Security Headers Middleware

```typescript
// Already implemented in lib/apiAuth.ts
const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Cache-Control': 'no-store',
};
```

### 3. Rate Limiting

```typescript
// Use @convex-dev/rate-limiter
const limitResult = await rateLimits.limit(ctx, key, { key: userId });
if (!limitResult.ok) {
  return rateLimitedResponse(60);
}
```

---

## When to Consider a Reverse Proxy

Only consider adding reverse proxy when:

- [ ] 10+ enterprise API customers with specific requirements
- [ ] SOC 2 Type II or HIPAA compliance required
- [ ] Multi-region requirements beyond Vercel's edge network
- [ ] Custom WAF rules needed for industry-specific threats
- [ ] Service mesh complexity (microservices architecture)

**Current status**: None of these apply. Revisit at 10+ enterprise customers.

---

## Security Checklist for New API Endpoints

// turbo-all

### Before Implementation

1. [ ] Define rate limits for the endpoint
2. [ ] Identify required permission level (read/write/admin)
3. [ ] List all input fields and validation rules
4. [ ] Determine which fields are safe to return

### During Implementation

5. [ ] Add API key or session authentication check
6. [ ] Implement permission check (RBAC)
7. [ ] Add rate limiting call
8. [ ] Validate all inputs (beyond Convex validators)
9. [ ] Filter response to safe fields only
10. [ ] Add request ID for tracing
11. [ ] Include security headers in response

### After Implementation

12. [ ] Test with invalid API key
13. [ ] Test with expired API key
14. [ ] Test rate limit boundaries
15. [ ] Test with malformed input
16. [ ] Document in API reference

---

## Quick Reference

### API Key Validation

```bash
# Test API key
curl -H "Authorization: Bearer mart_..." https://martai.app/api/v1/keywords
```

### Rate Limit Headers

```text
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1703657940
Retry-After: 60  (only on 429)
```

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "rate_limited",
    "message": "Rate limit exceeded"
  },
  "meta": {
    "requestId": "req_1703657880_abc123",
    "timestamp": "2025-12-27T04:38:00Z"
  }
}
```

---

## Decision Log

| Date       | Decision                     | Rationale                                         |
| ---------- | ---------------------------- | ------------------------------------------------- |
| 2025-12-27 | No reverse proxy needed      | Board review: Convex-native approach sufficient   |
| 2025-12-27 | Maximize middleware security | Implement gateway pattern without gateway product |
