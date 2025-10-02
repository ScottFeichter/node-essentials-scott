const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const util = require("util");
const { storedUsers, setLoggedOnUser } = require("../util/memoryStore");
const { userSchema } = require("../validation/userSchema");

const scrypt = util.promisify(crypto.scrypt);

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function comparePassword(inputPassword, storedHash) {
  const [salt, key] = storedHash.split(":");
  const keyBuffer = Buffer.from(key, "hex");
  const derivedKey = await scrypt(inputPassword, salt, 64);
  return crypto.timingSafeEqual(keyBuffer, derivedKey);
}

const register = async (req, res) => {
  if (!req.body) req.body = {};
  
  const { error, value } = userSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
  
  const hashedPassword = await hashPassword(value.password);
  const newUser = { 
    name: value.name, 
    email: value.email, 
    hashedPassword 
  };
  
  storedUsers.push(newUser);
  setLoggedOnUser(newUser);
  
  res.status(StatusCodes.CREATED).json({ name: newUser.name, email: newUser.email });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = storedUsers.find(u => u.email === email);
  
  if (!user || !(await comparePassword(password, user.hashedPassword))) {
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