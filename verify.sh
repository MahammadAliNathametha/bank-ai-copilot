#!/usr/bin/env bash
set -euo pipefail

pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
