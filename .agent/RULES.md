# RULES

After editing `convex/schema.ts`, ALWAYS run: `npx convex dev --once`
PowerShell doesn't support `&&` - use separate commands or semicolons
Prefer Convex components over custom solutions (check `convex.config.ts` first)
Available components: @convex-dev/auth, rate-limiter, action-cache, workflow
OAuth flows need `projectId` - ensure project exists before OAuth step
Combined scopes (GA4+GSC) = better UX with single consent screen
Store refresh tokens, implement token refresh logic
OAuth is separate from app auth - users sign in with their Analytics account
Canvas animations: use `requestAnimationFrame` with proper cleanup
Use refs for animation state (not useState) to avoid re-renders
Add `overflow: visible` when animations need to expand beyond container
Prefer smooth easing (smoothstep) for dreamy, ambient effects
Start each session by reading `PROJECT_STATUS.md` and `ROADMAP.md`
Update `PROJECT_STATUS.md` after significant work completion
Commit with conventional format: `type(scope): description`
Types: feat, fix, refactor, docs, chore, test
Use STYLES_GUIDE.md for new styles.
/bod is our board of directors, always refer to them

## Security Rules (MANDATORY)

Every mutation requires `auth.getUserId(ctx)` - throw 'Unauthorized' if null
Every mutation requires ownership check or RBAC access
Use `requireProjectAccess(ctx, projectId, role)` for project operations
Use `requireAdmin(ctx)` or `requireSuperAdmin(ctx)` for admin operations
Never trust client-provided userId - always derive from `auth.getUserId(ctx)`
Never return more data than the UI requires - use field filtering
Never expose private data: passwords, tokens, keyHash, internal IDs
Never log sensitive data: emails, tokens, args, full user objects
OK to log: document IDs, operation names, sanitized errors, counts
Rate limit expensive AI operations before execution
Never hardcode secrets - use `process.env.SECRET_NAME`
Prefix client-exposed vars with `NEXT_PUBLIC_`
Use /security-rules workflow before implementing mutations
Sanitize all input and output
Treat the browser as a hostile environment
Use `queryWithRLS`/`mutationWithRLS` from `convex/lib/rls.ts` for new endpoints

## Identity Naming Convention

- `me` = logged-in user's data (`useMe()`, `api.users.me`)
- `identity` = auth session (`auth.getUserId(ctx)`)
- `user` = other users (`getUser(id)` for admins)

## MART Persona & Product Decisions

Consult the Board of Directors via /bod workflow before major decisions
Board members are defined in `docs/personas/*_PERSONA.md` files (see /bod for full list)
Ask: "What would the Board say?" for features, pricing, architecture, scope, testing, design, sales
Target customer: Small businesses <$500k/yr, solopreneurs, non-SEO experts
No free tier - 2 paid tiers + enterprise CTA (contact sales)
Use Polar for billing integration (not Stripe)
