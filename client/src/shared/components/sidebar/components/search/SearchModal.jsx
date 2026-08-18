import { useState } from "react";

import SearchInput from "./SearchInput";
import SearchNewChatButton from "./SearchNewChatButton";
import SearchChatHistory from "./SearchChatHistory";

import { useChats } from "../../../../context/ChatContext";

const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const { chats } = useChats();

  if (!isOpen) return null;

  const handleClose = () => {
    setSearchQuery("");
    onClose();
  };

  return (
    <div
      onClick={handleClose}
      className="
        fixed
        inset-0
        z-50

        flex
        items-start
        justify-center

        bg-black/30

        px-3
        pt-16

        sm:px-5
        sm:pt-20
      "
    >
      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          flex
          h-[78dvh]

          w-full

          max-w-[700px]

          flex-col

          overflow-hidden

          rounded-xl

          border
          border-neutral-800

          bg-[#171717]

          shadow-2xl


          sm:rounded-2xl
        "
      >
        {/* Search Input */}
        <div
          className="
            flex-shrink-0

            border-b
            border-neutral-800

            p-3

            sm:p-4
          "
        >
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Content */}
        <div
          className="
            custom-scrollbar

            flex-1

            overflow-y-auto

            px-3
            py-2


            sm:px-5
          "
        >
          {/* New Chat */}
          <SearchNewChatButton onClose={handleClose} />

          {/* History */}
          <div
            className="
              mt-3
            "
          >
            <SearchChatHistory
              chats={chats}
              searchQuery={searchQuery}
              onClose={handleClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
