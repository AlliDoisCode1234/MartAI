# Internal Security Audit: OWASP ZAP

**Date**: January 3, 2026  
**Status**: Planned  
**Board Approval**: Yes (Confidence: 0.85)

---

## 1. Overview

This document outlines the internal security audit using OWASP ZAP (Zed Attack Proxy) as the primary tool. This audit is a prerequisite for the third-party penetration test ($5k budget approved).

### Objectives

1. Identify OWASP Top 10 vulnerabilities
2. Test API endpoint security
3. Verify authentication/authorization controls
4. Validate rate limiting effectiveness
5. Check for sensitive data exposure

---

## 2. Prerequisites

### Environment Setup

- [ ] **Staging environment** deployed (BLOCKER - required before audit)
- [ ] OWASP ZAP installed locally or Docker container
- [ ] Test user accounts created (admin, user, viewer roles)
- [ ] API keys for testing

### Installation

```bash
# Docker (recommended)
docker pull ghcr.io/zaproxy/zaproxy:stable
docker run -u zap -p 8080:8080 -p 8090:8090 -i ghcr.io/zaproxy/zaproxy:stable zap-webswing.sh

# Or download from: https://www.zaproxy.org/download/
```

---

## 3. Audit Scope

### In Scope

| Target           | URL Pattern                      | Priority     |
| ---------------- | -------------------------------- | ------------ |
| Public Marketing | `/`, `/pricing`, `/how-it-works` | Medium       |
| Authentication   | `/auth/*`, `/api/auth/*`         | **Critical** |
| OAuth Callbacks  | `/api/integrations/*/callback`   | **Critical** |
| Public API       | `/api/public/*`                  | **Critical** |
| Dashboard        | `/dashboard/*`, `/studio/*`      | High         |
| Admin Portal     | `/admin/*`                       | **Critical** |
| Settings         | `/settings/*`                    | Medium       |

### Out of Scope

- Third-party services (Convex, Vercel, Stripe)
- Production environment (staging only)
- DoS testing (could affect other tenants)

---

## 4. Test Cases

### 4.1 Authentication (OWASP A07:2021)

| Test                  | Method           | Expected Result             |
| --------------------- | ---------------- | --------------------------- |
| Broken authentication | Automated spider | No bypass possible          |
| Session fixation      | Manual test      | Session ID rotates on login |
| Password brute force  | Rate limit test  | Blocked after 5 attempts    |
| JWT manipulation      | Token tampering  | Rejected with 401           |

### 4.2 Injection (OWASP A03:2021)

