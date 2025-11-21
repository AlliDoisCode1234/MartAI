# Additional Services Proposal

## Unfurling/Social Preview Service

### What is "Unfurling"?
When links are shared on social media (Twitter, LinkedIn, Facebook), platforms fetch metadata to create rich previews with images, titles, and descriptions. This is called "unfurling" or "link preview."

### Why It Matters for SEO
- **Social shares drive traffic** - Better previews = more clicks
- **Brand consistency** - Professional previews build trust
- **Click-through rates** - Rich previews get 2-3x more clicks
- **SEO signal** - Social engagement can influence rankings

### Current State
We already check for OG tags in `lib/siteCrawler.ts` but don't:
- Generate/fix missing OG tags
- Validate OG tag quality
- Test actual social previews
- Auto-generate OG images
- Provide unfurling reports

### Proposed Service: "Social Preview Optimizer"

**Features:**
1. **Audit existing OG tags** - Check all pages for proper Open Graph, Twitter Cards
2. **Generate missing tags** - AI-powered OG tag generation from content
3. **Preview testing** - Test how links look on Twitter, LinkedIn, Facebook
4. **Image optimization** - Generate/suggest OG images (1200x630px)
5. **Bulk fix** - Auto-update CMS with proper tags
6. **Monitoring** - Alert when previews break or look bad

**Implementation:**
- New epic: "Social & Sharing Optimization"
- Add to SEO audit: OG tag checks
- Brief editor: Include OG title/description fields
- Publishing: Auto-generate OG tags if missing
- New page: `/social-preview` with preview tester
- API: `/api/social/preview` - test URL preview
- API: `/api/social/generate` - generate OG tags

**User Story:**
- **US-10.1** As a user, I can audit my site's social previews
- **US-10.2** As a user, I can generate optimized OG tags for my content
- **US-10.3** As a user, I can test how my links look on social platforms
- **US-10.4** As a user, I can auto-fix missing/broken OG tags across my site

---

## Accessibility Service

### Why Accessibility Matters for SEO
- **WCAG compliance** - Required for many clients/government
- **SEO benefit** - Google considers accessibility signals
- **Broader audience** - 15% of population has disabilities
- **Legal compliance** - ADA, Section 508 requirements
- **Better UX** - Accessible sites rank better

### Current State
We check for:
- Missing alt text on images (in `lib/siteCrawler.ts`)
- Basic mobile-friendliness

We DON'T check for:
- ARIA labels
- Keyboard navigation
- Color contrast
- Heading hierarchy
- Form labels
- Focus management
- Screen reader compatibility

### Proposed Service: "Accessibility Auditor"

**Features:**
1. **WCAG compliance audit** - Level A, AA, AAA checks
2. **Automated testing** - axe-core, Lighthouse accessibility
3. **Color contrast checker** - Validate text/background ratios
4. **Keyboard navigation test** - Ensure all interactive elements accessible
5. **Screen reader simulation** - Test with NVDA/JAWS
6. **Fix suggestions** - AI-powered recommendations
7. **Bulk fixes** - Auto-add missing alt text, ARIA labels
8. **Compliance reports** - Generate WCAG audit reports

**Implementation:**
- New epic: "Accessibility & Compliance"
- Add to SEO audit: Accessibility section
- Brief editor: Accessibility checklist
- Content editor: Real-time a11y warnings
- New page: `/accessibility` with audit dashboard
- API: `/api/accessibility/audit` - run WCAG checks
- API: `/api/accessibility/fix` - suggest fixes
- Integration: axe-core, pa11y, Lighthouse

**User Story:**
- **US-11.1** As a user, I can run WCAG compliance audits on my site
- **US-11.2** As a user, I can see accessibility issues with fix suggestions
- **US-11.3** As a user, I can auto-fix common issues (alt text, ARIA labels)
- **US-11.4** As a user, I can generate compliance reports for stakeholders

---

## Recommendation

**Both services fit perfectly into MartAI's SEO automation platform:**

1. **Natural extension** - We already audit sites, these are deeper audits
2. **AI-powered** - Can use GPT-4o to generate OG tags, suggest a11y fixes
3. **CMS integration** - Can auto-fix issues via WordPress/Shopify/Webflow
4. **Value-add** - Differentiates from basic SEO tools
5. **Revenue opportunity** - Premium features or add-on services

**Priority:**
- **P1 (Post-MVP)**: Social Preview Optimizer - easier to implement, immediate value
- **P2**: Accessibility Auditor - more complex, requires specialized tools

**Implementation Approach:**
1. Start with audit/reporting (no CMS changes)
2. Add AI-powered suggestions
3. Build CMS auto-fix capabilities
4. Add monitoring/alerts

Both align with MartAI's mission: "Automate SEO workflows from audit to publishing."

