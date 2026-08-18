import jwt from "jsonwebtoken";

import User from "../models/User.js";

//--->>> AUTHENTICATION MIDDLEWARE

export const protect = async (req, res, next) => {
  try {
    //--->>> GET TOKEN FROM HTTP-ONLY COOKIE

    const token = req.cookies?.token;

    //--->>> TOKEN NOT FOUND

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login.",
      });
    }

    //--->>> VERIFY JWT

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //--->>> FIND USER

    const user = await User.findById(decoded.userId);

    //--->>> USER NOT FOUND

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account no longer exists.",
      });
    }

    //---->>> CHECK ACCOUNT STATUS

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been disabled.",
      });
    }

    //--->> ATTACH USER TO REQUEST

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      authProvider: user.authProvider,
    };

    //--->>> CONTINUE

    next();
  } catch (error) {
    //--->> INVALID OR EXPIRED TOKEN

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Your session has expired. Please login again.",
      });
    }

    //--->>> SERVER / DATABASE ERROR

    console.error("Authentication Middleware Error:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication verification failed.",
    });
  }
};
