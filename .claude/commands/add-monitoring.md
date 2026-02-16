---
description: Add logging, error tracking, health checks, and monitoring to your SaaS application.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# SaaS Playbook — Monitoring & Observability

You are running the `/add-monitoring` command. Guide the user through setting up monitoring.

## Step 1: Read Configuration

Read `.saas-playbook.yml` for stack and deployment configuration.

## Step 2: Gather Requirements

Ask the user:
1. **Structured logging** — Set up structured JSON logging?
   - Pino (fastest, recommended for Node.js)
   - Winston (most popular)
   - Built-in console (simplest)
2. **Error tracking** — Sentry (recommended), Bugsnag, Datadog, or none
3. **Health checks** — Add `/api/health` endpoint? (recommended: yes)
4. **Uptime monitoring** — BetterStack, UptimeRobot, or none
5. **Performance monitoring** — APM? (Sentry Performance, Datadog APM)
6. **Custom metrics** — Business metrics? (active tenants, API usage, etc.)

## Step 3: Implement Logging

- Logger configuration with appropriate levels (debug, info, warn, error)
- Request logging middleware (method, path, status, duration)
- Error logging with context (user, tenant, request ID)
- Pretty format for development, JSON for production
- Sensitive data redaction (passwords, tokens, API keys)

## Step 4: Implement Error Tracking

- SDK initialization with environment and release tagging
- UI error boundary component (catches rendering errors)
- API error capture middleware
- User and tenant context attachment
- Source map upload for production builds
- `.env.example` additions for DSN/API keys

## Step 5: Add Health Checks

Create `/api/health` endpoint returning:
```json
{
  "status": "healthy",
  "checks": {
    "database": "ok",
    "redis": "ok"
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0"
}
```

## Step 6: Add Monitoring Utilities

- Request ID generation and propagation
- Response time tracking
- Custom metric helpers (if requested)

## Step 7: Update Config

Set `progress.monitoring-setup: true` in `.saas-playbook.yml`.

## Step 8: Summary

List monitoring integrations, environment variables needed, and provider dashboard setup links.
