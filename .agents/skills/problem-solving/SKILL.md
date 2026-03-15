---
name: problem-solving
description: High-level cognitive frameworks for complex coding tasks. Includes simplification cascades, pattern recognition, and inversion-based reasoning.
---

# Problem Solving Frameworks

## 1. Simplification Cascades

- Break complex objectives into a serial chain of simple, verifiable sub-tasks.
- If a task is blocked, pivot to the smallest possible sub-unit of work that can be completed immediately.

## 2. Meta-Pattern Recognition

- Identify recurring architectural patterns (e.g., Tenant Isolation, RSC Waterfalls) before writing code.
- Apply existing codebase solutions to new features rather than reinventing from scratch.

## 3. Inversion Exercise

- **Question**: "What would make this feature fail the banking verification checks?"
- **Answer**: Insecure RLS, missing audit logs, or unhandled nulls.
- **Action**: Build defenses against those failures first.

## 4. Collision-Zone Thinking

- Focus on the boundaries where components interact (API <-> Frontend, DB <-> Middleware).
- Most bugs live in these "collision zones"; prioritize testing them.
