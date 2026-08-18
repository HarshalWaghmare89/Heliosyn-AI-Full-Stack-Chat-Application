import crypto from "crypto";
import mongoose from "mongoose";

import Chat from "../models/Chat.js";

import { DEFAULT_GEMINI_MODEL, isSupportedGeminiModel } from "../config/ai.js";

import {
  checkUserMinuteLimit,
  checkUserDailyLimit,
  checkGlobalDailyLimit,
  recordSuccessfulAiRequest,
  MAX_MESSAGE_LENGTH,
} from "../config/usageLimits.js";

import {
  generateGeminiResponse,
  getValidGeminiModel,
} from "../services/geminiService.js";

//---->>>> HELPER — VALIDATE CHAT ID

const isValidChatId = (chatId) => {
  return mongoose.Types.ObjectId.isValid(chatId);
};

//---->>> HELPER — VALIDATE CHAT TITLE

const isValidChatTitle = (title) => {
  return (
    typeof title === "string" &&
    title.trim().length >= 1 &&
    title.trim().length <= 200
  );
};

//--->>> HELPER — SANITIZE CHAT RESPONSE

const sanitizeChat = (chat) => {
  return {
    id: chat._id,
    user: chat.user,
    title: chat.title,
    model: chat.model,
    isPinned: chat.isPinned,
    isArchived: chat.isArchived,
    isShared: chat.isShared,
    shareId: chat.isShared ? chat.shareId : null,
    messages: chat.messages,
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
  };
};

//---->>> CREATE NEW CHAT

export const createChat = async (req, res) => {
  try {
    const { title, model } = req.body;

    //----->>> VALIDATE TITLE

    if (title !== undefined && !isValidChatTitle(title)) {
      return res.status(400).json({
        success: false,
        message: "Chat title must be between 1 and 200 characters.",
      });
    }

    //---->>> VALIDATE MODEL

    const selectedModel = model || DEFAULT_GEMINI_MODEL;

    if (!isSupportedGeminiModel(selectedModel)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported Gemini model.",
        supportedModels: [
          // This is only informational.
        ],
      });
    }

    //---->>>> CREATE CHAT

    const chat = await Chat.create({
      user: req.user.id,
      title: title?.trim() || "New Chat",
      model: selectedModel,
    });

    return res.status(201).json({
      success: true,
      message: "Chat created successfully.",
      chat,
    });
  } catch (error) {
    console.error("Create Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create chat.",
    });
  }
};

//--->>> GET /api/chats
//
// Returns sidebar-friendly chat data.
// Also returns the latest message preview.

export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      user: req.user.id,
      isDeleted: false,
    })
      .select(
        "_id title model isPinned isArchived isShared shareId messages createdAt updatedAt",
      )
      .sort({
        isPinned: -1,
        updatedAt: -1,
      })
      .lean();

    const formattedChats = chats.map((chat) => {
      const messages = Array.isArray(chat.messages) ? chat.messages : [];

      //--->>> Get the latest message
      const lastMessage = messages[messages.length - 1];

      return {
        id: chat._id,
        _id: chat._id,

        title: chat.title || "New Chat",

        model: chat.model,

        isPinned: Boolean(chat.isPinned),
        isArchived: Boolean(chat.isArchived),
        isShared: Boolean(chat.isShared),

        //--->>> Frontend-friendly names
        pinned: Boolean(chat.isPinned),
        archived: Boolean(chat.isArchived),
        shared: Boolean(chat.isShared),

        shareId: chat.isShared ? chat.shareId : null,

        //--->>> Latest message preview
        preview: lastMessage?.content || "",

        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      };
    });

    return res.status(200).json({
      success: true,
      chats: formattedChats,
    });
  } catch (error) {
    console.error("Get Chats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch chats.",
    });
  }
};

//----->>>> SEARCH CHATS

//
// GET /api/chats/search?q=searchText
//
// Searches the logged-in user's chats by:
// - Chat title
// - Message content
//
// Archived chats are included.
// Deleted chats are excluded.

