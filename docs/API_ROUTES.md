# API Routes Reference

## Overview

**Total Routes**: 46 route files (~60+ endpoints)  
**Organization**: File-based routing in Next.js (`app/api/`)

## Quick Definitions

- **API**: The entire collection (all routes)
- **Route**: A file in `app/api/` that creates a URL path
- **Endpoint**: Route + HTTP Method (what you actually call)

Example:
- **Route file**: `app/api/projects/route.ts`
- **Endpoints**: `GET /api/projects`, `POST /api/projects`

## Route Organization

### Authentication (6 routes) ✅

```
POST   /api/login              - User login
POST   /api/auth/signup        - User registration
POST   /api/auth/logout        - User logout
GET    /api/auth/me            - Current user info
POST   /api/auth/refresh       - Refresh access token
GET    /api/csrf               - Get CSRF token
```

### Projects (1 route) ✅

```
GET    /api/projects           - List user projects
POST   /api/projects           - Create new project
```

### Content Generation (12 routes)

#### Clusters
```
GET    /api/clusters           - List clusters
PATCH  /api/clusters           - Update cluster
POST   /api/clusters/generate  - Generate clusters
POST   /api/clusters/rerank    - Rerank clusters
GET    /api/clusters/status    - Check generation status
```

#### Briefs
```
GET    /api/briefs             - Get brief by ID
POST   /api/briefs/generate    - Generate brief details
POST   /api/briefs/reschedule  - Reschedule brief
GET    /api/briefs/versions    - Get version history
POST   /api/briefs/versions    - Create new version
```

#### Plans
```
GET    /api/plans              - Get quarterly plan
PATCH  /api/plans              - Update plan
POST   /api/plans/generate     - Generate quarterly plan
```

#### Drafts
```
GET    /api/drafts             - Get draft by brief ID
POST   /api/drafts/generate    - Generate draft from brief
```

### Analytics (8 routes)

```
GET    /api/analytics/data     - Get analytics data
GET    /api/analytics/insights - Get AI insights
GET    /api/analytics/kpis     - Get KPI metrics
POST   /api/analytics/sync     - Trigger data sync
GET    /api/ga4/data           - GA4 data
GET    /api/ga4/properties     - GA4 properties
GET    /api/gsc/data           - GSC data
GET    /api/gsc/sites          - GSC sites
```

### Publishing (4 routes)

```
GET    /api/publish            - List scheduled posts
POST   /api/publish            - Create scheduled post
POST   /api/publish/now        - Publish immediately
POST   /api/publish/schedule   - Schedule for later
POST   /api/publish/trigger    - Webhook trigger
```

### Other Routes

```
GET    /api/user/profile       - Get user profile
PATCH  /api/user/profile       - Update user profile
GET    /api/competitors        - List competitors
POST   /api/competitors        - Add competitor
POST   /api/insights/apply     - Apply insight suggestion
POST   /api/seo-agent          - Main AI agent endpoint
GET    /api/demo               - Demo data
GET    /api/test               - Testing endpoint
```

### OAuth Routes (4 routes)

```
GET    /api/oauth/google              - Initiate Google OAuth
GET    /api/oauth/google/callback     - Google callback
POST   /api/oauth/wordpress           - WordPress connection
POST   /api/oauth/shopify             - Shopify connection
```

## Security Implementation

All routes are protected with:
- **JWT Authentication**: Required for all routes
- **Origin Validation**: All GET requests
- **CSRF Protection**: All POST/PATCH/DELETE requests
- **Security Headers**: All responses

See [SECURITY.md](../SECURITY.md) for details.

## Simplification Opportunities

Current structure is well-organized. Optional improvements:

1. **Group Analytics**: Move `/api/ga4/*` and `/api/gsc/*` under `/api/analytics/`
2. **Consolidate Actions**: Use query params or body actions instead of nested routes (optional)

### Example Consolidation (Optional)

**Before:**
```
POST /api/clusters/generate
POST /api/clusters/rerank
```

**After (Alternative):**
```
POST /api/clusters
Body: { action: "generate", ... }
Body: { action: "rerank", ... }
```

**Recommendation**: Keep current structure - it's clear and follows Next.js best practices.

## Route Structure Best Practices

1. ✅ **File-based routing**: One route per file
2. ✅ **Explicit endpoints**: Clear action URLs
3. ✅ **Logical grouping**: Related routes in subdirectories
4. ✅ **HTTP methods**: Use appropriate methods (GET, POST, PATCH, DELETE)
5. ✅ **Security**: All routes protected with authentication and CSRF

