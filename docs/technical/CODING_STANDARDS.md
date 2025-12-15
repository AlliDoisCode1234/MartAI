# Coding Standards

## 1. DRY and Inline

- **Make all code dry and inline**: Avoid repetition. Use mapping for repeated JSX elements.
- **Modular and reusable**: Extract reusables to components or utility files.

## 2. Process

- **Update documentation**: Update `ROADMAP.md` and `PROJECT_STATUS.md` after every significant change.
- **Commit frequency**: Treat every "task completion" as a commit/push event.

## 3. Date Handling

- Use `lib/dateUtils.ts` for all date formatting and manipulation.
- Avoid `new Date()` in UI components where possible.
