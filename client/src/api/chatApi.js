import axiosInstance from "./axios";

//---->> CREATE CHAT

export const createChat = async ({ title, model }) => {
  const response = await axiosInstance.post("/chats", {
    title,
    model,
  });

  return response.data;
};

//----->>> GET ALL CHATS

export const getChats = async () => {
  const response = await axiosInstance.get("/chats");

  return response.data;
};

//---->>>> GET SINGLE CHAT

export const getChatById = async (chatId) => {
  const response = await axiosInstance.get(`/chats/${chatId}`);

  return response.data;
};

//---->>>> GET CHAT MESSAGES

export const getChatMessages = async (chatId) => {
  const response = await axiosInstance.get(`/chats/${chatId}`);

  return response.data.chat?.messages || [];
};

//----->>> SEND MESSAGE

export const addChatMessage = async ({ chatId, content, model }) => {
  const response = await axiosInstance.post(`/chats/${chatId}/messages`, {
    message: content,
    model,
  });

  return response.data;
};

//---->> RENAME CHAT

export const renameChat = async ({ chatId, title }) => {
  const response = await axiosInstance.patch(`/chats/${chatId}/rename`, {
    title,
  });

  return response.data;
};

//----->>>> PIN / UNPIN CHAT

export const pinChat = async (chatId) => {
  const response = await axiosInstance.patch(`/chats/${chatId}/pin`);

  return response.data;
};

export const unpinChat = async (chatId) => {
  const response = await axiosInstance.patch(`/chats/${chatId}/pin`);

  return response.data;
};

//---->>> ARCHIVE / UNARCHIVE CHAT

export const archiveChat = async (chatId) => {
  const response = await axiosInstance.patch(`/chats/${chatId}/archive`);

  return response.data;
};

export const unarchiveChat = async (chatId) => {
  const response = await axiosInstance.patch(`/chats/${chatId}/archive`);

  return response.data;
};

//----->>> SHARE CHAT

export const shareChat = async (chatId) => {
  const response = await axiosInstance.post(`/chats/${chatId}/share`);

  return response.data;
};

//---->>>> GET PUBLIC SHARED CHAT

export const getSharedChat = async (shareId) => {
  if (!shareId) {
    throw new Error("Share ID is required.");
  }

  const response = await axiosInstance.get(`/shared/${shareId}`);

  return response.data;
};

//---->>> DELETE CHAT

export const deleteChat = async (chatId) => {
  const response = await axiosInstance.delete(`/chats/${chatId}`);

  return response.data;
};

//----->>> SEARCH CHATS

export const searchChats = async (query) => {
  const response = await axiosInstance.get("/chats/search", {
    params: {
      q: query,
    },
  });

  return response.data;
};
