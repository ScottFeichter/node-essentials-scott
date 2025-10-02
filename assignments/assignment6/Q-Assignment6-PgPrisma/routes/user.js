const express = require("express");
const router = express.Router();
const { register, login, logoff } = require("../controllers/userController");

router.route("/").post(register);
router.route("/logon").post(login);
router.route("/logoff").post(logoff);

module.exports = router;