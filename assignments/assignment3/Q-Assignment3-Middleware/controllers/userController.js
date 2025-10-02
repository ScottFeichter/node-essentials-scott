const { StatusCodes } = require("http-status-codes");
const { storedUsers, setLoggedOnUser } = require("../util/memoryStore");

const register = (req, res) => {
  const newUser = { ...req.body };
  storedUsers.push(newUser);
  setLoggedOnUser(newUser);
  delete req.body.password;
  res.status(StatusCodes.CREATED).json(req.body);
};

const login = (req, res) => {
  const { email, password } = req.body;
  const user = storedUsers.find(u => u.email === email);
  
  if (!user || user.password !== password) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Authentication Failed" });
  }
  
  setLoggedOnUser(user);
  res.status(StatusCodes.OK).json({ name: user.name });
};

const logoff = (req, res) => {
  setLoggedOnUser(null);
  res.sendStatus(StatusCodes.OK);
};

module.exports = { register, login, logoff };