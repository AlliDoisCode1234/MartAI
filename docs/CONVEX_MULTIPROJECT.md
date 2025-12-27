# Convex Multi-Project Setup

This guide explains how to use separate Convex projects for development and production.

## Why Separate Projects?

- **Fresh free tier limits** for each project
- **Clean production data** not polluted with test data
- **Safe testing** without affecting real users
- **Easier debugging** with isolated environments

## Setup

### 1. Create a Dev Project

```bash
# From project root
npx convex dev --configure

# When prompted:
# - Select "create a new project"
# - Name it: phoo-dev (or martai-dev)
# - This creates .env.local with the dev project URL
```

### 2. Save Both Project Configurations

After creating both projects, you'll have deployment URLs like:

- Production: `https://your-prod-project.convex.cloud`
- Development: `https://your-dev-project.convex.cloud`

### 3. Switch Between Projects

**Option A: Use npm scripts** (recommended)

Add these to your `package.json`:

```json
{
  "scripts": {
    "dev": "npm run convex:dev & next dev",
    "dev:prod": "CONVEX_DEPLOYMENT=prod npx convex dev & next dev",
    "convex:dev": "npx convex dev",
    "convex:prod": "npx convex deploy"
  }
}
```

**Option B: Use .env files**

Create two env files:

- `.env.local` - Dev project (default)
- `.env.production.local` - Production project

```bash
# .env.local (dev)
CONVEX_DEPLOYMENT=dev
NEXT_PUBLIC_CONVEX_URL=https://your-dev-project.convex.cloud

# .env.production.local (prod)
CONVEX_DEPLOYMENT=prod
NEXT_PUBLIC_CONVEX_URL=https://your-prod-project.convex.cloud
```

## Running Cleanup

After setting up, you can run cleanup on your current project:

### Via Convex Dashboard

1. Go to https://dashboard.convex.dev
2. Select your project
3. Go to Functions > admin/cleanup
4. Click "Run" on `runFullCleanup`
5. Set `dryRun: true` first to preview what will be deleted

### Via CLI

```bash
# Preview what will be deleted (dry run)
npx convex run admin/cleanup:runFullCleanup '{"dryRun": true}'

# Actually delete
npx convex run admin/cleanup:runFullCleanup '{"dryRun": false}'

# Get table counts
npx convex run admin/cleanup:getTableCounts
```

## Best Practices

1. **Always develop on dev project** - Use `npm run dev` default
2. **Deploy to prod separately** - Use `npx convex deploy` for production
3. **Run cleanup weekly** - Keep test data from accumulating
4. **Seed fresh data** - Use seeding scripts for dev instead of copying prod

## Switching Projects Manually

```bash
# Switch to dev project
npx convex dev --configure
# Select your dev project

# Switch to prod project
npx convex deploy --configure
# Select your prod project
```

## Current Projects

| Environment | Project Name | URL                    |
| ----------- | ------------ | ---------------------- |
| Development | phoo-dev     | _configure via CLI_    |
| Production  | martai       | _your current project_ |
