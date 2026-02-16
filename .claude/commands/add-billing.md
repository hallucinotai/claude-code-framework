---
description: Add subscription billing and payment processing to your SaaS project. Supports Stripe, LemonSqueezy, Paddle with plan management.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# SaaS Playbook — Billing & Subscriptions Module

You are running the `/add-billing` command. Guide the user through adding billing to their project.

## Step 1: Check Prerequisites

Read `.saas-playbook.yml`. Verify that **authentication is enabled** — billing requires user identity. If auth is not enabled, inform the user: "Authentication is required for billing. Run `/add-auth` first."

## Step 2: Billing Configuration

Ask the user:
1. **Billing provider** — Stripe (recommended), LemonSqueezy (simpler, MoR), Paddle (MoR), or custom
2. **Plan structure**:
   - How many plans? (e.g., Free, Pro, Enterprise)
   - Plan names and what's included in each
   - Pricing (monthly and/or yearly)
3. **Free tier?** — Is there a free plan with limited features?
4. **Trial period?** — Offer a trial? How many days?
5. **Billing frequency** — Monthly only, yearly only, or both (with yearly discount)?
6. **Usage-based billing?** — Any metered features? (API calls, storage, etc.)
7. **Feature gating** — Which features are restricted by plan?

## Step 3: Scaffold

Run the scaffolding script with the user's choices:

```
node scripts/scaffold.js add-billing \
  --provider=<stripe|lemon-squeezy|paddle> \
  --plans=<comma-separated-plan-names> \
  --trial=<days-or-false>
```

The script will create all billing boilerplate (Stripe SDK setup, plans definition, webhook handler, checkout/portal/subscription API routes, pricing page, billing settings, Prisma models, env vars). Review its output and then:
- Customize plan features, limits, and pricing in `lib/plans.ts`
- Add any usage-based billing logic specific to the product
- Wire up feature gating calls (`canAccessFeature()`) to existing features

## Step 4: Update Config

Update `.saas-playbook.yml`:
- Set `features.billing.enabled: true`
- Set `features.billing.provider`
- Set `features.billing.plans`
- Set `features.billing.trial`
- Set `stack.billing`

## Step 5: Summary and Next Steps

List all created files. Important reminders:
- "Set up your billing provider account and add API keys to `.env`"
- "Create products and prices in your billing provider dashboard"
- "Test webhooks locally using the provider's CLI tool"
- Suggest: "Run `/add-multi-tenancy` or `/add-teams` next"
