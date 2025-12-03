# Ticket: Test Rate Limiter Implementation

## Priority: Medium
## Status: TODO
## Assigned To: Team
## Created: 2025-12-02

---

## Description

Manually test the rate limiter implementation to verify that rate limits are correctly enforced across all AI operations and user tiers.

---

## Prerequisites

- ✅ Rate limiter integration complete
- ✅ Convex build successful
- ✅ All AI operations protected

---

## Test Scenarios

### 1. Test Brief Generation Rate Limits

**Free Tier (3/day)**
- [ ] Create a test user with `membershipTier: "free"`
- [ ] Generate 3 briefs successfully
- [ ] Attempt 4th brief generation
- [ ] Verify error message: "Rate limit exceeded. You can generate 3 briefs per day..."
- [ ] Verify retry time is displayed
- [ ] Wait for rate limit reset (or manually reset in Convex dashboard)
- [ ] Verify can generate again after reset

**Starter Tier (10/day)**
- [ ] Create test user with `membershipTier: "starter"`
- [ ] Generate 10 briefs successfully
- [ ] Verify 11th attempt is blocked

**Admin Tier (100/hour)**
- [ ] Create test user with `role: "admin"`
- [ ] Verify can generate many briefs rapidly
- [ ] Verify higher limits apply

---

### 2. Test Draft Generation Rate Limits

**Free Tier (3/day)**
- [ ] Generate 3 drafts successfully
- [ ] Verify 4th attempt is blocked
- [ ] Check error message clarity

**Pro Tier (100/day)**
- [ ] Test higher tier limits
- [ ] Verify appropriate rate limit applied

---

### 3. Test Keyword Clustering Rate Limits

**Free Tier (5/day)**
- [ ] Generate 5 keyword clusters
- [ ] Verify 6th attempt is blocked

---

### 4. Test Quarterly Plan Rate Limits

**Free Tier (1/day)**
- [ ] Generate 1 quarterly plan
- [ ] Verify 2nd attempt is blocked
- [ ] Check that error message is user-friendly

---

### 5. Test AI Analysis Rate Limits

**Free Tier (2/day)**
- [ ] Run AI analysis 2 times
- [ ] Verify 3rd attempt is blocked

---

### 6. Test Per-User Isolation

- [ ] Create User A and User B (both free tier)
- [ ] User A hits rate limit (3 briefs)
- [ ] Verify User B can still generate briefs
- [ ] Confirm rate limits are per-user, not global

---

### 7. Test Error Handling in UI

- [ ] Trigger rate limit in frontend
- [ ] Verify error alert displays correctly
- [ ] Verify retry time is shown in minutes
- [ ] Check that error doesn't crash the app
- [ ] Verify user can continue using other features

---

### 8. Test Rate Limit Reset

- [ ] Hit rate limit for an operation
- [ ] Wait for time window to pass (or manually reset)
- [ ] Verify user can perform operation again
- [ ] Check that counter resets properly

---

## Manual Testing Steps

### Setup Test Users

```javascript
// In Convex dashboard, run this mutation to create test users
// Or use the admin panel to set membership tiers

// Free tier user
await ctx.db.insert("users", {
  email: "test-free@example.com",
  name: "Test Free User",
  membershipTier: "free",
  role: "user"
});

// Starter tier user
await ctx.db.insert("users", {
  email: "test-starter@example.com",
  name: "Test Starter User",
  membershipTier: "starter",
  role: "user"
});

// Admin user
await ctx.db.insert("users", {
  email: "test-admin@example.com",
  name: "Test Admin User",
  role: "admin"
});
```

### Check Rate Limit Status

In Convex dashboard, you can view rate limit state in the `rateLimiter` component tables.

---

## Expected Results

- ✅ All rate limits enforce correctly per tier
- ✅ Error messages are clear and user-friendly
- ✅ Retry times are accurate
- ✅ Per-user isolation works
- ✅ No crashes or unexpected behavior
- ✅ Rate limits reset properly

---

## Known Issues

None yet - this is the first test pass.

---

## Notes

- Rate limits use both token bucket and fixed window strategies
- Token bucket allows bursts (capacity parameter)
- Fixed window is stricter for daily limits
- Admin tier is for testing and has generous limits

---

## Acceptance Criteria

- [ ] All test scenarios pass
- [ ] No bugs found in rate limiting logic
- [ ] Error messages are clear and helpful
- [ ] UI handles rate limit errors gracefully
- [ ] Documentation is accurate

---

## Related Files

- [convex/rateLimits.ts](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/convex/rateLimits.ts)
- [convex/content/briefActions.ts](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/convex/content/briefActions.ts)
- [convex/content/draftActions.ts](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/convex/content/draftActions.ts)
- [convex/seo/keywordActions.ts](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/convex/seo/keywordActions.ts)
- [convex/content/quarterlyPlanActions.ts](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/convex/content/quarterlyPlanActions.ts)
- [convex/ai/analysis.ts](file:///c:/Users/josia/Desktop/Anti_MartAI/MartAI/convex/ai/analysis.ts)
