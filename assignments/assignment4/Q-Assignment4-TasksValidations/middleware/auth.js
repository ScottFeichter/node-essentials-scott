const { StatusCodes } = require("http-status-codes");
const { getLoggedOnUser } = require("../util/memoryStore");

const authMiddleware = (req, res, next) => {
  const loggedOnUser = getLoggedOnUser();
  if (!loggedOnUser) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "unauthorized" });
  }
  next();
};

module.exports = authMiddleware;