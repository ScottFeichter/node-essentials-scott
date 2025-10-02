const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { xss } = require("express-xss-sanitizer");
const rateLimiter = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const { jwtMiddleware } = require("./passport/passport");

const app = express();

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);

app.use(helmet());

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

app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json({ limit: "1kb" }));
app.use(xss());

app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

const userRouter = require("./routes/user");
app.use("/user", userRouter);

const taskRouter = require("./routes/task");
app.use("/tasks", jwtMiddleware, taskRouter);

app.use((req, res) => {
  res.status(404).json({ message: `You can't do a ${req.method} for ${req.url}` });
});

app.use((err, req, res, next) => {
  console.log("Internal server error", err.constructor.name, err.message);
  if (!res.headersSent) {
    return res.status(500).json({ message: "An internal server error occurred." });
  }
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});

module.exports = { app, server };