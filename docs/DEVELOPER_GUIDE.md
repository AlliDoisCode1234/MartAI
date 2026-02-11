# Phoo.ai — Developer Guide

> **Last updated**: February 11, 2026
> **Audience**: Anyone writing code on this project.

---

## 1. Getting Started

### Prerequisites

- Node.js 20+
- Convex CLI (`npx convex`)
- Git with GPG signing (recommended)
- Access to `.env.local` values (see `.env.example`)

### First Run

```bash
# Install dependencies
npm install

# Start Convex backend (separate terminal)
npx convex dev

# Start Next.js frontend
npm run dev
```

The app runs at `http://localhost:3000`. Convex dev connects to your development instance automatically.

### Environment Variables

See `.env.example` for the full list. Critical ones:

| Variable                      | Purpose                           |
| ----------------------------- | --------------------------------- |
| `CONVEX_DEPLOYMENT`           | Convex project identifier         |
| `NEXT_PUBLIC_CONVEX_URL`      | Public Convex endpoint            |
| `OPENAI_API_KEY`              | AI content generation             |
| `GOOGLE_CLIENT_ID` / `SECRET` | OAuth for GA4/GSC                 |
| `STRIPE_SECRET_KEY`           | Payment processing                |
| `STRIPE_WEBHOOK_SECRET`       | Stripe event verification         |
| `PHOO_BETA_PASSWORD`          | Production beta gate              |
| `AUTH_RESEND_KEY`             | Transactional emails              |
| `CREDENTIAL_ENCRYPTION_KEY`   | AES-256-GCM credential encryption |

---

## 2. Daily Workflow

### Start of Session

```bash
# 1. Read project status
cat PROJECT_STATUS.md
cat ROADMAP.md

# 2. Pull latest
git checkout main
git pull origin main

# 3. Create feature branch
git checkout -b feat/your-feature-name

# 4. Start dev servers
npx convex dev          # Terminal 1
npm run dev             # Terminal 2
```

### Before Every Commit

```bash
# Type check (MUST PASS)
npx tsc --noEmit --skipLibCheck

# Full build verification (recommended for larger changes)
npm run build

# Run tests
npm test
```

### Commit Convention

```
type(scope): description

Types: feat, fix, refactor, docs, chore, test
Scope: mobile, auth, studio, admin, convex, api, ui
```

Examples:

```bash
git commit -m "feat(studio): add content type selector to create flow"
git commit -m "fix(security): harden rate limiting with per-user keying"
git commit -m "refactor(nav): extract HamburgerButton component"
```

### PR Workflow

```bash
# Push branch
git push -u origin feat/your-feature-name

# Create PR at GitHub (Qodo auto-reviews)
# Address Qodo findings before requesting human review
# Merge via GitHub, then pull main locally
```

---

## 3. Code Standards

### Component Rules

```tsx
// Component Hierarchy: App > Layout > Navigation > MobileNav
// Every component file starts with its location in the tree

'use client'; // Only if component uses hooks/interactivity

import { FC } from 'react';

interface Props {
  // Always named "Props" — never "MobileNavProps"
  brandColor?: string;
  variant?: 'dark' | 'light';
}

export const MobileNav: FC<Props> = ({ brandColor = '#FF9D00', variant = 'dark' }) => {
  // ...
};
```

**Rules**:

- One component per file
- Props interface always named `Props`
- Component hierarchy comment at the top
- No inline styles — use Chakra props or design system
- No emojis in code — use icons from `react-icons`
- When prop drilling, pass the whole object down and destructure in the child
- Never return more data than the UI requires

### TypeScript Rules

- **Zero `as any`** without justification comment
- **No implicit `any`** parameters
- Use branded types where appropriate (see Theo Principle KI)
- Validate all inputs with Zod or Convex validators

### Security Rules

- Sanitize all output and input
- Treat the browser as a hostile environment
- Never expose private data
- Auth checks on every protected route
- CSRF tokens on state-changing operations
- All new schema tables MUST have RLS rules in `convex/lib/rls.ts`

### Convex Rules

- After editing `convex/schema.ts`, ALWAYS run `npx convex dev --once`
- Mutations/queries must have proper validation
- No sensitive data in logs
- Rate limits on expensive operations
- Use `internalAction()` for test utilities (never public `action()`)

---

## 4. Available Commands

### Development

| Command                 | Purpose                  |
| ----------------------- | ------------------------ |
| `npm run dev`           | Start Next.js dev server |
| `npx convex dev`        | Start Convex dev watcher |
| `npx convex dev --once` | One-shot schema push     |

### Quality

| Command                           | Purpose                   |
| --------------------------------- | ------------------------- |
| `npx tsc --noEmit --skipLibCheck` | Type check (gate)         |
| `npm run build`                   | Production build (gate)   |
| `npm test`                        | Run Vitest test suite     |
| `npm run test:watch`              | Watch mode                |
| `npm run test:coverage`           | Coverage report           |
| `npm run lint`                    | ESLint check              |
| `npm run lint:fix`                | Auto-fix lint issues      |
| `npm run format`                  | Prettier format all files |
| `npm run format:check`            | Check formatting          |

### Deployment

| Command                | Purpose                        |
| ---------------------- | ------------------------------ |
| `npm run build:vercel` | Convex codegen + Next.js build |
| `npm run deploy`       | PowerShell deploy script       |
| `npx convex deploy`    | Deploy Convex to production    |

---

## 5. Agent Workflows

AI-assisted workflows live in `.agent/workflows/`. Use them with `/slash-command` syntax:

