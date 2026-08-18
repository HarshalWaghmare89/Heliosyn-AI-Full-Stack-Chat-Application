import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createChat,
  getChats,
  getChatMessages as getChatMessagesApi,
  addChatMessage,
  renameChat as renameChatApi,
  pinChat,
  unpinChat,
  archiveChat as archiveChatApi,
  unarchiveChat as unarchiveChatApi,
  shareChat as shareChatApi,
  deleteChat as deleteChatApi,
  searchChats as searchChatsApi,
} from "../../services/chatService";

//--->>> CONTEXT

const ChatContext = createContext(null);

//--->>> CONSTANTS

const MAX_PINNED_CHATS = 10;

//--->>> AI MODELS

const models = [
  {
    id: "heliosyn",
    name: "Heliosyn AI",
    modelId: "gemini-3.5-flash",
    description: "Balanced performance",
  },
  {
    id: "fast",
    name: "Heliosyn Fast",
    modelId: "gemini-3.6-flash",
    description: "Fast responses",
  },
  {
    id: "reasoning",
    name: "Heliosyn Reasoning",
    modelId: "gemini-3.5-flash-lite",
    description: "Advanced reasoning",
  },
];

//---->>>> PROVIDER

export function ChatProvider({ children }) {
  //---->>> CHAT STATE

  const [chats, setChats] = useState([]);

  const [activeChatId, setActiveChatId] = useState(null);

  //---->>> MESSAGE STATE

  const [messagesByChat, setMessagesByChat] = useState({});

  //--->>> CHAT MODE

  const [isNewChat, setIsNewChat] = useState(true);

  const [temporaryChat, setTemporaryChat] = useState(false);

  //--->>> LOADING

  const [isLoadingChats, setIsLoadingChats] = useState(false);

  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  //----->>> ERROR

  const [chatError, setChatError] = useState(null);

  //---->>>> MODEL

  const [selectedModel, setSelectedModel] = useState("Heliosyn AI");

  const selectedModelConfig = useMemo(() => {
    return models.find((model) => model.name === selectedModel) || models[0];
  }, [selectedModel]);

  const getModelConfig = useCallback((modelName) => {
    return models.find((model) => model.name === modelName) || models[0];
  }, []);

  //---->>>> POPUPS

  const [showPinLimitPopup, setShowPinLimitPopup] = useState(false);

  const [selectedDeleteChat, setSelectedDeleteChat] = useState(null);

  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const [shareChat, setShareChat] = useState(null);

  const [showSharePopup, setShowSharePopup] = useState(false);

  //--->>> RENAME

  const [editingChatId, setEditingChatId] = useState(null);

  const [editTitle, setEditTitle] = useState("");

  //--->>> LOAD CHATS

  const loadChats = useCallback(async () => {
    try {
      setIsLoadingChats(true);

      setChatError(null);

      const fetchedChats = await getChats();

      setChats(fetchedChats || []);
    } catch (error) {
      console.error("Load Chats Error:", error);

      setChatError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load chats.",
      );
    } finally {
      setIsLoadingChats(false);
    }
  }, []);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  //---->>>> LOAD MESSAGES

  const loadChatMessages = useCallback(async (chatId) => {
    if (!chatId) {
      return [];
    }

    try {
      setIsLoadingMessages(true);

      const messages = await getChatMessagesApi(chatId);

      setMessagesByChat((prev) => ({
        ...prev,
        [chatId]: messages || [],
      }));

      return messages || [];
    } catch (error) {
      console.error("Load Messages Error:", error);

      setChatError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load messages.",
      );

      return [];
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  //---->>> OPEN CHAT

  const openChat = useCallback(
    async (chatId) => {
      if (!chatId) {
        return;
      }

      setActiveChatId(chatId);

      setIsNewChat(false);

      await loadChatMessages(chatId);
    },
    [loadChatMessages],
  );

  //---->>> START NEW CHAT

  const startNewChat = useCallback(() => {
    setActiveChatId(null);

    setIsNewChat(true);

    setChatError(null);

    setSelectedDeleteChat(null);

    setShowDeletePopup(false);

    setShareChat(null);

    setShowSharePopup(false);

    setEditingChatId(null);

    setEditTitle("");
  }, []);

  //---->>> CREATE CHAT FROM FIRST MESSAGE

  const createChatFromFirstMessage = useCallback(
    async (firstMessage) => {
      const text = firstMessage?.trim();

      if (!text) {
        return null;
      }

      try {
        const title = text.length > 45 ? `${text.substring(0, 45)}...` : text;

        const createdChat = await createChat({
          title,
          model: selectedModelConfig.modelId,
        });

        const normalizedChat = {
          ...createdChat,
          id: createdChat.id || createdChat._id,
        };

        setChats((prev) => [normalizedChat, ...prev]);

        const chatId = normalizedChat.id;

        setActiveChatId(chatId);

        setIsNewChat(false);

        setMessagesByChat((prev) => ({
          ...prev,
          [chatId]: [],
        }));

        return chatId;
      } catch (error) {
        console.error("Create Chat Error:", error);

        setChatError(
          error?.response?.data?.message ||
            error?.message ||
            "Unable to create chat.",
        );

        return null;
      }
    },
    [selectedModelConfig],
  );

  //--->>>> ADD MESSAGE TO CHAT

  const addMessageToChat = useCallback(
    async (chatId, message) => {
      if (!chatId || !message) {
        return null;
      }

      //---->>>> CHECK WHETHER THIS IS THE FIRST MESSAGE IN THIS CHAT

      const isFirstMessage = (messagesByChat[chatId] || []).length === 0;

      //---->>> CREATE TIMESTAMP ONCE

      /*
       * This timestamp is created immediately when
       * the user sends the message.
       *
       * It is used as a fallback if the backend
       * response does not contain createdAt.
       */

      const messageCreatedAt = new Date().toISOString();

      //---->>> OPTIMISTIC USER MESSAGE

      const optimisticUserMessage = {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,

        role: "user",

        content: message.content || "",

        model: message.model,

        createdAt: messageCreatedAt,

        timestamp: messageCreatedAt,

        pending: true,
      };

      //--->>> ADD USER MESSAGE IMMEDIATELY

      setMessagesByChat((prev) => ({
        ...prev,

        [chatId]: [...(prev[chatId] || []), optimisticUserMessage],
      }));

      try {
        //---->>> SEND MESSAGE TO BACKEND

        const response = await addChatMessage({
          chatId,

          content: message.content,

          model: message.model,
        });

        //---->>> FINAL USER + ASSISTANT MESSAGE

        if (response?.assistantMessage) {
          //---->>> FINAL USER MESSAGE

          const finalUserMessage = {
            ...response.userMessage,

            /*
             * Preserve the optimistic ID if
             * backend doesn't provide one.
             */
            id:
              response.userMessage?.id ||
              response.userMessage?._id ||
              optimisticUserMessage.id,

            role: response.userMessage?.role || "user",

            content:
              response.userMessage?.content ?? optimisticUserMessage.content,

            model: response.userMessage?.model || optimisticUserMessage.model,

            createdAt:
              response.userMessage?.createdAt ||
              response.userMessage?.timestamp ||
              messageCreatedAt,

            /*
             * Compatibility fallback.
             */
            timestamp:
              response.userMessage?.createdAt ||
              response.userMessage?.timestamp ||
              messageCreatedAt,

            /*
             * Request completed.
             */
            pending: false,
          };

          //--->>> FINAL ASSISTANT MESSAGE

          const assistantCreatedAt =
            response.assistantMessage?.createdAt ||
            response.assistantMessage?.timestamp ||
            new Date().toISOString();

          const finalAssistantMessage = {
            ...response.assistantMessage,

            id:
              response.assistantMessage?.id ||
              response.assistantMessage?._id ||
              `assistant-${Date.now()}`,

            role: response.assistantMessage?.role || "assistant",

            createdAt: assistantCreatedAt,

            timestamp: assistantCreatedAt,

            pending: false,
          };

          //---->>>> REPLACE OPTIMISTIC MESSAGE

          setMessagesByChat((prev) => ({
            ...prev,

            [chatId]: [
              ...(prev[chatId] || []).filter(
                (item) => item.id !== optimisticUserMessage.id,
              ),

              finalUserMessage,

              finalAssistantMessage,
            ],
          }));
        }

        //---->>> UPDATE CHAT LIST / SEARCH PREVIEW

        const latestMessage =
          response?.assistantMessage?.content ||
          response?.userMessage?.content ||
          message.content;

        setChats((prev) => {
          const updatedChats = prev.map((chat) => {
            const currentChatId = chat.id || chat._id;

            if (currentChatId !== chatId) {
              return chat;
            }

            return {
              ...chat,

              preview: latestMessage,

              title:
                chat.title === "New Chat" && response?.userMessage?.content
                  ? response.userMessage.content.length > 50
                    ? `${response.userMessage.content.substring(0, 50).trim()}...`
                    : response.userMessage.content
                  : chat.title,

              updatedAt: new Date().toISOString(),
            };
          });

          //--->> SORT CHATS

          return updatedChats.sort((a, b) => {
            if (a.pinned && !b.pinned) {
              return -1;
            }

            if (!a.pinned && b.pinned) {
              return 1;
            }

            return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
          });
        });

        return response;
      } catch (error) {
        console.error("Add Message Error:", error);

        //--->>> REMOVE EXACT OPTIMISTIC MESSAGE

        setMessagesByChat((prev) => ({
          ...prev,

          [chatId]: (prev[chatId] || []).filter(
            (item) => item.id !== optimisticUserMessage.id,
          ),
        }));

        //---->>> REMOVE NEW CHAT IF FIRST MESSAGE FAILED

        if (isFirstMessage) {
          try {
            await deleteChatApi(chatId);

            setChats((prev) =>
              prev.filter((item) => (item.id || item._id) !== chatId),
            );

            setMessagesByChat((prev) => {
              const updated = { ...prev };

              delete updated[chatId];

              return updated;
            });

            setActiveChatId(null);
            setIsNewChat(true);
          } catch (cleanupError) {
            console.error("Empty Chat Cleanup Error:", cleanupError);
          }
        }

        throw error;
      }
    },
    [messagesByChat],
  );

  //--->>> GET LOCAL MESSAGES

  const getChatMessages = useCallback(
    (chatId) => {
      if (!chatId) {
        return [];
      }

      return messagesByChat[chatId] || [];
    },
    [messagesByChat],
  );

  //---->>> CLEAR LOCAL MESSAGES

  const clearChatMessages = useCallback((chatId) => {
    if (!chatId) {
      return;
    }

    setMessagesByChat((prev) => {
      const updated = {
        ...prev,
      };

      delete updated[chatId];

      return updated;
    });
  }, []);

  //---->>>> TOGGLE PIN

  const togglePin = useCallback(
    async (chatId) => {
      const chat = chats.find((item) => (item.id || item._id) === chatId);

      if (!chat) {
        return;
      }

      try {
        //---->>> UNPIN

        if (chat.pinned) {
          const updated = await unpinChat(chatId);

          setChats((prev) =>
            prev.map((item) =>
              (item.id || item._id) === chatId
                ? {
                    ...item,
                    ...updated,
                    pinned: false,
                  }
                : item,
            ),
          );

          return;
        }

        //--->> CHECK PIN LIMIT

        const pinnedCount = chats.filter(
          (item) => item.pinned && !item.archived,
        ).length;

        if (pinnedCount >= MAX_PINNED_CHATS) {
          setShowPinLimitPopup(true);

          return;
        }

        //--->>> PIN

        const updated = await pinChat(chatId);

        setChats((prev) =>
          prev.map((item) =>
            (item.id || item._id) === chatId
              ? {
                  ...item,
                  ...updated,
                  pinned: true,
                }
              : item,
          ),
        );
      } catch (error) {
        console.error("Pin Error:", error);

        setChatError(error?.message || "Unable to update pin.");
      }
    },
    [chats],
  );

  //---->>>> ARCHIVE CHAT

  const archiveChat = useCallback(
    async (chatId) => {
      if (!chatId) {
        return;
      }

      try {
        const updated = await archiveChatApi(chatId);

        setChats((prev) =>
          prev.map((item) =>
            (item.id || item._id) === chatId
              ? {
                  ...item,
                  ...updated,
                  archived: true,
                  pinned: false,
                }
              : item,
          ),
        );

        if (activeChatId === chatId) {
          setActiveChatId(null);

          setIsNewChat(true);
        }
      } catch (error) {
        console.error("Archive Error:", error);

        setChatError(error?.message || "Unable to archive chat.");
      }
    },
    [activeChatId],
  );

  //----->>> UNARCHIVE CHAT

  const unarchiveChat = useCallback(async (chatId) => {
    try {
      const updated = await unarchiveChatApi(chatId);

      setChats((prev) =>
        prev.map((item) =>
          (item.id || item._id) === chatId
            ? {
                ...item,
                ...updated,
                archived: false,
              }
            : item,
        ),
      );
    } catch (error) {
      setChatError(error?.message || "Unable to restore chat.");
    }
  }, []);

  //---->>> DELETE POPUP

  const openDeletePopup = useCallback((chat) => {
    setSelectedDeleteChat(chat);

    setShowDeletePopup(true);
  }, []);

  const closeDeletePopup = useCallback(() => {
    setSelectedDeleteChat(null);

    setShowDeletePopup(false);
  }, []);

  //---->> DELETE CHAT

  const deleteSelectedChat = useCallback(async () => {
    if (!selectedDeleteChat) {
      return;
    }

    const id = selectedDeleteChat.id || selectedDeleteChat._id;

    try {
      await deleteChatApi(id);

      //--->>> REMOVE CHAT

      setChats((prev) => prev.filter((item) => (item.id || item._id) !== id));

      //---->>> REMOVE LOCAL MESSAGES

      setMessagesByChat((prev) => {
        const updated = {
          ...prev,
        };

        delete updated[id];

        return updated;
      });

      if (activeChatId === id) {
        setActiveChatId(null);

        setIsNewChat(true);
      }

      closeDeletePopup();
    } catch (error) {
      setChatError(error?.message || "Unable to delete chat.");
    }
  }, [selectedDeleteChat, activeChatId, closeDeletePopup]);

  //----->>> RENAME CHAT

  const renameChat = useCallback(async (chatId, title) => {
    const text = title?.trim();

    if (!text) {
      return;
    }

    const updated = await renameChatApi({
      chatId,
      title: text,
    });

    setChats((prev) =>
      prev.map((item) =>
        (item.id || item._id) === chatId
          ? {
              ...item,
              ...updated,
              title: text,
            }
          : item,
      ),
    );
  }, []);

  //---->>>> SEARCH

  const searchChats = useCallback(
    async (query) => {
      const text = query?.trim();

      if (!text) {
        return chats;
      }

      try {
        return await searchChatsApi(text);
      } catch (error) {
        setChatError(error?.message || "Search failed.");

        return [];
      }
    },
    [chats],
  );

  //---->>>> START RENAME

  const startRename = useCallback((chat) => {
    if (!chat) {
      return;
    }

    setEditingChatId(chat.id || chat._id);

    setEditTitle(chat.title || "");
  }, []);

  //---->>> SAVE RENAME

  const saveRename = useCallback(async () => {
    if (!editingChatId) {
      return;
    }

    try {
      await renameChat(editingChatId, editTitle);

      setEditingChatId(null);

      setEditTitle("");
    } catch (error) {
      console.error("Save Rename Error:", error);
    }
  }, [editingChatId, editTitle, renameChat]);

  //---->>> CANCEL RENAME

  const cancelRename = useCallback(() => {
    setEditingChatId(null);

    setEditTitle("");
  }, []);

  //--->>> SHARE CHAT

  const openSharePopup = useCallback(async (chat) => {
    if (!chat) {
      return;
    }

    const chatId = chat.id || chat._id;

    if (!chatId) {
      setChatError("Unable to share this chat.");
      return;
    }

    try {
      setChatError(null);

      const response = await shareChatApi(chatId);

      const generatedShareId = response?.shareId;

      if (!generatedShareId) {
        throw new Error("Unable to generate a share link.");
      }

      const updatedChat = {
        ...chat,
        id: chatId,
        isShared: true,
        shared: true,
        shareId: generatedShareId,
      };

      setChats((prev) =>
        prev.map((item) =>
          (item.id || item._id) === chatId
            ? {
                ...item,
                ...updatedChat,
                isShared: true,
                shared: true,
                shareId: generatedShareId,
              }
            : item,
        ),
      );

      //---->>> OPEN SHARE POPUP

      setShareChat(updatedChat);

      setShowSharePopup(true);
    } catch (error) {
      console.error("Share Chat Error:", error);

      setChatError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to share this conversation.",
      );
    }
  });

  const closeSharePopup = useCallback(() => {
    setShareChat(null);

    setShowSharePopup(false);
  }, []);

  //---->>>> DERIVED CHAT LISTS

  const pinnedChats = useMemo(() => {
    return chats.filter((chat) => chat.pinned && !chat.archived);
  }, [chats]);

  const recentChats = useMemo(() => {
    return chats.filter((chat) => !chat.pinned && !chat.archived);
  }, [chats]);

  const archivedChats = useMemo(() => {
    return chats.filter((chat) => chat.archived);
  }, [chats]);

  //---->>> ACTIVE CHAT

  const activeChat = useMemo(() => {
    if (!activeChatId) {
      return null;
    }

    return chats.find((chat) => (chat.id || chat._id) === activeChatId) || null;
  }, [chats, activeChatId]);

  //---->>> ACTIVE CHAT MESSAGES

  const activeChatMessages = useMemo(() => {
    if (!activeChatId) {
      return [];
    }

    return messagesByChat[activeChatId] || [];
  }, [messagesByChat, activeChatId]);

  //--->>> CONTEXT VALUE

  const value = {
    //--->>>> CHAT DATA

    chats,

    setChats,

    loadChats,

    isLoadingChats,

    chatError,

    //--->>> ACTIVE CHAT

    activeChatId,

    activeChat,

    openChat,

    //---->>>> NEW CHAT

    isNewChat,

    startNewChat,

    createChatFromFirstMessage,

    //---->>> MODELS

    models,

    selectedModel,

    setSelectedModel,

    selectedModelConfig,

    getModelConfig,

    //--->>> MESSAGES

    messagesByChat,

    activeChatMessages,

    loadChatMessages,

    addMessageToChat,

    getChatMessages,

    clearChatMessages,

    isLoadingMessages,

    //---->>> TEMP CHAT

    temporaryChat,

    setTemporaryChat,

    //---->>>> LISTS

    pinnedChats,

    recentChats,

    archivedChats,

    //---->>>> PIN

    togglePin,

    showPinLimitPopup,

    setShowPinLimitPopup,

    //---->>> ARCHIVE

    archiveChat,

    unarchiveChat,

    //----->>> DELETE

    selectedDeleteChat,

    showDeletePopup,

    openDeletePopup,

    closeDeletePopup,

    deleteSelectedChat,

    //----->>>> RENAME

    renameChat,

    editingChatId,

    editTitle,

    setEditTitle,

    startRename,

    saveRename,

    cancelRename,

    //---->>> SHARE

    shareChat,

    setShareChat,

    showSharePopup,

    setShowSharePopup,

    openSharePopup,

    closeSharePopup,

    //---->>> SEARCH

    searchChats,
  };

  //---->>>>> PROVIDER RETURN

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

//---->>>> USE CHAT HOOK

export function useChats() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChats must be used inside ChatProvider");
  }

  return context;
}
