#!/usr/bin/env bash
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# --- Block local publishing ---
if [ -z "${CI:-}" ]; then
  error "Local publishing is disabled. Push to main and create a release to publish via GitHub Actions.

  To publish:
    1. Bump version:  npm version patch|minor|major
    2. Push to main:  git push origin main --tags
    3. Create a GitHub release from the new tag

  The GitHub Actions workflow will publish to npm automatically."
fi

# --- CI-only: Pre-publish checks ---
PACKAGE_NAME=$(node -p "require('./package.json').name")
VERSION=$(node -p "require('./package.json').version")

info "Running pre-publish checks for ${PACKAGE_NAME}@${VERSION}..."

# 1. Ensure no secrets in package
PACK_LIST=$(npm pack --dry-run 2>&1)
if echo "$PACK_LIST" | grep -qiE '\.npmrc|\.env$|\.env\.local|credentials|\.mcp\.json|settings\.local'; then
  error "Sensitive files detected in package! Check 'files' field in package.json."
fi

# 2. Show package contents
info "Package contents:"
echo "$PACK_LIST" | grep "npm notice" | grep -v "^npm notice $"
echo ""

# 3. Publish
info "Publishing ${PACKAGE_NAME}@${VERSION}..."
npm publish --access public

info "Published ${PACKAGE_NAME}@${VERSION} successfully!"
