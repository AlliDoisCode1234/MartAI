# MartAI Developer Guide

**Last Updated**: December 1, 2025  
**Purpose**: Guide for developers working on MartAI, covering Convex backend patterns, API routes, and common workflows.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Convex Backend Development](#convex-backend-development)
3. [API Routes Development](#api-routes-development)
4. [Authentication & Security](#authentication--security)
5. [Common Workflows](#common-workflows)
6. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

MartAI uses a **hybrid architecture**:

- **Frontend**: Next.js 15 with App Router (React Server Components + Client Components)
- **Backend**: Convex (serverless database + functions)
- **API Layer**: Next.js API routes (thin wrapper around Convex for authentication)
- **Authentication**: JWT-based auth with tokens stored in localStorage

### Request Flow

```
Client → Next.js API Route → Convex Function → Database
         (Auth middleware)     (Business logic)
```

---

## Convex Backend Development

### Directory Structure

```
convex/
├── _generated/          # Auto-generated TypeScript types
├── schema.ts           # Database schema definitions
├── auth/               # Authentication functions
├── analytics/          # Analytics queries & mutations
├── content/            # Content generation
├── seo/               # SEO & keyword clustering
└── publishing/        # Publishing workflows
```

### 1. Creating Queries

**Queries** are read-only operations that fetch data from the database.

**File**: `convex/projects/projects.ts`

```typescript
import { query } from "./_generated/server";
import { v } from "convex/values";

// Get projects for a user
export const getProjectsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    
    return projects;
  },
});

// Get a single project by ID
export const getProjectById = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    return project;
  },
});
```

**Key Points**:
- Use `query()` from `"./_generated/server"`
- Define `args` with type validation using `v` (Convex validators)
- Access database via `ctx.db`
- Queries are **read-only** - cannot modify data

### 2. Creating Mutations

**Mutations** are write operations that modify database state.

**File**: `convex/projects/projects.ts`

```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Create a new project
export const createProject = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    websiteUrl: v.string(),
    industry: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate input
    if (!args.name || !args.websiteUrl) {
      throw new Error("Name and website URL are required");
    }

    // Insert into database
    const projectId = await ctx.db.insert("projects", {
      userId: args.userId,
      name: args.name,
      websiteUrl: args.websiteUrl,
      industry: args.industry,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return projectId;
  },
});

// Update a project
export const updateProject = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { projectId, ...updates } = args;
    
    await ctx.db.patch(projectId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return projectId;
  },
});

// Delete a project
export const deleteProject = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.projectId);
  },
});
```

**Key Points**:
- Use `mutation()` from `"./_generated/server"`
- Can use `ctx.db.insert()`, `ctx.db.patch()`, `ctx.db.delete()`
- Always update `updatedAt` timestamp when modifying records
- Throw errors for validation failures

### 3. Creating Actions

**Actions** are for side effects like calling external APIs (OpenAI, WordPress, etc.).

**File**: `convex/content/briefs.ts`

```typescript
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Generate a content brief using OpenAI
export const generateBrief = action({
  args: {
    projectId: v.id("projects"),
    clusterId: v.id("clusters"),
    keywords: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Fetch data from database (via internal queries)
    const cluster = await ctx.runQuery(api.seo.clusters.getClusterById, {
      clusterId: args.clusterId,
    });

    // 2. Call external API (OpenAI)
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an SEO content strategist.",
          },
          {
            role: "user",
            content: `Create a content brief for keywords: ${args.keywords.join(", ")}`,
          },
        ],
      }),
    });

    const data = await response.json();
    const briefContent = data.choices[0].message.content;

    // 3. Save result to database (via internal mutation)
    const briefId = await ctx.runMutation(api.content.briefs.createBrief, {
      projectId: args.projectId,
      clusterId: args.clusterId,
      content: briefContent,
      keywords: args.keywords,
    });

    return briefId;
  },
});
```

**Key Points**:
- Use `action()` from `"./_generated/server"`
- Can call external APIs, use `fetch()`, access `process.env`
- Use `ctx.runQuery()` to call Convex queries
- Use `ctx.runMutation()` to call Convex mutations
- Actions **cannot** directly access `ctx.db` - must use queries/mutations

### 4. Database Schema

**File**: `convex/schema.ts`

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    userId: v.id("users"),
    name: v.string(),
    websiteUrl: v.string(),
    industry: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_createdAt", ["createdAt"]),

  users: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_email", ["email"]),
});
```

**Key Points**:
- Define tables with `defineTable()`
- Add indexes with `.index()` for efficient queries
- Use `v.id("tableName")` for foreign keys
- Use `v.optional()` for nullable fields

---

## API Routes Development

### Directory Structure

```
app/api/
├── projects/
│   └── route.ts       # GET, POST /api/projects
├── auth/
│   ├── login/
│   │   └── route.ts   # POST /api/auth/login
│   └── signup/
│       └── route.ts   # POST /api/auth/signup
└── csrf/
    └── route.ts       # GET /api/csrf (deprecated with JWT)
```

### Creating an API Route

**File**: `app/api/projects/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, secureResponse } from '@/lib/authMiddleware';
import { callConvexQuery, callConvexMutation, api } from '@/lib/convexClient';
import { assertProjectId, assertUserId } from '@/lib/typeGuards';

// IMPORTANT: Prevent static generation
export const dynamic = 'force-dynamic';

// GET - List projects
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authUser = await requireAuth(request, {
      requireOrigin: true,
      allowedMethods: ['GET'],
    });

    const userId = assertUserId(authUser.userId);
    
    // Call Convex query
    const projects = await callConvexQuery(api.projects.projects.getProjectsByUser, {
      userId: userId as any,
    });

    const response = NextResponse.json({ projects: projects || [] });
    return secureResponse(response);
  } catch (error: any) {
    console.error('Get projects error:', error);
    
    // Handle auth errors
    if (error.status === 401 && error.response) {
      return error.response;
    }
    
    const response = NextResponse.json(
      { error: 'Failed to get projects' },
      { status: 500 }
    );
    return secureResponse(response);
  }
}

