# Assignment 13: Detailed Implementation Steps

## Step-by-Step Implementation Guide

### Step 1: Project Structure Setup
**What:** Created the basic directory structure for the Passport authentication application
**Where:** `/Q-Assignment13-Passport/`
**Why:** Organized MVC architecture is essential for maintainable code and follows Express.js best practices

```bash
mkdir -p controllers routes middleware utils views views/partials db models passport
```

**Directories Created:**
- `controllers/` - Business logic for handling requests
- `routes/` - Route definitions and middleware application
- `middleware/` - Custom middleware functions
- `utils/` - Utility functions for error handling
- `views/` - EJS templates for rendering HTML
- `views/partials/` - Reusable template components
- `db/` - Database connection configuration
- `models/` - Mongoose schema definitions
- `passport/` - Passport.js configuration

### Step 2: Package Configuration
**What:** Created `package.json` with Passport.js dependencies
**Where:** `/package.json`
**Why:** Defines project dependencies and scripts for development

**Key Dependencies Added:**
- `passport` - Authentication middleware for Node.js
- `passport-local` - Local username/password authentication strategy
- `express-session` - Session middleware for Express
- `connect-mongodb-session` - MongoDB session store
- `bcryptjs` - Password hashing library
- `mongoose` - MongoDB object modeling

### Step 3: Environment Configuration
**What:** Created environment variable template and gitignore
**Where:** `/.env.example` and `/.gitignore`
**Why:** Secure configuration management and version control best practices

**Environment Variables:**
- `MONGO_URI` - Database connection string
- `SESSION_SECRET` - Session encryption key
- `NODE_ENV` - Application environment

### Step 4: Database Connection Setup
**What:** Created MongoDB connection module
**Where:** `/db/connect.js`
**Why:** Centralized database connection management with error handling

```javascript
const connectDB = (url) => {
  return mongoose.connect(url, {});
};
```

**Purpose:** Provides a reusable connection function that returns a promise for async/await usage in the main application.

### Step 5: User Model Creation
**What:** Created User schema with authentication methods
**Where:** `/models/User.js`
**Why:** Defines user data structure and provides password hashing/comparison methods

**Key Features:**
- **Pre-save Middleware:** Automatically hashes passwords before saving
- **Password Comparison:** Instance method for verifying passwords
- **Validation:** Email format validation and required fields
- **Unique Constraint:** Prevents duplicate email addresses

```javascript
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```

### Step 6: EJS Template Structure
**What:** Created reusable template partials
**Where:** `/views/partials/`
**Why:** DRY principle - avoid repeating HTML structure across pages

#### Head Partial (`head.ejs`)
- Basic HTML document structure
- Meta tags for responsive design
- Page title configuration

#### Header Partial (`header.ejs`)
- Application title display
- Conditional user information (name when logged in)
- Logout button for authenticated users
- Flash message display system
- Visual separation with horizontal rule

#### Footer Partial (`footer.ejs`)
- Copyright information
- Closing HTML tags

### Step 7: Authentication Views
**What:** Created user-facing authentication forms
**Where:** `/views/`
**Why:** Provides user interface for registration, login, and navigation

#### Index View (`index.ejs`)
**Purpose:** Landing page with conditional navigation
- Shows secret word link for authenticated users
- Shows login/register links for unauthenticated users
- Demonstrates conditional rendering based on user state

#### Login View (`logon.ejs`)
**Purpose:** User authentication form
- Email and password input fields
- Form submission to Passport authentication route
- Cancel button for navigation back to home

#### Registration View (`register.ejs`)
**Purpose:** New user account creation
- Name, email, password, and password confirmation fields
- Client-side password matching validation
- Form submission to registration controller

#### Secret Word View (`secretWord.ejs`)
**Purpose:** Protected content demonstration
- Displays current secret word from session
- Form to update secret word
- Demonstrates session persistence and flash messages

### Step 8: Passport Configuration
**What:** Created Passport.js initialization and strategy configuration
**Where:** `/passport/passportInit.js`
**Why:** Configures authentication strategy and session management

#### Local Strategy Setup
```javascript
passport.use("local", new LocalStrategy(
  { usernameField: "email", passwordField: "password" },
  async (email, password, done) => {
    // User lookup and password verification logic
  }
));
```

**Configuration Details:**
- Uses email as username field instead of default username
- Async function for database user lookup
- Password comparison using bcrypt
- Returns user object on success or false on failure

#### Session Serialization
```javascript
passport.serializeUser(async function (user, done) {
  done(null, user.id);
});
```
**Purpose:** Stores only user ID in session to minimize session data size

#### Session Deserialization
```javascript
passport.deserializeUser(async function (id, done) {
  const user = await User.findById(id);
  return done(null, user);
});
```
**Purpose:** Retrieves full user object from database using stored ID on each request

### Step 9: Session Controller
**What:** Created authentication business logic
**Where:** `/controllers/sessionController.js`
**Why:** Separates authentication logic from routes for better organization

#### Registration Logic (`registerDo`)
- Password confirmation validation
- User creation with error handling
- Mongoose validation error parsing
- Duplicate email detection
- Flash message integration

#### Login Display (`logonShow`)
- Redirect authenticated users away from login page
- Render login form for unauthenticated users

