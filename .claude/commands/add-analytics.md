---
description: Add analytics and event tracking to your SaaS project. Supports PostHog, Mixpanel, Plausible, and custom solutions.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# SaaS Playbook — Analytics Module

You are running the `/add-analytics` command. Guide the user through adding analytics.

## Step 1: Read Configuration

Read `.saas-playbook.yml` for stack and enabled features.

## Step 2: Analytics Configuration

Ask the user:
1. **Analytics provider**:
   - PostHog (recommended — open source, self-hostable, full-featured)
   - Mixpanel (powerful analytics, event-based)
   - Plausible (privacy-focused, simple web analytics)
   - Google Analytics (widely known, free tier)
   - Custom (build your own event tracking)
2. **Self-hosted or cloud?** — Relevant for PostHog and Plausible
3. **Key events to track**:
   - User signup and login
   - Feature usage (which features are used most)
   - Page views and navigation patterns
   - Plan changes and billing events
   - Errors and failures
   - Custom business events
4. **Server-side tracking?** — Track events from the API/backend too?
5. **Privacy considerations**:
   - GDPR consent required?
   - Data anonymization?
   - Cookie-free tracking?

## Step 3: Scaffold

Run the scaffolding script with the user's choices:

```
node scripts/scaffold.js add-analytics \
  --provider=<posthog|mixpanel|plausible|google|custom> \
  --serverSide=<true|false> \
  --gdpr=<true|false>
```

The script will create all analytics boilerplate (provider-specific analytics wrapper, AnalyticsProvider component with page tracking, server-side analytics client, typed event definitions, env vars). Review its output and then:
- Customize the event catalog in `lib/analytics/events.ts` with product-specific events
- Add `analytics.track()` calls to existing features and user actions
- Configure consent management if GDPR is enabled
- Add server-side tracking calls to API routes if server-side tracking is selected

## Step 4: Update Config

Update `.saas-playbook.yml`:
- Set `features.analytics.enabled: true`
- Set `features.analytics.provider`

## Step 5: Summary

List created files and suggest adding event tracking calls throughout existing features.
