# Next Steps - Action Plan

## Immediate Priorities (This Week)

### 1. **Phase 0: Infrastructure Foundation** (Critical Path)
**Why**: Without CI/CD and monitoring, we can't safely deploy or debug production issues.

**Tasks**:
- [ ] **Set up CI/CD pipeline** (2-3 days)
  - GitHub Actions or Vercel deployment pipeline
  - Automated tests on PR
  - Staging environment deployment
  - Production deployment workflow
  
- [ ] **Add error tracking** (1 day)
  - Integrate Sentry or similar
  - Add error boundaries to React components
  - Log API errors with context
  
- [ ] **Set up basic monitoring** (1 day)
  - Vercel Analytics (already available)
  - Custom metrics for API response times
  - Uptime monitoring (UptimeRobot/Pingdom)

**Owner**: DevOps/Lead Engineer  
**Timeline**: 3-5 days

---

### 2. **Complete WordPress Publishing** (Blocking MVP)
**Why**: Core feature, partially implemented but missing critical pieces.

**Current State**:
- ✅ Basic publish now works (`/api/publish/now`)
- ✅ Scheduled post trigger exists (`/api/publish/trigger`)
- ❌ No automated scheduler (cron job)
- ❌ No error handling/retry logic
- ❌ No media upload support
- ❌ No comprehensive testing

**Tasks**:
- [ ] **Add error handling & retry logic** (2 days)
  - Wrap publish calls in try-catch with exponential backoff
  - Store failed publishes for retry
  - Add error notifications
  
- [ ] **Set up scheduled post automation** (2 days)
  - Create Convex scheduled function or external cron
  - Call `/api/publish/trigger` daily/hourly
  - Add logging for scheduled publishes
  
- [ ] **Add basic tests** (1 day)
  - Test WordPress client with mock responses
  - Test error scenarios
  - Test scheduled post flow

**Owner**: Backend Engineer  
**Timeline**: 5 days

---

### 3. **Implement Nightly Analytics Sync** (Blocking MVP)
**Why**: Analytics dashboard needs fresh data, currently manual only.

**Current State**:
- ✅ Manual sync endpoint exists (`/api/analytics/sync`)
- ✅ Basic GA4/GSC data fetching works
- ❌ No automated nightly sync
- ❌ Token refresh logic incomplete (TODO in code)
- ❌ No error handling for API failures

**Tasks**:
- [ ] **Complete token refresh logic** (1 day)
  - Fix TODO in `app/api/ga4/properties/route.ts`
  - Implement OAuth token refresh for GA4/GSC
  - Handle expired tokens gracefully
  
- [ ] **Set up automated sync** (2 days)
  - Create Convex scheduled function (runs daily at 2 AM)
  - Or external cron calling `/api/analytics/sync`
  - Sync last 30 days of data
  
- [ ] **Add error handling** (1 day)
  - Retry logic for API failures
  - Dead-letter queue for failed syncs
  - Alert on consecutive failures

**Owner**: Backend Engineer  
**Timeline**: 4 days

---

## Short-term (Next 2 Weeks)

### 4. **SEO Checklist Validation** (MVP Feature)
**Why**: Content quality is core value prop, currently missing.

**Tasks**:
- [ ] **Implement basic SEO checks** (3 days)
  - Title length (50-60 chars)
  - Meta description length (150-160 chars)
  - H1 presence and uniqueness
  - H2 count (minimum 3)
  - Word count (minimum 800)
  - Internal link count
  - Image alt text check
  
- [ ] **Add to draft editor** (1 day)
  - Show checklist in sidebar
  - Real-time validation
  - Block approval if critical checks fail

**Owner**: Full-stack Engineer  
**Timeline**: 4 days

---

### 5. **Type Safety - Critical Paths** (Technical Debt)
**Why**: 92 `as any` instances create risk. Fix critical paths first.

**Priority Files** (auth, publishing, analytics):
- [ ] `app/api/publish/*` - Remove `as any` (1 day)
- [ ] `app/api/analytics/*` - Remove `as any` (1 day)
- [ ] `lib/authMiddleware.ts` - Fix type assertions (0.5 day)
- [ ] `app/api/auth/*` - Fix type issues (0.5 day)

**Owner**: Full-stack Engineer  
**Timeline**: 3 days

---

### 6. **Add Unit Tests for Critical Paths** (Quality)
**Why**: Only 3 test files exist. Need coverage for publishing and analytics.

**Tasks**:
- [ ] **Publishing tests** (2 days)
  - WordPress client unit tests
  - Publish API route tests
  - Scheduled post trigger tests
  
- [ ] **Analytics tests** (1 day)
  - Sync endpoint tests
  - KPI calculation tests
  - Insight generation tests

**Owner**: Full-stack Engineer  
**Timeline**: 3 days

---

## Decision Points (This Week)

### 1. **Infrastructure Setup**
- [ ] Choose CI/CD platform (GitHub Actions vs Vercel)
- [ ] Choose error tracking (Sentry vs LogRocket)
- [ ] Set up staging environment URL

### 2. **Scheduled Jobs**
- [ ] Decide: Convex scheduled functions vs external cron
- [ ] Set up cron service if external (Vercel Cron, EasyCron, etc.)

### 3. **Team Capacity**
- [ ] Confirm team size for Phase 1A
- [ ] Assign owners to each task
- [ ] Set up daily standups

---

## Success Criteria (End of Week 1)

- [ ] CI/CD pipeline running (tests on PR, auto-deploy staging)
- [ ] Error tracking capturing errors
- [ ] WordPress publishing with error handling
- [ ] Nightly analytics sync running
- [ ] Basic SEO checklist in draft editor
- [ ] Critical path type safety fixed
- [ ] Unit tests for publishing (60%+ coverage)

---

## Blockers & Risks

### Current Blockers
- None identified - all tasks can start immediately

### Risks
1. **Token refresh complexity** - OAuth refresh may be more complex than estimated
   - **Mitigation**: Start with manual refresh, automate later
   
2. **Scheduled jobs setup** - Convex scheduled functions may need investigation
   - **Mitigation**: Use external cron as fallback (Vercel Cron)

3. **Team availability** - Need to confirm engineer availability
   - **Mitigation**: Prioritize Phase 0 + WordPress completion first

---

## Recommended Sprint Structure

### Sprint 1 (Week 1): Foundation + Core Features
- Phase 0: Infrastructure (3-5 days)
- WordPress publishing completion (5 days)
- Nightly analytics sync (4 days)

### Sprint 2 (Week 2): Quality + Polish
- SEO checklist (4 days)
- Type safety critical paths (3 days)
- Unit tests (3 days)

### Sprint 3 (Week 3): MVP Polish
- Error boundaries
- Loading state standardization
- Integration tests
- Performance optimization

---

## Questions to Answer

1. **Team size**: How many engineers available?
2. **DevOps**: Do we have DevOps support or is it engineering?
3. **Budget**: Budget for error tracking/monitoring tools?
4. **Timeline**: Hard deadline for MVP launch?
5. **Priorities**: If we can only do 3 things, what are they?

---

**Last updated**: 2025-01-XX  
**Next review**: End of Week 1

