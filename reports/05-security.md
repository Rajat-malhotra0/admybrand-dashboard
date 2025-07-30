
# Step 5: Security Review

This security audit evaluates the web application's backend against common threat vectors. The Express.js server in `backend/server.js` is the primary focus. While the application leverages a modern stack, several critical security enhancements are necessary to protect against prevalent web vulnerabilities.

This document provides a hardening checklist with actionable steps and code samples to improve the application's security posture.

## Security Hardening Checklist

| # | Threat Category | Recommendation | Status |
|---|---|---|---|
| 1 | **Cross-Origin Resource Sharing (CORS)** | Restrict API access to trusted origins. | ❌ Insecure |
| 2 | **HTTP Security Headers** | Implement essential security headers using Helmet. | ❌ Not Implemented |
| 3 | **Rate Limiting** | Protect against brute-force and DoS attacks. | ❌ Not Implemented |
| 4 | **Input Sanitisation & Validation** | Sanitize and validate all user-provided data. | ❌ Partially Implemented |
| 5 | **Authentication & Authorization** | Implement a robust authentication mechanism (JWT/NextAuth). | ❌ Not Implemented |
| 6 | **CSRF Protection** | Implement measures to prevent Cross-Site Request Forgery. | ❌ Not Implemented |
| 7 | **Environment Variable Security** | Ensure sensitive environment files are not exposed. | ✅ Implemented |

---

## Detailed Findings & Recommendations

### 1. Cross-Origin Resource Sharing (CORS)

**Issue:** The backend API at `backend/server.js` currently uses the `cors` middleware with its default configuration (`app.use(cors())`). This allows requests from *any* origin (`Access-Control-Allow-Origin: *`), which is a security risk. A malicious website could make requests to your API on behalf of a user.

**Recommendation:** Configure CORS to only allow requests from your frontend application's domain.

**Sample Code (`backend/server.js`):**

```javascript
const cors = require('cors');

const allowedOrigins = ['http://localhost:3000', 'https://your-production-domain.com'];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
```

### 2. HTTP Security Headers (Helmet)

**Issue:** The application does not set crucial HTTP security headers, leaving it vulnerable to common attacks like clickjacking, cross-site scripting (XSS), and protocol downgrade attacks.

**Recommendation:** Use the `helmet` middleware for Express to set various security-related HTTP headers.

**Sample Code (`backend/server.js`):**

First, install Helmet:
```bash
npm install helmet
```

Then, add it as a middleware. It should be one of the first middleware used.
```javascript
const helmet = require('helmet');
app.use(helmet());
```

This will automatically add the following headers, among others:
- `Strict-Transport-Security`: Enforces secure (HTTP over SSL/TLS) connections to the server.
- `X-Content-Type-Options`: Prevents browsers from MIME-sniffing a response away from the declared content-type.
- `X-Frame-Options`: Provides clickjacking protection.
- `X-XSS-Protection`: Enables the XSS filtering in most recent web browsers.

### 3. Rate Limiting

**Issue:** The API has no rate-limiting mechanism. This makes it vulnerable to Denial-of-Service (DoS) attacks and brute-force attacks on authentication endpoints (once they are implemented).

**Recommendation:** Implement rate limiting to restrict the number of requests a single IP address can make in a given time frame.

**Sample Code (`backend/server.js`):**

First, install `express-rate-limit`:
```bash
npm install express-rate-limit
```

Then, apply it as a middleware to your application or specific routes.
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply to all requests
app.use(limiter);
```

### 4. Input Sanitisation and Validation

**Issue:** While the use of `@libsql/client` with parameterized queries effectively prevents SQL injection, the application does not validate the shape or type of incoming data in `req.body`. This can lead to unexpected errors and potential NoSQL injection vulnerabilities if the database engine were different.

**Recommendation:** Use a schema validation library like `zod` (which is already a dependency) to validate all incoming data.

**Sample Code (within an Express route):**

```javascript
const { z } = require('zod');

const influencerSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  projects: z.number().int().positive(),
  followers: z.string(),
  platform: z.string().optional(),
  email: z.string().email().optional(),
  // ... define the rest of the schema based on your needs
});

app.post('/api/influencers', (req, res) => {
  const validationResult = influencerSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({ errors: validationResult.error.issues });
  }

  // ... proceed with your logic using the validated data
  // const { name, projects, followers } = validationResult.data;
});
```

### 5. Authentication & Authorization

**Issue:** The API currently has no authentication or authorization. All endpoints are public, allowing anyone to read and write data.

**Recommendation:** Implement a robust authentication system. Given the Next.js frontend, using **NextAuth.js** is highly recommended. For the backend, implement JWT (JSON Web Token) verification middleware to protect routes.

**Conceptual Workflow:**
1.  **Frontend (Next.js):** Use NextAuth.js to handle user login (e.g., with credentials, OAuth with Google/GitHub).
2.  **Frontend (Next.js):** After a successful login, NextAuth.js will manage the session and provide a JWT.
3.  **Frontend (Next.js):** When making API requests to the Express backend, attach the JWT to the `Authorization` header: `Authorization: Bearer <token>`.
4.  **Backend (Express.js):** Create a middleware that verifies the incoming JWT. If the token is valid, the user is authenticated, and the request can proceed.

**Sample Code (Backend JWT Middleware):**

First, install `express-jwt`:
```bash
npm install express-jwt jwks-rsa
```

Create a middleware to protect your routes:
```javascript
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

// This should be configured with your NextAuth.js provider details
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://YOUR_AUTH_PROVIDER_DOMAIN/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: 'YOUR_API_IDENTIFIER',
  issuer: `https://YOUR_AUTH_PROVIDER_DOMAIN}/`,
  algorithms: ['RS256']
});

// Protect a route
app.get('/api/db/influencers', checkJwt, async (req, res) => {
  //... route logic
});
```

### 6. CSRF Protection

**Issue:** While JWTs stored in memory and sent via Authorization headers are generally not vulnerable to CSRF, if you ever decide to store session information in cookies, CSRF protection is vital.

**Recommendation:** If using cookie-based sessions, implement CSRF protection using a library like `csurf`. For the current JWT-based recommendation, ensure tokens are not stored in cookies that are automatically sent by the browser. Storing them in component state or localStorage is standard practice.

### 7. Environment Variable Security

**Status:** ✅ Implemented

**Assessment:** The project correctly uses a `.env.example` file to showcase required environment variables and loads secrets from `.env` or `.env.local` files at runtime. This is a good practice.

**Recommendation:** Ensure that `.env`, `.env.local`, and any other `.env.*` files containing secrets are listed in your project's `.gitignore` file to prevent them from being committed to version control.