// POST - Create project
export async function POST(request: NextRequest) {
  try {
    // Authenticate user (no CSRF needed with JWT)
    const authUser = await requireAuth(request, {
      requireOrigin: true,
      allowedMethods: ['POST'],
      allowedContentTypes: ['application/json'],
    });

    const body = await request.json();
    const { name, websiteUrl, industry } = body;

    // Validate input
    if (!name || !websiteUrl) {
      const response = NextResponse.json(
        { error: 'name and websiteUrl are required' },
        { status: 400 }
      );
      return secureResponse(response);
    }

    const userId = assertUserId(authUser.userId);
    
    // Call Convex mutation
    const projectId = await callConvexMutation(api.projects.projects.createProject, {
      userId: userId as any,
      name,
      websiteUrl,
      industry: industry || undefined,
    });

    const response = NextResponse.json({
      success: true,
      projectId: projectId.toString(),
    });
    return secureResponse(response);
  } catch (error: any) {
    console.error('Create project error:', error);
    
    if (error.status === 401 && error.response) {
      return error.response;
    }
    
    const response = NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
    return secureResponse(response);
  }
}
```

**Key Points**:
- Always add `export const dynamic = 'force-dynamic'` to prevent static generation
- Use `requireAuth()` for authentication
- Use `secureResponse()` to add security headers
- Call Convex functions via `callConvexQuery()` or `callConvexMutation()`
- Handle errors gracefully with proper status codes

---

## Authentication & Security

### JWT Authentication Flow

1. **Login/Signup**: User submits credentials → API route validates → Returns JWT token
2. **Token Storage**: Frontend stores token in `localStorage`
3. **Authenticated Requests**: Frontend includes token in `Authorization: Bearer <token>` header
4. **Token Validation**: API route validates token via `requireAuth()` middleware

### Security Middleware

**File**: `lib/authMiddleware.ts`

```typescript
import { NextRequest } from 'next/server';

export interface AuthUser {
  userId: string;
  email: string;
}

export interface RequireAuthOptions {
  requireOrigin?: boolean;      // Validate request origin
  allowedMethods?: string[];    // Allowed HTTP methods
  allowedContentTypes?: string[]; // Allowed content types
}

