# Assignment 3 Complete - Middleware and User Routes

## Task 1: User Registration, Login, and Logout

### Files Created:
- **`util/memoryStore.js`** - In-memory storage for users and logged-on user state
- **`controllers/userController.js`** - Controller functions for register, login, logoff
- **`routes/user.js`** - User routes with proper Express router structure

### User Routes Implemented:
- **POST `/user`** - User registration with JSON body parsing
- **POST `/user/logon`** - User login with email/password validation
- **POST `/user/logoff`** - User logout functionality

### Key Features:
- ✅ JSON request body parsing with express.json()
- ✅ Proper status codes (CREATED, OK, UNAUTHORIZED)
- ✅ Password validation and user authentication
- ✅ Organized code structure with controllers and routes
- ✅ Memory-based user storage system

## Task 2: Debugging Middleware (Dog Rescue App)

### Middleware Implemented:
- **Request ID Middleware** - Adds unique UUID to each request and response headers
- **Logging Middleware** - Logs timestamp, method, path, and request ID
- **JSON Parsing** - Handles POST requests with JSON bodies
- **Static File Serving** - Serves dog images from `/images` endpoint
- **Error Handling** - Custom error handler with request ID tracking

### Dog Rescue Routes:
- **GET `/dogs`** - Returns list of adoptable dogs
- **GET `/images/dachshund.png`** - Serves static dog images
- **POST `/adopt`** - Handles adoption applications
- **GET `/error`** - Test route for error handling

### Key Features:
- ✅ UUID-based request tracking with X-Request-Id headers
- ✅ Structured logging: `[timestamp]: METHOD path (requestID)`
- ✅ Static file serving for dog images
- ✅ JSON body parsing for adoption forms
- ✅ Comprehensive error handling with request ID context
- ✅ 404 handling for unknown routes

## Technical Implementation:
- **Express Router** - Organized route structure
- **Custom Middleware** - Request ID generation and logging
- **Built-in Middleware** - JSON parsing and static file serving
- **Error Handling** - Global error handler with proper status codes
- **Memory Storage** - Simple in-memory user management
- **Status Codes** - Proper HTTP status code usage throughout

## Testing:
- User registration/login can be tested via Postman
- Dog adoption form handles JSON POST requests
- Static images served from `/images` endpoint
- Error handling tested via `/error` route
- All middleware logs requests with unique IDs

The assignment demonstrates understanding of Express middleware patterns, request/response handling, route organization, and proper error handling in a production-like application structure.