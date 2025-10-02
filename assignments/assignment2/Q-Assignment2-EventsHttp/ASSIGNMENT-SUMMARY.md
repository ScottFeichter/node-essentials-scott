# Assignment 2 Complete - Events, HTTP, and Express

## Files Created:

### Task 1: Event Emitter
- **`events.js`** - Event emitter that listens for 'time' events and emits current time every 5 seconds

### Task 2: HTTP Server
- **`sampleHTTP.js`** - HTTP server with:
  - `/time` endpoint returning JSON with current time
  - `/timePage` endpoint serving HTML page with interactive time button
  - First REST API implementation

### Task 3: Express Application
- **`app.js`** - Express server with:
  - Basic "Hello, World!" route
  - Error handling middleware
  - 404 not-found middleware
  - Graceful shutdown handling
  - Logging middleware
  - POST route for testing

### Task 4: POST Route
- **POST `/testpost`** - Test endpoint for POST requests

### Task 5: Logging Middleware
- **Logging middleware** - Logs method, path, and query parameters for all requests

### Middleware Files:
- **`middleware/error-handler.js`** - Centralized error handling
- **`middleware/not-found.js`** - 404 error handling
- **`package.json`** - Dependencies and scripts configuration

## Key Features Implemented:
- ✅ Event emitter with time broadcasting
- ✅ HTTP server with JSON and HTML endpoints
- ✅ Express application with proper middleware structure
- ✅ Error handling and 404 responses
- ✅ Request logging middleware
- ✅ POST route handling
- ✅ Graceful shutdown process
- ✅ Organized code structure with separate middleware files

## Testing:
- Events: Run `node events.js` to see time events every 5 seconds
- HTTP Server: Run `node sampleHTTP.js` and visit http://localhost:3001/timePage
- Express App: Run `npm start` or `npm run dev` and test various endpoints
- POST testing available via Postman at `/testpost`

The assignment demonstrates understanding of Node.js events, HTTP servers, Express framework, middleware patterns, and proper error handling.