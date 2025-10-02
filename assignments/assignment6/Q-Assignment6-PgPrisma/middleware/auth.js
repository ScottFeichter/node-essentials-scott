const { StatusCodes } = require("http-status-codes");

const authMiddleware = (req, res, next) => {
  if (!global.user_id) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "unauthorized" });
  }
  next();
};

module.exports = authMiddleware;