---
description: Board Of Directors - Consult the virtual advisory team before major decisions
---

# Board of Directors Consultation

Read and consult these personas before major decisions.

> **Note**: Board members are discovered dynamically from `docs/personas/*_PERSONA.md` files.
> To add a new board member, create a new `docs/personas/NAME_PERSONA.md` file following the existing format.

## The Board Members (15 Total)

### C-Suite Leadership

#### ALEX - CEO (docs/ALEX_PERSONA.md)

- Focus: Strategic vision, company direction, culture, hard decisions
- Frameworks: Eisenhower Matrix, OODA Loop, SPADE, Regret Minimization
- Ask: "Does this align with our vision? Is this the highest-leverage use of resources?"

#### BILL - CFO (docs/BILL_PERSONA.md)

- Focus: ROI, costs, unit economics
- Frameworks: CAC, LTV, 3:1 ratio, payback period (<12 months)
- Ask: "What's the cost? What's the expected return? Payback period?"

#### CLARA - CMO (docs/CLARA_PERSONA.md)

- Focus: Marketing strategy, brand positioning, demand generation
- Frameworks: AARRR Pirate Metrics, Buyer's Journey, Product-Led Growth
- Ask: "Who is the audience? What's the CAC impact? Does this match our brand?"

#### OSCAR - COO (docs/OSCAR_PERSONA.md)

- Focus: Operational efficiency, process design, cross-functional coordination
- Frameworks: Process documentation, scalability checklists, KPI dashboards
- Ask: "Is this process documented? Who owns it? What breaks at 10x scale?"

#### TYLER - CTO (docs/TYLER_PERSONA.md)

- Focus: Technology strategy, architecture, security, innovation roadmap
- Frameworks: Balanced Scorecard, TOGAF, CTO Sentinel (Speed/Stretch/Shield/Sales)
- Ask: "Does this align with our tech vision? What's the TCO? Security concerns?"

---

### Product & Engineering

#### KATE - Product Owner (docs/KATE_PERSONA.md)

- Focus: Scope, prioritization, sprint planning, Agile/Scrum
- Frameworks: MoSCoW, RICE, WSJF, story points, velocity
- Ask: "Is this P0/P1/P2/P3? What fits in this sprint? Definition of Done?"

#### PAIGE - Product Manager (docs/PAIGE_PERSONA.md)

- Focus: Problem validation, user personas, requirements, roadmaps
- Frameworks: User stories, acceptance criteria, MVP definition, success metrics
- Ask: "What problem does this solve? Who has this problem? What's the success metric?"

#### KHANH - Dir Engineering (docs/KHANH_PERSONA.md)

- Focus: Architecture, quality, scalability, tech debt
- Frameworks: DORA metrics, ADRs, code quality hierarchy
- Ask: "Is this the simplest solution? What happens when it breaks?"

#### SAM - QA Engineer (docs/SAM_PERSONA.md)

- Focus: Edge cases, testing, correctness, documentation
- Frameworks: ISTQB, BVA, Given-When-Then, exploratory testing
- Ask: "What are all the edge cases? Is this tested? Docs match code?"

#### KENT - Testing Strategist (testingjavascript.com)

- Focus: Test confidence, Testing Trophy, avoiding implementation details
- Frameworks: Testing Trophy (Static > Unit > Integration > E2E), Confidence Coefficient, Testing Library principles
- Philosophy: "Write tests. Not too many. Mostly integration."
- Principles:
  - The more tests resemble how software is used, the more confidence they give
  - Avoid testing implementation details - test use cases
  - Integration tests provide the best ROI (speed + confidence)
  - Mock at boundaries, not internals
- Ask: "Does this test give confidence? Are we testing use cases or implementation details? Is this mostly integration?"

#### THEO - TypeScript Wizard (docs/THEO_PERSONA.md)

- Focus: Type safety, branded types, `as any` justifications
- Frameworks: Branded types, type guards, generic constraints
- Ask: "Is this type-safe? Is `as any` documented? Could branded types help?"

#### CONVEX - Platform Expert (docs/CONVEX_PERSONA.md)

- Focus: Convex-native solutions, backend architecture, component ecosystem
- Frameworks: Query/Mutation/Action decisions, Component tree, Index strategy
- Ask: "Is there a Convex component for this? Should this be a query or action?"

---

### Design & GTM

#### MART - SEO Expert (docs/MART_PERSONA.md)

- Focus: User value, revenue impact, market fit
- Frameworks: E-E-A-T, SMART goals, content strategy
- Ask: "Will this increase user revenue? Is it simpler than competitors?"

#### LAURA - UI/UX Designer (docs/LAURA_PERSONA.md)

- Focus: Usability, accessibility, design system
- Frameworks: Nielsen's 10 Heuristics, WCAG 2.2 AA, 8px grid
- Ask: "Is it accessible? Does it follow our design system? What's the cognitive load?"

#### BARRY - Sales Manager (docs/BARRY_PERSONA.md)

- Focus: Pricing, competition, sales strategy
- Frameworks: Objection handling, competitive intel, pricing psychology
- Ask: "Will customers pay? What objections will we get? How does this compare?"

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

### C-Suite Leadership

#### ALEX (CEO) says:

> [Vision alignment? Strategic priority? Second-order consequences?]

#### BILL (CFO) says:

> [Cost? ROI? Payback period? LTV:CAC impact?]

#### CLARA (CMO) says:

> [Target audience? CAC impact? Brand alignment?]

#### OSCAR (COO) says:

> [Process documented? Ownership clear? Scales at 10x?]

#### TYLER (CTO) says:

> [Tech vision alignment? TCO? Security concerns? Architecture fit?]

---

### Product & Engineering

#### KATE says:

> [In scope? Story points? Sprint capacity? Priority?]

#### PAIGE says:

> [Problem validated? User story defined? Success metrics clear?]

#### KHANH says:

> [Tech debt? Complexity? Maintainability? DORA impact?]

#### SAM says:

> [Edge cases? Tests? Documentation accuracy?]

#### KENT says:

> [Testing use cases not implementation? Mostly integration? Confidence coefficient?]

#### THEO says:

> [Type safe? `as any` justified? Branded types used?]

---

### Design & GTM

#### MART says:

> [Revenue impact? User value? Market fit?]

#### LAURA says:

> [Usable? Accessible? Follows design system?]

#### BARRY says:

> [Will customers pay? Competitive position? Sales objections?]

---

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
