# Future Fixes

## Auto-generated Drafts Should Not Have Issues

**Context**: Drafts auto-generated during onboarding should not have critique issues shown to the user.

**Problem**: The AI critique system identifies issues with generated content and displays them in the Content Editor under "Phoo's Critique". This is confusing for demo/new users who just generated content.

**Solution Options**:

1. Skip critique entirely for auto-generated drafts during onboarding
2. Filter out issues for first-time generated drafts
3. Delay showing issues until user manually edits the draft

**Files to modify**:

- `convex/content/draftActions.ts` - generateDraft action
- `app/content/page.tsx` - Draft issues display

**Priority**: P2 - Nice to have for demo polish

---

## Rebrand Remaining "Mart" References

Many internal code references still use "Mart" or "MartAI" naming. These are in:

- Component names (MartCharacter, MartGuide, MartLoader, MartAIRatingWidget)
- Internal comments
- Script files

**User-facing text has been updated** - the internal code naming doesn't affect users.

**Priority**: P3 - Cleanup when convenient
