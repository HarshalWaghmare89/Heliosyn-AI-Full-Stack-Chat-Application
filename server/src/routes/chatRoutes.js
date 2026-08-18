import express from "express";

import {
  createChat,
  getChats,
  searchChats,
  getChatById,
  renameChat,
  togglePinChat,
  toggleArchiveChat,
  shareChat,
  deleteChat,
  sendMessage,
} from "../controllers/chatController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

//--->>> ALL CHAT ROUTES REQUIRE AUTHENTICATION

router.use(protect);

//-->>> CHAT MANAGEMENT

//--->>> Create a new chat
// POST /api/chats

router.post("/", createChat);

//--->>> Get all chats for logged-in user
// GET /api/chats
router.get("/", getChats);

router.get("/search", searchChats);

//---->>> Get a specific chat
// GET /api/chats/:chatId
router.get("/:chatId", getChatById);

//--->>> CHAT ACTIONS

//-->> Rename chat
// PATCH /api/chats/:chatId/rename
router.patch("/:chatId/rename", renameChat);

//-->>> Pin / Unpin chat
// PATCH /api/chats/:chatId/pin
router.patch("/:chatId/pin", togglePinChat);

//--->>> Archive / Unarchive chat
// PATCH /api/chats/:chatId/archive
router.patch("/:chatId/archive", toggleArchiveChat);

//--->> Share chat
// POST /api/chats/:chatId/share
router.post("/:chatId/share", shareChat);

//-->>> SEND MESSAGE

// Send a user message and generate AI response
// POST /api/chats/:chatId/messages
router.post("/:chatId/messages", sendMessage);

//--->>> DELETE CHAT

// DELETE /api/chats/:chatId
router.delete("/:chatId", deleteChat);

export default router;
