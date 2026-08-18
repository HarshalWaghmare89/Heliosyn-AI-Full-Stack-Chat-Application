import SearchChatItem from "./SearchChatItem";

import { useNavigate } from "react-router-dom";

import { useChats } from "../../../../context/ChatContext";

const SearchChatHistory = ({ chats = [], searchQuery = "", onClose }) => {
  const { openChat } = useChats();

  //---->>> NAVIGATION

  const navigate = useNavigate();

  //----->>> FILTER CHATS

  const filteredChats = chats.filter((chat) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return !chat.archived;
    }

    return !chat.archived && chat.title.toLowerCase().includes(query);
  });

  //---->>> OPEN CHAT

  const handleChatClick = (chat) => {
    if (!chat) return;

    const chatId = chat.id || chat._id;

    if (!chatId) return;

    openChat(chatId);

    //--->> Navigate to chat-specific URL
    navigate(`/c/${chatId}`);

    onClose();
  };

  return (
    <>
      {/* Header */}

      <div
        className="
          mb-2
          sm:mb-3
        "
      >
        <h2
          className="
            text-sm
            font-semibold
            text-neutral-300
          "
        >
          {searchQuery.trim() ? "Search Results" : "Recent Chats"}
        </h2>
      </div>

      {/* Chat List */}

      <div
        className="
          overflow-hidden

          rounded-xl

          border
          border-neutral-800

          bg-neutral-950


          sm:rounded-2xl
        "
      >
        {filteredChats.length > 0 ? (
          <div
            className="
              divide-y
              divide-neutral-900
            "
          >
            {filteredChats.map((chat) => (
              <SearchChatItem
                key={chat.id}
                chat={chat}
                onClick={() => handleChatClick(chat)}
              />
            ))}
          </div>
        ) : (
          <div
            className="
              flex
              flex-col
              items-center
              justify-center

              px-5
              py-8

              text-center


              sm:px-6
              sm:py-12
            "
          >
            <p
              className="
                text-sm
                font-medium
                text-neutral-300
              "
            >
              No chats found
            </p>

            <p
              className="
                mt-1

                text-xs

                text-neutral-500
              "
            >
              Try searching with a different keyword.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}

      <p
        className="
          mt-3

          hidden

          text-center

          text-xs

          text-neutral-500


          sm:block
          sm:mt-4
        "
      >
        Press{" "}
        <kbd
          className="
            rounded

            border
            border-neutral-700

            px-1.5
            py-0.5
          "
        >
          Esc
        </kbd>{" "}
        to close
      </p>
    </>
  );
};

export default SearchChatHistory;
