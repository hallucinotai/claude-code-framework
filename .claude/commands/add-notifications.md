---
description: Add a notification system to your SaaS project. Supports email, in-app, push, and webhook channels.
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# SaaS Playbook — Notification System Module

You are running the `/add-notifications` command. Guide the user through adding notifications.

## Step 1: Read Configuration

Read `.saas-playbook.yml` for stack and enabled features.

## Step 2: Notification Configuration

Ask the user:
1. **Channels** — Which notification channels?
   - Email (most common, recommended)
   - In-app (notification bell/inbox)
   - Push (browser/mobile push notifications)
   - Slack/webhook (for team notifications)
2. **Email provider** — If email selected:
   - Resend (recommended, great DX)
   - SendGrid (popular, full-featured)
   - AWS SES (cheapest at scale)
   - Postmark (excellent deliverability)
3. **Notification preferences?** — Let users control which notifications they receive?
4. **Notification templates?** — Reusable email templates for common events?
5. **Real-time in-app?** — Use WebSocket/SSE for instant in-app notifications?

## Step 3: Scaffold

Run the scaffolding script with the user's choices:

```
node scripts/scaffold.js add-notifications \
  --channels=<email,in-app,push,webhook> \
  --emailProvider=<resend|sendgrid|postmark> \
  --realtime=<true|false>
```

The script will create all notification boilerplate (notification service, channel dispatching, API endpoints, notification bell component, Prisma models, env vars). Review its output and then:
- Implement the email sending logic for the chosen provider
- Customize notification templates for product-specific events
- Add notification triggers to existing features (auth, billing, teams events)

## Step 4: Update Config

Update `.saas-playbook.yml`:
- Set `features.notifications.enabled: true`
- Set `features.notifications.channels`

## Step 5: Summary

List created files and suggest integrating notification triggers into existing features (auth events, billing events, team events).
