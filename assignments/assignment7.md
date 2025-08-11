# Assignment 7: Advanced Prisma ORM Features

## Learning Objectives
- Implement eager loading to optimize database queries and eliminate N+1 problems
- Use groupBy operations for data aggregation and analytics
- Implement database transactions for data consistency
- Perform batch operations for better performance
- Use advanced Prisma query patterns and filtering
- Implement raw SQL with $queryRaw when needed
- Apply performance optimization techniques

## Assignment Overview
Building on your existing Prisma application from Lesson 6b, you'll enhance it with advanced features learned in Lesson 7. You'll add analytics endpoints, implement complex queries, and optimize performance while maintaining the same API structure.

## Prerequisites
- Completed Lesson 6b with a working Prisma application
- PostgreSQL database with users and tasks tables
- Basic understanding of Prisma ORM operations

---

## Assignment Tasks

### 1. Enhanced Task Analytics API

#### a. User Productivity Analytics Endpoint
Create a new endpoint `GET /api/users/:id/analytics` that provides comprehensive user statistics:

**Requirements:**
- Use `groupBy` to count tasks by completion status
- Include recent task activity (last 10 tasks)
- Calculate weekly progress metrics
- Use eager loading to fetch related user data efficiently

**Expected Response:**
```json
{
  "taskStats": [
    { "isCompleted": false, "_count": { "id": 5 } },
    { "isCompleted": true, "_count": { "id": 12 } }
  ],
  "recentTasks": [
    {
      "id": 1,
      "title": "Recent task",
      "isCompleted": false,
      "user": { "name": "John Doe" }
    }
  ],
  "weeklyProgress": [
    { "createdAt": "2024-01-15", "_count": { "id": 3 } }
  ]
}
```

#### b. User List with Task Counts
Create `GET /api/users` endpoint that shows all users with their task statistics:

**Requirements:**
- Show all users with their total task counts
- Include pending (incomplete) tasks for each user
- Use `_count` aggregation for efficient counting
- Implement pagination (limit to 10 users per page)
- Exclude sensitive information like passwords

### 2. Advanced Query Implementation

#### a. Complex Task Filtering
Enhance your existing `GET /api/tasks` endpoint to support advanced filtering:

**New Query Parameters:**
- `status`: Filter by completion status
- `priority`: Filter by priority (if you add this field)
- `date_range`: Filter by creation date range
- `search`: Text search in task titles
- `sort_by`: Sort by different fields
- `sort_order`: Ascending or descending order

**Implementation Requirements:**
- Use Prisma's advanced `where` clauses with `AND`, `OR`, `NOT`
- Implement proper input validation
- Use `select` to limit returned fields for performance
- Add pagination support

#### b. Task Search with Raw SQL
Create a new endpoint `GET /api/tasks/search` that uses `$queryRaw` for complex text search:

**Requirements:**
- Search across task titles and user names
- Use PostgreSQL's `ILIKE` for case-insensitive search
- Implement relevance scoring (exact matches first)
- Use parameterized queries to prevent SQL injection
- Include user information in results

**Example Query:**
```sql
SELECT t.*, u.name as user_name
FROM tasks t
JOIN users u ON t.user_id = u.id
WHERE t.title ILIKE $1 OR u.name ILIKE $1
ORDER BY 
  CASE WHEN t.title ILIKE $1 THEN 1 ELSE 2 END,
  t.created_at DESC
```

### 3. Database Transactions

#### a. User Registration with Welcome Tasks
Enhance your user registration to create initial tasks automatically:

**Requirements:**
- Use `$transaction` to ensure data consistency
- Create user account
- Create 3 welcome tasks (e.g., "Complete your profile", "Add your first task", "Explore the app")
- If any operation fails, rollback everything
- Return the created user with their welcome tasks

#### b. Bulk Task Operations
Implement `POST /api/tasks/bulk` for creating multiple tasks:

**Requirements:**
- Accept an array of task objects
- Use `createMany` for batch insertion
- Validate all tasks before insertion
- Return success count and any errors
- Use transactions if you need to ensure all-or-nothing behavior

