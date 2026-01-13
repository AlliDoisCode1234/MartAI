<p align="center">
  <img src="./public/images/phoo-logo-orange.png" alt="Phoo Logo" width="200" />
</p>

<h1 align="center">Phoo</h1>

<p align="center">
  <strong>AI-Powered SEO Automation for Small Businesses</strong>
</p>

<p align="center">
  <a href="https://phoo.ai">Website</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#features">Features</a> •
  <a href="./docs/VERCEL_SETUP.md">Deployment</a>
</p>

---

## What is Phoo?

Phoo helps small businesses grow their online presence with intelligent content strategy, automated keyword research, and AI-generated content — all without needing to be an SEO expert.

### Built For

- Small businesses under $500k annual revenue
- Solopreneurs and small marketing teams
- Non-SEO experts who need results, not tools

---

## Features

| Feature      | Description                                           |
| ------------ | ----------------------------------------------------- |
| **Strategy** | AI-generated keyword clusters and topic planning      |
| **Calendar** | Zero-click content calendar with automated scheduling |
| **Library**  | Centralized content management with status tracking   |
| **Create**   | AI-powered brief and draft generation                 |
| **Insights** | Analytics and performance tracking                    |

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

Visit `http://localhost:3000` to see the app.

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_CONVEX_URL=<your convex deployment url>
GOOGLE_CLIENT_ID=<google oauth client id>
GOOGLE_CLIENT_SECRET=<google oauth client secret>
```

---

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── studio/            # Content Studio (main product)
│   ├── admin/             # Admin portal
│   └── auth/              # Authentication pages
├── convex/                 # Convex backend
├── src/components/         # React components
└── lib/                    # Utilities and hooks
```

---

## Development

```bash
npm test          # Run tests
npm run typecheck # Type check
npm run lint      # Lint
npm run build     # Production build
```

---

## Documentation

- [Deployment Guide](./docs/VERCEL_SETUP.md)
- [Project Status](./PROJECT_STATUS.md)
- [Roadmap](./ROADMAP.md)

---

<p align="center">
  <strong>Phoo</strong> — Making SEO accessible for small businesses
</p>
