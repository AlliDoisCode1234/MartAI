import {
  a as o,
  b as a
} from "./K33OSGN4.js";
import {
  c as e,
  e as s
} from "./4U34M3I6.js";
import {
  a as t
} from "./RUVYHBJQ.js";

// convex/phoo/contentTypes.ts
s();
var d = {
  wordCount: 750,
  faqCount: 3,
  mainKeywordCount: 4,
  secondaryKeywordCount: 2,
  internalLinks: 3,
  metaDescription: { min: 150, max: 160 },
  keywordInFirst100Words: !0,
  imageWithAltText: !0,
  refreshInterval: "6-12 months",
  indexViaGSC: !0
}, l = [
  "homepage",
  "about",
  "service",
  "blog",
  "blogVersus",
  "leadMagnet",
  "paidProduct",
  "landing",
  "areasWeServe",
  "employment",
  "mentorship",
  "donate",
  "events",
  "partner",
  "program",
  "contentRefresh",
  "blogVideo"
], m = e.union(
  e.literal("homepage"),
  e.literal("about"),
  e.literal("service"),
  e.literal("blog"),
  e.literal("blogVersus"),
  e.literal("leadMagnet"),
  e.literal("paidProduct"),
  e.literal("landing"),
  e.literal("areasWeServe"),
  e.literal("employment"),
  e.literal("mentorship"),
  e.literal("donate"),
  e.literal("events"),
  e.literal("partner"),
  e.literal("program"),
  e.literal("contentRefresh"),
  e.literal("blogVideo")
), n = {
  homepage: {
    id: "homepage",
    name: "Homepage Optimization",
    description: "SEO-optimized homepage copy with value proposition and trust signals",
    wordCount: 500,
    priority: 1,
    frequency: "once",
    promptTemplate: `Optimize the homepage for {{companyName}}.
Title: "{{title}}"

Target keywords: {{keywords}}

Requirements:
- 400-600 words
- Clear value proposition in first paragraph
- Main service offerings listed
- Trust signals and social proof
- Primary CTA
- Use main keyword in H1 and first 100 words

Return JSON: { content, metaDescription, cta, h1 }`
  },
  about: {
    id: "about",
    name: "About Page",
    description: "Company/founder story page with team introduction",
    wordCount: 600,
    priority: 2,
    frequency: "once",
    promptTemplate: `Write an About page for {{companyName}}.
Title: "{{title}}"

Target keywords: {{keywords}}

Requirements:
- 500-700 words
- Tell the company/founder story
- Establish expertise and credibility (E-E-A-T)
- Include team highlights if applicable
- Personal, authentic tone
- CTA to contact or learn more

Return JSON: { content, metaDescription, cta }`
  },
  service: {
    id: "service",
    name: "Service Page",
    description: "Individual service description with benefits focus",
    wordCount: 1e3,
    priority: 3,
    frequency: "asNeeded",
    promptTemplate: `Optimize content for the service page on {{companyName}} website.
Title: "{{title}}"

Target keywords: {{keywords}}

Requirements:
- 800-1200 words
- Focus on benefits and outcomes, not just features
- Include 3 FAQ questions with clear answers
- Write compelling meta description (150-160 characters)
- Use main keyword 4 times, secondary keywords twice
- Include strong call to action
- Link to related services

Return JSON: { content, metaDescription, faqs: [{question, answer}], cta }`
  },
  blog: {
    id: "blog",
    name: "Blog Post",
    description: "Educational content piece for organic traffic",
    wordCount: 1200,
    priority: 5,
    frequency: "monthly",
    promptTemplate: `Write a {{wordCount}}-word blog post titled "{{title}}" for {{companyName}}.

Target keywords (use each naturally):
{{keywords}}

Requirements:
- Include 3 FAQ questions with clear answers
- Write a compelling meta description (150-160 characters)
- Use the main keyword in the first 100 words
- Include a strong call to action
- Use H2 and H3 subheadings
- Write for humans first, search engines second
- Educational yet engaging tone
- Include actionable takeaways

Return JSON: { content, metaDescription, faqs: [{question, answer}], cta, outline: [h2s] }`
  },
  blogVersus: {
    id: "blogVersus",
    name: "Versus Blog",
    description: "Competitor comparison post",
    wordCount: 1200,
    priority: 6,
    frequency: "quarterly",
    promptTemplate: `Write a comparison blog post: "{{title}}" for {{companyName}}.

Target keywords: {{keywords}}

Requirements:
- 1000-1500 words
- Objective comparison with fair pros/cons
- Clear differentiators for {{companyName}}
- Include comparison table
- End with clear recommendation
- Meta description mentioning both companies

Return JSON: { content, metaDescription, comparisonTable: [[headers], [row1], [row2]], cta }`
  },
  leadMagnet: {
    id: "leadMagnet",
    name: "Lead Magnet Page",
    description: "Gated content landing page for lead capture",
    wordCount: 500,
    priority: 4,
    frequency: "quarterly",
    promptTemplate: `Write a lead magnet landing page for {{companyName}}.
Title: "{{title}}"

Target keywords: {{keywords}}

Requirements:
- 400-600 words
- Clear value proposition for the free resource
- Bullet points of what they'll learn/get
- Build urgency without being pushy
- Simple opt-in form description
- Trust signals

Return JSON: { content, metaDescription, bulletPoints: [], cta }`
  },
  paidProduct: {
    id: "paidProduct",
    name: "Paid Product Page",
    description: "Monetized content product sales page",
    wordCount: 800,
    priority: 7,
    frequency: "asNeeded",
    promptTemplate: `Write a product sales page for {{companyName}}.
Title: "{{title}}"

Target keywords: {{keywords}}

Requirements:
- 700-900 words
- Clear product description and benefits
- What's included section
- Social proof / testimonials placeholder
- FAQ section (3 questions)
- Price justification
- Strong purchase CTA

Return JSON: { content, metaDescription, whatsIncluded: [], faqs: [{question, answer}], cta }`
  },
  landing: {
    id: "landing",
    name: "Landing Page",
    description: 'High-conversion "near me" or campaign landing page',
    wordCount: 600,
    priority: 4,
    frequency: "asNeeded",
    promptTemplate: `Write a landing page for {{companyName}}.
Title: "{{title}}"

Target keywords: {{keywords}}

Requirements:
- 500-700 words
- Conversion-focused copy
- Clear single CTA
- Benefits over features
- Local relevance if geo-targeted
- Trust signals

Return JSON: { content, metaDescription, cta }`
  },
  areasWeServe: {
    id: "areasWeServe",
    name: "Areas We Serve",
    description: "Geo-targeted service area page",
    wordCount: 400,
    priority: 4,
    frequency: "asNeeded",
    promptTemplate: `Write a location-specific service page for {{companyName}}.
Title: "{{title}}"
Location: {{location}}

Target keywords: {{keywords}}

Requirements:
- 350-500 words
- Local relevance and landmarks
- Services available in this area
- Contact information for this location
- Local testimonial placeholder

Return JSON: { content, metaDescription, cta }`
  },
  employment: {
    id: "employment",
    name: "Employment Page",
    description: "Job recruitment and career opportunity page",
    wordCount: 800,
    priority: 6,
    frequency: "asNeeded",
    promptTemplate: `Write an employment/careers page for {{companyName}}.
Title: "{{title}}"

Target keywords: {{keywords}}

Requirements:
- 700-900 words
- Job description and requirements
- Benefits of working at company
- Company culture highlights
- Application process
- Clear apply CTA

Return JSON: { content, metaDescription, requirements: [], benefits: [], cta }`
  },
  mentorship: {
    id: "mentorship",
    name: "Mentorship Page",
    description: "Program or mentor opportunity page",
    wordCount: 600,
    priority: 6,
    frequency: "once",
    promptTemplate: `Write a mentorship program page for {{companyName}}.
Title: "{{title}}"

Target keywords: {{keywords}}

Requirements:
- 500-700 words
- Program structure and benefits
- Who it's for
- How to apply/participate
- Success stories placeholder

Return JSON: { content, metaDescription, cta }`
  },
  donate: {
    id: "donate",
    name: "Donate Page",
    description: "Non-profit donation page",
    wordCount: 400,
    priority: 5,
    frequency: "once",
    promptTemplate: `Write a donation page for {{companyName}}.
Title: "{{title}}"

Target keywords: {{keywords}}

Requirements:
- 350-500 words
- Impact statement (what donations accomplish)
- Donation tiers if applicable
- Tax deduction information
- Urgency without manipulation
- Clear donate CTA

Return JSON: { content, metaDescription, impactStatement, cta }`
  },
  events: {
    id: "events",
    name: "Events Page",
    description: "Event listings and registration page",
    wordCount: 500,
    priority: 5,
    frequency: "monthly",
    promptTemplate: `Write an events page for {{companyName}}.
Title: "{{title}}"

Target keywords: {{keywords}}

Requirements:
- 400-600 words
- Event types and formats
- Who should attend
- Benefits of attending
- Registration CTA
- Past event highlights

Return JSON: { content, metaDescription, eventTypes: [], cta }`
  },
  partner: {
    id: "partner",
    name: "Partner Page",
    description: "B2B partnership opportunity page",
    wordCount: 600,
    priority: 6,
    frequency: "once",
    promptTemplate: `Write a partnership page for {{companyName}}.
Title: "{{title}}"

Target keywords: {{keywords}}

Requirements:
- 500-700 words
- Partnership benefits
- Types of partners sought
- Success stories placeholder
- Partnership application process
- Contact CTA

Return JSON: { content, metaDescription, partnerTypes: [], cta }`
  },
  program: {
    id: "program",
    name: "Program Page",
    description: "Curriculum or program description page",
    wordCount: 800,
    priority: 4,
    frequency: "asNeeded",
    promptTemplate: `Write a program description page for {{companyName}}.
Title: "{{title}}"

Target keywords: {{keywords}}

Requirements:
- 700-900 words
- Program overview and goals
- Curriculum/structure details
- Who it's for
- Outcomes and success metrics
- Enrollment CTA

Return JSON: { content, metaDescription, curriculum: [], outcomes: [], cta }`
  },
  contentRefresh: {
    id: "contentRefresh",
    name: "Content Improvement",
    description: "Refresh and optimize existing content",
    wordCount: 750,
    priority: 7,
    frequency: "quarterly",
    promptTemplate: `Improve and optimize existing content for {{companyName}}.
Title: "{{title}}"

Target keywords: {{keywords}}

Current content to optimize:
{{existingContent}}

Requirements:
- Maintain existing structure where effective
- Improve keyword optimization
- Add missing H2/H3 structure
- Update outdated information
- Strengthen CTA
- Improve meta description

Return JSON: { content, metaDescription, changes: [], cta }`
  },
  blogVideo: {
    id: "blogVideo",
    name: "Blog + YouTube",
    description: "Combined blog post and video script",
    wordCount: 1200,
    priority: 6,
    frequency: "monthly",
    promptTemplate: `Write a blog post with accompanying video script for {{companyName}}.
Title: "{{title}}"

Target keywords: {{keywords}}

Requirements:
- Blog: 1000-1400 words
- Video script: 3-5 minute read
- Both should complement each other
- Include video embed placeholder
- FAQs for both

Return JSON: { blogContent, videoScript, metaDescription, faqs: [{question, answer}], cta }`
  }
}, u = o({
  args: {},
  handler: /* @__PURE__ */ t(async () => Object.values(n), "handler")
}), g = o({
  args: {
    typeId: e.string()
  },
  handler: /* @__PURE__ */ t(async (i, r) => n[r.typeId] || null, "handler")
}), y = a({
  args: {},
  handler: /* @__PURE__ */ t(async () => Object.values(n).sort((i, r) => i.priority - r.priority), "handler")
});

export {
  d as a,
  l as b,
  m as c,
  n as d,
  u as e,
  g as f,
  y as g
};
//# sourceMappingURL=T2KGGNQC.js.map
