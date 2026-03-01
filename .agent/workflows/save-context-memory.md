---
description: Create a Board of Directors context memory persona from the current chat session.
---

# Context Memory Persona Workflow

Use this workflow at the end of a session, or when a major contextual milestone is reached, to persist the chat's context memory as a new persona for the `@[/bod]` Board of Directors. This allows the AI in future chat sessions to consult this persona and recall the exact context, decisions, and patterns established during this specific session.

## 1. Naming Convention

A new persona file MUST be created in the `docs/personas/` directory using the following nomenclature:
`docs/personas/bot_persona_[RELEVANT_CONTEXT]_[XXXXX]_PERSONA.md`

- Replace `[RELEVANT_CONTEXT]` with a 1-3 word capitalized summary of the session's focus (e.g., `AUTH_REFACTOR`, `GA4_GTM_PI`).
- Replace `[XXXXX]` with a padded 5-digit incremental number (e.g., `00001`).
- Ensure the filename ends specifically with `_PERSONA.md` so it is automatically and dynamically discovered by the `/bod` consultation workflow.

## 2. Generate the Persona Content

The persona file should follow the standard Board member format, acting as a "Memory Node". Use the template below:

```markdown
# BOT*PERSONA*[RELEVANT_CONTEXT]\_[XXXXX] - Context Memory Node

- **Focus**: [High-level summary of what this session accomplished or what context it holds]
- **Frameworks**: Context Persistence, Session Recall, Historical Architectural Decisions
- **Ask**: "What did we decide during the [RELEVANT_CONTEXT] initiative? What specific hazards or edge cases did we discover?"

### Session Memory & Key Context

- **Objective Achieved**:
  - [Briefly outline the PI, feature, or bug fix completed]
- **Key Technical Decisions**:
  - [Decision 1: e.g., We used exponential backoff instead of a simple retry loop]
  - [Decision 2: e.g., Added a new table `gtmConnections` and enforced RLS]
- **Hazards & Edge Cases Discovered**:
  - [Hazard 1: e.g., GA4 data API returns null instead of zeroes on completely empty traffic periods]
- **Unfinished Business / Deferred Debt**:
  - [List any deferred tech debt, ignored lint warnings, or immediate next steps left for future sessions]
```

## 3. Execution Steps

When a user invokes this workflow (e.g., via `/save-context-memory`):

1. **Analyze** the current chat history, extracting the key objectives, architectural decisions, and hazards discovered.
2. **Determine** the next `[XXXXX]` incremental number by using `list_dir` or `find_by_name` to check existing `docs/personas/bot_persona_*` files. If none exist, start at `00001`.
3. **Write** the synthesized markdown to `docs/personas/bot_persona_[RELEVANT_CONTEXT]_[XXXXX]_PERSONA.md`.
4. **Notify** the user that the context memory persona has been successfully integrated into the Board of Directors, ensuring safe passage of context into the next chat session.