export async function requireAuth(
  request: NextRequest,
  options: RequireAuthOptions = {}
): Promise<AuthUser> {
  // Extract and validate JWT token
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw { status: 401, response: /* ... */ };
  }

  const token = authHeader.substring(7);
  // Validate token, decode, return user
  // ...
}
```

### Important Security Notes

> [!WARNING]
> **CSRF Protection is NOT needed with JWT authentication**
> 
> - JWTs stored in localStorage/sessionStorage are immune to CSRF attacks
> - CSRF attacks cannot execute JavaScript to access tokens
> - Do NOT use `requireCsrf: true` with JWT auth

> [!IMPORTANT]
> **Always use these security practices**:
> 
> - Add `export const dynamic = 'force-dynamic'` to all API routes
> - Use `requireAuth()` for all authenticated endpoints
> - Use `secureResponse()` to add security headers
> - Validate all user input before processing
> - Use `assertUserId()` and `assertProjectId()` for type safety

---

## Common Workflows

### Adding a New Feature

1. **Define Database Schema** (`convex/schema.ts`)
   ```typescript
   myNewTable: defineTable({
     userId: v.id("users"),
     name: v.string(),
     createdAt: v.number(),
   }).index("by_userId", ["userId"]),
   ```

2. **Create Convex Functions** (`convex/myFeature/myFeature.ts`)
   ```typescript
   export const getItems = query({ /* ... */ });
   export const createItem = mutation({ /* ... */ });
   ```

3. **Create API Route** (`app/api/my-feature/route.ts`)
   ```typescript
   export const dynamic = 'force-dynamic';
   export async function GET(request: NextRequest) { /* ... */ }
   export async function POST(request: NextRequest) { /* ... */ }
   ```

4. **Create Frontend Component** (`app/my-feature/page.tsx`)
   ```typescript
   'use client';
   export default function MyFeaturePage() { /* ... */ }
   ```

5. **Test Locally**
   ```bash
   npm run dev        # Start Next.js dev server
   npx convex dev     # Start Convex dev server (separate terminal)
   ```

### Running the Development Environment

```bash
# Terminal 1: Start Convex backend
npx convex dev

# Terminal 2: Start Next.js frontend
npm run dev

# Access app at http://localhost:3000
```

### Building for Production

```bash
# Generate Convex types
npm run convex:codegen

# Build Next.js app
npm run build

# Deploy to Convex
npx convex deploy

# Deploy to Vercel (automatically triggers on git push)
git push origin main
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

---

## Troubleshooting

### Build Errors

#### Error: "Failed to collect page data for /api/..."

**Cause**: API route is missing `export const dynamic = 'force-dynamic'`

**Fix**: Add to the top of the route file:
```typescript
export const dynamic = 'force-dynamic';
```

#### Error: "JWT_SECRET environment variable is required"

**Cause**: Environment variables not set during build

**Fix**: Ensure `.env.local` exists with:
```bash
JWT_SECRET=your-secret-key-here
NEXT_PUBLIC_CONVEX_URL=https://your-convex-url
```

### Convex Errors

#### Error: "Convex not configured"

**Cause**: Convex client not initialized or API not imported correctly

**Fix**: Check that `lib/convexClient.ts` is properly configured and `api` is imported:
```typescript
import { api } from '@/convex/_generated/api';
```

#### Error: "Cannot read property 'db' of undefined"

**Cause**: Trying to use `ctx.db` in an action (actions cannot access database directly)

**Fix**: Use `ctx.runQuery()` or `ctx.runMutation()` instead:
```typescript
// ❌ Wrong (in action)
const data = await ctx.db.query("projects").collect();

// ✅ Correct (in action)
const data = await ctx.runQuery(api.projects.projects.getAll);
```

### Authentication Errors

#### Error: "Invalid or missing CSRF token"

**Cause**: API route has `requireCsrf: true` but frontend isn't sending token

**Fix**: Remove CSRF requirement (not needed with JWT):
```typescript
// ❌ Wrong
const authUser = await requireAuth(request, {
  requireCsrf: true,
});

// ✅ Correct
const authUser = await requireAuth(request, {
  requireOrigin: true,
});
```

### Type Errors

#### Error: "Type 'string' is not assignable to type 'Id<"users">'"

**Cause**: Type mismatch between string and Convex ID type

**Fix**: Use type assertion helpers:
```typescript
import { assertUserId } from '@/lib/typeGuards';

const userId = assertUserId(authUser.userId);
```

---

## Additional Resources

- **Convex Documentation**: https://docs.convex.dev
- **Next.js Documentation**: https://nextjs.org/docs
- **Project Roadmap**: See `ROADMAP.md`
- **API Documentation**: See `docs/API.md` (TODO)

---

**Questions?** Review the codebase examples or check existing implementations in:
- `convex/auth/` - Authentication patterns
- `app/api/projects/` - API route patterns
- `convex/content/` - Content generation patterns
