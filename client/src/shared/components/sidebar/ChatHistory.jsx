import { MessageCircle, ChevronDown } from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useChats } from "../../context/ChatContext";

import ChatCard from "../sidebar/components/chat/ChatCard";
import ChatContextMenu from "../sidebar/components/chat/ChatContextMenu";

const ChatHistory = ({ isCollapsed, onOpenRecentChats }) => {
  const [isOpen, setIsOpen] = useState(true);

  //----->>> NAVIGATION

  const navigate = useNavigate();

  //---->>> CONTEXT MENU

  const [menuChat, setMenuChat] = useState(null);

  const [menuPosition, setMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  const {
    recentChats = [],

    activeChatId,

    openChat,

    togglePin,

    archiveChat,

    openDeletePopup,

    openSharePopup,

    editingChatId,

    editTitle,

    setEditTitle,

    startRename,

    saveRename,

    cancelRename,
  } = useChats();

  //----->>> OPEN CHAT

  const handleChatClick = (chat) => {
    if (!chat) return;

    const chatId = chat.id || chat._id;

    if (!chatId) return;

    openChat(chatId);

    navigate(`/c/${chatId}`);
  };

  //---->>> COLLAPSED SIDEBAR

  if (isCollapsed) {
    return (
      <div className="relative">
        <div
          className="
            group
            flex
            cursor-pointer
            items-center
            justify-center
            rounded-lg
            p-2
            transition-colors
            duration-200
            hover:bg-white/5
          "
          onClick={onOpenRecentChats}
        >
          <MessageCircle size={19} className="text-neutral-400" />

          {/* TOOLTIP */}

          <div
            className="
              pointer-events-none
              absolute
              left-14
              top-1/2
              z-[9999]
              -translate-y-1/2
              whitespace-nowrap
              rounded-lg
              border
              border-neutral-700
              bg-neutral-900
              px-3
              py-2
              text-xs
              font-medium
              text-white
              opacity-0
              shadow-xl
              transition-opacity
              duration-200
              group-hover:opacity-100
            "
          >
            Recents
          </div>
        </div>
      </div>
    );
  }

  //---->>> EXPANDED SIDEBAR

  return (
    <>
      {/* HEADER */}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          flex
          w-full
          cursor-pointer
          items-center
          justify-between
          rounded-lg
          px-2
          py-1.5
          text-sm
          font-semibold
          text-neutral-100
          transition-colors
          duration-200
          hover:bg-white/5
        "
      >
        <span>Recents</span>

        <ChevronDown
          size={16}
          className={`
            text-neutral-500
            transition-transform
            duration-200

            ${isOpen ? "rotate-0" : "-rotate-90"}
          `}
        />
      </button>

      {/* CHAT LIST */}

      {isOpen && (
        <div className="mt-2 space-y-0.5">
          {recentChats.length > 0 ? (
            recentChats.map((chat) => (
              <ChatCard
                key={chat.id}
                chat={chat}
                isCollapsed={false}
                isSelected={activeChatId === chat.id}
                showIcon={false}
                showActions={editingChatId !== chat.id}
                isPinned={chat.pinned}
                isEditing={editingChatId === chat.id}
                editTitle={editTitle}
                setEditTitle={setEditTitle}
                onRenameSave={saveRename}
                onRenameCancel={cancelRename}
                onClick={() => handleChatClick(chat)}
                onPinClick={togglePin}
                onMenuClick={(chat, position) => {
                  setMenuChat(chat);

                  setMenuPosition(position);
                }}
              />
            ))
          ) : (
            <div
              className="
                px-2
                py-3
                text-sm
                text-neutral-500
              "
            >
              No recent chats
            </div>
          )}
        </div>
      )}

      {/* CONTEXT MENU */}

      {menuChat && (
        <ChatContextMenu
          chat={menuChat}
          position={menuPosition}
          onClose={() => setMenuChat(null)}
          onTogglePin={togglePin}
          onRename={(chat) => {
            startRename(chat);

            setMenuChat(null);
          }}
          onShare={(chat) => {
            openSharePopup(chat);

            setMenuChat(null);
          }}
          onArchive={(chat) => {
            archiveChat(chat.id);

            setMenuChat(null);
          }}
          onDelete={(chat) => {
            openDeletePopup(chat);

            setMenuChat(null);
          }}
        />
      )}
    </>
  );
};

export default ChatHistory;