export const searchChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const query = req.query.q?.trim();

    //---->>>> VALIDATE SEARCH QUERY

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required.",
      });
    }

    //--->>>> SEARCH USER'S CHATS

    const chats = await Chat.find({
      user: userId,
      isDeleted: false,

      $or: [
        //---->>> Search chat title
        {
          title: {
            $regex: query,
            $options: "i",
          },
        },

        //--->>> Search inside messages
        {
          "messages.content": {
            $regex: query,
            $options: "i",
          },
        },
      ],
    })
      .select(
        "_id title model isPinned isArchived isShared shareId messages createdAt updatedAt",
      )
      .sort({
        updatedAt: -1,
      })
      .lean();

    //----->>>> FORMAT RESPONSE

    const formattedChats = chats.map((chat) => {
      const messages = Array.isArray(chat.messages) ? chat.messages : [];

      //--->>> Get latest message
      const lastMessage = messages[messages.length - 1];

      return {
        id: chat._id,
        _id: chat._id,

        title: chat.title || "New Chat",

        model: chat.model,

        //--->>> Backend field names
        isPinned: Boolean(chat.isPinned),
        isArchived: Boolean(chat.isArchived),
        isShared: Boolean(chat.isShared),

        //--->>> Frontend-friendly field names
        pinned: Boolean(chat.isPinned),
        archived: Boolean(chat.isArchived),
        shared: Boolean(chat.isShared),

        //---->>> Share information
        shareId: chat.isShared ? chat.shareId : null,

        //--->>> Latest message preview
        preview: lastMessage?.content || "",

        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      };
    });

    return res.status(200).json({
      success: true,
      chats: formattedChats,
    });
  } catch (error) {
    console.error("Search Chats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to search chats.",
    });
  }
};

//--->>> GET SINGLE CHAT

// GET /api/chats/:chatId

export const getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;

    //---->>> VALIDATE CHAT ID

    if (!isValidChatId(chatId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid chat ID.",
      });
    }

    //---->>> FIND CHAT

    const chat = await Chat.findOne({
      _id: chatId,
      user: req.user.id,
      isDeleted: false,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    return res.status(200).json({
      success: true,
      chat: sanitizeChat(chat),
    });
  } catch (error) {
    console.error("Get Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch chat.",
    });
  }
};

//---->>>> RENAME CHAT
// PATCH /api/chats/:chatId/rename

export const renameChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { title } = req.body;

    //--->>> VALIDATE CHAT ID

    if (!isValidChatId(chatId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid chat ID.",
      });
    }

    //---->>> VALIDATE TITLE

    if (!isValidChatTitle(title)) {
      return res.status(400).json({
        success: false,
        message: "Chat title must be between 1 and 200 characters.",
      });
    }

    //--->>> UPDATE CHAT

    const chat = await Chat.findOneAndUpdate(
      {
        _id: chatId,
        user: req.user.id,
        isDeleted: false,
      },
      {
        $set: {
          title: title.trim(),
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Chat renamed successfully.",
      chat: sanitizeChat(chat),
    });
  } catch (error) {
    console.error("Rename Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to rename chat.",
    });
  }
};

//--->> PIN / UNPIN CHAT

// PATCH /api/chats/:chatId/pin

export const togglePinChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    //---->>> VALIDATE CHAT ID

    if (!isValidChatId(chatId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid chat ID.",
      });
    }

    //--->>> FIND CHAT

    const chat = await Chat.findOne({
      _id: chatId,
      user: req.user.id,
      isDeleted: false,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    //--->> TOGGLE PIN

    chat.isPinned = !chat.isPinned;

    await chat.save();

    return res.status(200).json({
      success: true,
      message: chat.isPinned
        ? "Chat pinned successfully."
        : "Chat unpinned successfully.",
      chat: sanitizeChat(chat),
    });
  } catch (error) {
    console.error("Toggle Pin Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update chat pin status.",
    });
  }
};

//---->>> ARCHIVE / UNARCHIVE CHAT

// PATCH /api/chats/:chatId/archive

export const toggleArchiveChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    //---->>> VALIDATE CHAT ID

    if (!isValidChatId(chatId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid chat ID.",
      });
    }

    //--->>> FIND CHAT

    const chat = await Chat.findOne({
      _id: chatId,
      user: req.user.id,
      isDeleted: false,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    //---->>> TOGGLE ARCHIVE

    chat.isArchived = !chat.isArchived;

    await chat.save();

    return res.status(200).json({
      success: true,
      message: chat.isArchived
        ? "Chat archived successfully."
        : "Chat unarchived successfully.",
      chat: sanitizeChat(chat),
    });
  } catch (error) {
    console.error("Toggle Archive Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update chat archive status.",
    });
  }
};

//--->>> SHARE CHAT

// POST /api/chats/:chatId/share

export const shareChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    //---->>> VALIDATE CHAT ID

    if (!isValidChatId(chatId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid chat ID.",
      });
    }

    //---->>> FIND CHAT

    const chat = await Chat.findOne({
      _id: chatId,
      user: req.user.id,
      isDeleted: false,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    //--->>> GENERATE SHARE ID

    if (!chat.shareId) {
      chat.shareId = crypto.randomBytes(16).toString("hex");
    }

    chat.isShared = true;

    await chat.save();

    return res.status(200).json({
      success: true,
      message: "Chat shared successfully.",
      shareId: chat.shareId,
    });
  } catch (error) {
    console.error("Share Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to share chat.",
    });
  }
};

