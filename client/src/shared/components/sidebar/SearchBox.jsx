import { Search } from "lucide-react";

const SearchBox = ({ isCollapsed, onOpenSearch }) => {
  return (
    <div
      className={`
        group
        relative

        ${isCollapsed ? "flex justify-center" : "w-full"}
      `}
    >
      <button
        onClick={onOpenSearch}
        className={`
          flex
          h-10
          cursor-pointer
          items-center
          rounded-lg
          text-sm
          font-medium
          text-neutral-100
          transition-all
          duration-200
          hover:bg-white/5
          active:scale-95

          ${isCollapsed ? "w-10 justify-center" : "w-full gap-2 px-3"}
        `}
      >
        <Search
          size={18}
          className="
            shrink-0
            text-neutral-300
          "
        />

        {!isCollapsed && (
          <span
            className="
              truncate
              text-neutral-100
            "
          >
            Search chats
          </span>
        )}
      </button>

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

          <span className="text-neutral-100">Search</span>

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
            Ctrl + K
          </kbd>
        </div>
      )}
    </div>
  );
};

export default SearchBox;
