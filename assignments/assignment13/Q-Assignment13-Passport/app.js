// Import required modules for Express application
const express = require("express");
// Automatically catch async errors in route handlers
require("express-async-errors");
// Load environment variables from .env file
require("dotenv").config();

// Session management dependencies
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
// Passport authentication middleware
const passport = require("passport");
const passportInit = require("./passport/passportInit");

// Create Express application instance
const app = express();

// Configure EJS as the template engine
app.set("view engine", "ejs");
// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Configure MongoDB session store for persistent sessions
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "mySessions",
});

// Handle MongoDB session store errors
store.on("error", function (error) {
  console.log(error);
});

// Session configuration parameters
const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};

// Enable secure cookies in production environment
if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sessionParms.cookie.secure = true;
}

// Initialize session middleware
app.use(session(sessionParms));

// Initialize Passport authentication
passportInit();
app.use(passport.initialize());
app.use(passport.session());

// Enable flash messages for user feedback
app.use(require("connect-flash")());
// Make user context and flash messages available to all views
app.use(require("./middleware/storeLocals"));

/**
 * Home page route - renders index view with conditional content
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.get("/", (req, res) => {
  res.render("index");
});

// Mount session-related routes (login, register, logout)
app.use("/sessions", require("./routes/sessionRoutes"));

// Import authentication middleware and secret word routes
const auth = require("./middleware/auth");
const secretWordRouter = require("./routes/secretWord");
// Protect secret word routes with authentication middleware
app.use("/secretWord", auth, secretWordRouter);

/**
 * 404 Not Found handler - catches all unmatched routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

/**
 * Global error handler - catches all application errors
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send(err.message);
});

// Server port configuration
const port = process.env.PORT || 3000;

/**
 * Start the server and connect to database
 * @async
 * @function start
 * @description Initializes database connection and starts Express server
 */
const start = async () => {
  try {
    await require("./db/connect")(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

// Start the application
start();