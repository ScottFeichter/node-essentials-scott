const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { xss } = require("express-xss-sanitizer");
const rateLimiter = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error-handler");
const notFound = require("./middleware/not-found");
const { jwtMiddleware } = require("./passport/passport");

const app = express();

// Rate limiting - first middleware
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }),
);

// Security middleware
app.use(helmet());

// CORS configuration
const origins = [];
if (process.env.ALLOWED_ORIGINS) {
  const originArray = process.env.ALLOWED_ORIGINS.split(",");
  originArray.forEach((orig) => {
    orig = orig.trim();
    if (orig.length > 4) {
      origins.push(orig);
    }
  });
  app.use(
    cors({
      origin: origins,
      credentials: true,
      methods: "GET,POST,PATCH,DELETE",
      allowedHeaders: "CONTENT-TYPE, X-CSRF-TOKEN",
    }),
  );
}

// Cookie parser
app.use(cookieParser(process.env.JWT_SECRET));

// Body parsing middleware
app.use(express.json({ limit: "1kb" }));

// XSS protection - after body parsers
app.use(xss());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

// User routes
const userRouter = require("./routes/user");
app.use("/user", userRouter);

// Protected task routes
const taskRouter = require("./routes/task");
app.use("/tasks", jwtMiddleware, taskRouter);

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