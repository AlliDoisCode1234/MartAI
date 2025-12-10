---
description: Security audit checklist before release
---

# Security Audit Workflow

## When to Use

- Before major releases
- After adding auth-related features
- After adding new API endpoints
- Periodically (monthly)

## Checklist

### 1. Authentication

- [ ] All protected routes check auth
- [ ] Sessions expire appropriately
- [ ] Password requirements enforced
- [ ] OAuth tokens stored securely (not in localStorage)
- [ ] Logout clears all session data

### 2. Authorization

- [ ] Users can only access their own data
- [ ] Admin routes check admin role
- [ ] API keys scoped to appropriate permissions
- [ ] No privilege escalation paths

### 3. Input Validation

- [ ] All user inputs validated server-side
- [ ] File uploads checked for type/size
- [ ] URLs validated before fetching
- [ ] SQL/NoSQL injection not possible (Convex handles this)

### 4. Output Encoding

- [ ] User content escaped before rendering
- [ ] No `dangerouslySetInnerHTML` with user data
- [ ] API responses don't leak sensitive fields
- [ ] Error messages don't reveal internals

### 5. CSRF/XSS

- [ ] CSRF tokens on state-changing operations
- [ ] HttpOnly cookies where appropriate
- [ ] Content-Security-Policy headers
- [ ] X-Frame-Options set

### 6. Secrets

- [ ] No secrets in code (use env vars)
- [ ] `.env` in `.gitignore`
- [ ] API keys rotated periodically
- [ ] Secrets different per environment

### 7. Dependencies

```bash
# Check for known vulnerabilities
npm audit
```

- [ ] No critical vulnerabilities
- [ ] Dependencies up to date

### 8. Logging

- [ ] No PII in logs
- [ ] No passwords/tokens logged
- [ ] Security events logged (failed logins, etc.)

---

## Quick Security Scan

```bash
# Dependency vulnerabilities
npm audit

# Check for secrets in code
grep -r "password\|secret\|api_key" --include="*.ts" --include="*.tsx" .

# Check env file isn't committed
git ls-files | grep -i env
```

---

## Red Flags

> [!CAUTION]
> Immediate action required if found:
>
> - Secrets committed to git
> - User data accessible without auth
> - `eval()` or `dangerouslySetInnerHTML` with user input
> - Passwords stored in plain text
