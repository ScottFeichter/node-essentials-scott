# Final RMOR - Authentication with Passport Week

## Multiple Choice Questions

### 1. Which method is used to handle asynchronous results from a promise?
**Answer: `.then()`**

**Explanation:** The `.then()` method is used to handle the resolved value of a promise. While `.await()` is used with async/await syntax, `.then()` is the traditional promise handling method.

### 2. What is the primary purpose of using regular expressions (regex)?
**Answer: To search for, match, and manipulate specific patterns within text data.**

**Explanation:** Regular expressions are powerful tools for pattern matching in strings, commonly used for validation, searching, and text manipulation.

### 3. What does Express do for Node.js? (Select all that apply)
**Answers:**
- ✅ Provides a framework for building web applications and APIs
- ✅ Manages and handles HTTP requests and responses
- ❌ Replaces the built-in http module in Node.js
- ✅ Simplifies routing and middleware integration
- ❌ Automatically handles database connections

**Explanation:** Express is a web framework that builds on top of Node.js's http module, providing routing, middleware, and request/response handling. It doesn't replace the http module or automatically handle databases.

### 4. Which method would you use to merge two or more arrays into a single array?
**Answer: `concat()`**

**Explanation:** The `concat()` method creates a new array by merging existing arrays without modifying the original arrays.

### 5. What is the role of planning/pseudo code in problem-solving?
**Answer: Planning involves outlining the exact steps needed to solve the problem before starting to code**

**Explanation:** Planning and pseudo code help break down complex problems into manageable steps, reducing errors and improving code quality.

### 6. Which method can be used to execute a function on each element of an array and return a new array with the results?
**Answer: `map()`**

**Explanation:** The `map()` method creates a new array by calling a function on each element of the original array and collecting the results.

### 7. What is the purpose of the build command in the Render.com deployment setup for a Node.js application?
**Answer: To execute scripts and prepare the application for deployment**

**Explanation:** The build command runs necessary scripts to prepare the application for production, such as installing dependencies and running build processes.

### 8. Which of the following techniques can help reduce latency and improve the efficiency of an API?
**Answer: Optimizing database queries and ensuring proper indexing**

**Explanation:** Database optimization is crucial for API performance. Proper indexing and query optimization significantly reduce response times.

### 9. Which of the following features can be specified in a Mongoose schema? (Select all that apply)
**Answers:**
- ✅ Data types for each field (e.g., String, Number, Date)
- ✅ Validation rules for data (e.g., required fields, min/max length)
- ✅ Indexes for optimizing query performance
- ✅ Methods for data manipulation and querying

**Explanation:** Mongoose schemas are comprehensive and allow defining data types, validation, indexes, and custom methods.

### 10. What is a key benefit of using cross-disciplinary collaboration when solving complex problems with technology?
**Answer: It brings together diverse perspectives and expertise to develop more innovative solutions**

**Explanation:** Different disciplines bring unique viewpoints and expertise, leading to more creative and comprehensive solutions.

### 11. What role does user-centered design play in creating effective technological solutions?
**Answer: It focuses on meeting the needs and preferences of the end-users to enhance usability and effectiveness**

**Explanation:** User-centered design ensures technology serves real user needs, improving adoption and effectiveness.

### 12. Which of the following methods or options can be used to sort query results in MongoDB? (Select all that apply)
**Answers:**
- ✅ Using the sort() method with a sorting document
- ❌ Using the find() method with a limit option
- ✅ Using the find() method with a sort option
- ✅ Using the aggregate() method with a $sort stage

**Explanation:** MongoDB provides multiple ways to sort results through sort() method, find() with sort option, and $sort in aggregation pipelines.

### 13. What does the unique: true property do in a Mongoose schema?
**Answer: Enforces that the field's value is unique in the collection**

**Explanation:** The unique property creates a unique index, ensuring no duplicate values exist for that field across documents.

### 14. What is the purpose of indexing in MongoDB?
**Answer: To improve query performance by reducing search time**

**Explanation:** Indexes create efficient data structures that allow MongoDB to quickly locate documents without scanning entire collections.

## Written Response Questions

### Node.js Description
Node.js is a JavaScript runtime environment that allows developers to run JavaScript on the server side. It uses an event-driven, non-blocking I/O model that makes it efficient for building scalable network applications. Node.js enables full-stack JavaScript development and is particularly well-suited for real-time applications, APIs, and microservices.

### API Description
An API (Application Programming Interface) is a set of rules and protocols that allows different software applications to communicate with each other. It defines the methods, data formats, and conventions that applications use to request and exchange information. APIs enable integration between systems and allow developers to access functionality or data from external services without knowing their internal implementation.

### Application Deployment Description
Application deployment involves taking code from development and making it available in a production environment. For a Node.js Express application on Render.com with MongoDB:

1. **Database Setup**: Create MongoDB Atlas cluster, configure network access and database users
2. **Environment Variables**: Set DATABASE_URL, JWT_SECRET, and other sensitive data in Render's environment settings
3. **Code Deployment**: Connect GitHub repository to Render, configure build and start commands
4. **Database Connection**: Use Mongoose to connect to MongoDB using the connection string from environment variables
5. **Security**: Ensure all secrets are stored as environment variables, never in code

### Mongoose and MongoDB Usage
Mongoose is an Object Document Mapper (ODM) for MongoDB and Node.js. It provides a schema-based solution for modeling application data, including built-in type casting, validation, query building, and business logic hooks. Mongoose simplifies MongoDB operations by providing a more structured approach with schemas, models, and middleware, making database interactions more predictable and maintainable.

### API Performance Strategies
Key strategies for improving API performance include:
- **Database Optimization**: Proper indexing, efficient queries, connection pooling
- **Caching**: Implement Redis or in-memory caching for frequently accessed data
- **Rate Limiting**: Prevent abuse and ensure fair resource usage
- **Compression**: Use gzip compression for responses
- **Pagination**: Limit response sizes for large datasets
- **Asynchronous Processing**: Use async/await and non-blocking operations
- **Load Balancing**: Distribute traffic across multiple server instances

### Project Functionality Description
This task management API provides a complete backend solution for organizing personal tasks. The system features secure user authentication with JWT tokens, allowing users to register, login, and manage their personal task lists. Users can create tasks with titles, descriptions, and priority levels, mark them as complete, update details, and delete individual or multiple tasks at once. The application uses PostgreSQL for reliable data storage with proper user-task relationships, implements comprehensive security measures including password hashing and input validation, and includes filtering capabilities to view completed or pending tasks. Built with Node.js and Express, it's designed for deployment on cloud platforms and includes a full test suite ensuring reliability and maintainability.