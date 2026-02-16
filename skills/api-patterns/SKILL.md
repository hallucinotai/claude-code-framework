---
name: api-patterns
description: Reference this skill when designing REST APIs, GraphQL schemas, tRPC routers, implementing pagination, rate limiting, error handling, or API authentication.
---

# API Design Patterns

## RESTful API Conventions

### URL Structure
```
GET    /api/v1/resources          # List resources
POST   /api/v1/resources          # Create resource
GET    /api/v1/resources/:id      # Get single resource
PATCH  /api/v1/resources/:id      # Partial update
PUT    /api/v1/resources/:id      # Full replace
DELETE /api/v1/resources/:id      # Delete resource

# Nested resources
GET    /api/v1/projects/:id/tasks        # List project's tasks
POST   /api/v1/projects/:id/tasks        # Create task in project

# Actions (non-CRUD operations)
POST   /api/v1/resources/:id/archive     # Archive resource
POST   /api/v1/resources/:id/duplicate   # Duplicate resource
```

### HTTP Status Codes
```
200 OK              # Successful GET, PATCH, PUT
201 Created         # Successful POST (include Location header)
204 No Content      # Successful DELETE
400 Bad Request     # Validation error
401 Unauthorized    # Not authenticated
403 Forbidden       # Authenticated but not authorized
404 Not Found       # Resource doesn't exist
409 Conflict        # Duplicate or state conflict
422 Unprocessable   # Valid syntax but semantic error
429 Too Many Reqs   # Rate limited
500 Internal Error  # Server error
```

### Standard Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request body contains invalid fields",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      }
    ],
    "requestId": "req_abc123"
  }
}
```

## Pagination

### Cursor-Based (Recommended)
```json
// Request
GET /api/v1/projects?limit=20&cursor=eyJpZCI6MTAwfQ

// Response
{
  "data": [...],
  "pagination": {
    "hasMore": true,
    "nextCursor": "eyJpZCI6MTIwfQ",
    "prevCursor": "eyJpZCI6MTAwfQ"
  }
}
```
- Best for: Real-time data, infinite scroll, large datasets
- Pros: Consistent with concurrent writes, efficient
- Cons: Can't jump to arbitrary page

### Offset-Based
```json
// Request
GET /api/v1/projects?page=3&pageSize=20

// Response
{
  "data": [...],
  "pagination": {
    "page": 3,
    "pageSize": 20,
    "totalPages": 15,
    "totalCount": 295
  }
}
```
- Best for: Admin panels, fixed datasets
- Pros: Can jump to any page, shows total count
- Cons: Inconsistent with concurrent writes, slow on large tables

## Rate Limiting

### Strategies
- **Fixed Window**: Simple, count requests per time window
- **Sliding Window**: More accurate, smooth rate enforcement
- **Token Bucket**: Allows burst traffic, refills over time

### Implementation
```typescript
// Rate limit by tenant + plan
const rateLimits = {
  free: { requests: 100, window: '1m' },
  pro: { requests: 1000, window: '1m' },
  enterprise: { requests: 10000, window: '1m' },
};

// Response headers
res.setHeader('X-RateLimit-Limit', limit);
res.setHeader('X-RateLimit-Remaining', remaining);
res.setHeader('X-RateLimit-Reset', resetTimestamp);
```

## API Versioning

### URL Path Versioning (Recommended)
```
/api/v1/resources
/api/v2/resources
```
- Simple, explicit, easy to route
- Each version is a separate handler

### Header Versioning
```
Accept: application/vnd.myapp.v2+json
```
- Cleaner URLs, more complex routing

## API Authentication Pattern

### Bearer Token (JWT)
```typescript
// Middleware
function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const payload = verifyJWT(token);
    req.user = payload;
    req.tenantId = payload.tenantId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

### API Keys (for external integrations)
```typescript
// API Key in header
const apiKey = req.headers['x-api-key'];
const tenant = await getTenantByApiKey(apiKey);

// API keys should:
// - Be long (32+ characters)
// - Be stored hashed (like passwords)
// - Have scopes (read, write, admin)
// - Be revocable
// - Be tied to a tenant
```

## GraphQL Patterns

### Schema Organization
```graphql
type Query {
  me: User!
  projects(input: ProjectsInput!): ProjectConnection!
  project(id: ID!): Project
}

type Mutation {
  createProject(input: CreateProjectInput!): Project!
  updateProject(input: UpdateProjectInput!): Project!
  deleteProject(id: ID!): Boolean!
}

type Subscription {
  projectUpdated(projectId: ID!): Project!
}
```

### N+1 Prevention with DataLoader
```typescript
const userLoader = new DataLoader(async (userIds) => {
  const users = await db.users.findMany({
    where: { id: { in: userIds } },
  });
  return userIds.map(id => users.find(u => u.id === id));
});
```

## tRPC Patterns

### Router Organization
```typescript
const appRouter = router({
  auth: authRouter,
  user: userRouter,
  project: projectRouter,
  billing: billingRouter,
});

const projectRouter = router({
  list: protectedProcedure
    .input(z.object({ cursor: z.string().optional() }))
    .query(({ ctx, input }) => {
      return getProjects(ctx.tenantId, input.cursor);
    }),
  create: protectedProcedure
    .input(createProjectSchema)
    .mutation(({ ctx, input }) => {
      return createProject(ctx.tenantId, input);
    }),
});
```

## Request Validation

### Zod Schema Pattern
```typescript
const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  visibility: z.enum(['public', 'private']).default('private'),
});

// In handler
const data = createProjectSchema.parse(req.body);
```

## Idempotency

### Pattern for POST Requests
```typescript
// Client sends Idempotency-Key header
const idempotencyKey = req.headers['idempotency-key'];

if (idempotencyKey) {
  const existing = await cache.get(`idem:${idempotencyKey}`);
  if (existing) return res.json(existing);
}

const result = await createResource(data);

if (idempotencyKey) {
  await cache.set(`idem:${idempotencyKey}`, result, { ex: 86400 });
}

return res.status(201).json(result);
```
