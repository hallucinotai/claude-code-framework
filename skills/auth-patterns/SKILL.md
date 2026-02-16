---
name: auth-patterns
description: Reference this skill when implementing authentication, authorization, OAuth flows, session management, JWT handling, MFA, SSO, or any identity-related features.
---

# Authentication & Authorization Patterns

## OAuth 2.0 / OpenID Connect

### Authorization Code Flow (Recommended for web apps)
1. Redirect user to provider's authorization URL
2. User authenticates and grants consent
3. Provider redirects back with authorization code
4. Server exchanges code for access token (+ ID token for OIDC)
5. Server validates token and creates session

### PKCE (Proof Key for Code Exchange)
- Required for public clients (SPAs, mobile apps)
- Generates code_verifier and code_challenge
- Prevents authorization code interception

### Common Providers Setup
- **Google**: Console -> OAuth consent screen -> Credentials -> OAuth client ID
- **GitHub**: Settings -> Developer settings -> OAuth Apps -> New OAuth App
- **Microsoft**: Azure Portal -> App registrations -> New registration
- **Discord**: Developer Portal -> Applications -> OAuth2

## Session Management

### Server-Side Sessions
```
Client -> Cookie (session_id) -> Server -> Session Store (Redis/DB)
```
- More secure (session data never on client)
- Easy to invalidate
- Requires session store (Redis recommended)
- Scales with shared session store

### JWT (JSON Web Tokens)
```
Client -> Bearer Token (JWT) -> Server -> Verify Signature
```
- Stateless (no session store needed)
- Self-contained (carries user claims)
- Cannot be easily invalidated (use short expiry + refresh tokens)
- Good for microservices and API authentication

### JWT Best Practices
- Use short expiry (15 minutes for access tokens)
- Use refresh tokens (rotate on each use)
- Store in httpOnly, secure, sameSite cookies (not localStorage)
- Include minimal claims (user ID, tenant ID, roles)
- Use RS256 or ES256 (asymmetric) for microservices

### Refresh Token Rotation
1. Client sends expired access token + refresh token
2. Server verifies refresh token
3. Server issues new access token + new refresh token
4. Server invalidates old refresh token
5. If old refresh token is reused -> revoke entire family (breach detected)

## Magic Link Authentication

### Flow
1. User enters email
2. Server generates unique token, stores hash with expiry
3. Server sends email with link containing token
4. User clicks link
5. Server verifies token, creates session
6. Token is invalidated after use

### Security Considerations
- Tokens expire after 15 minutes
- One-time use only
- Rate limit generation (prevent email bombing)
- Use constant-time comparison for token verification

## Multi-Factor Authentication (MFA)

### TOTP (Time-Based One-Time Password)
- User scans QR code with authenticator app
- App generates 6-digit code every 30 seconds
- Server verifies using shared secret
- Libraries: otpauth, speakeasy

### Implementation Steps
1. Generate secret per user
2. Create QR code (otpauth:// URI)
3. User scans and enters verification code
4. Store encrypted secret after verification
5. On login: prompt for TOTP after password

### Recovery Codes
- Generate 10 single-use recovery codes
- Store hashed (bcrypt)
- Allow user to regenerate
- Display once, never again

## SSO (Single Sign-On)

### SAML 2.0 (Enterprise)
- XML-based, complex but enterprise standard
- IdP-initiated and SP-initiated flows
- Libraries: saml2-js, passport-saml

### OIDC-Based SSO
- Modern alternative to SAML
- Easier to implement
- Works with most enterprise IdPs (Okta, Azure AD)

## Password Security

### Hashing
- Use bcrypt (cost factor 12+) or Argon2id
- Never use MD5, SHA-1, SHA-256 alone
- Salt is automatic with bcrypt

### Password Policies
- Minimum 8 characters (NIST recommendation)
- Check against breached password lists (HaveIBeenPwned API)
- Don't require special characters (reduces usability without improving security)
- Support passwords up to 128 characters

### Password Reset Flow
1. User requests reset
2. Generate unique token, store hash with expiry (1 hour)
3. Send email with reset link
4. User clicks link, enters new password
5. Invalidate token, invalidate all existing sessions
6. Log the reset event

## CSRF Protection
- Use SameSite=Lax or Strict cookies
- Double-submit cookie pattern for APIs
- Token-based protection for forms
- Custom header requirement for AJAX (X-Requested-With)

## XSS Prevention
- HttpOnly cookies for auth tokens
- Content Security Policy headers
- Input sanitization
- Output encoding
- Avoid dangerouslySetInnerHTML / @html without sanitization
