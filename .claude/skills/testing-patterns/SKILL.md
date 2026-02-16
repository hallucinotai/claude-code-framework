---
name: testing-patterns
description: Reference this skill when setting up testing infrastructure, writing tests for SaaS applications, mocking auth/billing, testing multi-tenant isolation, or optimizing CI test performance.
---

# Testing Patterns for SaaS Applications

## Test Pyramid

```
        /  E2E  \          ~10% - Critical user flows
       /----------\
      / Integration \      ~30% - API, DB, service tests
     /----------------\
    /    Unit Tests     \  ~60% - Pure logic, utilities
   /--------------------\
```

## Test Organization

### Co-Located Tests (Recommended)
```
src/
├── lib/
│   ├── billing/
│   │   ├── billing.service.ts
│   │   ├── billing.service.test.ts    # Unit test
│   │   └── billing.integration.test.ts # Integration test
│   └── auth/
│       ├── auth.service.ts
│       └── auth.service.test.ts
├── app/
│   └── api/
│       └── projects/
│           ├── route.ts
│           └── route.test.ts
└── test/
    ├── setup.ts              # Global setup
    ├── factories/            # Test data factories
    ├── helpers/              # Test utilities
    └── e2e/                  # E2E tests
```

## Test Factories

```typescript
// test/factories/user.factory.ts
import { faker } from '@faker-js/faker';

export function buildUser(overrides: Partial<User> = {}): User {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    createdAt: new Date(),
    ...overrides,
  };
}

export function buildTenant(overrides: Partial<Tenant> = {}): Tenant {
  return {
    id: faker.string.uuid(),
    name: faker.company.name(),
    slug: faker.helpers.slugify(faker.company.name()).toLowerCase(),
    plan: 'pro',
    ...overrides,
  };
}

// Database factory (creates in DB)
export async function createUser(overrides: Partial<User> = {}) {
  return db.user.create({ data: buildUser(overrides) });
}
```

## Authentication Helpers

```typescript
// test/helpers/auth.ts

// Create authenticated request context
export function createAuthContext(overrides: Partial<AuthContext> = {}) {
  const user = buildUser();
  const tenant = buildTenant();
  return {
    user,
    tenant,
    tenantId: tenant.id,
    userId: user.id,
    roles: ['member'],
    ...overrides,
  };
}

// Mock authentication middleware
export function mockAuth(context?: Partial<AuthContext>) {
  const ctx = createAuthContext(context);
  return (req: Request, _res: Response, next: NextFunction) => {
    req.user = ctx.user;
    req.tenantId = ctx.tenantId;
    req.roles = ctx.roles;
    next();
  };
}

// Generate test JWT
export function createTestToken(payload: Partial<JWTPayload> = {}) {
  return jwt.sign(
    { userId: 'test-user', tenantId: 'test-tenant', ...payload },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
}
```

## Multi-Tenant Test Isolation

```typescript
// CRITICAL: Verify tenant isolation in tests
describe('Tenant Isolation', () => {
  it('should not return data from other tenants', async () => {
    // Create data for tenant A
    const tenantA = await createTenant();
    const projectA = await createProject({ tenantId: tenantA.id });

    // Create data for tenant B
    const tenantB = await createTenant();
    const projectB = await createProject({ tenantId: tenantB.id });

    // Query as tenant A
    const results = await getProjects(tenantA.id);

    // Should only see tenant A's data
    expect(results).toContainEqual(expect.objectContaining({ id: projectA.id }));
    expect(results).not.toContainEqual(expect.objectContaining({ id: projectB.id }));
  });

  it('should not allow cross-tenant updates', async () => {
    const tenantA = await createTenant();
    const tenantB = await createTenant();
    const project = await createProject({ tenantId: tenantA.id });

    // Try to update tenant A's project as tenant B
    await expect(
      updateProject(project.id, { name: 'hacked' }, tenantB.id)
    ).rejects.toThrow('Not found');
  });
});
```

## Billing Test Patterns

```typescript
// Mock Stripe for tests
const mockStripe = {
  customers: {
    create: vi.fn().mockResolvedValue({ id: 'cus_test123' }),
  },
  checkout: {
    sessions: {
      create: vi.fn().mockResolvedValue({
        id: 'cs_test123',
        url: 'https://checkout.stripe.com/test',
      }),
    },
  },
  subscriptions: {
    retrieve: vi.fn().mockResolvedValue({
      id: 'sub_test123',
      status: 'active',
      items: { data: [{ price: { id: 'price_pro' } }] },
    }),
  },
  webhooks: {
    constructEvent: vi.fn(),
  },
};

// Test webhook handler
describe('Stripe Webhook Handler', () => {
  it('should activate subscription on checkout.session.completed', async () => {
    const event = {
      type: 'checkout.session.completed',
      data: {
        object: {
          customer: 'cus_test',
          subscription: 'sub_test',
          metadata: { tenantId: tenant.id },
        },
      },
    };

    mockStripe.webhooks.constructEvent.mockReturnValue(event);

    const response = await request(app)
      .post('/api/webhooks/stripe')
      .set('stripe-signature', 'test_sig')
      .send(event);

    expect(response.status).toBe(200);

    const subscription = await db.subscription.findFirst({
      where: { tenantId: tenant.id },
    });
    expect(subscription.status).toBe('active');
  });
});
```

## API Integration Testing

```typescript
// test/helpers/api.ts
import { createApp } from '../src/app';
import supertest from 'supertest';

export function createTestClient() {
  const app = createApp();
  return supertest(app);
}

// Usage
describe('POST /api/projects', () => {
  const client = createTestClient();

  it('should create a project', async () => {
    const token = createTestToken({ tenantId: tenant.id });

    const response = await client
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Project', description: 'A test' });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: 'Test Project',
      tenantId: tenant.id,
    });
  });

  it('should return 401 without auth', async () => {
    const response = await client
      .post('/api/projects')
      .send({ name: 'Test Project' });

    expect(response.status).toBe(401);
  });
});
```

## E2E Testing Patterns

```typescript
// Playwright E2E tests
import { test, expect } from '@playwright/test';

// Auth setup - reuse across tests
test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login via API (faster than UI login)
    const token = await loginViaAPI('test@example.com', 'password');
    await page.goto('/');
    await page.evaluate((t) => {
      localStorage.setItem('token', t);
    }, token);
  });

  test('should display projects list', async ({ page }) => {
    await page.goto('/dashboard/projects');
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
    await expect(page.getByTestId('project-list')).toBeVisible();
  });

  test('should create a new project', async ({ page }) => {
    await page.goto('/dashboard/projects');
    await page.getByRole('button', { name: 'New Project' }).click();
    await page.getByLabel('Project Name').fill('E2E Test Project');
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.getByText('E2E Test Project')).toBeVisible();
  });
});
```

## Database Test Setup

```typescript
// test/setup.ts
import { db } from '../src/lib/db';

beforeAll(async () => {
  // Run migrations on test database
  await db.$executeRawUnsafe('CREATE SCHEMA IF NOT EXISTS test');
});

beforeEach(async () => {
  // Clean all tables before each test
  const tables = await db.$queryRaw`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  `;
  for (const { tablename } of tables) {
    await db.$executeRawUnsafe(
      `TRUNCATE TABLE "${tablename}" CASCADE`
    );
  }
});

afterAll(async () => {
  await db.$disconnect();
});
```

## CI Test Optimization

- Run unit tests first (fast feedback)
- Run integration tests in parallel with separate DB schemas
- Cache node_modules and build artifacts
- Use test sharding for large E2E suites
- Only run E2E on main branch or when UI changes
