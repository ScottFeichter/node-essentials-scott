const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const prisma = require("../prisma/db");
const { userSchema } = require("../validation/userSchema");
const { setJwtCookie } = require("../passport/passport");

const register = async (req, res) => {
  if (!req.body) req.body = {};
  
  const { error, value } = userSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
  
  try {
    const result = await prisma.$transaction(async (tx) => {
      const hashedPassword = crypto.scryptSync(value.password, 'salt', 64).toString('hex');
      
      const newUser = await tx.user.create({
        data: {
          email: value.email,
          name: value.name,
          hashedPassword: hashedPassword
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true
        }
      });
      
      const welcomeTasks = await tx.task.createMany({
        data: [
          { title: "Complete your profile", userId: newUser.id, priority: "high" },
          { title: "Add your first task", userId: newUser.id, priority: "medium" },
          { title: "Explore the app", userId: newUser.id, priority: "low" }
        ]
      });

      const createdTasks = await tx.task.findMany({
        where: { userId: newUser.id },
        select: { id: true, title: true, isCompleted: true, userId: true }
      });
      
      return { user: newUser, welcomeTasks: createdTasks };
    });
    
    setJwtCookie(req, res, result.user);
    
    res.status(StatusCodes.CREATED).json({
      ...result,
      csrfToken: req.user.csrfToken,
      transactionStatus: "success"
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        message: "User with this email already exists" 
      });
    }
    throw error;
  }
};

const logoff = (req, res) => {
  res.clearCookie("jwt");
  res.sendStatus(StatusCodes.OK);
};

module.exports = { register, logoff };