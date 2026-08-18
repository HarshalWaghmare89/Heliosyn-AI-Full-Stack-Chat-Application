import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";

import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import sharedChatRouter from "./routes/sharedChatRouter.js";
import "./config/passport.js";

const app = express();

app.use(passport.initialize());

//--->> SECURITY

app.use(helmet());

//--->>> CORS

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

//--->>> BODY PARSING

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

//--->>> COOKIES

app.use(cookieParser());

//---->>> LOGGING

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

//--->>>ROUTES

app.use("/api/auth", authRoutes);

app.use("/api/chats", chatRoutes);

app.use("/api/shared", sharedChatRouter);

//--->>> HEALTH CHECK

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Heliosyn AI API is running",
  });
});

//--->>> 404 HANDLER

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

//--->>> GLOBAL ERROR HANDLER

app.use((error, req, res, next) => {
  console.error("Global Error:", error);

  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error."
      : error.message || "Internal server error";

  res.status(error.statusCode || 500).json({
    success: false,
    message,
  });
});
export default app;
