---
description: Board Of Directors - Consult the virtual advisory team before major decisions
---

# Board of Directors Consultation

Read and consult these personas before major decisions:

## The Board Members

### MART - SEO Expert (docs/MART_PERSONA.md)

- Focus: User value, revenue impact, market fit
- Frameworks: E-E-A-T, SMART goals, content strategy
- Ask: "Will this increase user revenue? Is it simpler than competitors?"

### KATE - Product Owner (docs/KATE_PERSONA.md)

- Focus: Scope, prioritization, sprint planning, Agile/Scrum
- Frameworks: MoSCoW, RICE, WSJF, story points, velocity
- Ask: "Is this P0/P1/P2/P3? What fits in this sprint? Definition of Done?"

### PAIGE - Product Manager (docs/PAIGE_PERSONA.md)

- Focus: Problem validation, user personas, requirements, roadmaps
- Frameworks: User stories, acceptance criteria, MVP definition, success metrics
- Ask: "What problem does this solve? Who has this problem? What's the success metric?"

### KHANH - Dir Engineering (docs/KHANH_PERSONA.md)

- Focus: Architecture, quality, scalability, tech debt
- Frameworks: DORA metrics, ADRs, code quality hierarchy
- Ask: "Is this the simplest solution? What happens when it breaks?"

### BILL - CFO (docs/BILL_PERSONA.md)

- Focus: ROI, costs, unit economics
- Frameworks: CAC, LTV, 3:1 ratio, payback period (<12 months)
- Ask: "What's the cost? What's the expected return? Payback period?"

### SAM - QA Engineer (docs/SAM_PERSONA.md)

- Focus: Edge cases, testing, correctness, documentation
- Frameworks: ISTQB, BVA, Given-When-Then, exploratory testing
- Ask: "What are all the edge cases? Is this tested? Docs match code?"

### LAURA - UI/UX Designer (docs/LAURA_PERSONA.md)

- Focus: Usability, accessibility, design system
- Frameworks: Nielsen's 10 Heuristics, WCAG 2.2 AA, 8px grid
- Ask: "Is it accessible? Does it follow our design system? What's the cognitive load?"

### BARRY - Sales Manager (docs/BARRY_PERSONA.md)

- Focus: Pricing, competition, sales strategy
- Frameworks: Objection handling, competitive intel, pricing psychology
- Ask: "Will customers pay? What objections will we get? How does this compare?"

### THEO - TypeScript Wizard (docs/THEO_PERSONA.md)

- Focus: Type safety, branded types, `as any` justifications
- Frameworks: Branded types, type guards, generic constraints
- Ask: "Is this type-safe? Is `as any` documented? Could branded types help?"

---

## Consultation Process

1. **State the decision** you need to make
2. **Get input from each persona** based on their focus area
3. **Document the decision** with rationale from Board input
4. **Proceed** with the Board-approved approach

## Board Decision Template

```markdown
## Board Review: [Decision Name]

**Context**: [Brief description of decision]

### MART says:

> [Revenue impact? User value? Market fit?]

### KATE says:

> [In scope? Story points? Sprint capacity? Priority?]

### PAIGE says:

> [Problem validated? User story defined? Success metrics clear?]

### KHANH says:

> [Tech debt? Complexity? Maintainability? DORA impact?]

### BILL says:

> [Cost? ROI? Payback period? LTV:CAC impact?]

### SAM says:

> [Edge cases? Tests? Documentation accuracy?]

### LAURA says:

> [Usable? Accessible? Follows design system?]

### BARRY says:

> [Will customers pay? Competitive position? Sales objections?]

### THEO says:

> [Type safe? `as any` justified? Branded types used?]

**Decision**: [Final decision]
**Rationale**: [Why, based on Board input]
**Confidence**: [0.0-1.0 based on Board consensus]
```

---

## Context & Confidence Building

The Board builds institutional knowledge over time. After each decision:

1. **Log the decision** to `docs/BOARD_DECISIONS.md`
2. **Rate confidence** (0.0-1.0) based on Board consensus
3. **Track outcomes** - Was the decision correct? Update confidence.
4. **Reference prior decisions** - "See Board Decision #12" in future reviews

### Confidence Scoring

| Score   | Meaning         | Board State                          |
| ------- | --------------- | ------------------------------------ |
| 0.9-1.0 | High confidence | All personas agree, prior success    |
| 0.7-0.8 | Good confidence | Most agree, some concerns noted      |
| 0.5-0.6 | Moderate        | Split board, needs monitoring        |
| 0.3-0.4 | Low             | Major concerns, proceed with caution |
| 0.0-0.2 | Very low        | Reconsider decision                  |

### Prior Decisions Reference

Before making a new decision, check `docs/BOARD_DECISIONS.md` for:

- Similar past decisions
- Patterns that worked/failed
- Confidence trends by domain

This builds **institutional memory** so the Board gets smarter over time.
