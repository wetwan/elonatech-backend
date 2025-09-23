import jwt from "jsonwebtoken";
import User from "../model/user.js";

export const protectUser = async (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.json({ success: false, message: "Not authorized, Login again" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET );
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
