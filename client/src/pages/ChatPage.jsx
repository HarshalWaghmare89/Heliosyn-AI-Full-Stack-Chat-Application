import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { useChats } from "../shared/context/ChatContext";

import ChatBody from "../modules/chat/ChatBody";
import ChatInput from "../modules/chat/ChatInput";
import ChatEmptyState from "../modules/chat/components/ChatEmptyState";

import HeaderAlert from "../shared/components/chat/HeaderAlert";
import ChatErrorMessage from "../shared/components/chat/ChatErrorMessage";

const MAX_MESSAGE_LENGTH = 2000;

const ChatPage = () => {
  const {
    activeChat,
    activeChatMessages,
    isNewChat,
    selectedModel,
    selectedModelConfig,
    getModelConfig,
    createChatFromFirstMessage,
    addMessageToChat,
    openChat,
  } = useChats();

  //---->>> ROUTER

  const navigate = useNavigate();

  const { chatId } = useParams();

  //---->>> STATE

  const [isGenerating, setIsGenerating] = useState(false);

  /*
   * Errors shown above the ChatInput.
   *
   * These are blocking errors:
   * - RATE_LIMIT
   * - DAILY_LIMIT
   * - GLOBAL_LIMIT
   */

  const [chatError, setChatError] = useState(null);

  /*
   * Errors shown at the top/header.
   *
   * These are common/non-blocking errors:
   * - MESSAGE_TOO_LONG
   * - CHAT_ERROR
   * - SERVER_ERROR
   * - NETWORK_ERROR
   */

  const [headerError, setHeaderError] = useState(null);

  //---->>> OPEN CHAT FROM URL

  useEffect(() => {
    if (!chatId) {
      return;
    }

    setChatError(null);
    setHeaderError(null);

    openChat(chatId);
  }, [chatId, openChat]);

  //---->> PAGE TITLE

  const pageTitle = isNewChat
    ? "Heliosyn AI"
    : activeChat?.title || "Heliosyn AI";

  //------>>>> ERROR CLASSIFICATION

  const isInputBlockingError = (error) => {
    if (!error) {
      return false;
    }

    return ["RATE_LIMIT", "DAILY_LIMIT", "GLOBAL_LIMIT"].includes(error.type);
  };

  const isHeaderError = (error) => {
    if (!error) {
      return false;
    }

    return [
      "MESSAGE_TOO_LONG",
      "CHAT_ERROR",
      "SERVER_ERROR",
      "NETWORK_ERROR",
    ].includes(error.type);
  };

  //------>>>> SEND MESSAGE

  const handleSendMessage = async ({ message, model }) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return false;
    }

    //----->>> CLIENT MESSAGE LENGTH LIMIT

    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      setChatError(null);

      setHeaderError({
        type: "MESSAGE_TOO_LONG",
        message:
          "The message you submitted was too long. Please submit something shorter.",
      });

      return false;
    }

    //---->>> MODEL

    const currentModelName = model || selectedModel;

    const currentModelConfig =
      model && model !== selectedModel
        ? getModelConfig(model)
        : selectedModelConfig;

    const currentModelId = currentModelConfig?.modelId || currentModelName;

    let currentChatId = activeChat?.id || activeChat?._id;

    try {
      //---->>>> CLEAR OLD ERRORS

      setChatError(null);
      setHeaderError(null);

      //----->>> START GENERATION

      setIsGenerating(true);

      //---->> NEW CHAT

      if (isNewChat) {
        currentChatId = await createChatFromFirstMessage(trimmedMessage);

        if (!currentChatId) {
          setHeaderError({
            type: "CHAT_ERROR",
            message: "Unable to create a new chat. Please try again.",
          });

          return false;
        }

        //---->>> UPDATE URL

        navigate(`/c/${currentChatId}`, {
          replace: true,
        });
      }

      //----->>>> EXISTING CHAT

      await addMessageToChat(currentChatId, {
        content: trimmedMessage,
        model: currentModelId,
      });

      //---->>> SUCCESS

      return true;
    } catch (error) {
      console.error("Failed to send message:", error);

      //---->>>> BACKEND ERROR DATA

      const responseData = error?.response?.data;

      const statusCode = error?.response?.status;

      //---->>> DEFAULT

      let errorMessage = "Something went wrong. Please try again.";

      let errorType = "CHAT_ERROR";

      let retryAfterSeconds = null;

      //----->>>> BACKEND MESSAGE

      if (responseData?.message) {
        errorMessage = responseData.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      //---->>> HTTP 429

      if (statusCode === 429) {
        errorType = "RATE_LIMIT";

        errorMessage =
          responseData?.message ||
          "You've reached the request limit. Please try again later.";

        retryAfterSeconds = responseData?.retryAfterSeconds ?? null;
      }

      //---->>>> USER MINUTE LIMIT

      if (responseData?.code === "USER_MINUTE_LIMIT") {
        errorType = "RATE_LIMIT";

        errorMessage =
          responseData?.message ||
          "You've reached the maximum number of requests per minute.";

        retryAfterSeconds = responseData?.retryAfterSeconds ?? null;
      }

      //---->>> USER DAILY LIMIT

      if (responseData?.code === "USER_DAILY_LIMIT") {
        errorType = "DAILY_LIMIT";

        errorMessage =
          responseData?.message ||
          "You've reached your daily AI message limit. Please try again tomorrow.";
      }

      //---->>>> GLOBAL DAILY LIMIT

      if (responseData?.code === "GLOBAL_DAILY_LIMIT") {
        errorType = "GLOBAL_LIMIT";

        errorMessage =
          responseData?.message ||
          "The AI service has reached its daily limit. Please try again later.";
      }

      //------>>> NETWORK ERROR

      if (error?.request && !error?.response) {
        errorType = "NETWORK_ERROR";

        errorMessage =
          "Unable to connect to the server. Please check your connection and try again.";
      }

      //----->>>> NORMALIZED ERROR

      const normalizedError = {
        type: errorType,
        message: errorMessage,
        retryAfterSeconds,
      };

      //----->>> ROUTE ERROR

      if (isInputBlockingError(normalizedError)) {
        /*
         * Rate/daily/global limits appear above the ChatInput.
         */

        setChatError(normalizedError);
      } else if (isHeaderError(normalizedError)) {
        /*
         * Common errors appear at the top/header.
         */

        setHeaderError(normalizedError);
      } else {
        /*
         * Fallback:
         * all unknown errors go to header.
         */

        setHeaderError(normalizedError);
      }

      //----->>> FAILURE

      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  //---->>>> CLEAR HEADER ERROR

  const handleClearHeaderError = () => {
    setHeaderError(null);
  };

  //---->>> CLEAR CHAT ERROR

  const handleClearChatError = () => {
    setChatError(null);
  };

  //----->>> SEND BUTTON BLOCKING

  /*
   * The textarea is NEVER disabled.
   *
   * Only these conditions disable SEND:
   *
   * 1. AI is generating
   * 2. Per-minute limit
   * 3. Daily limit
   * 4. Global limit
   */

  const isSendBlocked =
    isGenerating ||
    chatError?.type === "RATE_LIMIT" ||
    chatError?.type === "DAILY_LIMIT" ||
    chatError?.type === "GLOBAL_LIMIT";

  //--->>> RENDER

  return (
    <div
      className="
        relative
        flex
        h-full
        min-h-0
        w-full
        min-w-0
        flex-col
        overflow-hidden
        bg-black
      "
    >
      {/* ------>>>> PAGE TITLE */}

      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>

      {/* ------>>>> HEADER ALERT */}

      <HeaderAlert error={headerError} onClear={handleClearHeaderError} />

      {/* ----->>>> CHAT BODY */}

      <div
        className="
          min-h-0
          min-w-0
          flex-1
          overflow-hidden
        "
      >
        <ChatBody
          isGenerating={isGenerating}
          error={isNewChat ? null : chatError}
          onClearError={handleClearChatError}
        />
      </div>

      {/* ------>>>> NEW CHAT */}

      {isNewChat ? (
        <div
          className="
            absolute
            inset-0
            z-30
            flex
            min-h-0
            items-center
            justify-center
            overflow-y-auto
            px-3
            py-6

            sm:px-4
            sm:py-8
          "
        >
          <div
            className="
              flex
              w-full
              max-w-4xl
              -translate-y-2
              flex-col

              sm:-translate-y-4
            "
          >
            {/*------>>>> EMPTY STATE */}

            <div className="mb-4 text-center sm:mb-6">
              <ChatEmptyState />
            </div>

            {/*----->>>> NEW CHAT BLOCKING ERROR */}

            {chatError && (
              <div className="mb-10">
                <ChatErrorMessage
                  error={chatError}
                  onClear={handleClearChatError}
                />
              </div>
            )}

            {/*--->>>> INPUT */}

            <div
              className="
                -translate-y-2
                w-full

                sm:-translate-y-6
              "
            >
              <ChatInput onSend={handleSendMessage} disabled={isSendBlocked} />
            </div>
          </div>
        </div>
      ) : (
        /*
         * EXISTING CHAT
         */

        <div
          className="
            absolute
            bottom-0
            left-0
            right-0
            z-30
            bg-gradient-to-t
            from-black
            via-black/95
            to-transparent
            px-3
            pb-3
            pt-8

            sm:px-4
            sm:pb-4
            sm:pt-10
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-4xl
              -translate-y-1

              sm:-translate-y-2
            "
          >
            {/*----->>> BLOCKING ERROR ABOVE INPUT */}

            {chatError && (
              <ChatErrorMessage
                error={chatError}
                onClear={handleClearChatError}
              />
            )}

            {/*---->>>> INPUT */}

            <ChatInput onSend={handleSendMessage} disabled={isSendBlocked} />

            {/*---->>> DISCLAIMER */}

            {activeChatMessages?.length > 0 && (
              <p
                className="
                  mt-2
                  px-2
                  text-center
                  text-[10px]
                  leading-4
                  text-neutral-500

                  sm:text-xs
                "
              >
                AI can make mistakes. Check important information.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
