import express from "express";
import passport from "passport";

import {
  register,
  login,
  logout,
  getCurrentUser,
  googleAuthSuccess,
  googleAuthFailure,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

//---->>> LOCAL AUTHENTICATION

//--->>> REGISTER

// POST /api/auth/register

router.post("/register", register);

//--->>> LOGIN
// POST /api/auth/login

router.post("/login", login);

//--->> GET CURRENT AUTHENTICATED USER
// GET /api/auth/me

router.get("/me", protect, getCurrentUser);

//--->>> LOGOUT
// POST /api/auth/logout

router.post("/logout", logout);

//--->>> GOOGLE OAUTH

// GET /api/auth/google

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

//--->>> GOOGLE OAUTH CALLBACK

// GET /api/auth/google/callback
//
// Google redirects the user back here after
// successful authentication.
//
// Passport:
// 1. Verifies the Google account.
// 2. Finds or creates the user.
// 3. Sets req.user.
// 4. Calls googleAuthSuccess.
//

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/auth/google/failure",
  }),
  googleAuthSuccess,
);

//--->>> GOOGLE OAUTH FAILURE
// GET /api/auth/google/failure

router.get("/google/failure", googleAuthFailure);

export default router;
