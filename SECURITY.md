# Security Best Practices

## Password Security

### ✅ What We're Doing Right

1. **Password Hashing**
   - Using `bcrypt` with 10 salt rounds
   - Passwords are hashed before storage
   - Never store plain text passwords

2. **PasswordHash Isolation**
   - `passwordHash` is stored in database but **NEVER** exposed in API responses
   - Internal queries/mutations handle password verification
   - Public queries return safe user snapshots (excludes `passwordHash`)

3. **Internal vs Public Functions**
   - `verifyUserPassword` - Internal mutation (password never leaves Convex)
   - `getUserByEmailInternal` - Internal query (includes passwordHash)
   - `getUserSnapshotByEmail` - Public query (excludes passwordHash)
   - `getUserById` - Public query (excludes passwordHash)

### 🔒 Security Measures

1. **JWT Secrets**
   - Secrets MUST come from environment variables (`JWT_SECRET`, `JWT_REFRESH_SECRET`)
   - Production builds fail if secrets are missing
   - Development uses fallback secrets (not for production)

2. **Token Security**
   - Short-lived access tokens (15 minutes)
   - Long-lived refresh tokens (7 days)
   - Refresh tokens stored securely in Convex sessions

3. **Password Verification**
   - Passwords verified server-side using internal mutations
   - PasswordHash never sent to client
   - Generic error messages (no user enumeration)

4. **User Snapshots**
   - All API responses use `UserSnapshot` type (excludes `passwordHash`)
   - `createUserSnapshot()` utility ensures consistent filtering
   - Type guards prevent accidental exposure

## Critical Rules

1. **NEVER** return `passwordHash` in any API response
2. **NEVER** log passwords or password hashes
3. **NEVER** use default JWT secrets in production
4. **ALWAYS** use internal queries/mutations for password operations
5. **ALWAYS** validate passwords server-side

## Environment Variables Required

```bash
# Required in production
JWT_SECRET=your-secure-random-secret-here
JWT_REFRESH_SECRET=your-secure-random-refresh-secret-here

# Optional (has development fallbacks)
NEXT_PUBLIC_CONVEX_URL=your-convex-url
```

## Future Security Enhancements

- [ ] Rate limiting on login endpoint
- [ ] Account lockout after failed attempts
- [ ] Password reset flow with secure tokens
- [ ] Two-factor authentication (2FA)
- [ ] Password strength requirements
- [ ] Session management (revoke tokens)
- [ ] Audit logging for auth events

