# Draft Generation Implementation

## ✅ What's Been Implemented

### Backend (REST API)

1. **`/api/drafts/generate`** - Generate draft from brief
   - AI-powered content generation
   - Quality and tone scoring
   - Word count calculation
   - Issues and strengths analysis
   - Re-generation with notes support

2. **`/api/drafts`** - Draft CRUD
   - GET: Get draft by ID or briefId
   - PATCH: Update draft content
   - POST: Approve draft (locks editing)
   - DELETE: Delete draft

### Convex Functions

**`convex/drafts.ts`**
- `createDraft` - Create new draft
- `getDraftById` - Get single draft
- `getDraftByBrief` - Get draft for brief
- `getDraftsByProject` - List all project drafts
- `updateDraft` - Update draft content/scores
- `approveDraft` - Lock draft for editing
- `deleteDraft` - Remove draft

### Frontend

**`/content`** - Updated with Draft tab
- Tabs: Brief | Draft
- Draft generation button
- Quality/Tone score progress bars
- Word count display
- Issues & strengths alerts
- SEO checklist validation
- Markdown content editor
- Re-generation with notes
- Approve draft button
- Read-only when approved

### AI Draft Generation

**`lib/draftGenerator.ts`**
- `generateDraftFromBrief()` - AI content generation
- `calculateQualityScore()` - Quality metrics (0-100)
- `calculateToneScore()` - Tone assessment (0-100)
- `analyzeDraft()` - Issues and strengths
- `validateDraftSEO()` - SEO checklist

## 🎯 Quality Scoring (0-100)

**Factors:**
- Word count (target 1200-2000): +20
- H2 sections (≥5): +10
- FAQs included: +10
- Internal links (≥3): +10
- Keyword usage (3-10 times): +10

**Base score:** 50

## 🎯 Tone Scoring (0-100)

**Factors:**
- Active voice usage: +10
- Engaging language: +10
- Specific details (numbers, examples): +10

**Base score:** 70

## 📋 User Flow (US-5.1)

1. User opens brief in `/content`
2. Clicks "Generate Draft" (requires H2 outline)
3. AI generates comprehensive markdown content
4. Draft includes:
   - H1 title
   - H2 sections from outline
   - FAQs naturally integrated
   - Internal link placeholders [[topic]]
   - Transparent sections (costs, comparisons)
   - 800-2000 words
5. Quality/tone scores displayed
6. Issues and strengths shown
7. SEO checklist validated
8. User can edit content
9. User can re-generate with notes
10. User approves draft (locks editing)
11. Brief status updates to "approved"

## ✅ Acceptance Criteria Met

**US-5.1: Generate draft from brief**
✅ Click Generate Draft → job starts
✅ Status shown (loading, completed)
✅ Markdown draft appears
✅ Draft includes headings
✅ Transparent sections (cost/problems/comparisons)
✅ Internal link placeholders
✅ Quality/tone score displayed
✅ Can re-generate with notes

**US-5.2: Edit and approve draft** (partial)
✅ Word count displayed
✅ SEO checklist
✅ Approve locks draft
✅ Status = Approved
⏳ Rich editor (markdown textarea, can be enhanced)
⏳ Brand tone meter (tone score shown)

## 🎯 MVP P0 Progress

**Completed**: 7/10 features (70%)
- ✅ Authentication
- ✅ GA4 OAuth
- ✅ GSC OAuth
- ✅ Keyword Clustering
- ✅ Quarterly Planning
- ✅ Brief Editor
- ✅ Draft Generation

**Next**: Scheduling (US-6.1) or Analytics Dashboard (US-7.1)

## 📝 Next Steps

1. **Rich Text Editor** - Replace textarea with WYSIWYG
2. **Brand Tone Meter** - Visual tone analysis
3. **Version History** - Track draft versions
4. **Export** - Export to Word/PDF
5. **Publishing** - Schedule/publish to CMS

