const crypto = require("crypto");
const prisma = require("../prisma/db");

const createUser = async ({ email, password, name }) => {
  const hashedPassword = crypto.scryptSync(password, 'salt', 64).toString('hex');
  
  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword
    }
  });
  
  return user;
};

const verifyUserPassword = async (email, password) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return { user: null, isValid: false };
    }
    
    const hashedInputPassword = crypto.scryptSync(password, 'salt', 64).toString('hex');
    const isValid = hashedInputPassword === user.hashedPassword;
    
    return { user, isValid };
  } catch (error) {
    throw error;
  }
};

module.exports = { createUser, verifyUserPassword };