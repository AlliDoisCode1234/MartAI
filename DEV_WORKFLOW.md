# MartAI Development Workflow

## Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Convex account
- OpenAI API key
- Google OAuth credentials

### Initial Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
# Required
NEXT_PUBLIC_CONVEX_URL=your_convex_url
OPENAI_API_KEY=your_openai_key
JWT_SECRET=your_jwt_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/oauth/google/callback

# Optional
SHOPIFY_API_KEY=
SHOPIFY_API_SECRET=
```

### Convex Setup

```bash
# Initialize Convex (first time)
npx convex dev

# This will:
# - Create convex.json
# - Generate _generated/ types
# - Start dev server
```

## Development

### Start Development Server

```bash
# Terminal 1: Convex dev server
npx convex dev

# Terminal 2: Next.js dev server
npm run dev
```

### Available Scripts

```bash
npm run dev          # Start Next.js dev server
npm run build        # Production build
npm run clean        # Clean .next and cache
npm run build:clean  # Clean then build
npm test             # Run tests
npm run test:watch   # Watch mode tests
npm run deploy       # Build, commit, push (PowerShell)
```

### Project Structure

```
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── auth/              # Auth pages
│   ├── onboarding/        # Customer intake
│   ├── strategy/          # Clusters & planning
│   ├── content/           # Brief & draft editor
│   ├── publish/          # Scheduling
│   └── analytics/        # Dashboard
├── convex/                # Convex backend
│   ├── schema.ts         # Database schema
│   ├── *.ts              # Mutations & queries
│   └── _generated/       # Auto-generated
├── lib/                   # Utilities
│   ├── typeGuards.ts     # Type validation
│   ├── convexClient.ts   # Convex client
│   └── *.ts              # Feature utils
├── src/components/        # React components
└── types/                # TypeScript types
    └── index.ts          # Centralized types
```

## Development Practices

### Type Safety
- Use `assert*` for required fields (throws on invalid)
- Use `parse*` for optional fields (returns null)
- Pass whole objects to components
- No `as any` casting
- Validate at API boundaries

### Code Organization
- Centralized types in `types/index.ts`
- Type guards in `lib/typeGuards.ts`
- Feature utilities in `lib/`
- Components receive whole objects
- Extract fields internally

### API Routes
- Validate input with type guards
- Use `requireAuth` middleware
- Return proper HTTP status codes
- Handle errors gracefully
- Use `apiLocal` for Convex calls

### Convex Functions
- Mutations for writes
- Queries for reads
- Actions for external APIs
- HTTP actions for cron triggers
- Use `@ts-nocheck` only when necessary

## Testing

### Run Tests
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
```

### Test Structure
```
__tests__/
  ├── lib/            # Unit tests
  ├── api/            # Integration tests
  └── components/     # Component tests
```

### Writing Tests
- Unit tests for utilities
- Integration tests for API routes
- Mock Convex calls
- Test type guards
- Test error handling

## Building

### Clean Build
```bash
npm run clean         # Remove .next and cache
npm run build         # Production build
```

### Build Issues
- Run `npm run clean` if build fails
- Check for `as any` usage
- Verify Convex types are generated
- Check environment variables

## Deployment

### Vercel Deployment
1. Push to `main` branch
2. Vercel auto-deploys
3. Set environment variables in Vercel dashboard
4. Root directory: `.` (not `martai`)

### Convex Deployment
```bash
npx convex deploy
```

### Deployment Script
```bash
# PowerShell
.\scripts\deploy.ps1

# Bash
./scripts/deploy.sh
```

Script does:
1. Clean build artifacts
2. Run `npm run build`
3. Git add, commit, push

## Troubleshooting

### Convex Types Not Generated
```bash
npx convex dev
# Wait for _generated/ files
```

### Build Errors
```bash
npm run clean
npm run build
```

### Type Errors
- Check `lib/typeGuards.ts` usage
- Verify `types/index.ts` imports
- Run `npm run build` to see errors

### Module Not Found
- Check import paths
- Verify Convex is initialized
- Run `npm install`

## Git Workflow

### Branching
- `main` - Production
- Feature branches for new work

### Commits
- Clear, descriptive messages
- Reference issue numbers
- Group related changes

### Push to Main
```bash
git add .
git commit -m "Description"
git push origin main
```

## Code Review Checklist

- [ ] No `as any` casting
- [ ] Type guards used for validation
- [ ] Whole objects passed to components
- [ ] Error handling implemented
- [ ] Tests added/updated
- [ ] Build passes
- [ ] No console.logs in production code

