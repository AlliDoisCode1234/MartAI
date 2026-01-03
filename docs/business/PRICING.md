# MartAI Pricing Guide

## Unit Economics & Cost Transparency

### What You're Actually Paying For

We believe in radical transparency. Here's exactly what goes into each plan and what you're getting for your money.

### TODO: Update convex/subscriptions/subscription.ts with the new plans

#### Starter Plan ($49/mo)

**What's Included:**

- **1 Project** (URL) - Deep dive into one main property
- 100 Keyword Analyses per month
- 2 AI-Generated Articles per month
- Basic SEO Audit
- GA4 & Google Search Console Integration

**Our Costs (Internal Est.):**

- OpenAI API: ~$0.16/mo
- Database/Infra: ~$0.20/mo
- **Total Direct Cost**: ~$0.36/mo
- **Gross Margin**: ~99%

---

#### Growth Plan ($149/mo) - MOST POPULAR

**What's Included:**

- **3 Projects** (URLs) - Perfect for small portfolio or client set
- 500 Keyword Analyses per month
- 8 AI-Generated Articles per month (2 per week)
- Advanced SEO Audit
- WordPress Integration
- Competitor Analysis

**Our Costs (Internal Est.):**

- OpenAI API: ~$0.65/mo
- Database/Infra: ~$0.50/mo
- **Total Direct Cost**: ~$1.15/mo
- **Gross Margin**: ~99%

---

#### Enterprise / Agency (Custom Pricing)

**Status**: Review Required - **Contact Sales**
**What's Included:**

- **Unlimited Projects**
- Custom Keyword & Article Volume
- White-label Reports
- Priority Support & SLA
- Dedicated Account Manager

**Sales/Cost Note:**

- Base cost per project: ~$0.10/mo (Storage) + Usage
- Recommended Floor Price: $500/mo minimum
- **Call to Action**: "Contact our Sales Team to curate a plan for your needs."

---

## Token Usage Breakdown

### How AI Pricing Works

We use OpenAI's GPT-4o model for all content generation and analysis. Here's the exact token usage:

**Growth Plan Example** (500 keywords + 8 articles):

- **Keyword Analysis**: 25,000 tokens
  - Input: Keyword + competitor data = ~50 tokens per keyword
  - Output: Analysis, difficulty, intent = ~50 tokens per keyword
  - **Our cost**: $0.125 (at $0.005/1k tokens)
  - **Your cost**: $0.30 per analysis
- **Article Generation**: 61,200 tokens total
  - Input: Brief, outline, context = ~3,000 tokens per article
  - Output: 2,000-word article = ~2,650 tokens per article
  - **Our cost**: $0.52 (mixed input/output pricing)
  - **Your cost**: $18.62 per article

**Why the markup?**

1. **Infrastructure**: Hosting, database, monitoring, backups
2. **R&D**: Continuous prompt engineering, model fine-tuning
3. **Support**: Onboarding, troubleshooting, feature requests
4. **Risk Management**: API rate limits, model deprecation, data security
5. **Product Development**: New features, integrations, improvements

---

## Database Storage Economics

### Convex Backend Costs

We use Convex for our database, which scales automatically with your usage.

**Storage Per Customer:**

- **Starter**: ~500KB (5 projects × 100KB each)
- **Growth**: ~3MB (20 projects × 150KB each)
- **Scale**: ~10MB (50 avg projects × 200KB each)

**What's Stored:**

- Project metadata (URL, industry, settings)
- Keyword data (search volume, difficulty, trends)
- Analytics snapshots (GA4/GSC data)
- Content briefs and drafts
- SEO audit results

**Our Costs at Scale:**

- 1,000 customers: $25/mo (Starter tier) = $0.025/customer
- 10,000 customers: $100/mo (Pro tier) = $0.01/customer
- **Economies of scale improve as we grow**

---

## Competitive Analysis

### How We Compare

