# MartAI Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Convex
```bash
# Initialize Convex (first time only)
npx convex dev

# This will:
# - Create a Convex account if needed
# - Generate deployment URL
# - Set up local development
```

Copy the `NEXT_PUBLIC_CONVEX_URL` from the output and add to `.env.local` in the root directory

### 3. Configure Environment Variables
Create `.env.local`:
```env
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### 4. Run Development Server
```bash
# Terminal 1: Convex dev server
npm run convex:dev

# Terminal 2: Next.js dev server
npm run dev
```

Visit http://localhost:3000

## Convex Schema Setup

The Convex schema is already defined in `convex/schema.ts`. Run `npx convex dev` to push it to your Convex deployment.

## Features Overview

### Customer Intake → Statistics Generation
1. Go to `/onboarding`
2. Fill in business information
3. System automatically:
   - Crawls website
   - Generates SEO audit
   - Creates keyword suggestions
   - Calculates statistics
   - Saves to Convex

### Keyword Generation
1. After onboarding, go to `/keywords`
2. View generated keywords
3. Filter by intent, priority, status
4. Select keywords for page creation

### WordPress/Shopify Integration
1. Go to `/integrations`
2. Connect WordPress or Shopify
3. For WordPress:
   - Create Application Password (Users → Your Profile → Application Passwords)
   - Enter site URL, username, and app password
4. For Shopify:
   - Create Private App with content write permissions
   - Enter shop domain and access token

### Automated Page Creation
1. Go to `/keywords`
2. Select keywords to include
3. Click "Create WordPress Page" or "Create Shopify Page"
4. Enter credentials if not connected
5. Page is automatically created with SEO-optimized content

## Architecture Highlights

- **Convex**: Real-time database, serverless functions
- **AI Agent**: GPT-4o for analysis and content generation
- **Site Crawling**: Cheerio for HTML parsing
- **OAuth**: Application passwords (WordPress), Private apps (Shopify)
- **Automation**: Direct API integration for page creation

## Troubleshooting

### Convex Not Connecting
- Check `NEXT_PUBLIC_CONVEX_URL` is set
- Run `npx convex dev` to ensure deployment is active
- Check Convex dashboard for errors

### WordPress Connection Fails
- Verify Application Password is created correctly
- Check site URL includes https://
- Ensure WordPress REST API is enabled
- Check for security plugins blocking API access

### Shopify Connection Fails
- Verify Private App has `write_content` and `read_content` scopes
- Check shop domain format (mystore.myshopify.com)
- Verify access token is correct

### AI Agent Not Working
- Check `OPENAI_API_KEY` is set
- Verify API key has credits
- Check API rate limits

## Production Deployment

### Vercel
1. Push to GitHub
2. Import project in Vercel
3. Set root directory to `martai` if needed
4. Add environment variables
5. Deploy

### Convex
```bash
npx convex deploy --prod
```

## Next Steps

1. Complete onboarding to generate initial data
2. Review generated keywords
3. Connect WordPress or Shopify
4. Create your first automated service page
5. Monitor rankings and analytics

