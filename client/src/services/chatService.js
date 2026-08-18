import {
  createChat as createChatApi,
  getChats as getChatsApi,
  getChatById as getChatByIdApi,
  getChatMessages as getChatMessagesApi,
  addChatMessage as addChatMessageApi,
  renameChat as renameChatApi,
  pinChat as pinChatApi,
  unpinChat as unpinChatApi,
  archiveChat as archiveChatApi,
  unarchiveChat as unarchiveChatApi,
  shareChat as shareChatApi,
  getSharedChat as getSharedChatApi,
  deleteChat as deleteChatApi,
  searchChats as searchChatsApi,
} from "../api/chatApi";

//----->>>> NORMALIZE CHAT

// Keeps the frontend chat object consistent
// regardless of the exact backend response format.
//
// Backend:
// {
//   _id: "...",
//   title: "...",
//   pinned: false,
//   archived: false
// }
//
// Frontend:
// {
//   id: "...",
//   title: "...",
//   pinned: false,
//   archived: false
// }

const normalizeChat = (chat) => {
  if (!chat) {
    return null;
  }

  return {
    ...chat,

    //---->>> MongoDB ID
    id: chat.id || chat._id,

    //--->>> Basic information
    title: chat.title || "New Chat",

    //--->>>> Backend -> Frontend naming
    pinned: Boolean(chat.pinned ?? chat.isPinned),

    archived: Boolean(chat.archived ?? chat.isArchived),

    shared: Boolean(chat.shared ?? chat.isShared),

    //---->>> Preview
    preview: chat.preview || "",

    //---->>> Optional message information
    messages: Array.isArray(chat.messages) ? chat.messages : [],
  };
};

//----->>> NORMALIZE MESSAGE

// Keeps message structure consistent
// throughout the frontend.
//
// Frontend message:
// {
//   id,
//   role,
//   content,
//   model,
//   createdAt
// }

const normalizeMessage = (message) => {
  if (!message) {
    return null;
  }

  return {
    ...message,

    id: message.id || message._id,

    role: message.role,

    content: message.content || "",

    model: message.model || null,

    createdAt: message.createdAt || new Date().toISOString(),
  };
};

//----->>> EXTRACT CHAT FROM API RESPONSE

const extractChat = (response) => {
  if (!response) {
    return null;
  }

  const chat =
    response.chat || response.data?.chat || response.data || response;

  return normalizeChat(chat);
};

const extractChats = (response) => {
  if (!response) {
    return [];
  }

  const chats =
    response.chats ||
    response.data?.chats ||
    (Array.isArray(response.data)
      ? response.data
      : Array.isArray(response)
        ? response
        : []);

  return chats.map(normalizeChat).filter(Boolean);
};

//------>>>> CREATE CHAT

// Creates a new chat.
//
// Used by:
// - New Chat flow
// - First user message flow

export const createChat = async ({ title, model }) => {
  if (!title?.trim()) {
    throw new Error("Chat title is required.");
  }

  const response = await createChatApi({
    title: title.trim(),
    model,
  });

  return extractChat(response);
};

//----->>> GET ALL CHATS

// Loads all chats for the current user.
//
// Used by:
// - ChatContext initialization
// - Sidebar
// - Search refresh

export const getChats = async () => {
  const response = await getChatsApi();

  return extractChats(response);
};

//---->>> GET CHAT BY ID

// Loads a single chat.
//
// Used by:
// - Opening an existing chat
// - Loading chat history

export const getChatById = async (chatId) => {
  if (!chatId) {
    throw new Error("Chat ID is required.");
  }

  const response = await getChatByIdApi(chatId);

  return extractChat(response);
};

//----->>> GET CHAT MESSAGES

// Loads all messages for a chat.
//
// Used by:
// - Opening chat
// - Restoring conversation history

export const getChatMessages = async (chatId) => {
  if (!chatId) {
    throw new Error("Chat ID is required.");
  }

  const response = await getChatMessagesApi(chatId);

  if (Array.isArray(response)) {
    return response.map(normalizeMessage);
  }

  if (response?.messages) {
    return response.messages.map(normalizeMessage);
  }

  if (response?.chat?.messages) {
    return response.chat.messages.map(normalizeMessage);
  }

  return [];
};

