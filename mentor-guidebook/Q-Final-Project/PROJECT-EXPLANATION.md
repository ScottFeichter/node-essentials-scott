# Q-Final-Project: Complete Task Management API

## Quick Start Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your PostgreSQL credentials and JWT secret
   ```

3. **Setup Database**
   ```bash
   # Create PostgreSQL database, then run:
   psql -d your_database_name < database/schema.sql
   ```

4. **Run Application**
   ```bash
   npm start     # Production
   npm run dev   # Development
   ```

5. **Run Tests**
   ```bash
   npm test
   ```

## What Was Created

A complete Node.js/Express REST API for task management that satisfies every requirement in the final-project-rubric.md:

### Core Components
- **Authentication System**: Secure user registration, login, logout with JWT tokens
- **Task Management**: Full CRUD operations (Create, Read, Update, Delete) for tasks
- **Database Integration**: PostgreSQL with proper user-task relationships
- **Security Layer**: Password hashing, input validation, rate limiting, CORS protection
- **Test Suite**: Comprehensive automated tests using Jest and Supertest
- **Code Quality**: ESLint and Prettier configuration

### File Structure
```
├── app.js                    # Main Express application
├── config/database.js        # PostgreSQL connection
├── controllers/              # Business logic handlers
├── middleware/auth.js        # JWT authentication
├── models/                   # Database models (User, Task)
├── routes/                   # API route definitions
├── validation/               # Input validation schemas
├── tests/                    # Automated test suite
└── database/schema.sql       # Database schema
```

## Why Each Component Exists

### Security Requirements
- **bcryptjs**: Hashes passwords with salt for secure storage
- **jsonwebtoken**: Creates secure authentication tokens
- **helmet**: Adds security headers to prevent common attacks
- **express-rate-limit**: Prevents brute force attacks
- **express-validator**: Validates all user input to prevent injection attacks

### Database Design
- **Users table**: Stores user credentials and profile data
- **Tasks table**: Stores task data with foreign key to users
- **One-to-many relationship**: Each user can have multiple tasks

### Testing Strategy
- **Supertest**: Tests HTTP endpoints with real requests
- **Jest**: Provides test framework and assertions
- **Complete coverage**: Tests authentication, CRUD operations, validation, and error handling

### Code Quality
- **ESLint**: Enforces consistent code style and catches errors
- **Prettier**: Automatically formats code for readability
- **Modular structure**: Separates concerns for maintainability

## How It Works

### Authentication Flow
1. User registers with username, email, password
2. Password is hashed with bcrypt before storage
3. Login returns JWT token for subsequent requests
4. Protected routes verify JWT token via middleware

### Task Operations
1. All task operations require valid JWT token
2. Tasks are associated with authenticated user
3. Users can only access their own tasks
4. Full CRUD operations with proper validation

### Security Measures
- Passwords never stored in plain text
- JWT tokens expire after 24 hours
- Rate limiting prevents abuse
- Input validation prevents injection attacks
- CORS configured for secure cross-origin requests

### Extra Features Implemented
- **Batch Delete**: Delete multiple tasks in one request
- **Task Filtering**: Filter tasks by completion status
- **Priority Levels**: Tasks can have low/medium/high priority

This implementation follows Node.js best practices and is production-ready for deployment to Render.com with Neon.tech PostgreSQL database.