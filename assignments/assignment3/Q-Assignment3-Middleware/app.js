const express = require("express");
const { v4: uuidv4 } = require("uuid");
const errorHandler = require("./middleware/error-handler");
const notFound = require("./middleware/not-found");

const app = express();

// Custom middleware for request ID
app.use((req, res, next) => {
  req.requestId = uuidv4();
  res.setHeader('X-Request-Id', req.requestId);
  next();
});

// Custom logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}]: ${req.method} ${req.path} (${req.requestId})`);
  next();
});

// Built-in middleware for JSON parsing
app.use(express.json({ limit: "1kb" }));

// Static file serving for images
app.use('/images', express.static('public/images'));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

// Error test route
app.get("/error", (req, res) => {
  throw new Error("Test error for middleware debugging");
});

// User routes
const userRouter = require("./routes/user");
app.use("/user", userRouter);

// Dogs routes
const dogsRouter = require("./routes/dogs");
app.use("/dogs", dogsRouter);

// Middleware (order matters)
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;

let isShuttingDown = false;

async function shutdown() {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log('Shutting down gracefully...');
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  shutdown();
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  shutdown();
});

try {
  app.listen(port, () =>
    console.log(`Server is listening on port ${port}...`),
  );
} catch (error) {
  console.log(error);
}