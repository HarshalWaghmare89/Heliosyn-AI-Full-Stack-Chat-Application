import bcrypt from "bcryptjs";

import User from "../models/User.js";
import { generateToken } from "../utils/token.js";

//--->>> COOKIE OPTIONS

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,

    secure: isProduction,

    sameSite: isProduction ? "none" : "lax",

    // 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000,

    path: "/",
  };
};

//---->>> SAFE USER RESPONSE

const sanitizeUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    authProvider: user.authProvider,
    isEmailVerified: user.isEmailVerified ?? false,
  };
};

//--->>>> REGISTER — LOCAL AUTHENTICATION

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //---->>>> VALIDATE REQUIRED FIELDS

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required.",
      });
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    if (!password || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Password is required.",
      });
    }

    //--->>> NORMALIZE INPUT

    const normalizedName = name.trim();
    const normalizedEmail = email.toLowerCase().trim();

    //--->>> PASSWORD VALIDATION

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    if (password.length > 128) {
      return res.status(400).json({
        success: false,
        message: "Password must be less than 128 characters.",
      });
    }

    //--->>> CHECK EXISTING USER

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      if (existingUser.authProvider === "google") {
        return res.status(409).json({
          success: false,
          message:
            "An account with this email already exists using Google. Please continue with Google.",
        });
      }

      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    //--->>> HASH PASSWORD

    const hashedPassword = await bcrypt.hash(password, 12);

    //--->>>> CREATE USER

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      authProvider: "local",
      isActive: true,
      isEmailVerified: false,
      lastLoginAt: new Date(),
    });

    //--->>> GENERATE JWT

    const token = generateToken(user._id.toString());

    //---->>> SET HTTP-ONLY COOKIE

    res.cookie("token", token, getCookieOptions());

    //---->>> RESPONSE

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Register Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create account.",
    });
  }
};

//--->>> LOGIN — LOCAL AUTHENTICATION

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //--->>>> VALIDATE REQUIRED FIELDS

    if (!email || typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    if (!password || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Password is required.",
      });
    }

    //--->>> NORMALIZE EMAIL

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    //--->>> USER NOT FOUND

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    //---->>> ACCOUNT DISABLED

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been disabled.",
      });
    }

    //--->>> GOOGLE ACCOUNT

    if (user.authProvider === "google" && !user.password) {
      return res.status(400).json({
        success: false,
        message:
          "This account uses Google authentication. Please continue with Google.",
      });
    }

    //---->>>> PASSWORD VERIFICATION

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    //--->>> UPDATE LAST LOGIN

    user.lastLoginAt = new Date();

    await user.save();

    //--->>> GENERATE JWT

    const token = generateToken(user._id.toString());

    //---->>> SET COOKIE

    res.cookie("token", token, getCookieOptions());

    //--->>> RESPONSE

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to login.",
    });
  }
};

//--->>>> GOOGLE OAUTH SUCCESS

//
// Passport authenticates the user first.
// After successful authentication, Passport
// places the Google user in req.user.
//
// This controller:
// 1. Validates the Google user.
// 2. Checks account status.
// 3. Updates last login.
// 4. Generates application JWT.
// 5. Stores JWT in HTTP-only cookie.
// 6. Redirects to frontend.

export const googleAuthSuccess = async (req, res) => {
  try {
    //---->>> CHECK PASSPORT USER

    if (!req.user) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
      );
    }

    //---->>> FIND USER

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=user_not_found`,
      );
    }

    //--->>> CHECK ACCOUNT STATUS

    if (!user.isActive) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=account_disabled`,
      );
    }

    //---->>> UPDATE LAST LOGIN

    user.lastLoginAt = new Date();

    await user.save();

    //--->>>> GENERATE APPLICATION JWT

    const token = generateToken(user._id.toString());

    //---->>> SET HTTP-ONLY COOKIE

    res.cookie("token", token, getCookieOptions());

    //---->>> REDIRECT TO FRONTEND

    return res.redirect(`${process.env.FRONTEND_URL}/oauth-success`);
  } catch (error) {
    console.error("Google OAuth Success Error:", error);

    return res.redirect(
      `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
    );
  }
};

//---->>> GOOGLE OAUTH FAILURE

export const googleAuthFailure = async (req, res) => {
  return res.redirect(
    `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
  );
};

//---->>>> GET CURRENT USER

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    //--->>>> CHECK ACCOUNT STATUS

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been disabled.",
      });
    }

    return res.status(200).json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Get Current User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch current user.",
    });
  }
};

//---->>> LOGOUT

export const logout = async (req, res) => {
  try {
    const cookieOptions = getCookieOptions();

    res.clearCookie("token", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Logout Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to logout.",
    });
  }
};