//----->>>> ADD CHAT MESSAGE

// Adds a message to an existing chat.
//
// The exact backend behavior determines whether
// this endpoint only saves a message or also
// generates the AI response.
//
// Currently this service simply forwards the
// message request to the API layer.
//
// Used by:
// - ChatPage
// - ChatContext

//---->>> SEND MESSAGE
// ==========================================
//
// Backend Response:
//
// {
//   success:true,
//   chatId:"...",
//   userMessage:{...},
//   assistantMessage:{...}
// }

export const addChatMessage = async ({ chatId, content, model }) => {
  if (!chatId) {
    throw new Error("Chat ID is required.");
  }

  if (!content?.trim()) {
    throw new Error("Message content is required.");
  }

  const response = await addChatMessageApi({
    chatId,
    content: content.trim(),
    model,
  });

  return response.data || response;
};

//------>>>> UPDATE CHAT

// Generic chat update.
//
// Can update:
// - title
// - pinned
// - archived

//---->>> RENAME CHAT

export const renameChat = async ({ chatId, title }) => {
  if (!chatId) {
    throw new Error("Chat ID is required.");
  }

  if (!title?.trim()) {
    throw new Error("Chat title is required.");
  }

  const response = await renameChatApi({
    chatId,
    title: title.trim(),
  });

  return extractChat(response);
};

//----->>> PIN CHAT

export const pinChat = async (chatId) => {
  if (!chatId) {
    throw new Error("Chat ID is required.");
  }

  const response = await pinChatApi(chatId);

  return extractChat(response);
};

//----->>> UNPIN CHAT

export const unpinChat = async (chatId) => {
  if (!chatId) {
    throw new Error("Chat ID is required.");
  }

  const response = await unpinChatApi(chatId);

  return extractChat(response);
};

//--->>>> TOGGLE PIN

// Decides whether to pin or unpin based
// on the current state.
//
// Used by ChatContext.

// togglePin({
//   chatId: "123",
//   pinned: false
// })
//
// -> Calls pinChat()
//
// togglePin({
//   chatId: "123",
//   pinned: true
// })
//
// -> Calls unpinChat()

export const togglePin = async ({ chatId, pinned }) => {
  if (!chatId) {
    throw new Error("Chat ID is required.");
  }

  if (pinned) {
    return unpinChat(chatId);
  }

  return pinChat(chatId);
};

//---->>>> ARCHIVE CHAT

export const archiveChat = async (chatId) => {
  if (!chatId) {
    throw new Error("Chat ID is required.");
  }

  const response = await archiveChatApi(chatId);

  return extractChat(response);
};

//---->>> UNARCHIVE CHAT

export const unarchiveChat = async (chatId) => {
  if (!chatId) {
    throw new Error("Chat ID is required.");
  }

  const response = await unarchiveChatApi(chatId);

  return extractChat(response);
};

//---->>> SHARE CHAT

// Enables public sharing for a chat.
//
// Backend generates a secure shareId.
// Never construct the share ID on the frontend.

export const shareChat = async (chatId) => {
  if (!chatId) {
    throw new Error("Chat ID is required.");
  }

  const response = await shareChatApi(chatId);

  return response;
};

//----->>>> GET PUBLIC SHARED CHAT

// Fetches a shared conversation without login.
// Used by:
// - SharedChatPage

export const getSharedChat = async (shareId) => {
  if (!shareId) {
    throw new Error("Share ID is required.");
  }

  const response = await getSharedChatApi(shareId);

  return response?.chat || response?.data?.chat || null;
};

//----->>>> DELETE CHAT
// Permanently deletes a chat.

export const deleteChat = async (chatId) => {
  if (!chatId) {
    throw new Error("Chat ID is required.");
  }

  return deleteChatApi(chatId);
};

//---->>>> SEARCH CHATS

// Searches chats by title/content.
//
// Used by:
// - Sidebar search
// - Chat search UI

export const searchChats = async (query) => {
  const trimmedQuery = query?.trim();

  // Empty search returns an empty result.

  if (!trimmedQuery) {
    return [];
  }

  const response = await searchChatsApi(trimmedQuery);

  return extractChats(response);
};

export { normalizeChat, normalizeMessage };
