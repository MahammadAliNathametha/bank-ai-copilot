#!/bin/bash
set -e

echo "🚀 Starting Full System Verification..."

# 1. Check Schema consistency
echo "🔍 Checking database schema..."
node --env-file=.env.local scripts/check-supabase-schema.mjs

# 2. Run Linting
echo "🧹 Running lint..."
pnpm lint

# 3. Build Application
echo "🏗️  Building application..."
pnpm build

# 4. Run Playwright E2E Tests
echo "🎭 Running Playwright E2E tests..."
pnpm test:e2e

echo "✅ System verification passed successfully!"
