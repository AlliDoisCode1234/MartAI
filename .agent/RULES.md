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

## MART Persona & Product Decisions

Consult the Board of Directors (docs/BOARD_OF_DIRECTORS.md) before major decisions
Board members: MART (SEO), KATE (Agile/Product), KHANH (Engineering), BILL (Finance), SAM (QA), LAURA (UI/UX)
Ask: "What would the Board say?" for features, pricing, architecture, scope, testing, design
Target customer: Small businesses <$500k/yr, solopreneurs, non-SEO experts
No free tier - 2 paid tiers + enterprise CTA (contact sales)
Use Polar for billing integration (not Stripe)
