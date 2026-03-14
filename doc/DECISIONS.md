# DECISIONS

## 2026-03-14

- Use a generated scaffold first because the repository started empty and the blueprint scope exceeds a single pass of fully working feature delivery.
- Model tenancy with `tenant_id` on all banking entities and centralize tenant resolution in middleware and request helpers.
- Keep the first pass dependency-free at runtime in this environment by generating config and source files without downloading packages.
- Use route-shell pages backed by a shared `FeaturePage` pattern to cover the full blueprint URL surface without inflating the first pass with duplicated implementation code.
- Implement CRUD verification against a tenant-scoped in-memory store first so route semantics, validation, and isolation rules are testable before wiring live Supabase persistence.
- Use the Supabase session pooler `DATABASE_URL` for live migration application from this environment because the direct database host path was not IPv4-reachable here, while the pooler allowed both `psql` access and schema verification.
- Keep a backend abstraction that uses the mock tenant store in tests but switches to the Supabase adapter in live/dev environments, so the route contracts stay stable while the runtime persistence layer moves to the database.
- Extend the initial schema with a second migration rather than rewriting the first one, because the current UI contract had already drifted beyond the original table definitions and the live database needed an additive upgrade path.
- Finish the API cutover by moving every production route behind the same Supabase-backed adapter, leaving the mock store only as a test fallback and shared type source until types are extracted later.
- Prioritize replacing placeholder pages that already have live APIs before taking on brand new backend features, because those pages provide the fastest path to turning the scaffold into a functional banking product surface.
- Replace placeholder routes in coherent vertical slices that share existing APIs, so each frontend pass produces visibly functional product areas without forcing premature backend invention for more speculative features.
- For pages like appointments and credit, reuse adjacent live systems already in the product surface when that produces a coherent user workflow, instead of blocking on brand-new appointment or bureau-specific backend primitives.
- When a remaining page can be implemented by composing existing live APIs on the client, do that first and only add new backend primitives if the user flow truly cannot be expressed with the current contracts.
- Treat lower-priority feature areas the same way as core routes: prefer live, compositional workspaces over shell pages so the entire routed surface reflects the real data model instead of a mix of finished and placeholder experiences.
- Apply the same replacement strategy to auth and setup surfaces when the needed backend contracts already exist, so shell removal is driven by live contract availability rather than by route category.
- Replace admin stubs with truthful status endpoints before attempting privileged side effects from the app server, so operators can see real migration readiness without pretending the app has already executed database changes on their behalf.
- Introduce realtime incrementally at the React Query boundary by invalidating resource families from Supabase `postgres_changes` events, because that yields visible live updates with minimal contract churn and without forcing every workspace into bespoke subscription state management.
- Add storage-backed uploads behind the existing documents API rather than creating a parallel upload endpoint, so current document consumers keep the same record contract while the persistence layer moves from placeholder URLs to real file objects.
- Move check-deposit orchestration out of the client and into a dedicated server route once storage is live, so OCR-style review decisions and balance-release rules execute atomically instead of being split across multiple client mutations.
- Keep the UI redesign inside the repo’s Tailwind system instead of introducing Stitches, because the existing app is already structured around shared Tailwind primitives and the fastest path to a better result is upgrading those primitives rather than splitting the styling stack.
- Never persist a secret copied into chat back into the repository or shared command history; only add the env surface and require the user to place a rotated key locally.
- When the user explicitly asks to use Codex instead of the default GPT-5.4 migration target, pin the global Codex CLI model back to `gpt-5.3-codex` in `/home/bacancy/.codex/config.toml` rather than changing app code.
