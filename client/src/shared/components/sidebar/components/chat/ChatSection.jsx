import { MessageCircle, MoreHorizontal, Pin, PinOff } from "lucide-react";

const ChatCard = ({
  chat,

  isCollapsed = false,
  isSelected = false,

  showIcon = true,
  showActions = true,

  isPinned = false,

  onClick,
  onPinClick,
  onMenuClick,
}) => {
  //---->>>> COLLAPSED SIDEBAR

  if (isCollapsed) {
    return (
      <div className="group relative flex justify-center">
        <button
          type="button"
          onClick={onClick}
          className={`
            flex
            h-10
            w-10
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
          <MessageCircle size={18} />
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

  //--->>> EXPANDED SIDEBAR

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

        ${isSelected ? "bg-neutral-900" : "hover:bg-neutral-900"}
      `}
    >
      {/* LEFT CONTENT */}

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
          <MessageCircle
            size={17}
            className="
              flex-shrink-0
              text-neutral-400
            "
          />
        )}

        <span
          className="
            truncate
            text-sm
            text-neutral-200
          "
        >
          {chat.title}
        </span>
      </div>

      {/* ACTION BUTTONS */}

      {showActions && (
        <div
          className="
            flex
            items-center
            gap-1

            opacity-100

            md:opacity-0
            md:translate-x-1

            md:transition-all
            md:duration-150

            md:group-hover:translate-x-0
            md:group-hover:opacity-100
          "
        >
          {/* PIN */}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPinClick?.(chat.id);
            }}
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-md
              text-neutral-500
              transition

              hover:bg-neutral-800
              hover:text-white
            "
          >
            {isPinned ? (
              <PinOff size={15} />
            ) : (
              <Pin size={15} className="rotate-45" />
            )}
          </button>

          {/* MORE */}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();

              onMenuClick?.(chat, {
                x: e.clientX,
                y: e.clientY,
              });
            }}
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-md
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
