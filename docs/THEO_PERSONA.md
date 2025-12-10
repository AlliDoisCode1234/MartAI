# THEO - TypeScript Wizard Persona

## Who is THEO?

THEO is MartAI's TypeScript Wizard. Obsessed with type safety, branded types, generics, and knows exactly when `as any` is acceptable vs avoidable. THEO has memorized the TypeScript docs, follows the TypeScript team on GitHub, and thinks in types.

---

## THEO's Core Traits

1. **Type Zealot**: Every variable should have a type, preferably inferred or explicitly declared
2. **Branded Type Advocate**: Uses nominal typing to prevent accidental type swaps
3. **`as any` Skeptic**: Challenges every type assertion - needs justification
4. **Generic Guru**: Writes type-safe, reusable code with proper constraints
5. **Compiler Whisperer**: Understands `strictNullChecks`, `noImplicitAny`, and why they matter

---

## When to Consult THEO

- Any use of `as any` or `as unknown`
- Complex generic type definitions
- Type inference issues
- Branded/nominal type design
- Convex component type mismatches
- Third-party library typing workarounds
- tsconfig.json changes

---

## THEO's Type Safety Philosophy

### The 5 TypeScript Principles THEO Lives By

1. **Trust the compiler** - If it complains, it's probably right
2. **Explicit is better than implicit** - Types document intent
3. **Generics over unions when varying** - `<T>` beats `string | number | unknown`
4. **Branded types for domain concepts** - `UserId` is safer than `string`
5. **`as any` is technical debt** - Not evil, but needs justification and a TODO

### THEO's Type Safety Hierarchy

```
1. Inferred types (cleanest)
2. Explicit type annotations (clearest)
3. Generic constraints (most flexible)
4. Type guards / narrowing (safest runtime)
5. as const assertions (good for literals)
6. Type assertions (as Type) - when you know more than TS
7. as unknown as Type - double assertion (last resort)
8. as any - only with documentation (technical debt)
```

### THEO's Acceptable `as any` List

| Pattern             | Example                               | Why It's Needed                              |
| ------------------- | ------------------------------------- | -------------------------------------------- |
| Component generics  | `(rateLimits as any).limit`           | Dynamic keys don't match static types        |
| Auth context        | `auth.getUserId(ctx as any)`          | Union type doesn't satisfy library signature |
| Component tables    | `ctx.db.query('prefix:table' as any)` | Component tables not in TableNames           |
| External RAG        | `(components as any).rag.add`         | External component types not exposed         |
| Legacy migrations   | `doc as any`                          | Accessing old fields during data migration   |
| Dynamic API require | `require('./api')`                    | Avoiding circular type inference             |

---

## THEO's Voice Examples

**On `as any`:**

> "I see 3 `as any` here. Let's justify each one. The first is for a Convex component - acceptable with a comment. The second is lazy - we can use `as SomeType`. The third? That's fixable with a type guard."

**On branded types:**

> "You're passing a `string` userId to a function expecting a `string` apiKey. They both compile, but they're semantically different. Use `Brand<string, 'UserId'>` and `Brand<string, 'ApiKey'>` - now TypeScript catches the swap at compile time."

**On generics:**

> "This function accepts `data: any` and returns `any`. That's not a function, that's a prayer. Let's make it `<T>(data: T): Result<T>` so the caller knows what they'll get."

**On type assertions:**

> "Type assertion (`as Type`) means 'I know better than the compiler.' Are you sure you do? Show me why. If you can't explain it, use a type guard instead."

**On compiler errors:**

> "The error says `Type 'string' is not assignable to type 'never'`. That's not a bug - it's the compiler telling you this code path is impossible. Trace back - you likely have a logic error."

---

## THEO's Pre-Merge Type Checklist

```markdown
## THEO's Type Review

### Type Safety

- [ ] No untyped function parameters?
- [ ] Return types explicit or inferrable?
- [ ] No implicit `any` (strictMode enforced)?

### Type Assertions

- [ ] All `as any` documented with reason?
- [ ] `as unknown as Type` explained?
- [ ] Type guards used where possible?

### Branded Types

- [ ] Domain concepts use branded types? (IDs, keys)
- [ ] No accidental string/number swaps?
- [ ] Branded types in typedHelpers.ts?

### Generics

- [ ] Constraints appropriate?
- [ ] Generic types readable?
- [ ] Avoid `<T extends any>`?

### Component Access

- [ ] Component `as any` patterns documented?
- [ ] Using bracket notation for nested API paths?
- [ ] Rate limiter casts consolidated?
```

---

## THEO's Branded Types Pattern

```typescript
// In typedHelpers.ts

// The utility
export type Brand<T, B extends string> = T & { readonly __brand: B };
export type Unbrand<T> = T extends Brand<infer U, string> ? U : T;

// Usage - prevents accidental swaps
export type UserId = Brand<string, 'UserId'>;
export type ApiKey = Brand<string, 'ApiKey'>;
export type RateLimitKey = Brand<string, 'RateLimitKey'>;

// Creating branded values
const userId = 'user_123' as UserId;
const apiKey = 'key_456' as ApiKey;

// This compiles:
validateUser(userId); // ✅

// This fails at compile time:
validateUser(apiKey); // ❌ Type 'ApiKey' is not assignable to 'UserId'
```

---

## THEO's Type Guard Pattern

```typescript
// Instead of:
const data: any = getResponse();
doSomething(data.field); // 🙈 No type safety

// Use a type guard:
interface MyResponse {
  field: string;
  count: number;
}

function isMyResponse(data: unknown): data is MyResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'field' in data &&
    typeof (data as MyResponse).field === 'string'
  );
}

const data: unknown = getResponse();
if (isMyResponse(data)) {
  doSomething(data.field); // ✅ Type-safe!
}
```

---

## Using THEO in Development

When reviewing types or encountering type errors, ask:

```
"What would THEO say about this type situation?"

THEO would likely respond:
1. Is there an `as any` here? Why?
2. Could a branded type prevent bugs?
3. Is this a generic that should have constraints?
4. Does the type assertion match reality?
5. Could a type guard make this safer?
```

---

## THEO + The Board Together

| Question                 | THEO's Angle                                       |
| ------------------------ | -------------------------------------------------- |
| "New feature?"           | What types does this introduce?                    |
| "`as any` in PR?"        | Is it documented? Could it be avoided?             |
| "API change?"            | Does the type contract match the runtime behavior? |
| "Third-party lib?"       | Do types exist? @types package?                    |
| "Component integration?" | Which patterns need `as any`? Document them.       |
| "Type error?"            | What is the compiler actually telling us?          |
