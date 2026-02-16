#!/usr/bin/env bash
set -euo pipefail

# --- Config ---
PACKAGE_NAME="saas-playbook"
REQUIRED_BRANCH="main"

# --- Colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# --- Pre-flight checks ---
info "Running pre-publish checks..."

# 1. Must be on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "$REQUIRED_BRANCH" ]; then
  error "Must be on '$REQUIRED_BRANCH' branch (currently on '$CURRENT_BRANCH')"
fi

# 2. Working tree must be clean
if [ -n "$(git status --porcelain)" ]; then
  warn "Uncommitted changes detected:"
  git status --short
  echo ""
  read -p "Continue anyway? (y/N) " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    error "Aborted. Commit or stash your changes first."
  fi
fi

# 3. Ensure no secrets are being published
info "Checking for secrets in package..."
PACK_LIST=$(npm pack --dry-run 2>&1)
if echo "$PACK_LIST" | grep -qiE '\.npmrc|\.env$|\.env\.local|credentials|\.mcp\.json|settings\.local'; then
  error "Sensitive files detected in package! Check your 'files' field in package.json."
fi

# 4. Show what will be published
echo ""
info "Package contents:"
echo "$PACK_LIST" | grep "npm notice" | grep -v "^npm notice $"
echo ""

# 5. Read version from package.json
VERSION=$(node -p "require('./package.json').version")
info "Publishing ${PACKAGE_NAME}@${VERSION}"

# 6. Confirm
read -p "Proceed with publish? (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  error "Aborted."
fi

# --- Publish ---
npm publish --access public

# --- Post-publish ---
echo ""
info "Published ${PACKAGE_NAME}@${VERSION} successfully!"
info "Verify: https://www.npmjs.com/package/${PACKAGE_NAME}"
info "Test:   npx ${PACKAGE_NAME} init"
