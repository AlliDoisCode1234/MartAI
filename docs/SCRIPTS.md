# MartAI Scripts Reference

This document explains the available scripts for development, deployment, and administration.

---

## Quick Reference

| Script            | Purpose                | Usage                                                   |
| ----------------- | ---------------------- | ------------------------------------------------------- |
| `create-admin.ts` | Manage admin users     | `npx ts-node scripts/create-admin.ts <email> [--super]` |
| `clean.js`        | Clean build artifacts  | `node scripts/clean.js`                                 |
| `setup-env.js`    | Initialize environment | `node scripts/setup-env.js`                             |

---

## Admin Management

### `scripts/create-admin.ts`

Create or promote users to admin/super_admin roles.

```bash
# Promote user to admin
npx ts-node scripts/create-admin.ts john@example.com

# Promote user to super_admin (full access)
npx ts-node scripts/create-admin.ts john@example.com --super

# List all current admins
npx ts-node scripts/create-admin.ts --list

# Show help
npx ts-node scripts/create-admin.ts --help
```

**Requirements:**

- User must have signed up via the app first
- `CONVEX_URL` or `NEXT_PUBLIC_CONVEX_URL` must be set

**Roles:**
| Role | Access |
|------|--------|
| `user` | Default, can use the app |
| `admin` | Access admin portal, manage keyword library |
| `super_admin` | Full access, manage other users |

---

## Cleanup Scripts

### `scripts/clean.js`

Removes build artifacts and cache directories.

```bash
node scripts/clean.js
```

**Cleans:**

- `.next/` - Next.js build output
- `node_modules/.cache/` - Build caches
- Generated files that should be rebuilt

---

## Environment Setup

### `scripts/setup-env.js`

Initialize environment variables and configuration.

```bash
node scripts/setup-env.js
```

---

## Deployment Scripts

Located in `scripts/deploy/`:

| Script                                           | Purpose |
| ------------------------------------------------ | ------- |
| Deploy-related scripts for production deployment |

---

## Seed Scripts

Located in `scripts/seed/`:

Seed the database with initial data for development or testing.

---

## Test Scripts

Located in `scripts/test/`:

Test utilities and helpers for the test suite.

---

## Verification Scripts

Located in `scripts/verify/`:

Verification and validation scripts for CI/CD pipelines.

---

## PowerShell Scripts

### `scripts/refactor-types.ps1`

Refactoring helper for type definitions.

### `scripts/replace-as-any.ps1`

Helper script for replacing `as any` casts with proper types.

### `scripts/update-route-security.ps1`

Update route security configurations.

---

## Dogfood Scripts

Located in `scripts/dogfood/`:

Scripts for internal dogfooding and testing the product.

---

## Adding New Scripts

When adding a new script:

1. Place it in `scripts/` or appropriate subdirectory
2. Add documentation to this file
3. Include a `--help` flag if it accepts arguments
4. Use TypeScript (`.ts`) for complex scripts, JavaScript (`.js`) for simple ones
