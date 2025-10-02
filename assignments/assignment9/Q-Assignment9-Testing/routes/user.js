const express = require("express");
const router = express.Router();
const { register, logoff } = require("../controllers/userController");
const { logonRouteHandler, jwtMiddleware } = require("../passport/passport");

router.route("/").post(register);
router.route("/logon").post(logonRouteHandler);
router.route("/logoff").post(jwtMiddleware, logoff);

module.exports = router;