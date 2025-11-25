# 🔧 MartAI Developer Guide

**Setup, development workflow, and technical documentation for MartAI**

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Convex account (sign up at [convex.dev](https://convex.dev))

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd MartAI

# Install dependencies
npm install

# Set up Convex (generates types and runs backend)
npx convex dev

# In a new terminal, start Next.js dev server
npm run dev
```

Visit `http://localhost:3000` to see the app running.

---

## 📋 Environment Setup

Create `.env.local` in the root directory:

```bash
# Required
NEXT_PUBLIC_CONVEX_URL=<your-convex-deployment-url>
JWT_SECRET=<secure-random-string>
JWT_REFRESH_SECRET=<secure-random-string>

# Optional (for AI features)
OPENAI_API_KEY=<your-openai-api-key>
VERCEL_AI_GATEWAY_KEY=<vercel-ai-gateway-key>  # Alternative to OpenAI

# Optional (for integrations)
GOOGLE_CLIENT_ID=<google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<google-oauth-client-secret>
```

**Generate secure secrets:**
```bash
# On Unix/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

## 🛠️ Development Commands

### Core Commands

```bash
# Development
npm run dev              # Start Next.js dev server (port 3000)
npx convex dev           # Start Convex dev server + auto codegen

# Type Checking
npm run type-check       # TypeScript type checking
npm run type-check:watch # Watch mode for type checking

# Building
npm run build            # Build Next.js app for production
npm run convex:codegen   # Regenerate Convex types only
npm run convex:deploy    # Deploy Convex functions to production

# Testing
npx tsx scripts/testProspectService.ts  # Test prospect intake flow
npx tsx scripts/seedDemoAccount.ts     # Seed demo data

# Utilities
npm run clean            # Clean build artifacts (.next, cache)
npm run server:restart   # Restart both servers (PowerShell script)
```

### Server Restart Helper

```bash
# Windows (PowerShell)
npm run server:restart

# Manual restart
# Terminal 1: npx convex dev
# Terminal 2: npm run dev
```

---

## 🗄️ Database & Seeding

### Seed Demo Data

```bash
# Create admin user + demo account with sample data
npx tsx scripts/seedDemoAccount.ts

# Create admin user only
npx tsx scripts/seedAdmin.ts

# Verify seeded data
npx tsx scripts/verifySeededData.ts
```

**Demo credentials** are printed to console after seeding.

### Convex Schema

- Schema defined in `convex/schema.ts`
- After schema changes, run `npx convex dev` to regenerate types
- Types auto-imported from `convex/_generated/api`

---

## 🏗️ Project Structure

```
MartAI/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (REST endpoints)
│   ├── apply/             # Prospect intake forms
│   ├── admin/             # Admin portal
│   ├── dashboard/          # Customer dashboard
│   └── auth/              # Authentication pages
├── convex/                 # Convex backend
│   ├── _generated/        # Auto-generated types (gitignored)
│   ├── ai/                # AI analysis logic
│   ├── auth/              # Authentication
│   ├── content/           # Content management
│   ├── prospects/         # Prospect CRUD
│   ├── seo/               # SEO tools
│   └── schema.ts          # Database schema
├── lib/                   # Shared libraries
│   ├── auth.ts            # JWT utilities
│   ├── authMiddleware.ts  # Auth middleware
│   ├── apiSecurity.ts     # Security utilities
│   ├── services/         # Service layer (API clients)
│   └── validation/        # Zod schemas
├── types/                 # TypeScript type definitions
├── scripts/               # Utility scripts
└── middleware.ts          # Next.js middleware (security headers)
```

---

## 🔄 Development Workflow

### 1. Making Schema Changes

```bash
# 1. Edit convex/schema.ts
# 2. Run Convex dev (auto-generates types)
npx convex dev

# 3. Types are now available in convex/_generated/api
```

### 2. Creating New API Routes

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, secureResponse } from '@/lib/authMiddleware';
import { callConvexMutation, api } from '@/lib/convexClient';

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth(request, {
      requireOrigin: true,
      requireCsrf: true,
    });
    
    const body = await request.json();
    const result = await callConvexMutation(api.module.function, body);
    
    return secureResponse(NextResponse.json(result));
  } catch (error: any) {
    return secureResponse(
      NextResponse.json({ error: error.message }, { status: 400 })
    );
  }
}
```

### 3. Creating Convex Functions

```typescript
// convex/example/example.ts
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const createExample = mutation({
  args: {
    name: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    return await ctx.db.insert("examples", {
      ...args,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const getExample = query({
  args: { id: v.id("examples") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
```

---

## 🧪 Testing

### Smoke Tests

```bash
# Test prospect intake service
npx tsx scripts/testProspectService.ts

# Test all Convex queries
npx tsx scripts/testAllQueries.ts

# Test strategy data
npx tsx scripts/testStrategyData.ts
```

### Type Checking

```bash
# Full type check
npm run type-check

# Watch mode (auto-check on file changes)
npm run type-check:watch
```

---

## 🐛 Troubleshooting

### Type Errors After Schema Changes

```bash
# Regenerate Convex types
npx convex codegen

# Or restart Convex dev server
npx convex dev
```

### Convex Function Not Found

- Ensure `npx convex dev` is running
- Check function is exported in module
- Verify import path: `api.module.function`

### Auth Issues

- Check JWT secrets in `.env.local`
- Verify token expiration times in `lib/auth.ts`
- Check role assignments in database

### AI Pipeline Failures

- Verify `OPENAI_API_KEY` is set
- Check network connectivity
- Review error logs in Convex dashboard

### Port Already in Use

```bash
# Kill process on port 3000 (Next.js)
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Unix/Mac
lsof -ti:3000 | xargs kill
```

---

## 🔐 Security Best Practices

- **Never commit `.env.local`** - Already in `.gitignore`
- **Use strong JWT secrets** - Generate with openssl or PowerShell
- **Validate all inputs** - Use Zod schemas
- **Use `secureResponse()`** - Adds security headers to all API responses
- **Check auth on protected routes** - Use `requireAuth()` middleware

---

## 📦 Deployment

### Convex Deployment

```bash
# Deploy Convex functions
npx convex deploy

# Or use production URL
CONVEX_DEPLOYMENT=<prod-url> npx convex deploy
```

### Next.js Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

**Recommended:** Deploy to Vercel for automatic deployments and previews.

---

## 📚 Key Concepts

### Authentication Flow

1. User signs up/logs in → JWT tokens generated
2. Access token (15 min) + Refresh token (7 days)
3. Tokens include: `userId`, `username`, `role`
4. Admin login uses separate `/api/admin/login` route

### Prospect Intake Flow

1. Initial form (`/apply`) → Creates `prospects` record
2. Details form (`/apply/details`) → Saves to `prospectDetails` + `submittedUrls`
3. Admin triggers AI analysis → Runs intelligence pipeline
4. AI generates keywords → Stores in `keywordIdeas`
5. Content calendar created → Stores in `contentCalendars`

### Convex Patterns

- **Mutations** - Write operations (insert, update, delete)
- **Queries** - Read operations (get, list, filter)
- **Actions** - External API calls, AI operations
- **HTTP Routes** - Webhooks, scheduled tasks

---

## 🔗 Useful Links

- [Convex Documentation](https://docs.convex.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [Chakra UI Documentation](https://chakra-ui.com)
- [Zod Documentation](https://zod.dev)

---

## 📝 Notes

- Legacy CRA code exists in `src/` and `martai/` directories (excluded from TS checks)
- Admin portal uses separate login flow for security
- Prospect intake supports partial saves (draft status)
- AI pipeline is modular for easy extension
- All API routes use `secureResponse()` for security headers
- Convex codegen must run after schema changes

---

**Happy coding! 🚀**

