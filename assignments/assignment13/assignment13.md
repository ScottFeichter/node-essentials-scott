# Assignment 13: Authentication with Passport

## Learning Objectives
Discover a new tool called Passport and how to use it to authenticate data.

## Lesson Materials

### Authentication Approaches

When creating APIs, you can perform authentication using JavaScript Web Tokens (JWTs). The front end makes an API call passing credentials to the back end, and the back end returns a token, either in the body of the response or by setting a cookie. The front end then passes this token to the back end on all subsequent requests.

When the application does not have a separate front end to invoke the APIs, only the cookie approach can work. The browser is making the requests, and browsers cannot call arbitrary APIs or send authorization headers. But there has to be some way to save state, such as the state of being logged on. For applications without a way to call various API endpoints, like server-side rendered applications (that don't have any client-side scripts), this is done using "sessions", and sessions are established and maintained using cookies.

This way of handling security can be used for APIs as well, if the APIs are to be called from a browser. And, when using a browser, the cookie based approach is more secure, because sensitive information such as the JWT is not stored in local storage. However, when one server calls another, the cookie-based approach can't be used, as cookies only have meaning for browsers.

### Cookie-Based Authentication Flow

This is the general pattern that would be used in a cookie-based authentication flow:

1. The browser requests the logon page from the server (GET request), and then sends the credentials (eg: username and password) that were obtained from the user (POST request).
2. The server verifies the credentials, and if verification is successful, the server sends a response that includes a set-cookie response header to the browser. The cookie is a cryptographically signed string, signed with a secret key so that it can't be counterfeited by a malicious user. The browser automatically includes the cookie in the header of all subsequent requests to the same URL, until the cookie expires.
3. For all protected routes, the server has middleware that validates the cookie. Different browser sessions from different users have different cookie values, so the server can tell which user is making the request. On the server side, the cookie is used as a key to access session state data, which is kept on the server. This state data is the user's session.

## Accessibility (A11y)

Take a moment and think of a time when there was something you wanted or needed but didn't have access to it for some reason or another. Being denied access to something you want or need can feel beyond frustrating.

The internet is a very powerful tool. So many businesses give extra discounts to people with accounts on their sites; government offices keep forms on their sites now instead of keeping paper copies; medical offices now use client portals for people to be able to access and pay their accounts, scheduled appointments and services. Not being able to get around and use any of these sites can make something that was supposed to be a better/easier alternative seem like a huge stumbling block.

Accessibility focuses on making sure that those of us who are helping building these structures build them in a way that EVERYONE can use them easily. Last week you got an introduction into the challenges some people face when trying to use and interact with websites. Read the WebAim site starting with the "Implementing Web Accessibility" section then check out the A11y Checklist. We strongly recommend bookmarking a tool you can run your code through to help check for accessibility compliance (Wave from WebAIM) or a simple tool you can add to your code to help you check accessibility features on your site (like totA11y from Khan Academy).

Accessibility is a way bigger topic than we can cover here, but hopefully this starts your wheels turning about how to be sure that the awesome things you build throughout your career can be easily used by everyone.

This article talks about the importance of color alone

### Reflection Questions
Take a few moments now and consider the following:
- When you've had limited or no access to something, what did you do? Were you ultimately able to get what you needed? If not, how did your lack of access impact your life?
- Now that you've read about accessibility, and hopefully considered some of the challenges others face using the internet, perhaps there are things you can/will do differently in your current/future project(s) to help get into good accessibility habits as a programmer.

## Hungry For More
Introducing Typescript, Let's Go Docsss!!

- https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
- https://www.typescriptlang.org/docs/

## Assignment

**Due Date: Oct 07, 2025**

### Coding Assignment

In this lesson, you use the passport and passport-local npm packages to handle user authentication, from within a server-side rendered application.

#### First Steps

You continue to work with the same repository as the previous lesson, but you create a new branch called lesson13.

The user records are stored in the Mongo database, just as for the Jobs API lesson. You have already copied the models directory tree from the Jobs API lesson into the jobs-ejs repository. The user model is used unchanged. You configure passport to use that model.

#### Required Views

To begin, you will need the following views:

- `views/index.ejs`
- `views/logon.ejs`
- `views/register.ejs`

The index.ejs view just shows links to login or register. The logon.ejs view collects the email and password from the user. The register collects the name, email, and password for a new user. We want to use the partials as well. We want to modify the header partial to give the name of the logged on user, and to add a logoff button if a user is logged on.

##### views/index.ejs:
```html
<%- include("partials/head.ejs") %>
<%- include("partials/header.ejs") %>
<% if (user) { %>
    <a href="/secretWord">Click this link to view/change the secret word.</a>
<% } else { %>
    <a href="/sessions/logon">Click this link to logon.</a>
    <a href="/sessions/register">Click this link to register.</a>
<% } %>
<%- include("partials/footer.ejs") %>
```

##### views/logon.ejs:
```html
<%- include("partials/head.ejs") %>
<%- include("partials/header.ejs") %>
<form method="POST">
  <div>
    <label name="email">Enter your email:</label>
    <input name="email" />
  </div>
  <div>
    <label name="password">Enter your password:</label>
    <input type="password" name="password" />
  </div>
  <div>
    <button>Logon</button>
    <a href="/">
      <button type="button">Cancel</button>
    </a>
  </div>
</form>
<%- include("partials/footer.ejs") %>
```

##### views/register.ejs:
```html
<%- include("partials/head.ejs") %>
<%- include("partials/header.ejs") %>
<form method="POST">
  <div>
    <label name="name">Enter your name:</label>
    <input name="name" />
  </div>
  <div>
    <label name="email">Enter your email:</label>
    <input name="email" />
  </div>
  <div>
    <label name="password">Enter your password:</label>
    <input type="password" name="password" />
  </div>
  <div>
    <label name="password1">Confirm your password:</label>
    <input type="password" name="password1" />
  </div>
  <div>
    <button>Register</button>
    <a href="/">
      <button type="button">Cancel</button>
    </a>
  </div>
</form>
<%- include("partials/footer.ejs") %>
```

##### Revised views/partials/header.ejs:
```html
<h1>The Jobs EJS Application</h1>
<% if (user) { %>
   <p>User <%= user.name %> is logged on.</p>
   <form method="POST" action="/sessions/logoff">
   <button>Logoff</button>
   </form>
<% } %>
<% if (errors) {
    errors.forEach((err) => { %>
      <div>
        Error: <%= err %>
      </div>
    <% })
  } %>
  <% if (info) {
    info.forEach((msg) => { %>
      <div>
        Info: <%= msg %>
      </div>
    <% })
  } %>
<hr />
```

#### Router and Controller

Create a file `routes/sessionRoutes.js`:

```javascript
const express = require("express");
// const passport = require("passport");
const router = express.Router();

const {
  logonShow,
  registerShow,
  registerDo,
  logoff,
} = require("../controllers/sessionController");

router.route("/register").get(registerShow).post(registerDo);
router
  .route("/logon")
  .get(logonShow)
  .post(
    // passport.authenticate("local", {
    //   successRedirect: "/",
    //   failureRedirect: "/sessions/logon",
    //   failureFlash: true,
    // })
    (req, res) => {
      res.send("Not yet implemented.");
    }
  );
router.route("/logoff").post(logoff);

module.exports = router;
```

Create `controllers/sessionController.js`:

```javascript
const User = require("../models/User");
const parseVErr = require("../util/parseValidationErr");

const registerShow = (req, res) => {
  res.render("register");
};

const registerDo = async (req, res, next) => {
  if (req.body.password != req.body.password1) {
    req.flash("error", "The passwords entered do not match.");
    return res.render("register", {  errors: flash("errors") });
  }
  try {
    await User.create(req.body);
  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseVErr(e, req);
    } else if (e.name === "MongoServerError" && e.code === 11000) {
      req.flash("error", "That email address is already registered.");
    } else {
      return next(e);
    }
    return res.render("register", {  errors: flash("errors") });
  }
  res.redirect("/");
};

const logoff = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
};

const logonShow = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("logon", {
    errors: req.flash("error"),
    info: req.flash("info"),
  });
};

module.exports = {
  registerShow,
  registerDo,
  logoff,
  logonShow,
};
```

Create `util/parseValidationErrs.js`:

```javascript
const parseValidationErrors = (e, req) => {
  const keys = Object.keys(e.errors);
  keys.forEach((key) => {
    req.flash("error", key + ": " + e.errors[key].properties.message);
  });
};

module.exports = parseValidationErrors;
```

Create `middleware/storeLocals.js`:

```javascript
const storeLocals = (req, res, next) => {
  if (req.user) {
    res.locals.user = req.user;
  } else {
    res.locals.user = null;
  }
  res.locals.info = req.flash("info");
  res.locals.errors = req.flash("error");
  next();
};

module.exports = storeLocals;
```

Add these lines to app.js right after the connect-flash line:

```javascript
app.use(require("./middleware/storeLocals"));
app.get("/", (req, res) => {
  res.render("index");
});
app.use("/sessions", require("./routes/sessionRoutes"));
```

#### Database Connection

Create `db/connect.js`:

```javascript
const mongoose = require("mongoose");

const connectDB = (url) => {
  return mongoose.connect(url, {});
};

module.exports = connectDB;
```

Add this line to app.js, just before the listen line:

```javascript
await require("./db/connect")(process.env.MONGO_URI);
```

#### Configuring Passport

Create `passport/passportInit.js`:

```javascript
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

const passportInit = () => {
  passport.use(
    "local",
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email });
          if (!user) {
            return done(null, false, { message: "Incorrect credentials." });
          }

          const result = await user.comparePassword(password);
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect credentials." });
          }
        } catch (e) {
          return done(e);
        }
      }
    )
  );

  passport.serializeUser(async function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
    try {
      const user = await User.findById(id);
      if (!user) {
        return done(new Error("user not found"));
      }
      return done(null, user);
    } catch (e) {
      done(e);
    }
  });
};

module.exports = passportInit;
```

Add to app.js, right after the app.use for session:

```javascript
const passport = require("passport");
const passportInit = require("./passport/passportInit");

passportInit();
app.use(passport.initialize());
app.use(passport.session());
```

Uncomment the Passport lines in `routes/sessionRoutes.js`:

```javascript
router
  .route("/logon")
  .get(logonShow)
  .post(
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/sessions/logon",
      failureFlash: true,
    })
  );
```

Update `logonShow` in `controllers/sessionController.js`:

```javascript
const logonShow = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("logon");
};
```

#### Protecting a Route

Create `middleware/auth.js`:

```javascript
const authMiddleware = (req, res, next) => {
  if (!req.user) {
    req.flash("error", "You can't access that page before logon.");
    res.redirect("/");
  } else {
    next();
  }
};

module.exports = authMiddleware;
```

Create `routes/secretWord.js`:

```javascript
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  if (!req.session.secretWord) {
    req.session.secretWord = "syzygy";
  }

  res.render("secretWord", { secretWord: req.session.secretWord });
});

router.post("/", (req, res) => {
  if (req.body.secretWord.toUpperCase()[0] == "P") {
    req.flash("error", "That word won't work!");
    req.flash("error", "You can't use words that start with p.");
  } else {
    req.session.secretWord = req.body.secretWord;
    req.flash("info", "The secret word was changed.");
  }

  res.redirect("/secretWord");
});

module.exports = router;
```

Replace the app.get and app.post statements for "/secretWord" routes in app.js:

```javascript
const auth = require("./middleware/auth");
const secretWordRouter = require("./routes/secretWord");
app.use("/secretWord", auth, secretWordRouter);
```

## RMOR Comprehension Check
Take the FINAL RMOR Comprehension Check as review of what you learned throughout our class.

## Mindset Assignment
No Mindset Assignment this week - focus on your lesson! Please put "N/A" in the Mindset Response section of your assignment submission form.