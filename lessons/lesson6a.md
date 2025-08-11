# Lesson 6a: PostgreSQL and Node.js Integration

## Overview
In this lesson, you will modify your existing **week4 Express application** to use PostgreSQL instead of in-memory storage. You'll transform your working Express app that stores data in memory to one that persists data in a real database.

**What You'll Learn:**
- How to connect your Express app to PostgreSQL
- How to replace in-memory operations with SQL queries
- How to maintain the same API while changing the data layer
- How to handle database connections and errors

## 1. Introduction to PostgreSQL

PostgreSQL is a powerful, open-source object-relational database system known for its reliability, feature set, and performance. It is widely used in production environments for web, mobile, and analytics applications.

**Key Features:**
- Open source and free
- ACID compliant
- Supports advanced data types and indexing
- Extensible with custom functions and plugins

---

## 2. Setting Up Your Database

### a. Check if PostgreSQL is Installed - Should have been Installed at the start of the cohort
Open your terminal and run:
```bash
psql --version
```
If you see a version number, PostgreSQL is installed. If not, follow the [official installation guide](https://www.postgresql.org/download/) for your OS.

### b. Set Up Your Database Connection
Update your `.env` file with PostgreSQL connection:
```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/yourdatabase
PORT=3000
```
**Purpose:** This connection string tells your application how to connect to your PostgreSQL database. The format is: `postgresql://
username:password@host:port/database`

**How to Find Your Database URI:**

1. **Username**: Usually `postgres` (the default superuser)
2. **Password**: The password you set when installing PostgreSQL
   - If you forgot it, you can reset it: `sudo -u postgres psql` then `ALTER USER postgres PASSWORD 'newpassword';`
3. **Host**: 
   - `localhost` for local development
   - Your server IP for remote databases
4. **Port**: 
   - `5432` is the default PostgreSQL port
   - Check with: `sudo netstat -plunt | grep postgres`
5. **Database Name**: 
   - Create a new database: `createdb yourdatabase`
   - Or use existing: `psql -l` to list all databases

**Common URI Examples:**
```
# Local development
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/testdb

# Remote server
DATABASE_URL=postgresql://username:password@your-server.com:5432/production_db

# With SSL (for cloud databases)
DATABASE_URL=postgresql://username:password@host:5432/dbname?sslmode=require
```

**Purpose:** This connection string tells your application how to connect to your PostgreSQL database with all the necessary authentication and location information.

### c. Create the Database Tables
Create a file called `schema.sql` in your project root with the following tables:

```sql
-- Users table to store user information
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(30) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table to store user tasks with foreign key relationship
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose:** 
- The `users` table stores user authentication data
- The `tasks` table stores tasks with a foreign key (`user_id`) that links each task to a specific user
- `SERIAL PRIMARY KEY` creates auto-incrementing IDs
- `REFERENCES users(id)` creates a foreign key constraint ensuring data integrity

Run this SQL in your PostgreSQL database:
```bash
psql "postgresql://postgres:yourpassword@localhost:5432/yourdatabase" -f schema.sql
```

---

## 3. Modifying Your Express App for PostgreSQL

### a. Create Database Connection File
Create `db.js` in your project root:

```js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
```

**Purpose:** 
- **Pool**: Manages multiple database connections efficiently
- **Connection String**: Uses your DATABASE_URL from .env
- **SSL**: Required for some hosting platforms
- **Export**: Makes the pool available to other files

### b. Modify Your User Controller
In `controllers/userController.js`, you need to replace in-memory storage with database queries:

1. **Replace the memory store import** with your database pool:
```js
const pool = require('../db');
```

2. **Update the register function**:
   - Keep the validation logic (no changes needed)
   - Replace `storedUsers.find()` with a SQL query to check for existing users:
   ```js
   const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
   ```
   - Replace `storedUsers.push()` with an INSERT query:
   ```js
   const result = await pool.query(
     'INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING id, email, name',
     [email, name, password]
   );
   ```

**Purpose:** 
- **Parameterized queries** (`$1`, `$2`) prevent SQL injection
- **RETURNING** clause gets the newly created user data
- **Array parameters** safely pass values to the query

3. **Update the login function**:
   - Replace the memory lookup with a SQL SELECT query:
   ```js
   const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
   ```
   - Check for matching email and password
   - Return user data on success

**Purpose:** 
- **WHERE clause** filters users by email and password
- **AND** ensures both conditions must match
- **result.rows[0]** gets the first (and should be only) matching user

4. **Keep the logoff function** as is (it doesn't need database changes)

### c. Modify Your Task Controller
In `controllers/taskController.js`, you need to add user ownership and database queries:

1. **Replace the memory store import** with your database pool:
```js
const pool = require('../db');
```

2. **Update the index function** (get all tasks for a user):
   - Add user_id parameter from query: `const { user_id } = req.query;`
   - Replace `storedTasks.filter()` with a SQL SELECT query:
   ```js
   const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [user_id]);
   ```

**Purpose:** 
- **user_id parameter** ensures users only see their own tasks
- **WHERE user_id = $1** filters tasks by the logged-in user
- **Security**: Prevents users from accessing other users' tasks

3. **Update the show function** (get a specific task):
   - Add user_id parameter from query
   - Replace memory lookup with SQL SELECT query:
   ```js
   const result = await pool.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [id, user_id]);
   ```

**Purpose:** 
- **AND user_id = $2** ensures the task belongs to the requesting user
- **Security**: Double-check that users can only access their own tasks

4. **Update the create function** (create a new task):
   - Add user_id parameter from query
   - Keep the validation logic (no changes needed)
   - Replace memory push with SQL INSERT query:
   ```js
   const result = await pool.query(
     'INSERT INTO tasks (title, is_completed, user_id) VALUES ($1, $2, $3) RETURNING *',
     [title, isCompleted, user_id]
   );
   ```

**Purpose:** 
- **user_id in INSERT** links the task to the specific user
- **RETURNING *** gets the complete task data after creation
- **Data integrity**: Ensures every task has an owner

5. **Update the update function** (modify an existing task):
   - Add user_id parameter from query
   - Keep the validation logic (no changes needed)
   - Replace memory update with SQL UPDATE query:
   ```js
   const result = await pool.query(
     'UPDATE tasks SET title = $1, is_completed = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
     [title, isCompleted, id, user_id]
   );
   ```

**Purpose:** 
- **WHERE id = $3 AND user_id = $4** ensures only the task owner can update it
- **SET clause** updates only the specified fields
- **Security**: Prevents users from modifying others' tasks

6. **Update the deleteTask function** (delete a task):
   - Add user_id parameter from query
   - Replace memory delete with SQL DELETE query:
   ```js
   const result = await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *', [id, user_id]);
   ```

**Purpose:** 
- **WHERE id = $1 AND user_id = $2** ensures only the task owner can delete it
- **RETURNING *** confirms the task was actually deleted
- **Security**: Prevents users from deleting others' tasks

### d. Modify Your App.js
In your `app.js`:

1. **Import your database pool** instead of any memory store:
```js
const pool = require('./db');
```

2. **Add a health check endpoint** that tests the database connection:
```js
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'not connected', error: err.message });
  }
});
```

**Purpose:** 
- **Health check** verifies database connectivity
- **SELECT 1** is a simple query that tests the connection
- **Error handling** provides clear feedback if database is down

3. **Keep your existing routes** - no changes needed to route files

---

## 4. Key Changes Made to Your Week4 Files

### Files Modified:
1. **`db.js`** - NEW FILE: PostgreSQL connection pool for efficient database connections
2. **`controllers/userController.js`** - Replace memory storage with SQL queries for persistent data
3. **`controllers/taskController.js`** - Replace memory storage with SQL queries and add user ownership
4. **`app.js`** - Add database health check for monitoring
5. **`.env`** - Update with PostgreSQL connection string for database access
6. **`schema.sql`** - NEW FILE: Database table definitions with proper relationships

### Major Changes:
- **Replaced `memoryStore.js`** with PostgreSQL database for data persistence
- **Added user_id parameter** to all task operations for proper user ownership and security
- **Updated all database operations** to use SQL queries instead of in-memory arrays
- **Maintained validation** - Same Joi schemas still work for input validation
- **Kept route structure** - No changes needed to route files, maintaining API consistency

---

## 5. Testing Your PostgreSQL API

1. **Start your PostgreSQL database** and make sure the tables exist.
2. **Start your Node.js server:**
   ```bash
   npm start
   ```
3. **Test your API endpoints** using [Postman](https://www.postman.com/) or curl:
   - Register: `POST /api/users/register`
   - Login: `POST /api/users/login`
   - Create task: `POST /api/tasks?user_id=1`
   - Get tasks: `GET /api/tasks?user_id=1`
   - Update task: `PATCH /api/tasks/1?user_id=1`
   - Delete task: `DELETE /api/tasks/1?user_id=1`

---

**Tips:**
- Make sure PostgreSQL is running and accessible
- Check your `.env` file for correct database credentials
- Use `console.log` to debug database queries
- Test each endpoint individually to ensure proper functionality
- Your validation schemas and routes remain unchanged!
- Remember to handle SQL errors appropriately in your try-catch blocks
- The `user_id` parameter ensures proper data isolation between users