| Command               | Purpose                                                                    |
| --------------------- | -------------------------------------------------------------------------- |
| `/bod`                | Board of Directors consultation before major decisions                     |
| `/code-review`        | Pre-commit checklist (type safety, build, DRY, security)                   |
| `/code-standards`     | Pre-flight before writing code                                             |
| `/debugging-workflow` | Systematic debugging (4-phase: root cause → pattern → hypothesis → fix)    |
| `/martai`             | Full development workflow (refresh → research → plan → implement → verify) |
| `/security-rules`     | Security rules checklist before any mutation/query                         |
| `/security-audit`     | Full security audit before release                                         |
| `/convex-migration`   | Schema changes with data migration                                         |
| `/feature-flag`       | Safe feature flag rollout                                                  |
| `/performance`        | Performance investigation                                                  |
| `/network-security`   | API security patterns                                                      |

---

## 6. Directory Conventions

### Where to Put Things

| What                    | Where                                           |
| ----------------------- | ----------------------------------------------- |
| New route               | `app/your-route/page.tsx`                       |
| New component           | `src/components/your-feature/YourComponent.tsx` |
| Shared UI primitives    | `src/components/shared/`                        |
| Convex backend function | `convex/your-module.ts`                         |
| Convex internal helpers | `convex/lib/`                                   |
| React hooks             | `lib/hooks/`                                    |
| API routes              | `app/api/your-endpoint/route.ts`                |
| Test files              | `__tests__/` or colocated as `*.test.ts`        |
| MDX content             | `content/resources/your-article.mdx`            |
| Documentation           | `docs/`                                         |
| Agent workflows         | `.agent/workflows/`                             |
| Board personas          | `docs/personas/`                                |

### Naming Conventions

| Type          | Convention              | Example                  |
| ------------- | ----------------------- | ------------------------ |
| Components    | PascalCase              | `MobileNav.tsx`          |
| Hooks         | camelCase, `use` prefix | `useProject.ts`          |
| Utils         | camelCase               | `dateUtils.ts`           |
| Constants     | SCREAMING_SNAKE         | `RATE_LIMIT_TIERS`       |
| Schema tables | camelCase               | `contentPieces`          |
| API routes    | kebab-case directories  | `app/api/seo-agent/`     |
| Branches      | `type/description`      | `feat/mobile-navigation` |

---

## 7. Integration Development

### Adding a New CMS Integration

1. Create connection component in `src/components/settings/YourCMSConnect.tsx`
2. Add OAuth flow in `app/api/oauth/your-cms/`
3. Create Convex integration module in `convex/integrations/yourCms.ts`
4. Add publishing action in `convex/publishing/`
5. Add platform connection type to `convex/integrations/platformConnections.ts`
6. Add "Need help?" tooltip linking to resource article
7. Update CMS capability matrix in KI

### Adding a New AI Provider

1. Add provider config in `convex/ai/providers/`
2. Register in AI router (`convex/ai/router/`)
3. Add health monitoring in `convex/ai/health/`
4. Add fallback chain ordering
5. Add API key to environment variables

---

## 8. Testing Guide

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# Single file
npx vitest run convex/contentGeneration.test.ts
```

### Writing Tests

```typescript
// Use convex-test for integration tests
import { convexTest } from 'convex-test';
import schema from '../convex/schema';

test('should enforce rate limits per user', async () => {
  const t = convexTest(schema);
  // Test the use case, not the implementation
  // Mock at boundaries (external APIs), not internals
});
```

**Philosophy** (Kent C. Dodds Testing Trophy):

- Mostly integration tests (highest confidence/effort ratio)
- Test use cases, not implementation details
- Mock external APIs at the boundary
- Static analysis (TypeScript) catches the rest

---

## 9. Troubleshooting

### Common Issues

| Problem                           | Solution                                                            |
| --------------------------------- | ------------------------------------------------------------------- |
| `convex dev` won't start          | Check for zombie processes on port 3210                             |
| Type errors after schema change   | Run `npx convex dev --once` to regenerate types                     |
| Build fails with circular imports | Check barrel exports in `convex/index.ts`                           |
| OAuth callback fails              | Verify `GOOGLE_CLIENT_ID` in both `.env.local` and Convex dashboard |
| Rate limiting too aggressive      | Check `rateLimits.ts` tier configuration                            |
| Content not appearing in calendar | Verify `scheduledDate` is set on contentPiece                       |

### PowerShell Gotchas (Windows)

- **No `&&`**: Use `;` or separate commands
- **No `export`**: Use `$env:VAR = "value"`
- **Path separators**: Use `/` in Git Bash, `\` in PowerShell

---

## 10. Key Files Quick Reference

| File                                  | Purpose                         | Lines |
| ------------------------------------- | ------------------------------- | ----- |
| `convex/schema.ts`                    | Database schema (58 tables)     | 1766  |
| `convex/contentGeneration.ts`         | AI content pipeline             | 776   |
| `convex/lib/rls.ts`                   | Row-level security rules        | ~500  |
| `convex/lib/rbac.ts`                  | Role-based access control       | ~200  |
| `convex/rateLimits.ts`                | Tier-based rate limiting        | ~300  |
| `middleware.ts`                       | Edge security + routing         | ~216  |
| `convex/phoo/agent/phoo.ts`           | AI assistant prompts            | ~300  |
| `convex/phoo/industryTemplates.ts`    | 15+ industry content templates  | ~800  |
| `lib/apiSecurity.ts`                  | API route security middleware   | ~300  |
| `src/components/Navigation/index.tsx` | Main navigation (context-aware) | ~440  |

---

_Keep this guide up to date when workflows or conventions change._