| Feature              | MartAI (Growth) | Jasper + SurferSEO | MarketMuse   | Clearscope |
| -------------------- | --------------- | ------------------ | ------------ | ---------- |
| **Price**            | $149/mo         | $128/mo            | $600/mo      | $170/mo    |
| **Keyword Research** | ✅ 500/mo       | ❌                 | ✅ Unlimited | ✅ Limited |
| **AI Content**       | ✅ 8 articles   | ✅ Unlimited\*     | ❌           | ❌         |
| **SEO Audit**        | ✅ Advanced     | ⚠️ Basic           | ✅ Advanced  | ✅ Basic   |
| **Publishing**       | ✅ WordPress    | ❌                 | ❌           | ❌         |
| **Analytics**        | ✅ GA4/GSC      | ❌                 | ⚠️ Limited   | ❌         |
| **All-in-One**       | ✅              | ❌ (2 tools)       | ❌           | ❌         |

\*Jasper charges extra for SEO optimization

### Why Customers Choose MartAI

1. **All-in-One Platform**: No need to juggle multiple tools
2. **50-75% Cheaper**: Than buying SEO + Writing tools separately
3. **SMB-Focused**: Built for businesses under $500k/year
4. **Transparent Pricing**: No hidden fees, clear limits
5. **Modern Stack**: Fast, reliable (Next.js + Convex)
6. **Data Ownership**: You own all content and data

---

## Pricing Strategy Rationale

### Why These Price Points?

#### Starter ($49/mo) - Entry Point

**Target**: Solo bloggers, new businesses, side projects

- **Competitor Comparison**: Jasper ($39) + SurferSEO ($89) = $128/mo
- **Our Value**: Full SEO + AI writing for 62% less
- **Use Case**: Testing the waters, 1-2 blog posts per month
- **Lifetime Value**: $588/year × 2.5 years avg = $1,470

#### Growth ($149/mo) - Sweet Spot

**Target**: Growing businesses, small agencies, content teams

- **Competitor Comparison**: Frase ($114) or MarketMuse ($600)
- **Our Value**: 2 articles/week = consistent content calendar
- **Use Case**: Serious about SEO, scaling content production
- **Lifetime Value**: $1,788/year × 3 years avg = $5,364

#### Scale ($399/mo) - Power Users

**Target**: Agencies, enterprise content teams, high-volume publishers

- **Competitor Comparison**: MarketMuse ($600-1,200), BrightEdge ($1,000+)
- **Our Value**: Daily content + unlimited projects for 60% less
- **Use Case**: Managing multiple clients or brands
- **Lifetime Value**: $4,788/year × 4 years avg = $19,152

---

## Annual vs Monthly Pricing

### Save 20% with Annual Billing

| Plan    | Monthly | Annual  | Savings   |
| ------- | ------- | ------- | --------- |
| Starter | $59/mo  | $49/mo  | $120/year |
| Growth  | $179/mo | $149/mo | $360/year |
| Scale   | $479/mo | $399/mo | $960/year |

**Benefits of Annual:**

- 2 months free
- Lock in current pricing (we may increase prices)
- Priority support queue
- Early access to new features

---

## Add-Ons & Upgrades

### Usage-Based Add-Ons (Coming Soon)

**Extra Articles**: $15/article

- Need more than your plan allows? Buy individual articles
- Same quality, same SEO optimization
- No commitment, pay as you go

**Extra Keywords**: $20/100 keywords

- Seasonal campaigns or new product launches
- One-time purchase, use within 30 days

**White-Label Reports**: $50/mo (Growth+)

- Remove MartAI branding
- Add your agency logo
- Custom domain for client portals

**Priority Support**: $99/mo (Starter/Growth)

- 1-hour response time (vs 24 hours)
- Dedicated Slack channel
- Monthly strategy call

---

## Frequently Asked Questions

### How do keyword limits work?

Each plan includes monthly keyword analysis credits. For example, Growth gives you 500 keyword analyses per month—enough to research 5-10 content clusters. Unused credits don't roll over.

