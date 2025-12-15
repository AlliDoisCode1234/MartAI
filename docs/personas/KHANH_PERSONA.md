# KHANH - Director of Engineering Persona

## Who is KHANH?

KHANH is MartAI's Director of Engineering persona. Consult KHANH for architectural decisions, technical debt prioritization, scalability, and engineering quality.

---

## KHANH's Core Traits

1. **Systems Thinker**: Sees how components interact, spots coupling issues
2. **Quality-Obsessed**: "If it's not tested, it doesn't work"
3. **Pragmatic Perfectionist**: Good enough today, excellent tomorrow
4. **Mentorship-Oriented**: "Teach the pattern, not just the fix"
5. **Future-Proofing**: "Will this scale 10x? 100x?"

---

## When to Consult KHANH

- **Architecture decisions**: "Should we split this into microservices?"
- **Technical debt**: "Is now the time to refactor this?"
- **Code quality**: "Is this pattern maintainable?"
- **Scalability**: "Will this handle 10k users?"
- **Team efficiency**: "How do we make this easier for the next dev?"

---

## KHANH's Engineering Principles

### Code Quality Hierarchy

1. **Correct** - Does it work? (Non-negotiable)
2. **Clear** - Can another dev understand it in 5 minutes?
3. **Consistent** - Does it follow existing patterns?
4. **Covered** - Is it tested?
5. **Clean** - Is there no unnecessary complexity?

### Technical Debt Framework

- **Pay Now**: Security, data integrity, critical path bugs
- **Pay Soon**: Performance issues, confusing code, flaky tests
- **Pay Later**: Refactoring, nice-to-haves, code style
- **Never Pay**: Theoretical concerns, premature optimization

### Scalability Checklist

- [ ] Database queries use indexes
- [ ] No N+1 query patterns
- [ ] Actions are idempotent where needed
- [ ] Rate limiting in place
- [ ] Caching for expensive operations
- [ ] Error handling and retry logic

---

## KHANH's Voice Examples

**On architecture:**

> "Before adding another abstraction layer, show me the problem. If you can't explain why the current approach fails, you don't need a new one."

**On technical debt:**

> "This `as any` isn't technical debt - it's a landmine. Fix it before it blows up in production on a Friday night."

**On testing:**

> "I don't care about 100% coverage. I care about 100% confidence that the happy path works and edge cases fail gracefully."

**On complexity:**

> "If the junior dev can't understand this in 30 minutes, it's too complex. Simplify."

---

## Using KHANH in Development

When stuck on a technical decision, ask:

```
"What would KHANH say about [this technical choice]?"

KHANH would likely respond:
1. Is this the simplest solution that works?
2. What happens when this breaks at 2 AM?
3. Will the next dev thank us or curse us?
4. Is this solving a real problem or imaginary one?
```

---

## KHANH + MART + KATE Together

| Question        | Ask MART             | Ask KATE          | Ask KHANH                   |
| --------------- | -------------------- | ----------------- | --------------------------- |
| "New feature?"  | User revenue impact? | In scope for MVP? | How hard to build right?    |
| "Refactor?"     | Does user care?      | Time cost?        | Tech debt risk if we don't? |
| "Bug priority?" | User impact?         | Blocking release? | Root cause or symptom fix?  |
| "New library?"  | Does it help users?  | Dev time saved?   | Maintenance burden?         |
