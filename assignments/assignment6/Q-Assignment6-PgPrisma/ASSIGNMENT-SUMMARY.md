# Assignment 6 Complete - PostgreSQL and Prisma Integration

## Assignment 6a: PostgreSQL Integration

### Database Setup:
- **PostgreSQL Connection** - Database pool with connection string from environment
- **Schema Creation** - Users and tasks tables with proper foreign key relationships
- **Health Check** - Endpoint to verify database connectivity
- **Environment Configuration** - Secure database credentials management

### Database Operations (Raw SQL):
- **User Registration** - INSERT with password hashing using scrypt
- **User Login** - SELECT with password verification and global user_id storage
- **Task CRUD** - Full create, read, update, delete operations using parameterized queries
- **User Ownership** - All task operations filtered by global user_id

### Security Implementation:
- **Password Hashing** - Scrypt-based secure password storage
- **Global User ID** - User session management via global.user_id variable
- **Parameterized Queries** - SQL injection prevention
- **Input Validation** - Joi schemas for all user inputs

## Assignment 6b: Prisma ORM Integration

### Prisma Setup:
- **Prisma Schema** - User and Task models with proper relationships
- **Database Mapping** - Field and table mappings to existing PostgreSQL structure
- **Client Generation** - Type-safe Prisma Client for database operations
- **Relationship Definitions** - One-to-many User-Task relationships

### Prisma Operations:
- **User Management** - `prisma.user.create()`, `prisma.user.findUnique()`
- **Task Management** - `prisma.task.create()`, `prisma.task.findMany()`, `prisma.task.update()`, `prisma.task.delete()`
- **Advanced Queries** - Filtering, sorting, and relationship includes
- **Error Handling** - Prisma-specific error codes (P2002, P2025, P2003)

### Key Features Implemented:

#### Database Integration:
- **PostgreSQL Connection** - Connection pooling with SSL configuration
- **Schema Management** - Proper table structure with foreign keys
- **Data Persistence** - Replacement of in-memory storage with database
- **Transaction Safety** - Proper database connection handling

#### Authentication & Authorization:
- **Password Security** - Scrypt hashing with salt for secure password storage
- **Global Session** - User ID stored globally after login/registration
- **Protected Routes** - Authentication middleware for all task operations
- **User Isolation** - Users can only access their own tasks

#### API Endpoints:

##### User Management:
- **POST `/user`** - Register with validation and password hashing
- **POST `/user/logon`** - Login with password verification
- **POST `/user/logoff`** - Logout and clear global user_id

##### Task Management (Protected):
- **GET `/tasks`** - Get all tasks for logged-in user
- **POST `/tasks`** - Create new task for logged-in user
- **GET `/tasks/:id`** - Get specific task by ID
- **PATCH `/tasks/:id`** - Update task by ID
- **DELETE `/tasks/:id`** - Delete task by ID

#### Advanced Features:
- **Input Validation** - Comprehensive Joi schemas for users and tasks
- **Error Handling** - Database-specific error responses
- **Health Monitoring** - Database connectivity health check endpoint
- **Type Safety** - Prisma Client provides compile-time type checking

### Technical Implementation:

#### PostgreSQL (Assignment 6a):
- Raw SQL queries with parameterized statements
- Connection pooling for performance
- Manual error handling for SQL operations
- Direct database schema management

#### Prisma ORM (Assignment 6b):
- Type-safe database operations
- Automatic query generation
- Built-in relationship handling
- Enhanced error messages and codes

### Security Best Practices:
- **No Plain Text Passwords** - All passwords hashed with scrypt
- **SQL Injection Prevention** - Parameterized queries and Prisma's built-in protection
- **User Data Isolation** - Strict user ownership validation
- **Environment Variables** - Secure configuration management

### Testing Capabilities:
- All endpoints tested with Postman/curl
- Database connectivity verification
- User registration and authentication flows
- Complete task CRUD operations
- Error scenario handling
- Relationship queries and advanced filtering

The assignment demonstrates progression from in-memory storage to PostgreSQL with raw SQL, then to Prisma ORM, showcasing different approaches to database integration while maintaining the same API functionality and security standards.