//-->>> SOFT DELETE CHAT
// DELETE /api/chats/:chatId

export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    //---->>> VALIDATE CHAT ID

    if (!isValidChatId(chatId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid chat ID.",
      });
    }

    //--->>> SOFT DELETE

    const chat = await Chat.findOneAndUpdate(
      {
        _id: chatId,
        user: req.user.id,
        isDeleted: false,
      },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      },
      {
        new: true,
      },
    );

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Chat deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete chat.",
    });
  }
};

//---->>> SEND MESSAGE

// POST /api/chats/:chatId/messages
//
// Body:
// {
//   "message": "Explain binary search",
//   "model": "gemini-3.5-flash"
// }

export const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message, model } = req.body;

    //---->>> VALIDATE CHAT ID

    if (!isValidChatId(chatId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid chat ID.",
      });
    }

    //--->>> VALIDATE MESSAGE

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const userMessage = message.trim();
    if (userMessage.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`,
      });
    }

    //---->>> FIND CHAT

    const chat = await Chat.findOne({
      _id: chatId,
      user: req.user.id,
      isDeleted: false,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    //---->>> CHECK ARCHIVED CHAT

    if (chat.isArchived) {
      return res.status(400).json({
        success: false,
        message: "Cannot send messages to an archived chat.",
      });
    }

    //--->>> CHECK USER MINUTE LIMIT

    const minuteLimit = checkUserMinuteLimit(req.user.id);

    if (!minuteLimit.allowed) {
      return res.status(429).json({
        success: false,
        code: "USER_MINUTE_LIMIT",
        message: "You have reached the maximum of 2 AI requests per minute.",
        retryAfterSeconds: minuteLimit.retryAfterSeconds,
      });
    }

    //--->>> CHECK USER DAILY LIMIT

    const dailyLimit = checkUserDailyLimit(req.user.id);

    if (!dailyLimit.allowed) {
      return res.status(429).json({
        success: false,
        code: "USER_DAILY_LIMIT",
        message:
          "You have reached your daily AI message limit. Please try again tomorrow.",
      });
    }

    //---->>> CHECK GLOBAL DAILY LIMIT

    const globalLimit = checkGlobalDailyLimit();

    if (!globalLimit.allowed) {
      return res.status(429).json({
        success: false,
        code: "GLOBAL_DAILY_LIMIT",
        message:
          "The daily AI request limit has been reached. Please try again tomorrow.",
      });
    }

    //--->>> SELECT MODEL

    const selectedModel = model || chat.model || DEFAULT_GEMINI_MODEL;

    //---->>>> VALIDATE MODEL

    let validModel;

    try {
      validModel = getValidGeminiModel(selectedModel);
    } catch (error) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }

    //------>>> UPDATE CHAT MODEL

    chat.model = validModel;

    //---->>> BUILD HISTORY

    const recentMessages = chat.messages.slice(-20);

    const history = recentMessages.map((item) => ({
      role: item.role,
      content: item.content,
    }));

    //--->>>> GENERATE AI RESPONSE

    const aiResponse = await generateGeminiResponse({
      message: userMessage,
      history,
      model: validModel,
    });

    //---->>> RECORD SUCCESSFUL AI REQUEST

    recordSuccessfulAiRequest(req.user.id);

    //--->>> SAVE USER MESSAGE

    chat.messages.push({
      role: "user",
      content: userMessage,
      model: null,
    });

    //--->>> SAVE ASSISTANT MESSAGE

    chat.messages.push({
      role: "assistant",
      content: aiResponse.text,
      model: aiResponse.model,
    });

    //--->>> AUTO-GENERATE CHAT TITLE

    if (!chat.title || chat.title === "New Chat") {
      const generatedTitle =
        userMessage.length > 50
          ? `${userMessage.substring(0, 50).trim()}...`
          : userMessage;

      chat.title = generatedTitle;
    }

    //--->>> SAVE CHAT

    await chat.save();

    //---->>> RESPONSE

    return res.status(200).json({
      success: true,
      message: "Message processed successfully.",
      chatId: chat._id,
      model: aiResponse.model,
      userMessage: {
        role: "user",
        content: userMessage,
      },
      assistantMessage: {
        role: "assistant",
        content: aiResponse.text,
        model: aiResponse.model,
      },
    });
  } catch (error) {
    console.error("Send Message Error:", error);

    return res.status(500).json({
      success: false,
      code: "CHAT_PROCESSING_ERROR",
      message: "Unable to process your message right now. Please try again.",
    });
  }
};
