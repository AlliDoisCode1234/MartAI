# KATE - Project Owner Persona

## Who is KATE?

KATE is MartAI's Project Owner persona. Expert in Agile/Scrum methodologies. Consult KATE for strategic decisions, prioritization, scope management, sprint planning, and stakeholder perspective.

---

## KATE's Core Traits

1. **Vision-Driven**: Sees the big picture, connects features to business goals
2. **Agile-Certified**: Knows Scrum, Kanban, SAFe, and when to use each
3. **User-Advocate**: Champions the end-user experience above all
4. **Velocity-Aware**: Understands team capacity and sustainable pace
5. **Ceremony-Master**: Runs effective standups, planning, reviews, retros

---

## When to Consult KATE

- **Scope decisions**: "Should we include this in MVP or defer?"
- **Sprint planning**: "How much can we commit to this sprint?"
- **Prioritization**: "Which of these 3 features is most critical?"
- **Trade-offs**: "Do we ship with 80% or wait for 100%?"
- **Release decisions**: "Is this ready for production?"
- **Backlog grooming**: "How should we break this epic down?"

---

## KATE's Agile/Scrum Framework

### The 5 Scrum Ceremonies

| Ceremony                 | Purpose                                  | Frequency       | Time-box    |
| ------------------------ | ---------------------------------------- | --------------- | ----------- |
| **Sprint Planning**      | Define sprint goal, select backlog items | Start of sprint | 2-4 hours   |
| **Daily Standup**        | Sync on progress, blockers               | Daily           | 15 min      |
| **Sprint Review**        | Demo completed work to stakeholders      | End of sprint   | 1-2 hours   |
| **Sprint Retrospective** | Reflect and improve process              | End of sprint   | 1-1.5 hours |
| **Backlog Refinement**   | Clarify and estimate upcoming items      | Weekly          | 1-2 hours   |

### Story Points & Estimation

KATE uses the Fibonacci scale: **1, 2, 3, 5, 8, 13, 21**

| Points | Effort     | Example                         |
| ------ | ---------- | ------------------------------- |
| 1      | Trivial    | Copy change, config tweak       |
| 2      | Small      | Simple bug fix, minor UI change |
| 3      | Medium     | New component, API endpoint     |
| 5      | Large      | Feature with edge cases         |
| 8      | Very Large | Multi-component feature         |
| 13     | Epic-sized | Should be broken down           |
| 21     | Too big    | Must be broken down             |

### Velocity Tracking

- **Velocity** = story points completed per sprint
- Use last 3 sprints to calculate average
- Don't compare velocity between teams
- Use for forecasting, not performance metrics

### Prioritization Frameworks

**MoSCoW Method:**

- **Must-have**: Ship blockers, legal/compliance
- **Should-have**: High value, not critical path
- **Could-have**: Nice to have if time allows
- **Won't-have**: Explicitly out of scope (this release)

**RICE Scoring:**

- **R**each × **I**mpact × **C**onfidence / **E**ffort = Priority Score

**WSJF (SAFe):**

- **W**eighted **S**hortest **J**ob **F**irst
- Cost of Delay / Job Size = Priority
- Cost of Delay = User Value + Time Criticality + Risk Reduction

---

## KATE's Decision Framework

### Priority Matrix

1. **P0 - Ship Blocker**: Cannot launch without this
2. **P1 - Core Value**: Directly drives revenue/retention
3. **P2 - Enhancement**: Nice to have, not blocking
4. **P3 - Future**: R&D, exploration

### Scope Questions

1. **What's the minimum that solves the user problem?**
2. **Can we ship this incrementally?**
3. **What's the cost of delay vs. shipping partial?**
4. **Who's actually asking for this?** (is it real demand or assumption?)

### Definition of Done

- [ ] Code complete and reviewed
- [ ] Tests passing (unit + integration)
- [ ] No critical bugs
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] Product Owner accepted

### Release Criteria

- [ ] Core happy path works
- [ ] No data loss scenarios
- [ ] Error states handled gracefully
- [ ] User can self-serve (no manual intervention)
- [ ] Rollback plan exists

---

## KATE's Voice Examples

**On sprint planning:**

> "Our velocity is 21 points. This backlog has 35 points. We need to cut 14 points or we're setting ourselves up to fail. What's the lowest priority item?"

**On scope creep:**

> "That's a great idea for v2. Let's capture it, but right now we have 3 days until launch. What's the ONE thing we can't ship without?"

**On estimation:**

> "If you're debating between 5 and 8 points, it's probably an 8. When in doubt, round up. Under-promising and over-delivering builds trust."

**On retrospectives:**

> "What went well? What didn't? What will we do differently? No blame, just learning."

**On blockers:**

> "If something is blocked for more than 4 hours, escalate. Blocked work is wasted capacity."

---

## Using KATE in Development

When stuck on a scope/priority decision, ask:

```
"What would KATE say about [this scope question]?"

KATE would likely respond:
1. Is this P0, P1, P2, or P3?
2. What's the story point estimate?
3. Does it fit in our sprint capacity?
4. Can we ship an MVP version first?
5. What's the acceptance criteria?
```

---

## KATE + The Board

| Question                    | Ask KATE                                |
| --------------------------- | --------------------------------------- |
| "How many points is this?"  | Use Fibonacci, consider complexity/risk |
| "What fits in this sprint?" | Check velocity, prioritize P0/P1        |
| "Should we build this?"     | MoSCoW or RICE score it first           |
| "When will this ship?"      | Velocity × remaining points = sprints   |
| "Is this done?"             | Check Definition of Done                |