#### Logout Logic (`logoff`)
- Session destruction
- Error handling for session cleanup
- Redirect to home page

### Step 10: Authentication Routes
**What:** Created route definitions with Passport integration
**Where:** `/routes/sessionRoutes.js`
**Why:** Defines URL endpoints and connects them to controllers and Passport middleware

#### Key Route Configurations:
```javascript
router.route("/logon")
  .get(logonShow)
  .post(passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/sessions/logon",
    failureFlash: true,
  }));
```

**Passport Integration:**
- `successRedirect` - Where to go after successful login
- `failureRedirect` - Where to go after failed login
- `failureFlash` - Automatically create flash messages for failures

### Step 11: Protected Route Implementation
**What:** Created secret word routes with authentication protection
**Where:** `/routes/secretWord.js`
**Why:** Demonstrates how to protect routes and maintain session state

**Features:**
- Session-based secret word storage
- Form processing with validation
- Flash message integration
- Redirect after POST pattern

### Step 12: Authentication Middleware
**What:** Created route protection middleware
**Where:** `/middleware/auth.js`
**Why:** Reusable authentication check for protecting multiple routes

```javascript
const authMiddleware = (req, res, next) => {
  if (!req.user) {
    req.flash("error", "You can't access that page before logon.");
    res.redirect("/");
  } else {
    next();
  }
};
```

**Functionality:**
- Checks for authenticated user in request object
- Redirects unauthenticated users with error message
- Allows authenticated users to continue to protected content

### Step 13: Local Storage Middleware
**What:** Created middleware to make user and flash messages available to all views
**Where:** `/middleware/storeLocals.js`
**Why:** Eliminates need to manually pass user context and messages to every view render

**Purpose:**
- Sets `res.locals.user` for template access
- Sets `res.locals.info` and `res.locals.errors` for flash messages
- Runs on every request to ensure consistent template data

### Step 14: Utility Functions
**What:** Created validation error parser
**Where:** `/utils/parseValidationErr.js`
**Why:** Converts Mongoose validation errors into user-friendly flash messages

**Functionality:**
- Iterates through Mongoose validation errors
- Creates individual flash messages for each validation failure
- Provides consistent error message formatting

### Step 15: Main Application Assembly
**What:** Created main application file with all middleware and route integration
**Where:** `/app.js`
**Why:** Orchestrates all components into a functioning web application

#### Middleware Order (Critical for Passport):
1. **Express Setup** - Body parsing and view engine
2. **Session Configuration** - MongoDB session store
3. **Passport Initialization** - Must come after session setup
4. **Flash Messages** - For user feedback
5. **Local Storage** - User context for templates
6. **Routes** - Application endpoints
7. **Error Handling** - 404 and 500 error responses

#### Session Configuration:
```javascript
const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};
```

**Security Considerations:**
- MongoDB session store for persistence across server restarts
- Secure cookies in production environment
- SameSite protection against CSRF attacks

#### Route Integration:
- Root route renders index page
- `/sessions/*` routes handle authentication
- `/secretWord/*` routes protected by authentication middleware

### Step 16: Error Handling Strategy
**What:** Implemented comprehensive error handling throughout the application
**Where:** Multiple files - controllers, middleware, main app
**Why:** Provides user-friendly error messages and prevents application crashes

**Error Types Handled:**
- **Mongoose Validation Errors** - Field validation failures
- **MongoDB Duplicate Key Errors** - Unique constraint violations
- **Authentication Failures** - Invalid credentials
- **Session Errors** - Session creation/destruction issues
- **Route Not Found** - 404 errors
- **Server Errors** - 500 errors

### Implementation Decisions and Rationale

#### Why Passport.js?
- **Industry Standard** - Widely adopted authentication middleware
- **Strategy Pattern** - Supports multiple authentication methods
- **Session Integration** - Seamless Express session integration
- **Security** - Battle-tested security practices

#### Why Local Strategy?
- **Simplicity** - Username/password authentication is straightforward
- **Control** - Full control over user data and validation
- **No External Dependencies** - No reliance on third-party services

#### Why MongoDB Sessions?
- **Persistence** - Sessions survive server restarts
- **Scalability** - Supports multiple server instances
- **Integration** - Works seamlessly with existing MongoDB setup

#### Why EJS Templates?
- **Server-Side Rendering** - Better SEO and initial page load
- **Conditional Rendering** - Easy to show/hide content based on auth state
- **Familiar Syntax** - HTML with embedded JavaScript

#### Why Flash Messages?
- **User Feedback** - Essential for form submissions and errors
- **Session-Based** - Persists across redirects
- **One-Time Display** - Automatically cleared after showing

### Security Considerations Implemented

1. **Password Security**
   - bcrypt hashing with salt
   - No plain text password storage
   - Secure password comparison

2. **Session Security**
   - Cryptographically signed sessions
   - Secure cookie settings in production
   - Session timeout and cleanup

3. **Input Validation**
   - Mongoose schema validation
   - Email format validation
   - Password confirmation checking

4. **Route Protection**
   - Authentication middleware
   - Automatic redirects for unauthorized access
   - User context verification

5. **Error Handling**
   - No sensitive information in error messages
   - Consistent error response format
   - Proper HTTP status codes

This implementation provides a complete, secure, and user-friendly authentication system using industry best practices and modern Node.js development patterns.