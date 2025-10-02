# Week 10 Assignment: Deployment & Production

## Learning Objectives
- Understand production deployment strategies for Node.js applications
- Configure environment variables and production settings
- Implement health checks and monitoring
- Set up process management with PM2
- Configure reverse proxy with Nginx
- Implement logging and error tracking
- Understand Docker containerization basics
- Deploy to cloud platforms (Heroku/Railway)

## Assignment Guidelines

1. **Setup**
   - Work inside the `assignment10` folder for all your answers and code for this assignment.
2. **Create a branch:**
   - Create a new branch for your work on assignment 10 (e.g., `assignment10`).
   - Make all your changes and commits on this branch.

## Assignment Tasks

### 1. Production Configuration
- Create a production-ready Express application with:
  - Environment-based configuration
  - Security middleware (helmet, cors, rate limiting)
  - Proper error handling and logging
  - Health check endpoints
  - Graceful shutdown handling

### 2. Process Management
- Configure PM2 for process management:
  - Create ecosystem file for PM2
  - Set up clustering for multiple processes
  - Configure auto-restart and monitoring
  - Implement log rotation

### 3. Containerization
- Create Docker configuration:
  - Write Dockerfile for Node.js application
  - Create docker-compose.yml with database
  - Implement multi-stage builds
  - Configure environment variables

### 4. Deployment
- Deploy application to cloud platform:
  - Choose between Heroku or Railway
  - Configure database connection
  - Set up environment variables
  - Implement CI/CD pipeline (optional)

### 5. Monitoring & Logging
- Implement production monitoring:
  - Set up structured logging with Winston
  - Create application metrics endpoint
  - Implement error tracking
  - Configure uptime monitoring

## To Submit an Assignment

1. Do these commands:

    ```bash
    git add -A
    git commit -m "some meaningful commit message"
    git push origin assignment10  # The branch you are working in.
    ```
2. Go to your `node-homework` repository on GitHub.  Select your `assignment10` branch, the branch you were working on.  Create a pull request.  The target of the pull request should be the main branch of your GitHub repository.
3. Once the pull request (PR) is created, your browser contains the URL of the PR. Copy that to your clipboard.  Include that link in your homework submission.