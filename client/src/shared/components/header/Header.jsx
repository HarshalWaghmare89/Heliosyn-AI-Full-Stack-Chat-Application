import { useEffect, useRef, useState } from "react";
import {
  Check,
  MessageCircle,
  MoreHorizontal,
  ChartNoAxesColumnDecreasing,
  ChevronDown,
} from "lucide-react";

import { useChats } from "../../context/ChatContext";
import ChatContextMenu from "../sidebar/components/chat/ChatContextMenu";

const Header = ({ onOpenSidebar }) => {
  const {
    //--->>> CHAT DATA

    chats = [],
    activeChatId,

    //----->>> TEMPORARY CHAT

    temporaryChat,
    setTemporaryChat,

    //---->>>> CHAT ACTIONS

    togglePin,
    archiveChat,
    openDeletePopup,
    openSharePopup,
    startRename,

    //---->> SHARED MODEL SELECTION

    models = [],
    selectedModel,
    setSelectedModel,
  } = useChats();

  //---->>> LOCAL STATE

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);

  const moreButtonRef = useRef(null);

  const modelMenuRef = useRef(null);

  //--->>>> ACTIVE CHAT

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  const isChatOpen = Boolean(activeChat);

  //----->>>> TEMPORARY CHAT

  const handleTemporaryChat = () => {
    setTemporaryChat((prev) => !prev);
  };

  //---->>> MODEL SELECTION

  const handleModelSelect = (model) => {
    setSelectedModel(model.name);

    setIsModelMenuOpen(false);
  };

  //--->>> CLOSE MENUS WHEN CHAT CHANGES

  useEffect(() => {
    setIsMoreMenuOpen(false);

    setIsModelMenuOpen(false);
  }, [activeChatId]);

  //----->>> OUTSIDE CLICK

  useEffect(() => {
    const handleOutsideClick = (event) => {
      // MORE MENU

      if (
        moreButtonRef.current &&
        !moreButtonRef.current.contains(event.target)
      ) {
        const menu = document.querySelector("[data-header-chat-context-menu]");

        if (!menu || !menu.contains(event.target)) {
          setIsMoreMenuOpen(false);
        }
      }

      if (
        modelMenuRef.current &&
        !modelMenuRef.current.contains(event.target)
      ) {
        setIsModelMenuOpen(false);
      }
    };

    if (isMoreMenuOpen || isModelMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMoreMenuOpen, isModelMenuOpen]);

  //---->>> CHAT CONTEXT MENU POSITION

  const getMenuPosition = () => {
    if (!moreButtonRef.current) {
      return {
        x: 0,
        y: 0,
      };
    }

    const rect = moreButtonRef.current.getBoundingClientRect();

    const menuWidth = 180;

    const padding = 12;

    let x = rect.right - menuWidth;

    let y = rect.bottom + 8;

    //---->>> RIGHT SIDE OVERFLOW

    if (x + menuWidth > window.innerWidth - padding) {
      x = window.innerWidth - menuWidth - padding;
    }

    //---->>> LEFT SIDE OVERFLOW

    if (x < padding) {
      x = padding;
    }

    return {
      x,
      y,
    };
  };

  //---->>> CHAT MENU ACTIONS

  const handleTogglePin = (chat) => {
    togglePin(chat);

    setIsMoreMenuOpen(false);
  };

  const handleRename = (chat) => {
    startRename(chat);

    setIsMoreMenuOpen(false);
  };

  const handleMenuShare = (chat) => {
    openSharePopup(chat);

    setIsMoreMenuOpen(false);
  };

  const handleArchive = (chat) => {
    archiveChat(chat.id);

    setIsMoreMenuOpen(false);
  };

  const handleDelete = (chat) => {
    openDeletePopup(chat);

    setIsMoreMenuOpen(false);
  };

  return (
    <>
      {/* HEADER */}

      <header
        className={`
          sticky
          top-0
          z-40
          flex
          h-14
          w-full
          flex-shrink-0
          items-center
          border-b
          border-neutral-800
          transition-all
          duration-300

          ${isChatOpen ? "bg-black/30 backdrop-blur-xl" : "bg-black"}
        `}
      >
        <div
          className="
            flex
            h-full
            w-full
            min-w-0
            items-center
            justify-between
            px-3
            sm:px-5
            lg:px-6
          "
        >
          {/* LEFT SECTION */}

          <div
            className="
              flex
              min-w-0
              flex-1
              items-center
              gap-2
            "
          >
            {/* MOBILE SIDEBAR BUTTON */}

            <button
              type="button"
              onClick={onOpenSidebar}
              aria-label="Open sidebar"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                text-neutral-400
                transition
                hover:bg-white/10
                hover:text-white
                md:hidden
              "
            >
              <ChartNoAxesColumnDecreasing
                size={20}
                className="
                  rotate-90
                  text-neutral-400
                  transition-colors
                  hover:text-white
                "
              />
            </button>

            {/* CHAT OPEN */}
            {/* SHOW CHAT TITLE */}

            {isChatOpen ? (
              <h1
                className="
                  min-w-0
                  truncate
                  text-sm
                  font-medium
                  text-neutral-100
                  sm:text-base
                "
              >
                {activeChat.title}
              </h1>
            ) : (
              /* NO CHAT OPEN */
              /* SHOW MODEL SELECTOR */

              <div ref={modelMenuRef} className="relative">
                {/* MODEL SELECTOR BUTTON */}

                <button
                  type="button"
                  onClick={() => setIsModelMenuOpen((prev) => !prev)}
                  aria-label="Select AI model"
                  aria-expanded={isModelMenuOpen}
                  className={`
      group
      relative
      flex
      h-9
      max-w-[220px]
      cursor-pointer
      items-center
      gap-2
      overflow-hidden
      rounded-xl
      border
      px-3
      text-xs
      font-medium
      transition-all
      duration-300
      ease-out

      ${
        isModelMenuOpen
          ? "border-violet-500/50 bg-violet-500/10 text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
          : "border-neutral-800 bg-[#171b25] text-neutral-400 hover:border-indigo-500/40 hover:bg-[#1c2130] hover:text-neutral-200 hover:shadow-[0_0_18px_rgba(99,102,241,0.14)]"
      }

      active:scale-[0.98]
    `}
                >
                  {/* ANIMATED GLOW */}

                  <span
                    className={`
        pointer-events-none
        absolute
        -inset-[1px]
        rounded-xl
        bg-gradient-to-r
        from-blue-500/0
        via-violet-500/40
        to-indigo-500/0
        opacity-0
        blur-[2px]
        transition-opacity
        duration-300

        ${isModelMenuOpen ? "opacity-100" : "group-hover:opacity-100"}
      `}
                  />

                  {/* SELECTED MODEL */}

                  <span
                    className="
    relative
    z-10
    min-w-0
    max-w-[110px]
    truncate
    text-sm
    font-medium
    leading-5
    text-white
    sm:max-w-[140px]
    sm:text-sm
    md:max-w-[180px]
  "
                  >
                    {selectedModel || "Select model"}
                  </span>

                  {/* ========================================== */}
                  {/* CHEVRON */}
                  {/* ========================================== */}

                  <ChevronDown
                    size={13}
                    className={`
        relative
        z-10
        flex-shrink-0
        transition-all
        duration-300

        ${
          isModelMenuOpen
            ? "rotate-180 text-violet-400"
            : "rotate-0 text-neutral-500"
        }
      `}
                  />
                </button>

                {/* MODEL DROPDOWN */}

                {isModelMenuOpen && (
                  <div
                    className="
        absolute
        top-11
        left-0
        z-[9999]
        w-64
        origin-bottom-left
        overflow-hidden
        rounded-xl
        border
        border-neutral-800
        bg-[#11141c]
        p-1.5
        shadow-[0_15px_50px_rgba(0,0,0,0.65)]

        animate-in
        fade-in
        slide-in-from-bottom-2
        duration-200
      "
                  >
                    {models.length > 0 ? (
                      models.map((model) => {
                        const isSelected = selectedModel === model.name;

                        return (
                          <button
                            key={model.id}
                            type="button"
                            onClick={() => handleModelSelect(model)}
                            className={`
                group
                relative
                flex
                w-full
                flex-col
                items-start
                overflow-hidden
                rounded-lg
                border
                px-3
                py-2.5
                text-left
                transition-all
                duration-200

                 cursor-pointer
                ${
                  isSelected
                    ? "border-violet-500/20 bg-violet-500/10"
                    : "border-transparent hover:border-neutral-800 hover:bg-neutral-800/70"
                }
              `}
                          >
                            {/* HOVER GLOW */}

                            <span
                              className="
                  pointer-events-none
                  absolute
                  -inset-[1px]
                  rounded-lg
                  bg-gradient-to-r
                  from-blue-500/0
                  via-violet-500/20
                  to-indigo-500/0
                  opacity-0
                  blur-[2px]
                  transition-opacity
                  duration-300
                  group-hover:opacity-100
                  
                "
                            />

                            {/* MODEL NAME */}

                            <span
                              className={`
                  relative
                  z-10
                  text-xs
                  font-medium
                  transition-colors
                  duration-200
                  

                  ${isSelected ? "text-violet-300" : "text-neutral-200"}
                `}
                            >
                              {model.name}
                            </span>

                            {/* MODEL DESCRIPTION */}

                            <span
                              className="
                  relative
                  z-10
                  mt-0.5
                  text-[11px]
                  text-neutral-500
                "
                            >
                              {model.description}
                            </span>
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-3 py-3 text-xs text-neutral-500">
                        No models available
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT SECTION */}

          <div
            className="
              flex
              items-center
              gap-1.5
              sm:gap-2
            "
          >
            {/* MORE CHAT OPTIONS */}
            {/* ONLY WHEN CHAT IS OPEN */}

            {isChatOpen && (
              <button
                ref={moreButtonRef}
                type="button"
                onClick={() => setIsMoreMenuOpen((prev) => !prev)}
                aria-label="More chat options"
                className={`
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  active:scale-95

                  ${
                    isMoreMenuOpen
                      ? "bg-white/10 text-white"
                      : "text-neutral-400 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <MoreHorizontal size={20} />
              </button>
            )}

            {/* TEMPORARY CHAT */}
            {/* ONLY WHEN NO CHAT IS OPEN */}

            {!isChatOpen && (
              <div className="group relative">
                <button
                  type="button"
                  onClick={handleTemporaryChat}
                  aria-label="Temporary chat"
                  className={`
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    transition-all
                    duration-200
                    cursor-pointer

                    ${
                      temporaryChat
                        ? "bg-violet-500/15 text-violet-400"
                        : "text-neutral-400 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  {temporaryChat ? (
                    <Check size={18} />
                  ) : (
                    <MessageCircle size={18} />
                  )}
                </button>

                {/* TOOLTIP */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    right-0
                    top-11
                    z-50
                    whitespace-nowrap
                    rounded-lg
                    border
                    border-neutral-800
                    bg-neutral-900
                    px-3
                    py-2
                    text-xs
                    font-medium
                    text-white
                    opacity-0
                    shadow-xl
                    transition-all
                    duration-200
                    group-hover:translate-y-1
                    group-hover:opacity-100
                  "
                >
                  Temporary chat
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CHAT CONTEXT MENU */}

      {isMoreMenuOpen && activeChat && (
        <div data-header-chat-context-menu>
          <ChatContextMenu
            chat={activeChat}
            position={getMenuPosition()}
            onClose={() => setIsMoreMenuOpen(false)}
            onTogglePin={handleTogglePin}
            onRename={handleRename}
            onShare={handleMenuShare}
            onArchive={handleArchive}
            onDelete={handleDelete}
          />
        </div>
      )}
    </>
  );
};

export default Header;
