---
name: vercel-react-best-practices
description: React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, reviewing, or refactoring React/Next.js code to ensure optimal performance patterns. Triggers on tasks involving React components, Next.js pages, data fetching, bundle optimization, or performance improvements.
license: MIT
---

# Vercel React Best Practices

Comprehensive performance optimization guide for React and Next.js applications, maintained by Vercel.

## Core Performance Rules

### 1. Eliminating Waterfalls (CRITICAL)

- **Parallel Fetching**: Use `Promise.all()` for independent operations.
- **Suspense Boundaries**: Use `<Suspense>` to stream content and unlock the UI early.
- **Early Fetching**: Start promises in API routes or RSCs as early as possible.

### 2. Bundle Size Optimization (CRITICAL)

- **Direct Imports**: Avoid barrel files (`index.ts` re-exports) to prevent tree-shaking issues.
- **Dynamic Imports**: Use `next/dynamic` for heavy client components (charts, editors).
- **Defer Third Party**: Load non-critical scripts (analytics) after hydration.

### 3. Server-Side Performance (HIGH)

- **Serialization**: Minimize data passed from Server to Client Components.
- **Deduplication**: Use `React.cache()` for per-request data deduplication.
- **Auth Actions**: Always verify active session in Server Actions.

### 4. Client-Side Optimization (MEDIUM)

- **Memoization**: Use `React.memo` for expensive components, but avoid it for simple primitives.
- **State Initialization**: Use lazy initializer `useState(() => expensive())` for heavy setup.
- **Functional Updates**: Use `setState(prev => ...)` to keep callbacks stable.

### 5. JavaScript Efficiency

- **Early Exits**: Return early to reduce nesting and improve readability.
- **Map/Set Lookups**: Use `Map` or `Set` for O(1) lookups in loops.
- **Iteration Merging**: Combine `.filter().map()` into a single loop where possible.

## How to Apply

Reference these rules during every code review. If a component exceeds 150 lines, it is likely violating one of the modularity or performance rules above.
