import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ChatCard from "../sidebar/components/chat/ChatCard";
import ChatContextMenu from "../sidebar/components/chat/ChatContextMenu";

import { useChats } from "../../context/ChatContext";

const PinnedChatsCard = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const {
    pinnedChats = [],

    // Active Chat
    activeChatId,

    // Open Chat
    openChat,

    // Chat Actions
    togglePin,
    archiveChat,

    // Popups
    openDeletePopup,
    openSharePopup,

    // Rename
    editingChatId,
    editTitle,
    setEditTitle,
    startRename,
    saveRename,
    cancelRename,
  } = useChats();

  const [menuChat, setMenuChat] = useState(null);

  const [menuPosition, setMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  //---->>> CLOSE IF NOT OPEN

  if (!isOpen) return null;

  //--->>> OPEN CHAT

  const handleChatClick = (chat) => {
    if (!chat) return;

    const chatId = chat.id || chat._id;

    if (!chatId) return;

    openChat(chatId);

    navigate(`/c/${chatId}`);

    onClose();
  };

  return (
    <>
      {/* OVERLAY */}

      <div
        onClick={onClose}
        className="
          fixed
          inset-0
          z-40
          bg-black/20
        "
      />

      {/* FLOATING CARD */}

      <div
        className="
          fixed
          left-14
          top-20
          z-50
          flex
          max-h-[70vh]
          w-[280px]
          max-w-[calc(100vw-24px)]
          flex-col
          overflow-hidden
          rounded-xl
          border
          border-neutral-800
          bg-[#171717]
          shadow-2xl

          max-md:left-3
          max-md:top-20
        "
      >
        {/* HEADER */}

        <div
          className="
            flex-shrink-0
            border-b
            border-neutral-800
            px-4
            py-3
          "
        >
          <h2
            className="
              text-sm
              font-semibold
              text-white
            "
          >
            Pinned
          </h2>
        </div>

        {/* CHAT LIST */}

        <div
          className="
            custom-scrollbar
            flex-1
            overflow-y-auto
            p-2
          "
        >
          {pinnedChats.length ? (
            pinnedChats.map((chat) => (
              <ChatCard
                key={chat.id}
                chat={chat}
                isCollapsed={false}
                isSelected={activeChatId === chat.id}
                showIcon={true}
                showActions={editingChatId !== chat.id}
                isPinned={chat.pinned}
                //--->> RENAME

                isEditing={editingChatId === chat.id}
                editTitle={editTitle}
                setEditTitle={setEditTitle}
                onRenameSave={saveRename}
                onRenameCancel={cancelRename}
                //--->>> OPEN CHAT

                onClick={() => handleChatClick(chat)}
                //--->>> PIN

                onPinClick={togglePin}
                //---->>> CONTEXT MENU

                onMenuClick={(chat, position) => {
                  setMenuChat(chat);
                  setMenuPosition(position);
                }}
              />
            ))
          ) : (
            <div
              className="
                flex
                h-32
                items-center
                justify-center
                text-sm
                text-neutral-500
              "
            >
              No pinned chats
            </div>
          )}
        </div>
      </div>

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

export default PinnedChatsCard;
