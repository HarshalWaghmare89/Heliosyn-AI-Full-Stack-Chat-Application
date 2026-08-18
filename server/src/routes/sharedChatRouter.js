import express from "express";

import { getSharedChat } from "../controllers/sharedChatController.js";

const router = express.Router();

//--->>> PUBLIC SHARED CHAT ROUTE

router.get("/:shareId", getSharedChat);

export default router;
