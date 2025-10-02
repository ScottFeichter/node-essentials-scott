# Assignment 12: Server-Side Rendering with EJS - Summary

## Overview
This assignment demonstrates server-side rendering using EJS templating language with Express.js, implementing a complete jobs application with user authentication, session management, and CRUD operations.

## Key Features Implemented

### 1. EJS Templating System
- **Server-Side Rendering**: Dynamic HTML generation on the server
- **Partials System**: Reusable header, footer, and head components
- **Template Syntax**: `<%= %>` for output, `<% %>` for logic, `<%- %>` for includes
- **Bootstrap Integration**: Responsive UI with Bootstrap CSS framework

### 2. Session Management
- **Express Sessions**: User session persistence across requests
- **MongoDB Session Store**: Durable session storage in database
- **Session Security**: Secure cookies and session configuration
- **User Authentication**: Session-based login/logout system

### 3. Flash Messages
- **User Feedback**: Temporary messages for user actions
- **Message Categories**: Error and info message types
- **Session Integration**: Messages persist across redirects
- **Template Display**: Automatic message rendering in views

### 4. User Authentication
- **Registration System**: New user account creation
- **Login/Logout**: Secure authentication flow
- **Password Hashing**: bcryptjs for secure password storage
- **Session Protection**: Authentication middleware for protected routes

### 5. Jobs CRUD Operations
- **Create Jobs**: Add new job applications
- **Read Jobs**: Display user's job list
- **Update Jobs**: Edit existing job details
- **Delete Jobs**: Remove job applications
- **User Isolation**: Users only see their own jobs

### 6. Database Integration
- **MongoDB**: Document database with Mongoose ODM
- **User Model**: User schema with validation and password hashing
- **Job Model**: Job schema with user association
- **Data Relationships**: Proper foreign key relationships

## File Structure
```
Q-Assignment12-EJS/
├── app.js                    # Main application with EJS setup
├── package.json              # Dependencies and scripts
├── .env.example              # Environment variables template
├── .gitignore               # Git ignore rules
├── db/
│   └── connect.js           # Database connection
├── models/
│   ├── User.js              # User model with authentication
│   └── Job.js               # Job model with user association
├── views/
│   ├── partials/
│   │   ├── head.ejs         # HTML head with Bootstrap
│   │   ├── header.ejs       # Header with flash messages
│   │   └── footer.ejs       # Footer component
│   ├── secretWord.ejs       # Secret word demo page
│   ├── login.ejs            # Login form
│   ├── register.ejs         # Registration form
│   ├── jobs.ejs             # Jobs listing page
│   └── job-form.ejs         # Job create/edit form
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── jobsController.js    # Jobs CRUD operations
├── middleware/
│   └── auth.js              # Authentication middleware
└── routes/
    ├── auth.js              # Authentication routes
    └── jobs.js              # Jobs routes
```

## EJS Template Features

### Partials System
```html
<%- include("partials/head.ejs") %>
<%- include("partials/header.ejs") %>
<!-- Page content -->
<%- include("partials/footer.ejs") %>
```

### Dynamic Content
```html
<p>The secret word is: <strong><%= secretWord %></strong></p>
<% if (jobs && jobs.length > 0) { %>
  <!-- Display jobs -->
<% } else { %>
  <!-- No jobs message -->
<% } %>
```

### Flash Messages
```html
<% if (errors && errors.length > 0) {
  errors.forEach((err) => { %>
    <div class="alert alert-danger">Error: <%= err %></div>
<% }) } %>
```

## Session Management Features

### MongoDB Session Store
```javascript
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "mySessions",
});
```

### Session Configuration
```javascript
const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};
```

## Authentication System

### User Registration
- Name, email, and password validation
- Automatic password hashing with bcryptjs
- Session creation on successful registration

### User Login
- Email and password verification
- Password comparison with hashed stored password
- Session establishment for authenticated users

### Protected Routes
- Authentication middleware for job routes
- Automatic redirect to login for unauthenticated users
- User context available in all protected routes

## Jobs Management

### CRUD Operations
- **Create**: Add new job applications with company, position, status
- **Read**: Display paginated list of user's jobs
- **Update**: Edit job details with form pre-population
- **Delete**: Remove jobs with confirmation

### Job Status Tracking
- Pending, Interview, Declined status options
- Color-coded status badges in UI
- Status filtering and organization

## Security Features
- **Password Hashing**: bcryptjs with salt rounds
- **Session Security**: Secure cookies and CSRF protection
- **Input Validation**: Mongoose schema validation
- **User Isolation**: Database queries filtered by user ID
- **Environment Variables**: Sensitive data in .env files

## UI/UX Features
- **Bootstrap Styling**: Professional responsive design
- **Flash Messages**: User feedback for all actions
- **Form Validation**: Client and server-side validation
- **Confirmation Dialogs**: Delete confirmation prompts
- **Navigation**: Intuitive user flow and navigation

## Development Features
- **Hot Reload**: Nodemon for development
- **Error Handling**: Comprehensive error catching and display
- **Async/Await**: Modern JavaScript async patterns
- **Modular Structure**: Organized MVC architecture

This implementation provides a complete server-side rendered web application demonstrating EJS templating, session management, user authentication, and CRUD operations with a professional user interface.