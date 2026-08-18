import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { useChats } from "../../../../context/ChatContext";

const SearchNewChatButton = ({ onClose }) => {
  const { startNewChat } = useChats();

  const handleNewChat = () => {
    startNewChat();

    if (onClose) {
      onClose();
    }
  };
  return (
    <Link
      to="/"
      onClick={handleNewChat}
      className="
        flex
        h-12
        w-full
        cursor-pointer
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-violet-600
        text-sm
        font-medium
        text-white
        transition-all
        duration-200
        hover:bg-violet-500
        active:scale-[0.99]
      "
    >
      <Plus size={18} />

      <span>New Chat</span>
    </Link>
  );
};

export default SearchNewChatButton;
