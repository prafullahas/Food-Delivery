import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({ success: false, message: "Not Authorized Login Again" });
  }
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(token_decode.id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    req.user = { id: user._id, role: user.role };
    next();
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"});
  }
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.json({ success: false, message: `Access denied. ${role} role required.` });
    }
  };
};

export { authMiddleware, requireRole };
