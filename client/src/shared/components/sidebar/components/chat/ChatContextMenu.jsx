import { useEffect, useRef, useState } from "react";

import { Share2, Pencil, Pin, PinOff, Archive, Trash2 } from "lucide-react";

const ChatContextMenu = ({
  chat,
  position,
  onClose,
  onRename,
  onShare,
  onArchive,
  onDelete,
  onTogglePin,
}) => {
  const menuRef = useRef(null);

  const [menuPosition, setMenuPosition] = useState({
    x: position.x,
    y: position.y,
  });

  //---->>> RESPONSIVE POSITION CALCULATION

  useEffect(() => {
    if (!menuRef.current) return;

    const rect = menuRef.current.getBoundingClientRect();

    const padding = 12;

    let x = position.x;
    let y = position.y;

    // Right overflow
    if (x + rect.width > window.innerWidth - padding) {
      x = window.innerWidth - rect.width - padding;
    }

    // Bottom overflow
    if (y + rect.height > window.innerHeight - padding) {
      y = window.innerHeight - rect.height - padding;
    }

    // Left overflow
    if (x < padding) {
      x = padding;
    }

    // Top overflow
    if (y < padding) {
      y = padding;
    }

    setMenuPosition({
      x,
      y,
    });
  }, [position]);

  //---->>> CLOSE ON OUTSIDE CLICK

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);

      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [onClose]);

  if (!chat) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        className="
          fixed
          inset-0
          z-[998]
        "
      />

      {/* MENU */}
      <div
        ref={menuRef}
        className="
          fixed
          z-[999]

          w-[170px]
          sm:w-[180px]

          max-w-[calc(100vw-24px)]

          overflow-hidden

          rounded-xl

          border
          border-neutral-800

          bg-[#171717]

          p-1

          shadow-[0_15px_50px_rgba(0,0,0,0.55)]
        "
        style={{
          left: menuPosition.x,
          top: menuPosition.y,
        }}
      >
        {/* SHARE */}
        <MenuButton
          icon={<Share2 size={15} />}
          label="Share"
          onClick={() => {
            onShare(chat);
            onClose();
          }}
        />

        {/* RENAME */}
        <MenuButton
          icon={<Pencil size={15} />}
          label="Rename"
          onClick={() => {
            onRename(chat);
            onClose();
          }}
        />

        {/* PIN */}
        <MenuButton
          icon={
            chat.pinned ? (
              <PinOff size={15} />
            ) : (
              <Pin size={15} className="rotate-45" />
            )
          }
          label={chat.pinned ? "Unpin" : "Pin"}
          onClick={() => {
            onTogglePin(chat.id);
            onClose();
          }}
        />

        {/* ARCHIVE */}
        <MenuButton
          icon={<Archive size={15} />}
          label="Archive"
          onClick={() => {
            onArchive(chat);
            onClose();
          }}
        />

        {/* DIVIDER */}
        <div
          className="
            my-1
            h-px
            bg-neutral-800
          "
        />

        {/* DELETE */}
        <MenuButton
          danger
          icon={<Trash2 size={15} />}
          label="Delete"
          onClick={() => {
            onDelete(chat);
            onClose();
          }}
        />
      </div>
    </>
  );
};

//----->>>> MENU BUTTON

const MenuButton = ({ icon, label, onClick, danger = false }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        w-full
        items-center
        gap-2.5

        rounded-md

        px-2.5
        py-2

        text-sm
 cursor-pointer
        active:scale-[0.98]

        ${
          danger
            ? `
              text-red-400
              hover:bg-red-500/10
              hover:text-red-300
            `
            : `
              text-neutral-200
              hover:bg-neutral-800
              hover:text-white
            `
        }
      `}
    >
      <span className="flex items-center justify-center">{icon}</span>

      <span>{label}</span>
    </button>
  );
};

export default ChatContextMenu;
