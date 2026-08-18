import mongoose from "mongoose";

//--->>> SUPPORTED GEMINI MODELS

const SUPPORTED_GEMINI_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
];

//--->>> MESSAGE SCHEMA

const messageSchema = new mongoose.Schema(
  {
    //--->> MESSAGE ROLE

    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },

    //--->>> MESSAGE CONTENT

    content: {
      type: String,
      required: true,
      trim: true,
    },

    model: {
      type: String,
      enum: [...SUPPORTED_GEMINI_MODELS, null],
      default: null,
    },
  },
  {
    timestamps: true,
    _id: true,
  },
);

//--->> CHAT SCHEMA

const chatSchema = new mongoose.Schema(
  {
    //--->> CHAT OWNER

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    //--->>> CHAT TITLE

    title: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "New Chat",
    },

    //--->>>> MESSAGES

    messages: {
      type: [messageSchema],
      default: [],
    },

    //--->>>> SELECTED AI MODEL

    model: {
      type: String,
      enum: SUPPORTED_GEMINI_MODELS,
      required: true,
      default: "gemini-3.5-flash",
    },

    //--->>> SIDEBAR ACTIONS

    isPinned: {
      type: Boolean,
      default: false,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },

    //--->>> SHARING

    isShared: {
      type: Boolean,
      default: false,
    },

    shareId: {
      type: String,
      unique: true,
      sparse: true,
    },

    //--->>> SOFT DELETE

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

//---->> INDEXES

// User's active chats
chatSchema.index({
  user: 1,
  isDeleted: 1,
  isArchived: 1,
  updatedAt: -1,
});

// Pinned chats
chatSchema.index({
  user: 1,
  isPinned: -1,
  updatedAt: -1,
});

// Archived chats
chatSchema.index({
  user: 1,
  isArchived: 1,
  updatedAt: -1,
});

//--->> CREATE MODEL

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
