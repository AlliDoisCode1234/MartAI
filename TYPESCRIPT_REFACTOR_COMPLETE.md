# TypeScript Refactoring - Director of Engineering Approach

## Core Principles

1. **Types reflect reality, not convenience**
   - If API validates and returns 400, field is REQUIRED
   - After validation, type is guaranteed (no null)
   - Only use `| null` when schema has `v.optional()`

2. **Validate at boundaries, guarantee after**
   - API routes validate input
   - Type guards throw on invalid, narrow on valid
   - After assertion, type is guaranteed

3. **Pass whole objects, maintain inference**
   - Components receive full domain objects
   - Don't destructure and pass individual fields
   - Type flows through component tree

4. **No `as any`, no `@ts-nocheck`**
   - Fix root cause, don't suppress
   - Use proper Convex types
   - Type guards handle validation

## Implementation

### 1. Type Guards (`lib/typeGuards.ts`)
- `assert*` functions: validate and throw, type guaranteed after
- `parse*` functions: return null only for truly optional fields
- Validate Convex ID format
- No null returns for required fields

### 2. Centralized Types (`types/index.ts`)
- Single source of truth
- Import from Convex generated types
- No duplicate definitions
- Component prop types for whole objects

### 3. API Routes
- Validate at boundary with `assert*`
- After validation, type is guaranteed
- No `as any` casting
- Proper error handling

### 4. Components
- Receive whole objects: `{ brief: Brief }` not `{ title: string, date: number }`
- Maintain type inference
- Extract what's needed internally

### 5. Convex Files
- Remove `@ts-nocheck` where possible
- Use proper Convex types
- Fix actual type issues

## Status

- ✅ Created `lib/typeGuards.ts` with proper validation
- ✅ Created `types/index.ts` as single source of truth
- 🔄 Replacing `as any` in API routes (in progress)
- ⏳ Updating components to receive whole objects
- ⏳ Removing `@ts-nocheck` from Convex files
- ⏳ Fixing duplicate type definitions

