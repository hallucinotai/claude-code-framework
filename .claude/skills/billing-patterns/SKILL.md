---
name: billing-patterns
description: Reference this skill when implementing payment processing, subscription management, plan enforcement, webhook handling, or any billing-related features. Covers Stripe, LemonSqueezy, and Paddle patterns.
---

# Billing & Subscription Patterns

## Stripe Integration

### Core Concepts
- **Customer**: Represents a user/tenant in Stripe
- **Product**: Your SaaS plan (Pro, Enterprise)
- **Price**: A specific pricing for a product ($29/mo, $290/yr)
- **Subscription**: Active relationship between Customer and Price
- **PaymentIntent**: A one-time payment
- **Invoice**: Billing document for subscription charges

### Subscription Lifecycle
```
Customer Created -> Checkout Session -> Subscription Active
  -> Invoice Paid (recurring) -> Subscription Active
  -> Payment Failed -> Subscription Past Due
  -> Retry Logic -> Subscription Canceled (if all retries fail)
  -> Customer Portal -> Subscription Updated/Canceled
```

### Checkout Flow
```typescript
// Create checkout session
const session = await stripe.checkout.sessions.create({
  customer: customerId,           // Existing customer
  mode: 'subscription',
  line_items: [{
    price: priceId,               // Stripe Price ID
    quantity: 1,
  }],
  success_url: `${baseUrl}/billing?success=true`,
  cancel_url: `${baseUrl}/billing?canceled=true`,
  subscription_data: {
    trial_period_days: 14,        // Optional trial
    metadata: { tenantId },       // Your metadata
  },
});
```

### Critical Webhooks to Handle
```
checkout.session.completed     -> Provision access, create subscription record
customer.subscription.updated  -> Update plan in your DB
customer.subscription.deleted  -> Revoke access
invoice.paid                   -> Record payment, extend access
invoice.payment_failed         -> Notify user, start grace period
customer.updated               -> Sync customer data
```

### Webhook Handler Pattern
```typescript
// CRITICAL: Verify webhook signature
const event = stripe.webhooks.constructEvent(
  body,
  signature,
  webhookSecret
);

switch (event.type) {
  case 'checkout.session.completed':
    await handleCheckoutComplete(event.data.object);
    break;
  case 'customer.subscription.updated':
    await handleSubscriptionUpdate(event.data.object);
    break;
  case 'customer.subscription.deleted':
    await handleSubscriptionCanceled(event.data.object);
    break;
  case 'invoice.payment_failed':
    await handlePaymentFailed(event.data.object);
    break;
}
```

### Idempotency
- Webhooks can be sent multiple times
- Use event ID to deduplicate
- Make handlers idempotent (same result if run twice)

## Plan Enforcement Pattern

```typescript
interface Plan {
  id: string;
  name: string;
  limits: {
    maxUsers: number;
    maxProjects: number;
    maxStorage: number;        // in bytes
    apiRateLimit: number;      // requests per minute
  };
  features: {
    customDomain: boolean;
    prioritySupport: boolean;
    advancedAnalytics: boolean;
    sso: boolean;
    apiAccess: boolean;
  };
}

// Check feature access
function requireFeature(feature: keyof Plan['features']) {
  return (req, res, next) => {
    const plan = getTenantPlan(req.tenantId);
    if (!plan.features[feature]) {
      return res.status(403).json({
        error: 'upgrade_required',
        message: `This feature requires a ${getMinimumPlan(feature)} plan`,
        upgradeUrl: '/billing/upgrade',
      });
    }
    next();
  };
}

// Check usage limits
async function checkLimit(tenantId: string, resource: string) {
  const plan = await getTenantPlan(tenantId);
  const current = await getUsage(tenantId, resource);
  const limit = plan.limits[resource];

  if (current >= limit) {
    throw new LimitExceededError(resource, current, limit);
  }
}
```

## Trial Management

### Trial Patterns
- **No credit card trial**: Lower friction, higher signup, higher churn
- **Credit card required trial**: Higher intent, lower churn, lower signup
- **Reverse trial**: Start with full features, downgrade after trial

### Trial Implementation
```typescript
// On signup
const trialEnd = addDays(new Date(), 14);
await createSubscription({
  tenantId,
  plan: 'pro',          // Trial gets pro features
  status: 'trialing',
  trialEnd,
});

// Check trial status
function isTrialing(subscription: Subscription): boolean {
  return subscription.status === 'trialing'
    && subscription.trialEnd > new Date();
}

// Trial ending notification (3 days before)
// Schedule: check daily for trials ending in 3 days
```

## LemonSqueezy Integration

### Key Differences from Stripe
- Merchant of Record (handles tax, compliance)
- Simpler API, less flexibility
- Built-in checkout pages
- License key support

### Setup Pattern
```typescript
// Create checkout URL
const checkout = await lemonSqueezy.createCheckout({
  storeId: process.env.LEMON_STORE_ID,
  variantId: planVariantId,
  checkoutData: {
    email: user.email,
    custom: { tenantId },
  },
});
```

## Paddle Integration

### Key Differences
- Also a Merchant of Record
- Handles all tax compliance globally
- Uses client-side checkout overlay
- Different webhook format

## Customer Portal Pattern

### Self-Service Actions
- View current plan and billing period
- Upgrade/downgrade plan
- Update payment method
- View invoice history
- Download invoices
- Cancel subscription
- Reactivate canceled subscription

### Stripe Customer Portal
```typescript
const session = await stripe.billingPortal.sessions.create({
  customer: stripeCustomerId,
  return_url: `${baseUrl}/settings/billing`,
});
// Redirect to session.url
```

## Testing Billing

### Stripe Test Mode
- Use test API keys (sk_test_...)
- Test card numbers: 4242424242424242 (success), 4000000000000002 (decline)
- Use Stripe CLI for webhook testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### Mocking Pattern for Tests
```typescript
// Mock Stripe in tests
const mockStripe = {
  checkout: {
    sessions: {
      create: vi.fn().mockResolvedValue({ id: 'cs_test', url: '...' }),
    },
  },
  webhooks: {
    constructEvent: vi.fn().mockReturnValue(mockEvent),
  },
};
```
