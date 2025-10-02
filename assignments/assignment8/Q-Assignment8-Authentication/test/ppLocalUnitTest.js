require("../passport/passport");
const passport = require("passport");
const req = { body: { email: "jim@sample8.com", password: "wX23-combo" } };
const reportPassportResult = (err, user) => {
  if (err) {
    return console.log("An error happened on authentication:", err.message);
  }
  if (user) {
    return console.log("Authentication succeeded, and the user information is:", JSON.stringify(user));
  }
  console.log("Authentication Failed" )
};
const passportLocalMiddleware = passport.authenticate("local", reportPassportResult);
passportLocalMiddleware(req, {});