const express = require("express");
const errorHandler = require("./middleware/error-handler");
const notFound = require("./middleware/not-found");
const authMiddleware = require("./middleware/auth");

const app = express();

// Built-in middleware
app.use(express.json({ limit: "1kb" }));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

// User routes
const userRouter = require("./routes/user");
app.use("/user", userRouter);

// Analytics routes
const analyticsRouter = require("./routes/analyticsRoutes");
app.use("/analytics", analyticsRouter);

// Protected task routes
const taskRouter = require("./routes/task");
app.use("/tasks", authMiddleware, taskRouter);

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