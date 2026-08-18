import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ChatCard from "../sidebar/components/chat/ChatCard";
import ChatContextMenu from "../sidebar/components/chat/ChatContextMenu";

import { useChats } from "../../context/ChatContext";

const RecentChatsCard = ({ isOpen, onClose }) => {
  const {
    recentChats = [],

    //--->>> Open Chat
    openChat,

    //--->>> Chat Actions
    togglePin,
    archiveChat,

    //--->>> Popups
    openDeletePopup,
    openSharePopup,

    //-->>> Rename
    editingChatId,
    editTitle,
    setEditTitle,
    startRename,
    saveRename,
    cancelRename,
  } = useChats();

  //--->> NAVIGATION

  const navigate = useNavigate();

  //---->>> SELECTED CHAT

  const [activeChat, setActiveChat] = useState(null);

  //---->>> CONTEXT MENU

  const [menuChat, setMenuChat] = useState(null);

  const [menuPosition, setMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  //---->>> CLOSE IF NOT OPEN

  if (!isOpen) return null;

  //--->>> OPEN CHAT

  const handleChatClick = (chat, index) => {
    if (!chat) return;

    const chatId = chat.id || chat._id;

    if (!chatId) return;

    setActiveChat(index);

    openChat(chatId);

    //--->> Navigate to chat-specific URL
    navigate(`/c/${chatId}`);

    //--->> Close floating recent chats card
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

      {/* CARD */}

      <div
        className="
          fixed
          left-14
          top-32
          z-50
          w-[260px]
          max-w-[calc(100vw-24px)]
          overflow-hidden
          rounded-2xl
          border
          border-neutral-800
          bg-[#171717]
          shadow-2xl

          max-md:left-3
          max-md:top-24
        "
      >
        {/* HEADER */}

        <div
          className="
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
            Recents
          </h2>
        </div>

        {/* CHAT LIST */}

        <div
          className="
            custom-scrollbar
            max-h-[60vh]
            overflow-y-auto
            p-2
          "
        >
          {recentChats.length > 0 ? (
            recentChats.map((chat, index) => (
              <ChatCard
                key={chat.id}
                chat={chat}
                isCollapsed={false}
                isSelected={activeChat === index}
                showIcon={false}
                showActions={editingChatId !== chat.id}
                isPinned={chat.pinned}
                //--->>> RENAME

                isEditing={editingChatId === chat.id}
                editTitle={editTitle}
                setEditTitle={setEditTitle}
                onRenameSave={saveRename}
                onRenameCancel={cancelRename}
                //--->> OPEN CHAT

                onClick={() => {
                  handleChatClick(chat, index);
                }}
                //---->> PIN

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
                py-8
                text-center
                text-sm
                text-neutral-500
              "
            >
              No recent chats
            </div>
          )}
        </div>
      </div>

      {/* CONTEXT MENU */}

      {menuChat && (
        <ChatContextMenu
          chat={menuChat}
          position={menuPosition}
          onClose={() => {
            setMenuChat(null);
          }}
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

export default RecentChatsCard;
