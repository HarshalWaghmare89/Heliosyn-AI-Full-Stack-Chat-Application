import { useState } from "react";
import { Pin, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useChats } from "../../context/ChatContext";

import ChatCard from "../sidebar/components/chat/ChatCard";
import ChatContextMenu from "../sidebar/components/chat/ChatContextMenu";

const PinnedChats = ({ isCollapsed, onOpenPinnedChats }) => {
  const [isOpen, setIsOpen] = useState(true);

  //--->> NAVIGATION

  const navigate = useNavigate();

  //----->>> ACTIVE CHAT

  const [activeChat, setActiveChat] = useState(null);

  //---->>> CONTEXT MENU

  const [menuChat, setMenuChat] = useState(null);

  const [menuPosition, setMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  const {
    pinnedChats = [],
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

  //---->>> OPEN CHAT

  const handleChatClick = (chat, index) => {
    if (!chat) return;

    setActiveChat(index);

    const chatId = chat.id || chat._id;

    if (!chatId) return;

    openChat(chatId);
    navigate(`/c/${chatId}`);
  };

  //--->>> NO PINNED CHATS

  if (pinnedChats.length === 0) {
    return null;
  }

  //--->>> COLLAPSED SIDEBAR

  if (isCollapsed) {
    return (
      <div className="relative">
        <div
          onClick={onOpenPinnedChats}
          className="
            group
            flex
            cursor-pointer
            items-center
            justify-center
            rounded-lg
            px-2
            py-2
            transition-colors
            duration-200
            hover:bg-white/5
          "
        >
          <Pin size={18} className="rotate-45 text-neutral-400" />

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
            Pinned
          </div>
        </div>
      </div>
    );
  }

  //--->>> EXPANDED SIDEBAR

  return (
    <>
      {/* HEADER */}
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => {
            return !prev;
          });
        }}
        className="
          flex
          w-full
          cursor-pointer
          items-center
          justify-between
          rounded-lg
          px-2
          py-2
          mb-3
          text-sm
          font-semibold
          text-neutral-100
          transition-colors
          duration-200
          hover:bg-white/5
        "
      >
        <span>Pinned</span>

        <ChevronDown
          size={16}
          className="
    text-neutral-500
    transition-transform
    duration-200
  "
          style={{
            transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
          }}
        />
      </button>

      {/* CHAT LIST */}
      {isOpen && (
        <div className="mt-2 space-y-0.5">
          {pinnedChats.map((chat, index) => (
            <ChatCard
              key={chat.id || chat._id}
              chat={chat}
              isCollapsed={false}
              isSelected={activeChat === index}
              showIcon={true}
              showActions={editingChatId !== chat.id}
              isPinned={true}
              isEditing={editingChatId === chat.id}
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              onRenameSave={saveRename}
              onRenameCancel={cancelRename}
              onClick={() => handleChatClick(chat, index)}
              onPinClick={togglePin}
              onMenuClick={(chat, position) => {
                setMenuChat(chat);
                setMenuPosition(position);
              }}
            />
          ))}
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
            archiveChat(chat.id || chat._id);
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

export default PinnedChats;
