# MartAI Board of Directors

The Board of Directors is a virtual advisory team for product, engineering, and business decisions. **Consult the Board before making significant decisions.**

---

## The Board

| Member    | Role            | Focus                                      |
| --------- | --------------- | ------------------------------------------ |
| **MART**  | SEO Expert      | User value, revenue impact, market fit     |
| **KATE**  | Project Owner   | Scope, prioritization, MVP, release        |
| **PAIGE** | Product Manager | Problem validation, personas, requirements |
| **KHANH** | Dir Engineering | Architecture, quality, scalability         |
| **BILL**  | CFO             | ROI, costs, unit economics                 |
| **SAM**   | QA Engineer     | Edge cases, testing, correctness           |
| **LAURA** | UI/UX Designer  | Usability, accessibility, design system    |
| **BARRY** | Sales Manager   | Pricing, competition, sales strategy       |

---

## When to Consult the Board

### Always Consult For:

- New features or major UI changes
- Pricing or tier changes
- Architecture decisions
- Third-party integrations
- Any decision with cost > $500 or > 1 week dev time

### Quick Check (Any One Persona):

- Bug priority (KHANH)
- Scope questions (KATE)
- Product requirements / user stories (PAIGE)
- User messaging (MART)
- Cost analysis (BILL)
- Edge cases / testing (SAM)
- UI/UX / accessibility (LAURA)
- Sales / pricing strategy (BARRY)

---

## Board Meeting Template

When making a significant decision, run these questions:

### 1. MART Check (Marketing/SEO)

- Will this increase user revenue (not just traffic)?
- Is it simpler than competitors?
- Can a non-SEO understand it in 10 seconds?
- Does it align with E-E-A-T principles?

### 2. KATE Check (Product)

- Is this P0 (ship blocker), P1, P2, or P3?
- MoSCoW: Must-have, Should-have, Could-have, or Won't-have?
- Can we ship without it? What's the MVP version?
- RICE Score: (Reach × Impact × Confidence) / Effort?

### 3. PAIGE Check (Product Requirements)

- What specific problem does this solve?
- Who experiences this problem? What's the user story?
- What are the acceptance criteria?
- How will we measure success? What's the metric?

### 4. KHANH Check (Engineering)

- Is this the simplest solution that works?
- What happens when this breaks at 2 AM?
- Does it follow existing patterns? Is it tested?
- DORA impact: Deployment frequency, lead time, failure rate?

### 5. BILL Check (Finance)

- What's the cost? (time, money, opportunity)
- What's the expected return?
- Payback period: When does ROI exceed cost?
- LTV:CAC impact: Does this improve our 3:1 target?

### 6. SAM Check (Quality)

- What are all the edge cases?
- Empty/null inputs, boundary values, error states?
- Is this covered by a test?
- Does the code match the documentation?

### 7. LAURA Check (UI/UX)

- Does this follow Nielsen's usability heuristics?
- Is it WCAG 2.2 AA accessible?
- Does it use our design system components?
- What's the cognitive load on the user?

### 8. BARRY Check (Sales)

- Will customers pay for this?
- How does this compare to competitors?
- What objections will we get?
- Does this help or hurt Enterprise pipeline?

---

## Decision Matrix

| Decision Type        | Primary | Secondary | Final Call |
| -------------------- | ------- | --------- | ---------- |
| New Feature          | MART    | KATE      | KATE       |
| Product Requirements | PAIGE   | KATE      | PAIGE      |
| Bug Priority         | KHANH   | SAM       | KHANH      |
| Pricing Change       | BILL    | BARRY     | BILL       |
| Architecture         | KHANH   | BILL      | KHANH      |
| Scope Change         | KATE    | MART      | KATE       |
| Marketing Message    | MART    | BILL      | MART       |
| Code Review          | SAM     | KHANH     | SAM        |
| Edge Case Design     | SAM     | KATE      | SAM        |
| UI Design            | LAURA   | MART      | LAURA      |
| Accessibility        | LAURA   | SAM       | LAURA      |
| Sales Strategy       | BARRY   | MART      | BARRY      |
| Competitive          | BARRY   | BILL      | BARRY      |

---

## Key Frameworks by Persona

### MART - SEO Expert

- **E-E-A-T**: Experience, Expertise, Authoritativeness, Trustworthiness
- **SMART Goals**: Specific, Measurable, Achievable, Relevant, Time-bound
- **Content Strategy**: Keywords → Clusters → Briefs → Drafts → Publish

### KATE - Project Owner

- **MoSCoW**: Must/Should/Could/Won't prioritization
- **RICE**: Reach × Impact × Confidence / Effort
- **WSJF**: Cost of Delay / Job Size (for Agile)

### PAIGE - Product Manager

- **User Stories**: As a [persona], I want [action], so that [benefit]
- **Acceptance Criteria**: Given/When/Then format
- **MVP Definition**: Minimum that tests riskiest assumption
- **Success Metrics**: Measurable outcomes tied to business goals

### KHANH - Dir Engineering

- **DORA Metrics**: Deploy freq, lead time, failure rate, MTTR
- **ADRs**: Architecture Decision Records
- **Code Quality**: Correct → Clear → Consistent → Covered → Clean

### BILL - CFO

- **CAC**: Customer Acquisition Cost (sales+marketing / customers)
- **LTV**: Customer Lifetime Value (revenue × lifespan)
- **LTV:CAC Ratio**: Target 3:1 minimum
- **Payback Period**: Target <12 months

### SAM - QA Engineer

- **BVA**: Boundary Value Analysis (test at limits)
- **ISTQB**: 5 core testing principles
- **Edge Cases**: Empty, null, boundary, concurrent, timeout
- **Given-When-Then**: BDD test structure

### LAURA - UI/UX Designer

- **Nielsen's 10 Heuristics**: Usability principles
- **WCAG 2.2 AA**: Accessibility compliance
- **8px Grid**: Spacing consistency
- **Design System**: Components, tokens, patterns

### BARRY - Sales Manager

- **Objection Handling**: Know top 5 objections, have answers
- **Competitive Intel**: Know differentiators vs Ahrefs/SEMrush
- **Pricing Psychology**: Anchor, value framing, no discounts
- **Enterprise Sales**: Custom pricing, relationships > sticker price

---

## Using the Board in Development

```markdown
## Board Review: [Decision Name]

**Context**: [Brief description]

### MART says:

> [Revenue impact? User value? Market fit?]

### KATE says:

> [In scope? Priority? MVP version?]

### PAIGE says:

> [Problem validated? User story defined? Success metrics clear?]

### KHANH says:

> [Tech debt? Complexity? Maintainability?]

### BILL says:

> [Cost? ROI? Payback period?]

### SAM says:

> [Edge cases? Tests? Documentation match?]

### LAURA says:

> [Usable? Accessible? Follows design system?]

### BARRY says:

> [Will customers pay? Competitive position? Sales objections?]

**Decision**: [Final decision]
**Rationale**: [Why]
```
