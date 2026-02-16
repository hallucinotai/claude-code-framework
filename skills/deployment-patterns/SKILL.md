---
name: deployment-patterns
description: Reference this skill when configuring deployments, setting up CI/CD pipelines, containerizing applications, or implementing monitoring and observability for SaaS applications.
---

# Deployment & Infrastructure Patterns

## Docker Multi-Stage Builds

### Node.js / Next.js
```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

### Python / FastAPI
```dockerfile
FROM python:3.12-slim AS base
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## GitHub Actions CI/CD

### Complete Pipeline
```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  release:
    types: [published]

env:
  NODE_VERSION: '20'

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm type-check

  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        ports: ['5432:5432']
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:coverage
        env:
          DATABASE_URL: postgres://test:test@localhost:5432/test
      - uses: codecov/codecov-action@v4

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build

  deploy-staging:
    runs-on: ubuntu-latest
    needs: [build]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    environment: staging
    steps:
      - uses: actions/checkout@v4
      # Provider-specific deploy steps

  deploy-production:
    runs-on: ubuntu-latest
    needs: [build]
    if: github.event_name == 'release'
    environment: production
    steps:
      - uses: actions/checkout@v4
      # Provider-specific deploy steps
```

## Vercel Deployment

### vercel.json
```json
{
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "DATABASE_URL": "@database-url",
    "NEXTAUTH_SECRET": "@nextauth-secret"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```

## Environment Management

### Environment Variable Structure
```bash
# .env.example -- committed to git, documents all variables

# -- Application --
NODE_ENV=development
APP_URL=http://localhost:3000
APP_SECRET=generate-a-random-secret-here

# -- Database --
DATABASE_URL=postgresql://user:pass@localhost:5432/myapp

# -- Authentication --
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-secret

# OAuth Providers
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# -- Billing --
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# -- Email --
RESEND_API_KEY=

# -- Monitoring --
SENTRY_DSN=
```

### Per-Environment Configuration
```
.env.local          # Local development (gitignored)
.env.test           # Test environment
.env.staging        # Staging values (secrets in CI)
.env.production     # Production values (secrets in CI)
```

## Health Check Endpoint

```typescript
// /api/health
export async function GET() {
  const checks = {
    database: 'unknown',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || 'unknown',
  };

  try {
    await db.$queryRaw`SELECT 1`;
    checks.database = 'healthy';
  } catch (error) {
    checks.database = 'unhealthy';
  }

  const isHealthy = checks.database === 'healthy';

  return Response.json(
    { status: isHealthy ? 'healthy' : 'degraded', checks },
    { status: isHealthy ? 200 : 503 }
  );
}
```

## Zero-Downtime Deployment

### Strategy
1. Deploy new version alongside old
2. Run database migrations (backward-compatible only)
3. Switch traffic to new version
4. Verify health checks pass
5. Remove old version

### Database Migrations in CI
```yaml
# Run migrations before deployment
- name: Run migrations
  run: npx prisma migrate deploy
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## Monitoring Setup

### Sentry Integration
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  beforeSend(event) {
    // Scrub sensitive data
    if (event.request?.cookies) {
      delete event.request.cookies;
    }
    return event;
  },
});
```

### Structured Logging
```typescript
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty' }
    : undefined,
  redact: ['req.headers.authorization', 'req.headers.cookie'],
});

// Usage with tenant context
logger.info({ tenantId, userId, action: 'project.created', projectId },
  'Project created');
```
