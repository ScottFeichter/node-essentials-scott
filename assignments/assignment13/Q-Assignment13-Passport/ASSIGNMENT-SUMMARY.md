# Assignment 13: Authentication with Passport - Summary

## Overview
This assignment demonstrates implementing authentication using Passport.js with the local strategy in a server-side rendered EJS application, featuring user registration, login, logout, and protected routes.

## Key Features Implemented

### 1. Passport.js Authentication
- **Local Strategy**: Email and password authentication
- **User Serialization**: Session-based user persistence
- **Password Verification**: Secure password comparison with bcrypt
- **Authentication Flow**: Complete login/logout cycle

### 2. User Management System
- **User Registration**: New account creation with validation
- **Password Confirmation**: Client-side password matching
- **Email Uniqueness**: Duplicate email prevention
- **Input Validation**: Mongoose schema validation with custom error handling

### 3. Session-Based Security
- **Protected Routes**: Authentication middleware for sensitive pages
- **Session Management**: MongoDB-backed session storage
- **User Context**: Authenticated user available in all views
- **Automatic Redirects**: Seamless navigation based on auth state

### 4. EJS Template Integration
- **Conditional Rendering**: Different content for authenticated/unauthenticated users
- **User Information Display**: Show logged-in user's name
- **Flash Messages**: Error and success message system
- **Responsive Navigation**: Dynamic login/logout buttons

### 5. Error Handling & Validation
- **Validation Error Parsing**: User-friendly error messages
- **Duplicate Email Detection**: MongoDB unique constraint handling
- **Password Mismatch**: Registration form validation
- **Authentication Failures**: Login error feedback

### 6. Route Protection
- **Authentication Middleware**: Protect sensitive routes
- **Automatic Redirects**: Redirect unauthenticated users
- **Session Validation**: Verify user session on protected routes
- **Access Control**: User-specific content access

## File Structure
```
Q-Assignment13-Passport/
├── app.js                      # Main application with Passport setup
├── package.json                # Dependencies including Passport
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── db/
│   └── connect.js              # Database connection
├── models/
│   └── User.js                 # User model with password hashing
├── passport/
│   └── passportInit.js         # Passport configuration and strategies
├── views/
│   ├── partials/
│   │   ├── head.ejs            # HTML head
│   │   ├── header.ejs          # Header with user info and logout
│   │   └── footer.ejs          # Footer component
│   ├── index.ejs               # Home page with conditional links
│   ├── logon.ejs               # Login form
│   ├── register.ejs            # Registration form
│   └── secretWord.ejs          # Protected secret word page
├── controllers/
│   └── sessionController.js    # Authentication logic
├── routes/
│   ├── sessionRoutes.js        # Auth routes with Passport integration
│   └── secretWord.js           # Protected route example
├── middleware/
│   ├── auth.js                 # Authentication middleware
│   └── storeLocals.js          # Flash messages and user context
└── utils/
    └── parseValidationErr.js   # Validation error parser
```

## Passport.js Configuration

### Local Strategy Setup
```javascript
passport.use("local", new LocalStrategy(
  { usernameField: "email", passwordField: "password" },
  async (email, password, done) => {
    // User lookup and password verification
  }
));
```

### User Serialization
```javascript
passport.serializeUser(async function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  const user = await User.findById(id);
  return done(null, user);
});
```

## Authentication Flow

### Registration Process
1. User submits registration form
2. Password confirmation validation
3. User creation with password hashing
4. Automatic redirect to home page
5. Flash message confirmation

### Login Process
1. User submits login credentials
2. Passport local strategy verification
3. Session establishment on success
4. Redirect to protected content
5. Error handling for invalid credentials

### Logout Process
1. User clicks logout button
2. Session destruction
3. Redirect to home page
4. User context cleared

## Security Features

### Password Security
- **bcrypt Hashing**: Secure password storage with salt
- **Password Comparison**: Safe password verification
- **No Plain Text**: Passwords never stored in plain text

### Session Security
- **MongoDB Sessions**: Persistent session storage
- **Session Secrets**: Cryptographically signed sessions
- **Secure Cookies**: HttpOnly and secure cookie settings
- **Session Validation**: Middleware verification on each request

### Input Validation
- **Mongoose Validation**: Schema-level validation rules
- **Email Format**: Regex validation for email addresses
- **Password Length**: Minimum password requirements
- **Duplicate Prevention**: Unique email constraint

## Protected Route Implementation

### Authentication Middleware
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

### Route Protection
```javascript
app.use("/secretWord", auth, secretWordRouter);
```

## User Experience Features

### Conditional Navigation
- Different links for authenticated/unauthenticated users
- User name display when logged in
- Logout button availability
- Protected content access

### Flash Messages
- Registration success/failure feedback
- Login error messages
- Validation error display
- User-friendly error formatting

### Seamless Redirects
- Automatic redirect after login
- Protected route access control
- Post-logout navigation
- Registration flow completion

## Template Integration

### User Context in Views
```html
<% if (user) { %>
   <p>User <%= user.name %> is logged on.</p>
   <form method="POST" action="/sessions/logoff">
   <button>Logoff</button>
   </form>
<% } %>
```

### Conditional Content
```html
<% if (user) { %>
    <a href="/secretWord">Click this link to view/change the secret word.</a>
<% } else { %>
    <a href="/sessions/logon">Click this link to logon.</a>
    <a href="/sessions/register">Click this link to register.</a>
<% } %>
```

This implementation provides a complete authentication system using Passport.js with secure session management, user registration/login, protected routes, and seamless integration with EJS templating for a professional user experience.