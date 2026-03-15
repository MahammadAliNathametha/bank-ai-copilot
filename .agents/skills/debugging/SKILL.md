---
name: systematic-debugging
description: Comprehensive debugging and verification framework. Combines root cause tracing, defense-in-depth, and systematic verification into a single workflow.
---

# Systematic Debugging & Verification

## 1. Root Cause Tracing

- **Binary Search logs**: Isolate the first faulty state.
- **Polluter Identification**: Identify which module or state change "polluted" the execution context.
- **Trace Backwards**: Start at the error and trace input variables back to their origin.

## 2. Defense-in-Depth

- **Strict Validations**: Add Zod schemas to all entry/exit points of a function.
- **Audit Logs**: Ensure every sensitive action (transfers, migrations) is logged.
- **Least Privilege**: Verify RLS policies are active on every new table.

## 3. Verification Before Completion

- **The "verify.sh" Gate**: Never mark a task done until `verify.sh` passes.
- **E2E Smoke Tests**: Run Playwright for critical paths after any UI or schema change.
- **Strict Lint**: Resolve every ESLint warning, especially around `any` types and unused variables.

## When to Use

Trigger this skill whenever you encounter a bug, a failing test, or before finalizing a complex feature.
