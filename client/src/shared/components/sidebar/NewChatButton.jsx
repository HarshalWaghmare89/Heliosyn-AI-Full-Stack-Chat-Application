import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { useChats } from "../../context/ChatContext";

const NewChatButton = ({ isCollapsed }) => {
  const { startNewChat } = useChats();

  const handleNewChat = () => {
    startNewChat();
  };

  return (
    <div
      className={`group relative mt-3 pb-2 pt-2 ${
        isCollapsed ? "mt-0 flex justify-center px-0" : "px-3"
      }`}
    >
      <Link
        to="/"
        onClick={handleNewChat}
        className={`flex h-10 cursor-pointer items-center rounded-lg bg-violet-600 text-sm font-medium text-white transition-all duration-300 hover:bg-violet-500 ${
          isCollapsed
            ? "w-10 justify-center"
            : "w-full justify-center gap-2 px-3"
        }`}
      >
        <Plus
          size={18}
          className="flex-shrink-0 transition-transform duration-300 group-hover:rotate-90"
        />

        {!isCollapsed && <span>New chat</span>}
      </Link>

      {/* Tooltip */}

      {isCollapsed && (
        <div
          className="
            pointer-events-none
            absolute
            left-14
            top-1/2
            z-50
            -translate-y-1/2

            flex
            items-center
            gap-2

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

            transition-all
            duration-200

            group-hover:opacity-100
          "
        >
          {/* Tooltip Info */}

          <span className="text-neutral-100">New chat</span>

          {/* Keyboard Shortcut */}

          <kbd
            className="
              rounded-md
              border
              border-neutral-600
              bg-neutral-800
              px-1.5
              py-0.5

              font-mono
              text-[10px]
              font-bold
              text-violet-300

              shadow-sm
            "
          >
            Ctrl + Shift + O
          </kbd>
        </div>
      )}
    </div>
  );
};

export default NewChatButton;
