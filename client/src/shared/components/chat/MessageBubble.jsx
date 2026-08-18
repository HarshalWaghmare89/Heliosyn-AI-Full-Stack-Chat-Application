import { useState } from "react";
import { ChevronLeft, ChevronRight, User } from "lucide-react";

import CopyMessageButton from "./CopyMessageButton";
import logo from "../../../assets/favicon.png";

//------>>> FORMAT MESSAGE TIME

const formatMessageTime = (timestamp) => {
  if (!timestamp) return "";

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};

//----->>> MESSAGE BUBBLE

const MessageBubble = ({ role, content = "", timestamp, children }) => {
  const isUser = role === "user";

  const time = formatMessageTime(timestamp);

  //---->>> LONG MESSAGE STATE

  const [showFullMessage, setShowFullMessage] = useState(false);

  //--->>> LONG MESSAGE CONFIGURATION

  const MAX_USER_MESSAGE_LENGTH = 500;

  const isLongUserMessage = isUser && content.length > MAX_USER_MESSAGE_LENGTH;

  //----->>> RENDER

  return (
    <article
      className={`
        group
        flex
        w-full
        gap-3
        sm:gap-4
        mb-6
        sm:mb-8
        ${isUser ? "justify-end" : "justify-start"}
      `}
    >
      {/* ------>>>> ASSISTANT AVATAR */}

      {!isUser && (
        <div
          className="
            mt-1
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-violet-600/15
            text-violet-400
            sm:h-9
            sm:w-9
          "
        >
          <img
            src={logo}
            alt="Heliosyn AI"
            className="
              h-8
              w-8
              rounded-full
              object-contain
            "
          />
        </div>
      )}

      {/* -------->>>> MESSAGE COLUMN */}

      <div
        className={`
          min-w-0
          ${
            isUser
              ? "flex max-w-[85%] flex-col items-end sm:max-w-[75%] lg:max-w-[68%]"
              : "w-full max-w-[900px]"
          }
        `}
      >
        {/* MESSAGE */}

        <div
          className={`
            min-w-0
            ${
              isUser
                ? `
                  rounded-2xl
                  rounded-br-md
                  bg-violet-600
                  px-4
                  py-3
                  text-white
                  shadow-sm
                  sm:px-5
                  sm:py-3.5
                `
                : `
                  w-full
                  text-neutral-200
                `
            }
          `}
        >
          {/* LONG USER MESSAGE - COLLAPSED */}

          {isLongUserMessage && !showFullMessage ? (
            <>
              <div
                className="
                  max-h-40
                  overflow-hidden
                "
              >
                {children}
              </div>

              {/* ------>>>>  SHOW MORE */}

              <button
                type="button"
                onClick={() => setShowFullMessage(true)}
                className="
    mt-2
    inline-flex
    items-center
    gap-1
    text-sm
    font-medium
    text-white/80
    transition
    hover:text-white
  "
              >
                Show more
                <ChevronRight size={16} strokeWidth={2} className="rotate-90" />
              </button>
            </>
          ) : (
            <>
              {/* NORMAL / EXPANDED MESSAGE */}

              {children}

              {/* SHOW LESS */}

              {isLongUserMessage && (
                <button
                  type="button"
                  onClick={() => setShowFullMessage(false)}
                  className="
    mt-2
    inline-flex
    items-center
    gap-1
    text-sm
    font-medium
    text-white/80
    transition
    hover:text-white
  "
                >
                  Show less
                  <ChevronLeft
                    size={16}
                    strokeWidth={2}
                    className="rotate-90"
                  />
                </button>
              )}
            </>
          )}
        </div>

        {/*  MESSAGE META / ACTIONS */}

        <div
          className={`
            mt-2
            flex
            items-center
            gap-2
            ${isUser ? "justify-end" : "justify-start"}
          `}
        >
          {/* TIME */}

          {time && (
            <span
              className="
                text-[11px]
                leading-none
                text-neutral-500
              "
            >
              {time}
            </span>
          )}

          {/* COPY MESSAGE */}

          <CopyMessageButton text={content} />
        </div>
      </div>

      {/* USER AVATAR */}

      {isUser && (
        <div
          className="
            mt-1
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-neutral-800
            text-neutral-300
            sm:h-9
            sm:w-9
          "
        >
          <User size={17} />
        </div>
      )}
    </article>
  );
};

export default MessageBubble;
