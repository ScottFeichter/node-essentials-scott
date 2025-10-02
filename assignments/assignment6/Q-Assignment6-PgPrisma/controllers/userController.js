const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const prisma = require("../prisma/db");
const { userSchema } = require("../validation/userSchema");

const register = async (req, res) => {
  if (!req.body) req.body = {};
  
  const { error, value } = userSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
  
  try {
    // Hash password using scrypt
    const hashedPassword = crypto.scryptSync(value.password, 'salt', 64).toString('hex');
    
    const newUser = await prisma.user.create({
      data: {
        email: value.email,
        name: value.name,
        hashedPassword: hashedPassword
      },
      select: {
        id: true,
        email: true,
        name: true
      }
    });
    
    // Store user_id globally after successful registration
    global.user_id = newUser.id;
    
    res.status(StatusCodes.CREATED).json(newUser);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        message: "User with this email already exists" 
      });
    }
    console.error('Registration error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Authentication Failed" });
    }
    
    // Compare hashed password
    const hashedInputPassword = crypto.scryptSync(password, 'salt', 64).toString('hex');
    const isValidPassword = hashedInputPassword === user.hashedPassword;
    
    if (!isValidPassword) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Authentication Failed" });
    }
    
    // Store user_id globally after successful login
    global.user_id = user.id;
    
    res.status(StatusCodes.OK).json({ name: user.name });
  } catch (error) {
    console.error('Login error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const logoff = (req, res) => {
  global.user_id = null;
  res.sendStatus(StatusCodes.OK);
};

module.exports = { register, login, logoff };