| Test              | Target                       | Expected Result     |
| ----------------- | ---------------------------- | ------------------- |
| SQL Injection     | N/A (Convex doesn't use SQL) | Not applicable      |
| NoSQL Injection   | Query parameters             | Sanitized inputs    |
| XSS (Reflected)   | All inputs                   | No script execution |
| XSS (Stored)      | Content creation             | Sanitized output    |
| Command Injection | File uploads                 | Rejected/sandboxed  |

### 4.3 Broken Access Control (OWASP A01:2021)

| Test                            | Scenario                    | Expected Result   |
| ------------------------------- | --------------------------- | ----------------- |
| Horizontal privilege escalation | Access other user's project | 403 Forbidden     |
| Vertical privilege escalation   | User → Admin actions        | 403 Forbidden     |
| API key permission bypass       | Read key → Write action     | 403 Forbidden     |
| Direct object reference         | `/api/projects/{id}`        | Only own projects |

### 4.4 Security Misconfiguration (OWASP A05:2021)

| Test                | Check              | Expected Result               |
| ------------------- | ------------------ | ----------------------------- |
| Security headers    | Response headers   | All present (CSP, HSTS, etc.) |
| Error messages      | Error responses    | No stack traces               |
| Default credentials | Admin login        | No defaults                   |
| Directory listing   | `/api/`, `/admin/` | 404 or redirect               |

### 4.5 Sensitive Data Exposure (OWASP A02:2021)

| Test                | Target         | Expected Result     |
| ------------------- | -------------- | ------------------- |
| API key in response | All endpoints  | Never exposed       |
| Password in logs    | Auth endpoints | Never logged        |
| PII in URLs         | Query strings  | No sensitive data   |
| Tokens in referrer  | OAuth flow     | Referrer-Policy set |

### 4.6 Rate Limiting (Custom)

| Test               | Endpoint          | Expected Result      |
| ------------------ | ----------------- | -------------------- |
| API rate limit     | `/api/public/*`   | 429 after limit      |
| Auth rate limit    | `/api/auth/*`     | 429 after 5 attempts |
| Content generation | `/api/*/generate` | Tier-based limits    |

---

## 5. ZAP Configuration

### 5.1 Contexts

```xml
<!-- contexts/martai-staging.context -->
<context>
  <name>MartAI Staging</name>
  <include>https://staging.phoo.ai/*</include>
  <exclude>https://staging.phoo.ai/auth/logout</exclude>
  <tech>
    <include>React</include>
    <include>Next.js</include>
  </tech>
</context>
```

### 5.2 Authentication (for Authenticated Scanning)

```yaml
# Use form-based authentication
authentication:
  method: form
  login_url: https://staging.phoo.ai/auth/login
  username_field: email
  password_field: password
  logged_in_indicator: /dashboard
  logged_out_indicator: /auth/login
```

### 5.3 Scan Policy

```yaml
# zap-scan-policy.yaml
alerts:
  high: fail
  medium: warn
  low: info
  informational: ignore

tests:
  injection: enabled
  xss: enabled
  path_traversal: enabled
  auth_bypass: enabled
```

---

## 6. Execution Steps

### Phase 1: Passive Scan (Day 1)

```bash
# Start ZAP in daemon mode
zap.sh -daemon -port 8080 -config api.key=your-api-key

# Spider the application
zap-cli quick-scan -s all https://staging.phoo.ai

# Export passive scan results
zap-cli report -o passive-scan-report.html -f html
```

### Phase 2: Active Scan (Day 2)

```bash
# Run active scan (authenticated)
zap-cli active-scan -r https://staging.phoo.ai

# Export active scan results
zap-cli report -o active-scan-report.html -f html
```

### Phase 3: API Scan (Day 3)

```bash
# Import OpenAPI spec (if available)
zap-cli openapi-import /path/to/openapi.yaml

# Scan API endpoints
zap-cli api-scan -t https://staging.phoo.ai/api
```

### Phase 4: Manual Testing (Day 4)

- OAuth flow manipulation
- JWT tampering
- RBAC bypass attempts
- Rate limit evasion

---

## 7. Findings Template

```markdown
## Finding: [Title]

**Severity**: Critical / High / Medium / Low / Informational
**OWASP Category**: A01-A10
**CWE ID**: CWE-XXX

### Description

[What was found]

### Evidence

[Screenshot, request/response, URL]

### Impact

[What could an attacker do?]

### Remediation

[How to fix]

### Status

- [ ] Identified
- [ ] Triaged
- [ ] Fixed
- [ ] Verified
```

---

## 8. Remediation SLAs

| Severity      | Response Time | Fix Deadline |
| ------------- | ------------- | ------------ |
| Critical      | Immediate     | 24 hours     |
| High          | 4 hours       | 3 days       |
| Medium        | 24 hours      | 2 weeks      |
| Low           | 1 week        | Next sprint  |
| Informational | Log only      | No deadline  |

---

## 9. CI Integration

```yaml
# .github/workflows/security.yml
name: Security Scan

on:
  push:
    branches: [main, develop]
  schedule:
    - cron: '0 2 * * 1' # Weekly Monday 2am

jobs:
  zap-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: zaproxy/action-baseline@v0.10.0
        with:
          target: 'https://staging.phoo.ai'
          rules_file_name: '.zap/rules.tsv'
          cmd_options: '-a'
```

---

## 10. Deliverables

1. [ ] Passive scan report (HTML)
2. [ ] Active scan report (HTML)
3. [ ] API scan report (HTML)
4. [ ] Manual testing notes
5. [ ] Findings spreadsheet (severity, status, owner)
6. [ ] Remediation tickets created
7. [ ] Re-scan after fixes
8. [ ] Final clean report (for third-party pentest)

---

## 11. Schedule

| Phase               | Date          | Owner           |
| ------------------- | ------------- | --------------- |
| Environment setup   | Week of Jan 6 | DevOps          |
| Passive scan        | Jan 8         | Security        |
| Active scan         | Jan 9         | Security        |
| API scan            | Jan 10        | Security        |
| Manual testing      | Jan 13-14     | Security        |
| Remediation         | Jan 15-24     | Engineering     |
| Re-scan             | Jan 27        | Security        |
| Third-party pentest | Feb 1-14      | External vendor |

---

**Last Updated**: January 3, 2026
