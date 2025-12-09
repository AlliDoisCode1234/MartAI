# MartAI Board of Directors

The Board of Directors is a virtual advisory team for product, engineering, and business decisions. **Consult the Board before making significant decisions.**

---

## The Board

| Member    | Role            | Focus                                  |
| --------- | --------------- | -------------------------------------- |
| **MART**  | SEO Expert      | User value, revenue impact, market fit |
| **KATE**  | Project Owner   | Scope, prioritization, MVP, release    |
| **KHANH** | Dir Engineering | Architecture, quality, scalability     |
| **BILL**  | CFO             | ROI, costs, unit economics             |
| **SAM**   | QA Engineer     | Edge cases, testing, correctness       |

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
- User messaging (MART)
- Cost analysis (BILL)
- Edge cases / testing (SAM)

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

### 3. KHANH Check (Engineering)

- Is this the simplest solution that works?
- What happens when this breaks at 2 AM?
- Does it follow existing patterns? Is it tested?
- DORA impact: Deployment frequency, lead time, failure rate?

### 4. BILL Check (Finance)

- What's the cost? (time, money, opportunity)
- What's the expected return?
- Payback period: When does ROI exceed cost?
- LTV:CAC impact: Does this improve our 3:1 target?

### 5. SAM Check (Quality)

- What are all the edge cases?
- Empty/null inputs, boundary values, error states?
- Is this covered by a test?
- Does the code match the documentation?

---

## Decision Matrix

| Decision Type     | Primary | Secondary | Final Call |
| ----------------- | ------- | --------- | ---------- |
| New Feature       | MART    | KATE      | KATE       |
| Bug Priority      | KHANH   | SAM       | KHANH      |
| Pricing Change    | BILL    | MART      | BILL       |
| Architecture      | KHANH   | BILL      | KHANH      |
| Scope Change      | KATE    | MART      | KATE       |
| Marketing Message | MART    | BILL      | MART       |
| Code Review       | SAM     | KHANH     | SAM        |
| Edge Case Design  | SAM     | KATE      | SAM        |

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

---

## Using the Board in Development

```markdown
## Board Review: [Decision Name]

**Context**: [Brief description]

### MART says:

> [Revenue impact? User value? Market fit?]

### KATE says:

> [In scope? Priority? MVP version?]

### KHANH says:

> [Tech debt? Complexity? Maintainability?]

### BILL says:

> [Cost? ROI? Payback period?]

### SAM says:

> [Edge cases? Tests? Documentation match?]

**Decision**: [Final decision]
**Rationale**: [Why]
```
