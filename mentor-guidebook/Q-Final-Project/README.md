# Task Management API

A secure Node.js/Express REST API for task management with user authentication, built according to the Node Class Final Project requirements.

## Features

- **User Authentication**: Secure registration, login, and logout with JWT tokens
- **Task Management**: Full CRUD operations for tasks with user association
- **Security**: Password hashing, JWT authentication, rate limiting, CORS, and input validation
- **Database**: PostgreSQL with proper schema and relationships
- **Testing**: Comprehensive test suite using Jest and Supertest
- **Code Quality**: ESLint and Prettier configuration
- **Extra Features**: 
  - Batch task deletion
  - Task filtering by completion status
  - Priority levels for tasks

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (protected)

### Tasks
- `POST /api/tasks` - Create a new task (protected)
- `GET /api/tasks` - Get all user tasks (protected)
- `GET /api/tasks/:id` - Get specific task (protected)
- `PUT /api/tasks/:id` - Update task (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)
- `DELETE /api/tasks` - Delete multiple tasks (protected)

## Setup Instructions

1. **Clone and Install**
   ```bash
   cd Q-Final-Project
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and JWT secret
   ```

3. **Database Setup**
   ```bash
   # Create PostgreSQL database and run schema
   psql -d your_database < database/schema.sql
   ```

4. **Run Application**
   ```bash
   npm start          # Production
   npm run dev        # Development with nodemon
   ```

5. **Run Tests**
   ```bash
   npm test           # Run all tests
   npm run test:watch # Run tests in watch mode
   ```

## Security Features

- **Password Security**: Bcrypt hashing with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Express-validator for all user inputs
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Configured for secure cross-origin requests
- **Helmet**: Security headers for protection
- **SQL Injection Protection**: Parameterized queries

## Database Schema

### Users Table
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password_hash`
- `created_at`

### Tasks Table
- `id` (Primary Key)
- `title`
- `description`
- `completed` (Boolean)
- `priority` (low/medium/high)
- `user_id` (Foreign Key)
- `created_at`
- `updated_at`

## Deployment

This application is designed to be deployed on Render.com with a Neon.tech PostgreSQL database. Set the following environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `NODE_ENV`: Set to 'production'
- `FRONTEND_URL`: URL of your React frontend

## Testing

The test suite covers:
- User registration and authentication
- Task CRUD operations
- Input validation
- Error handling
- Authentication middleware

Run tests with `npm test` to ensure all functionality works correctly.