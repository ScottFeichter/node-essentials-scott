# Week 11 Assignment: Application Enhancement Features

## Learning Objectives
- Implement OAuth authentication with Google
- Add role-based access control (RBAC)
- Implement server-side pagination with Prisma
- Create API documentation with Swagger
- Build bulk operations for multiple records
- Extend data models with additional associations

## Assignment Guidelines

1. **Setup**
   - Work inside the `assignment11` folder for all your answers and code for this assignment.
2. **Create a branch:**
   - Create a new branch for your work on assignment 11 (e.g., `assignment11`).
   - Make all your changes and commits on this branch.

## Assignment Tasks

### 1. OAuth Authentication with Google
- Implement Google OAuth authentication:
  - Set up Google OAuth credentials
  - Create OAuth routes and middleware
  - Handle user creation/login with Google tokens
  - Integrate with existing JWT authentication

### 2. Role-Based Access Control (RBAC)
- Extend user model with roles:
  - Add roles field to user schema
  - Create role-based middleware
  - Implement manager role with special permissions
  - Protect admin routes with role checks

### 3. Server-Side Pagination
- Implement Prisma pagination:
  - Add pagination to task queries
  - Create pagination middleware
  - Handle page size and offset parameters
  - Return pagination metadata

### 4. API Documentation with Swagger
- Set up Swagger documentation:
  - Install and configure swagger-jsdoc
  - Document all API endpoints
  - Create interactive API explorer
  - Include authentication examples

### 5. Bulk Operations
- Implement bulk task operations:
  - Bulk task completion
  - Bulk task deletion
  - Bulk task status updates
  - Transaction handling for data integrity

## To Submit an Assignment

1. Do these commands:

    ```bash
    git add -A
    git commit -m "some meaningful commit message"
    git push origin assignment11  # The branch you are working in.
    ```
2. Go to your `node-homework` repository on GitHub.  Select your `assignment11` branch, the branch you were working on.  Create a pull request.  The target of the pull request should be the main branch of your GitHub repository.
3. Once the pull request (PR) is created, your browser contains the URL of the PR. Copy that to your clipboard.  Include that link in your homework submission.