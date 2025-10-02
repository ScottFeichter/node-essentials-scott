const crypto = require("crypto");
const prisma = require("../prisma/db");

const verifyUserPassword = async (email, password) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return { user: null, isValid: false };
    }
    
    // Compare hashed password
    const hashedInputPassword = crypto.scryptSync(password, 'salt', 64).toString('hex');
    const isValid = hashedInputPassword === user.hashedPassword;
    
    return { user, isValid };
  } catch (error) {
    throw error;
  }
};

module.exports = { verifyUserPassword };