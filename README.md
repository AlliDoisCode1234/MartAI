# Phoo

**AI-Powered SEO Automation for Small Businesses**

Phoo (powered by MartAI) helps small businesses grow their online presence with intelligent content strategy, automated keyword research, and AI-generated content — all without needing to be an SEO expert.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AlliDoisCode1234/MartAI)

---

## What is Phoo?

Phoo is a unified Content Studio that automates the entire SEO workflow:

- **Strategy** — AI-generated keyword clusters and topic planning
- **Calendar** — Zero-click content calendar with automated scheduling
- **Library** — Centralized content management with status tracking
- **Create** — AI-powered brief and draft generation
- **Insights** — Analytics and performance tracking

### Built For

- Small businesses under $500k annual revenue
- Solopreneurs and small marketing teams
- Non-SEO experts who need results, not tools

---

## Tech Stack

| Layer    | Technology                                        |
| -------- | ------------------------------------------------- |
| Frontend | Next.js 15, React 19, Chakra UI                   |
| Backend  | Convex (realtime database + serverless functions) |
| AI       | OpenAI GPT-4, multi-model routing                 |
| Auth     | Convex Auth (Google OAuth + Email/Password)       |
| Payments | Stripe                                            |
| Hosting  | Vercel + Convex Cloud                             |

---

## Quick Start

```bash
# Install dependencies
npm install

# Start Convex backend (generates types)
npx convex dev

# Start Next.js frontend
npm run dev
```

Visit `http://localhost:3000` to see the landing page.

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_CONVEX_URL=<your convex deployment url>
GOOGLE_CLIENT_ID=<google oauth client id>
GOOGLE_CLIENT_SECRET=<google oauth client secret>
```

See `docs/VERCEL_SETUP.md` for complete deployment guide.

---

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── studio/            # Content Studio (main product)
│   ├── admin/             # Admin portal
│   └── auth/              # Authentication pages
├── convex/                 # Convex backend (queries, mutations, actions)
├── src/components/         # React components
├── lib/                    # Utilities and hooks
└── docs/                   # Documentation
```

---

## Key Features

### Content Studio

The unified workspace for all content operations — Strategy, Calendar, Library, Create, and Insights in one place.

### Zero-Click Automation

Content calendars auto-generate based on industry templates. No manual configuration required.

### MartAI Rating (MR)

Proprietary composite SEO score (0-100) that predicts content performance.

### Multi-Model AI

Intelligent routing across AI models for cost optimization and reliability.

---

## Development

```bash
# Run tests
npm test

# Type check
npm run typecheck

# Lint
npm run lint

# Full build
npm run build
```

---

## Deployment

### Production

Push to `main` branch triggers automatic deployment to Vercel + Convex.

### Environment Setup

1. Connect repository to Vercel
2. Add Convex integration in Vercel
3. Configure environment variables
4. Deploy

---

## Documentation

- [Vercel Setup Guide](./docs/VERCEL_SETUP.md)
- [Project Status](./PROJECT_STATUS.md)
- [Roadmap](./ROADMAP.md)

---

## License

Private repository. All rights reserved.

---

<p align="center">
  <strong>Phoo</strong> — Making SEO accessible for small businesses
</p>
