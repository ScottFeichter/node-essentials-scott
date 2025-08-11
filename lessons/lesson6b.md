# Lesson 6b: PostgreSQL and Node.js Integration with Prisma ORM

## 1. Introduction to Prisma

Prisma is a modern ORM (Object-Relational Mapping) for Node.js and TypeScript. It provides a type-safe, auto-completing, and developer-friendly way to interact with your database, compared to writing raw SQL or using the `pg` library directly.

**Key Features:**
- Type-safe database queries
- Auto-generated client based on your schema
- Built-in migrations and schema management
- Easy integration with PostgreSQL and other databases

---

## 2. Setting Up Prisma in Your Existing PostgreSQL Project

### a. Install Prisma Dependencies
In your project root (where your lesson 6a files are), install Prisma:
```bash
npm install prisma @prisma/client
npx prisma init
```

**Purpose:** 
- **prisma**: The CLI tool for managing your database schema
- **@prisma/client**: The generated client that provides type-safe database access
- **npx prisma init**: Creates the initial Prisma configuration files

### b. Configure Your Database Connection
Your `.env` file should already have the PostgreSQL connection. Make sure it looks like this:
```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/testdb?schema=public"
PORT=3000
```

**Purpose:** 
- **DATABASE_URL**: Tells Prisma how to connect to your existing PostgreSQL database
- **schema=public**: Specifies the database schema to use
- **Reuses existing database**: You'll keep the same database from lesson 6a

### c. Create Prisma Schema Based on Your Existing Tables
Replace the content of `prisma/schema.prisma` with a schema that matches your existing PostgreSQL tables:

```prisma
// This is your Prisma schema file
// Learn more at https://pris.ly/d/prisma-schema

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  password  String
  tasks     Task[]
  createdAt DateTime @default(now()) @map("created_at")

  @@map("users")
}

model Task {
  id          Int      @id @default(autoincrement())
  title       String
  isCompleted Boolean  @default(false) @map("is_completed")
  userId      Int      @map("user_id")
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now()) @map("created_at")

  @@map("tasks")
}
```

**Purpose:** 
- **datasource**: Defines which database to use (your existing PostgreSQL)
- **generator**: Creates the Prisma Client for type-safe queries
- **User model**: Maps to your existing users table structure
- **Task model**: Maps to your existing tasks table with foreign key relationship
- **@relation**: Creates the relationship between User and Task models
- **@@map**: Maps Prisma models to your existing database table names
- **@map**: Maps Prisma fields to your existing database column names

### d. Introspect Your Existing Database
Since you already have tables from lesson 6a, you can introspect them:
```bash
npx prisma db pull
```

**Purpose:** 
- **db pull**: Reads your existing database structure and generates a schema
- **Preserves existing data**: Your current data remains intact
- **Automatic mapping**: Prisma detects your table structure automatically

### e. Generate Prisma Client
Run this command to generate the client based on your schema:
```bash
npx prisma generate
```

**Purpose:** 
- **Generates Prisma Client** for use in your application
- **Type-safe access** to your existing database
- **No data migration needed** - your existing data stays intact

---

## 3. Modifying Your Lesson 6a Files for Prisma

### a. Create Database Connection File
Create `prisma/db.js` in your project root:

```js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = prisma;
```

**Purpose:** 
- **PrismaClient**: The generated client that provides type-safe database access
- **Single instance**: Reuse the same client across your application
- **Export**: Makes the client available to other files

### b. Modify Your User Controller
In `controllers/userController.js`, you need to replace PostgreSQL queries with Prisma Client methods:

1. **Replace the PostgreSQL pool import** with your Prisma client:
```js
// Replace this:
// const pool = require('../db');

// With this:
const prisma = require('../prisma/db');
```

2. **Update the register function**:
   - Keep the validation logic (no changes needed)
   - Replace the PostgreSQL query with `prisma.user.findUnique()`:
   ```js
   // Replace this:
   // const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
   
   // With this:
   const existingUser = await prisma.user.findUnique({
     where: { email }
   });
   ```
   - Replace the INSERT query with `prisma.user.create()`:
   ```js
   // Replace this:
   // const result = await pool.query(
   //   'INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING id, email, name',
   //   [email, name, password]
   // );
   
   // With this:
   const newUser = await prisma.user.create({
     data: { email, name, password },
     select: { id: true, email: true, name: true }
   });
   ```

