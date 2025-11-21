# Editor & AI Technology Recommendations

## Current State
- **Draft Editor**: Basic markdown `Textarea` component
- **AI**: Already using `@ai-sdk/openai` with `ai` package
- **Backend**: Convex for reactive database
- **Stack**: Next.js + Chakra UI

## Recommendation: Use **Lexical** for Rich Text Editor

### Why Lexical (https://lexical.dev/)

**✅ Best fit for your use case:**

1. **Framework Agnostic** - Works with React (you're on Next.js)
   - Official React bindings available
   - Easy integration with Chakra UI

2. **Production Ready** - Built by Meta, used in production
   - Reliable, well-tested
   - Active maintenance and community

3. **Extensible** - Perfect for SEO features
   - Can add plugins for:
     - Word count (already needed)
     - SEO checklist validation
     - Internal link placeholders `[[topic]]`
     - Heading structure validation
     - Meta tag preview

4. **Accessible** - WCAG compliant
   - Important for content editors
   - Screen reader support

5. **Fast & Lightweight** - Minimal bundle size
   - Doesn't include unnecessary features
   - Plugin-based architecture

6. **Markdown Support** - Can render/edit markdown
   - Your AI generates markdown
   - Can display as rich text, edit as markdown
   - Best of both worlds

### Implementation Plan

```typescript
// Install
npm install lexical @lexical/react @lexical/markdown @lexical/utils

// Key plugins for your MVP:
- @lexical/rich-text (bold, italic, headings)
- @lexical/list (bullets, numbered)
- @lexical/link (internal link placeholders)
- Custom plugin for SEO validation
- Custom plugin for word count
- Custom plugin for brand tone meter
```

### Why NOT Replit for this?

**Replit Agent** (https://replit.com/) is:
- ✅ Great for **building** the app (development assistance)
- ❌ NOT a runtime dependency for your app
- ❌ Not a rich text editor
- ✅ Could use it to help implement Lexical faster

**Use Replit if:**
- You want AI assistance to implement Lexical
- Rapid prototyping new features
- But you're already 80% done with MVP

### Why NOT other editors?

**TipTap** - Good alternative, but:
- More opinionated
- Larger bundle
- Lexical is more flexible for custom SEO features

**Slate** - Older, less maintained
**Draft.js** - Deprecated by Meta in favor of Lexical

## Recommendation for AI

**Keep your current setup:**
- ✅ `@ai-sdk/openai` - Already working well
- ✅ `ai` package from Vercel - Great DX
- ✅ Convex for backend - Perfect fit
- ✅ No need for Replit's AI (it's for building, not runtime)

**Consider adding:**
- Streaming responses for draft generation
- Better error handling
- But current stack is solid

## Action Plan

1. **Implement Lexical** for MVP-8 (Rich Text Editor)
   - Replace markdown Textarea
   - Add word count plugin
   - Add SEO checklist plugin
   - Add brand tone meter (custom plugin)
   - Keep markdown export for CMS publishing

2. **Keep current AI stack** - It's working well

3. **Optional**: Use Replit Agent to help implement Lexical faster
   - Could prompt: "Implement Lexical rich text editor with word count, SEO validation, and markdown support"

## Conclusion

**Use Lexical** for the rich text editor - it's the clear winner for your SEO content editing needs.

**Don't use Replit** as a runtime dependency - it's a development tool, not a library.

**Keep your AI stack** - `@ai-sdk/openai` + Convex is perfect.