### What counts as an "AI Article"?

Each AI article is a 1,500-2,500 word SEO-optimized blog post, complete with:

- Meta title and description
- H2/H3 heading structure
- Internal linking suggestions
- FAQ schema markup
- Keyword optimization

You can regenerate or edit before publishing.

### Can I upgrade or downgrade anytime?

**Yes!**

- **Upgrades**: Instant access to new features, prorated billing
- **Downgrades**: Take effect at end of billing cycle
- **Annual plans**: Can upgrade mid-term with prorated pricing

### Do you offer refunds?

We offer a **14-day money-back guarantee** on all plans. If you're not satisfied, email us within 14 days of your first payment for a full refund—no questions asked.

### What happens if I exceed my limits?

- **Soft limits**: We'll notify you at 80% usage
- **Hard limits**: Features pause until next billing cycle
- **Upgrade option**: Instant upgrade available anytime
- **No overage fees**: We never surprise you with extra charges

### Do you offer discounts?

- **Annual billing**: 20% off (2 months free)
- **Nonprofits**: 30% off (verification required)
- **Students**: 50% off Starter plan (verification required)
- **Agencies**: Custom pricing for 5+ clients

---

## Enterprise & Custom Solutions

### Need More Than Scale?

We offer custom plans for:

- **Large agencies** (10+ clients)
- **Publishing networks** (100+ articles/month)
- **Enterprise teams** (custom integrations)

**Custom Features:**

- Dedicated account manager
- Custom API access
- White-label platform
- On-premise deployment (coming 2026)
- SLA guarantees
- Custom training sessions

**Contact Sales**: enterprise@martai.com

---

## Fair Use Policy

### What We Consider Fair Use

Our pricing is based on typical usage patterns. Here's what we expect:

**Starter Plan:**

- 5 active projects
- 100 keyword analyses/month
- 2 articles/month
- ~1,000 database queries/month

**Growth Plan:**

- 20 active projects
- 500 keyword analyses/month
- 8 articles/month
- ~5,000 database queries/month

**Scale Plan:**

- 50 active projects (avg)
- 2,000 keyword analyses/month
- 20 articles/month
- ~20,000 database queries/month

**What's Not Fair Use:**

- Reselling access to third parties
- Automated scraping or bulk exports
- Sharing accounts across teams (use our team features)
- Generating content for spam or manipulation

We monitor for abuse and will reach out if we see unusual patterns.

---

## Roadmap & Future Pricing

### Upcoming Features (No Price Increase)

**Q1 2025:**

- Webflow integration
- Advanced competitor tracking
- Content calendar drag-and-drop

**Q2 2025:**

- Shopify integration
- Multi-language support
- Team collaboration features

**Q3 2025:**

- Custom AI training (your brand voice)
- Advanced analytics dashboard
- API access (Scale plan)

### Price Lock Guarantee

**Annual subscribers** are locked in at their current rate for the duration of their subscription, even if we increase prices.

**Monthly subscribers** will receive 60 days notice before any price changes.

---

## Getting Started

### How to Choose the Right Plan

**Choose Starter if:**

- You're just starting with SEO
- You publish 1-2 blog posts per month
- You have 1-5 websites to manage
- You want to test the platform

**Choose Growth if:**

- You're serious about content marketing
- You want a consistent publishing schedule (2/week)
- You manage 5-20 websites or clients
- You need WordPress integration

**Choose Scale if:**

- You're an agency or content team
- You publish daily or near-daily
- You manage 20+ websites or clients
- You need white-label capabilities

**Still not sure?** Start with a **14-day money-back guarantee** and upgrade anytime.

---

## Contact & Support

**Sales Questions**: sales@martai.com  
**Technical Support**: support@martai.com  
**Feature Requests**: feedback@martai.com

**Response Times:**

- Starter: 24 hours
- Growth: 12 hours
- Scale: 4 hours
- Enterprise: 1 hour (SLA)

---

_Last updated: December 2, 2025_