**Purpose:** 
- **findUnique()**: Efficiently finds a user by unique field (email)
- **create()**: Creates a new user with type-safe data
- **select**: Returns only the fields you want (excludes password)
- **Type safety**: Prisma ensures data types match your schema

3. **Update the login function**:
   - Replace the PostgreSQL query with `prisma.user.findFirst()`:
   ```js
   // Replace this:
   // const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
   
   // With this:
   const user = await prisma.user.findFirst({
     where: { email, password }
   });
   ```

**Purpose:** 
- **findFirst()**: Finds the first user matching both email and password
- **where clause**: Filters users by multiple conditions
- **Type safety**: Prisma validates the data types automatically

4. **Keep the logoff function** as is (it doesn't need database changes)

### c. Modify Your Task Controller
In `controllers/taskController.js`, you need to replace PostgreSQL queries with Prisma Client methods:

1. **Replace the PostgreSQL pool import** with your Prisma client:
```js
// Replace this:
// const pool = require('../db');

// With this:
const prisma = require('../prisma/db');
```

2. **Update the index function** (get all tasks for a user):
   - Keep the user_id parameter logic (no changes needed)
   - Replace the PostgreSQL query with `prisma.task.findMany()`:
   ```js
   // Replace this:
   // const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [user_id]);
   
   // With this:
   const tasks = await prisma.task.findMany({
     where: { userId: parseInt(user_id) }
   });
   ```

**Purpose:** 
- **findMany()**: Retrieves multiple tasks that match the criteria
- **parseInt()**: Converts string user_id to integer for Prisma
- **where clause**: Filters tasks by the specific user
- **Security**: Ensures users only see their own tasks

3. **Update the show function** (get a specific task):
   - Replace the PostgreSQL query with `prisma.task.findFirst()`:
   ```js
   // Replace this:
   // const result = await pool.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [id, user_id]);
   
   // With this:
   const task = await prisma.task.findFirst({
     where: { 
       id: parseInt(id), 
       userId: parseInt(user_id) 
     }
   });
   ```

**Purpose:** 
- **findFirst()**: Gets the first task matching both conditions
- **Multiple conditions**: Ensures the task belongs to the requesting user
- **Security**: Double-check that users can only access their own tasks

4. **Update the create function** (create a new task):
   - Replace the PostgreSQL query with `prisma.task.create()`:
   ```js
   // Replace this:
   // const result = await pool.query(
   //   'INSERT INTO tasks (title, is_completed, user_id) VALUES ($1, $2, $3) RETURNING *',
   //   [title, isCompleted, user_id]
   // );
   
   // With this:
   const newTask = await prisma.task.create({
     data: {
       title,
       isCompleted,
       userId: parseInt(user_id)
     }
   });
   ```

**Purpose:** 
- **create()**: Creates a new task with type-safe data
- **parseInt()**: Converts string user_id to integer
- **Data integrity**: Prisma ensures the foreign key relationship is valid
- **Type safety**: Validates all data types against your schema

5. **Update the update function** (modify an existing task):
   - Replace the PostgreSQL query with `prisma.task.update()`:
   ```js
   // Replace this:
   // const result = await pool.query(
   //   'UPDATE tasks SET title = $1, is_completed = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
   //   [title, isCompleted, id, user_id]
   // );
   
   // With this:
   const updatedTask = await prisma.task.update({
     where: { 
       id: parseInt(id),
       userId: parseInt(user_id)
     },
     data: { title, isCompleted }
   });
   ```

**Purpose:** 
- **update()**: Updates existing tasks with type-safe data
- **where clause**: Ensures only the task owner can update it
- **data object**: Specifies which fields to update
- **Security**: Prevents users from modifying others' tasks

6. **Update the deleteTask function** (delete a task):
   - Replace the PostgreSQL query with `prisma.task.delete()`:
   ```js
   // Replace this:
   // const result = await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *', [id, user_id]);
   
   // With this:
   await prisma.task.delete({
     where: { 
       id: parseInt(id),
       userId: parseInt(user_id)
     }
   });
   ```
   - Add error handling for Prisma error codes:
   ```js
   } catch (err) {
     if (err.code === 'P2025') {
       return res.status(404).json({ error: "Task not found" });
     }
     res.status(500).json({ error: err.message });
   }
   ```

**Purpose:** 
- **delete()**: Removes tasks with type-safe operations
- **where clause**: Ensures only the task owner can delete it
- **Error handling**: P2025 means the record wasn't found
- **Security**: Prevents users from deleting others' tasks

### d. Modify Your App.js
In your `app.js`:

1. **Replace the PostgreSQL pool import** with your Prisma client:
```js
// Replace this:
// const pool = require('./db');

// With this:
const prisma = require('./prisma/db');
```

2. **Update the health check endpoint** to use Prisma:
```js
// Replace this:
// app.get('/health', async (req, res) => {
//   try {
//     await pool.query('SELECT 1');
//     res.json({ status: 'ok', db: 'connected' });
//   } catch (err) {
//     res.status(500).json({ status: 'error', db: 'not connected', error: err.message });
//   }
// });

// With this:
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'not connected', error: err.message });
  }
});
```

**Purpose:** 
- **$queryRaw**: Executes raw SQL for testing connection
- **Health check**: Verifies database connectivity
- **Error handling**: Provides clear feedback if database is down
- **Monitoring**: Helps identify database issues quickly

3. **Keep your existing routes** - no changes needed to route files

---

## 4. Key Changes Made to Your Lesson 6a Files

### Files Modified:
1. **`prisma/schema.prisma`** - NEW FILE: Prisma schema that maps to your existing database tables
2. **`prisma/db.js`** - NEW FILE: Prisma client instance for type-safe database access
3. **`controllers/userController.js`** - Replace PostgreSQL queries with Prisma Client methods
4. **`controllers/taskController.js`** - Replace PostgreSQL queries with Prisma Client methods
5. **`app.js`** - Update health check to use Prisma instead of PostgreSQL pool
6. **`.env`** - Reuse existing PostgreSQL connection string

### Major Changes:
- **Replaced PostgreSQL pool** with Prisma ORM for type-safe database operations
- **Added Prisma schema** - Declarative mapping to your existing database structure
- **Updated all database operations** to use Prisma Client methods instead of raw SQL queries
- **Maintained user ownership** - Same user_id parameter logic for security
- **Enhanced type safety** - Prisma validates data types automatically
- **Kept route structure** - No changes needed to route files, maintaining API consistency

---

## 5. Testing Your Prisma API

1. **Start your PostgreSQL database** (same as lesson 6a).
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

## 6. Comparing Prisma and PostgreSQL (pg) Approaches

| Feature                | pg (SQL/Pool)                | Prisma ORM                        |
|------------------------|------------------------------|-----------------------------------|
| Query style            | Raw SQL strings              | Type-safe JS/TS API               |
| Schema management      | Manual SQL/migrations        | Prisma schema + migrations        |
| Type safety            | None (unless using TS types) | Built-in                          |
| Autocomplete           | No                           | Yes (in editors with Prisma ext.) |
| Error handling         | Manual                       | Built-in                          |
| Relations              | Manual JOINs                 | Declarative in schema             |
| Refactoring            | Tedious                      | Easier (schema-driven)            |
| Learning curve         | Lower (for SQL users)        | Slightly higher, but modern       |

---

**Tips:**
- Your existing PostgreSQL database and data remain intact
- Check your `.env` file for correct database credentials
- Use `npx prisma studio` to view your database visually
- Test each endpoint individually to ensure proper functionality
- Use the [Prisma docs](https://www.prisma.io/docs/) for more advanced features
- Your validation schemas and routes remain unchanged!
- Remember to handle Prisma error codes appropriately in your try-catch blocks
- Use `parseInt()` when converting string user_id to integer for Prisma queries
- The `user_id` parameter ensures proper data isolation between users
- Prisma provides better type safety and autocomplete compared to raw SQL