### 4. Performance Optimization

#### a. Implement Pagination
Add pagination to all list endpoints:

**Requirements:**
- Use `take` and `skip` for offset-based pagination
- Implement cursor-based pagination for better performance
- Add pagination metadata to responses
- Handle edge cases (invalid page numbers, empty results)

#### b. Selective Field Loading
Optimize your existing endpoints to load only necessary fields:

**Requirements:**
- Use `select` to exclude sensitive data (passwords)
- Implement different response schemas for different use cases
- Add a `fields` query parameter to let clients specify which fields they need
- Document the available field options

### 5. Error Handling and Validation

#### a. Enhanced Error Handling
Improve error handling across your application:

**Requirements:**
- Handle Prisma-specific error codes (P2025, P2002, etc.)
- Provide meaningful error messages
- Implement proper HTTP status codes
- Add request logging for debugging

#### b. Input Validation
Enhance your existing validation:

**Requirements:**
- Validate date ranges for analytics queries
- Sanitize search inputs
- Validate pagination parameters
- Add rate limiting for search endpoints

---

## Implementation Guidelines

### File Structure
Your enhanced application should maintain the same structure as Lesson 6b, with these additions:

```
project/
├── controllers/
│   ├── userController.js (enhanced)
│   ├── taskController.js (enhanced)
│   └── analyticsController.js (new)
├── routes/
│   ├── userRoutes.js (enhanced)
│   ├── taskRoutes.js (enhanced)
│   └── analyticsRoutes.js (new)
├── prisma/
│   ├── schema.prisma
│   └── db.js
├── app.js (enhanced)
└── .env
```

### Code Quality Requirements
- Use async/await consistently
- Implement proper error handling
- Add JSDoc comments for complex functions
- Follow consistent naming conventions
- Use environment variables for configuration

### Testing Requirements
Test all new endpoints with Postman or similar tools:

1. **Analytics Endpoints:**
   - Test with existing users and tasks
   - Verify aggregation calculations
   - Test with empty data sets

2. **Advanced Filtering:**
   - Test all filter combinations
   - Verify pagination works correctly
   - Test edge cases (invalid parameters)

3. **Transactions:**
   - Test successful operations
   - Test failure scenarios (verify rollback)
   - Test concurrent operations

4. **Performance:**
   - Test with large datasets
   - Verify pagination performance
   - Check query execution times

---

## Submission Requirements

### Code Submission
- All enhanced files with new functionality
- Updated Prisma schema (if you added new fields)
- Environment configuration
- Clear documentation of new endpoints

### Testing Documentation
- Postman collection or curl commands for testing
- Test results showing all endpoints working
- Performance metrics (if applicable)
- Any issues encountered and solutions

### Bonus Challenges
- Implement caching for analytics endpoints
- Add real-time updates using WebSockets
- Create a dashboard frontend for analytics
- Implement advanced search with full-text search
- Add task categories and tags

---

## Grading Criteria

| Criteria | Points | Description |
|----------|--------|-------------|
| **Analytics Implementation** | 25 | Working analytics endpoints with proper aggregations |
| **Advanced Queries** | 25 | Complex filtering, search, and pagination |
| **Transactions** | 20 | Proper transaction handling and error management |
| **Performance** | 15 | Pagination, selective loading, and optimization |
| **Code Quality** | 10 | Clean code, error handling, and documentation |
| **Testing** | 5 | All endpoints tested and working |

**Total: 100 points**

---

## Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Prisma Query Examples](https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting)
- [PostgreSQL Text Search](https://www.postgresql.org/docs/current/textsearch.html)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

---

## Getting Help

- Review Lesson 7 materials thoroughly
- Check Prisma error codes in the documentation
- Use `console.log` and Prisma query logging for debugging
- Test queries incrementally before implementing full endpoints
- Ask for help if you're stuck on specific concepts

**Remember:** This assignment builds on your existing work from Lesson 6b. Focus on enhancing what you already have rather than rebuilding from scratch!
