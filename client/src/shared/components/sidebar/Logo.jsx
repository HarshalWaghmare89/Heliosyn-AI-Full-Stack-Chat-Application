import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Link } from "react-router-dom";

import favicon from "../../../assets/favicon.png";
import { useChats } from "../../context/ChatContext";

const Logo = ({ isCollapsed, setIsCollapsed, isMobile, onCloseMobile }) => {
  const { startNewChat } = useChats();

  const handleNewChat = () => {
    startNewChat();
  };

  return (
    <div className="border-b border-neutral-800">
      {/* COLLAPSED SIDEBAR */}

      {isCollapsed ? (
        <div className="flex justify-center py-2">
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="
              cursor-pointer
              group
              relative
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-lg
              transition-colors
              duration-200
              hover:bg-neutral-900
            "
          >
            {/* Logo */}

            <img
              src={favicon}
              alt="Heliosyn AI"
              className="
                absolute
                h-8
                w-8
                transition-all
                duration-300
                group-hover:scale-0
                group-hover:opacity-0
              "
            />

            {/* Expand */}

            <PanelLeftOpen
              size={18}
              className="
                absolute
                scale-75
                text-neutral-300
                opacity-0
                transition-all
                duration-300
                group-hover:scale-100
                group-hover:opacity-100
              "
            />

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
                border-neutral-800
                bg-neutral-900
                px-3
                py-2
                text-xs
                font-medium
                text-white
                opacity-0
                shadow-xl
                transition-opacity
                group-hover:opacity-100
              "
            >
              Open sidebar
            </div>
          </button>
        </div>
      ) : (
        /* EXPANDED SIDEBAR */

        <div
          className="
            flex
            h-14
            items-center
            justify-between
            px-4
          "
        >
          {/* BRAND */}

          <Link
            to="/"
            onClick={handleNewChat}
            className="
              flex
              min-w-0
              cursor-pointer
              items-center
              gap-3
              rounded-lg
              transition-colors
              duration-200
              hover:bg-white/5
            "
          >
            <img
              src={favicon}
              alt="Heliosyn AI"
              className="
                h-9
                w-9
                flex-shrink-0
              "
            />

            <span
              className="
                truncate
                text-lg
                font-semibold
                tracking-wide
                text-white
              "
            >
              Heliosyn AI
            </span>
          </Link>

          {/* COLLAPSE BUTTON */}

          <button
            type="button"
            onClick={() => {
              // Mobile drawer close
              if (isMobile) {
                onCloseMobile?.();
                return;
              }

              // Desktop collapse
              setIsCollapsed(true);
            }}
            className="
              cursor-ew-resize
              group
              relative
              rounded-lg
              p-1.5
              text-neutral-400
              transition-all
              duration-200
              hover:bg-neutral-900
              hover:text-white
            "
          >
            <PanelLeftClose size={18} />

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
                border-neutral-800
                bg-neutral-900
                px-3
                py-2
                text-xs
                font-medium
                text-white
                opacity-0
                shadow-xl
                transition-opacity
                duration-200
                group-hover:opacity-100
              "
            >
              Close sidebar
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default Logo;
