# Assignment 8 Complete - Authentication with Passport and JWTs

## Passport Configuration

### Local Strategy:
- **Username/Password Authentication** - Configured with email as username field
- **Database Integration** - Uses `verifyUserPassword` service for credential validation
- **Error Handling** - Proper async error handling to prevent server crashes
- **Callback Pattern** - Returns user object or authentication failure message

### JWT Strategy:
- **Cookie-based JWT** - Extracts JWT tokens from HTTP-only cookies
- **Token Validation** - Verifies JWT signature and expiration
- **Payload Extraction** - Returns decoded JWT payload as user object
- **Security Configuration** - Uses environment-based JWT secret

## Authentication Implementation

### JWT Cookie Management:
- **Secure Cookie Settings** - HTTP-only, secure flags for production
- **Cross-site Configuration** - SameSite settings for development vs production
- **CSRF Protection** - Random UUID token included in JWT payload
- **Expiration Handling** - 1-hour token expiration with matching cookie maxAge

### Login Route Handler:
- **Promise-wrapped Authentication** - Converts Passport callback to async/await
- **JWT Cookie Creation** - Sets secure JWT cookie on successful login
- **CSRF Token Response** - Returns CSRF token to client for subsequent requests
- **Error Handling** - Proper error propagation and status codes

### JWT Middleware:
- **Token Validation** - Validates JWT from cookie on protected routes
- **CSRF Verification** - Checks X-CSRF-TOKEN header for state-changing operations
- **User Context** - Populates req.user with authenticated user data
- **Method-specific Protection** - CSRF required for POST, PATCH, PUT, DELETE

## Security Middleware Stack

### Rate Limiting:
- **Request Throttling** - 100 requests per 15-minute window per IP
- **DDoS Protection** - Prevents abuse and resource exhaustion
- **Early Filtering** - Applied before other middleware for efficiency

### CORS Configuration:
- **Origin Whitelist** - Environment-configurable allowed origins
- **Credential Support** - Enables cookie transmission for cross-origin requests
- **Header Control** - Restricts allowed headers to CONTENT-TYPE and X-CSRF-TOKEN
- **Method Restriction** - Limits to GET, POST, PATCH, DELETE methods

### Additional Security:
- **Helmet** - Security headers for common attack prevention
- **XSS Sanitization** - Input sanitization after body parsing
- **Cookie Parser** - Signed cookie parsing with JWT secret
- **HTTP-only Cookies** - Prevents JavaScript access to authentication tokens

## Enhanced User Management

### Registration with JWT:
- **Transaction-based Registration** - User creation with welcome tasks
- **Automatic Login** - JWT cookie set immediately after registration
- **CSRF Token Response** - Returns CSRF token for immediate API access
- **Welcome Tasks** - Creates initial tasks for new users

### Logout Implementation:
- **Cookie Clearing** - Removes JWT cookie on logout
- **Protected Route** - Requires authentication and CSRF token
- **Clean Session End** - Proper session termination

## Task Management with JWT

### Authentication Integration:
- **JWT-based User Context** - Uses req.user.id from JWT payload instead of global variable
- **CSRF Protection** - All task operations require valid CSRF token
- **User Isolation** - Tasks filtered by authenticated user ID
- **Secure Operations** - All CRUD operations protected by JWT middleware

### API Endpoints:
- **GET `/tasks`** - List user's tasks (JWT protected)
- **POST `/tasks`** - Create task (JWT + CSRF protected)
- **GET `/tasks/:id`** - Get single task (JWT protected)
- **PATCH `/tasks/:id`** - Update task (JWT + CSRF protected)
- **DELETE `/tasks/:id`** - Delete task (JWT + CSRF protected)

## Testing Infrastructure

### Unit Tests:
- **Passport Local Test** - Tests local strategy authentication
- **JWT Strategy Test** - Tests JWT token validation
- **Isolated Testing** - Tests Passport strategies independently
- **Error Scenario Testing** - Tests authentication failures

### Postman Integration:
- **CSRF Token Capture** - Automatic extraction from login/register responses
- **Environment Variables** - Dynamic CSRF token management
- **Header Automation** - X-CSRF-TOKEN header populated from environment
- **Cookie Handling** - Automatic JWT cookie management

## Security Features

### CSRF Protection:
- **Token Generation** - Cryptographically random CSRF tokens
- **Header Validation** - X-CSRF-TOKEN header required for state changes
- **Cookie Storage** - CSRF token stored in JWT payload
- **Method-specific** - Only required for POST, PATCH, PUT, DELETE operations

### JWT Security:
- **HTTP-only Cookies** - Prevents XSS token theft
- **Secure Transmission** - HTTPS-only in production
- **Signed Tokens** - Cryptographic signature prevents tampering
- **Expiration Control** - 1-hour token lifetime

### Production Considerations:
- **Environment-based Configuration** - Different settings for dev/prod
- **Domain Restrictions** - Cookie domain set for production
- **HTTPS Requirements** - Secure flags enabled in production
- **Origin Validation** - Strict CORS policy for production

## API Security Model

### Authentication Flow:
1. User registers/logs in with credentials
2. Server validates credentials via Passport local strategy
3. JWT cookie set with user ID and CSRF token
4. Client receives CSRF token in response body
5. Subsequent requests include JWT cookie automatically
6. State-changing requests must include X-CSRF-TOKEN header
7. JWT middleware validates token and CSRF for protected routes

### Error Handling:
- **Database Errors** - Graceful handling of connection failures
- **Authentication Failures** - Clear error messages without information leakage
- **Validation Errors** - Detailed validation feedback
- **Server Stability** - No crashes on authentication errors

The assignment demonstrates comprehensive authentication security using industry-standard practices including JWT tokens, CSRF protection, secure cookies, and defense-in-depth security middleware.