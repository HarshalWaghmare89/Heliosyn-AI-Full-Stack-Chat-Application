import { MessageCircle, MoreHorizontal, Pin, PinOff } from "lucide-react";

const ChatCard = ({
  chat,
  isCollapsed = false,
  isSelected = false,
  showIcon = true,
  showActions = false,
  icon = <MessageCircle size={17} />,
  isPinned = false,

  isEditing = false,
  editTitle = "",
  setEditTitle,
  onRenameSave,
  onRenameCancel,

  onClick,
  onPinClick,
  onMenuClick,
}) => {
  //----->>> Collapsed Sidebar

  if (isCollapsed) {
    return (
      <div className="group relative flex justify-center">
        <button
          onClick={onClick}
          className={`
            flex
            h-10
            w-10
            cursor-pointer
            items-center
            justify-center
            rounded-lg
            transition-all
            duration-200

            ${
              isSelected
                ? "bg-neutral-800 text-white"
                : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
            }
          `}
        >
          {icon}
        </button>

        {/* Tooltip */}

        <div
          className="
            pointer-events-none
            absolute
            left-14
            top-1/2
            z-50
            -translate-y-1/2
            whitespace-nowrap
            rounded-lg
            border
            border-neutral-700
            bg-neutral-800
            px-3
            py-2
            text-xs
            font-medium
            text-white
            opacity-0
            shadow-2xl
            transition-all
            duration-200
            group-hover:opacity-100
          "
        >
          {chat.title}
        </div>
      </div>
    );
  }

  //---->>> Expanded Sidebar

  return (
    <div
      onClick={onClick}
      className={`
        group
        flex
        w-full
        cursor-pointer
        items-center
        rounded-lg
        px-3
        py-2.5
        transition-all
        duration-200

       ${isSelected ? "bg-white/10" : "hover:bg-white/10"}
      `}
    >
      {/* LEFT SIDE */}

      <div
        className="
          flex
          min-w-0
          flex-1
          items-center
          gap-3
        "
      >
        {showIcon && (
          <span className="flex-shrink-0 text-neutral-400">{icon}</span>
        )}

        {/* Rename */}

        {isEditing ? (
          <input
            autoFocus
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onFocus={(e) => e.target.select()}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onRenameSave();
              }

              if (e.key === "Escape") {
                onRenameCancel();
              }
            }}
            onBlur={() => {
              setTimeout(() => {
                onRenameSave();
              }, 100);
            }}
            className="
              w-full
              rounded-md
              border
              border-neutral-700
              bg-neutral-800
              px-2
              py-1
              text-sm
              text-white
              outline-none
              focus:border-neutral-500
            "
          />
        ) : (
          <span
            className="
              block
              flex-1
              truncate
              text-left
              text-sm
              text-neutral-200
            "
            title={chat.title}
          >
            {chat.title}
          </span>
        )}
      </div>

      {/* ACTIONS */}

      {showActions && (
        <div
          className="
            flex
            items-center
            gap-1

            translate-x-0
            opacity-100

            transition-all
            duration-150

            md:translate-x-1
            md:opacity-0
            md:pointer-events-none

            md:group-hover:translate-x-0
            md:group-hover:opacity-100
            md:group-hover:pointer-events-auto
          "
        >
          {/* Pin */}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onPinClick?.(chat.id);
            }}
            className="
              cursor-pointer
              rounded-md
              p-1
              text-neutral-500
              transition
              hover:bg-neutral-800
              hover:text-white
            "
          >
            {isPinned ? (
              <PinOff size={16} />
            ) : (
              <Pin size={16} className="rotate-45" />
            )}
          </button>

          {/* More Menu */}

          <button
            onClick={(e) => {
              e.stopPropagation();

              onMenuClick?.(chat, {
                x: e.clientX,
                y: e.clientY,
              });
            }}
            className="
              cursor-pointer
              rounded-md
              p-1
              text-neutral-500
              transition
              hover:bg-neutral-800
              hover:text-white
            "
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatCard;
