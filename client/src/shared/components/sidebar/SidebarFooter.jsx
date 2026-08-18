import { useAuth } from "../../context/AuthContext";

const SidebarFooter = ({ isCollapsed, onOpenProfile }) => {
  const { user } = useAuth();

  //--->>> USER DATA

  const fullName = user?.name?.trim() || "User";

  //--->> Get first name only
  const firstName = fullName.split(/\s+/)[0] || "User";

  //-->>> First character of first name
  const avatarInitial = firstName.charAt(0).toUpperCase();

  return (
    <div
      className="
        border-t
        border-neutral-800
        p-2.5
      "
    >
      <div className="group relative">
        <button
          type="button"
          onClick={onOpenProfile}
          className={`
            flex
            h-10
            w-full
            cursor-pointer
            items-center
            rounded-lg
            text-neutral-100
            transition-all
            duration-200
            hover:bg-white/5
            active:scale-95

            ${isCollapsed ? "justify-center" : "gap-2.5 px-2"}
          `}
          aria-label={`Open profile for ${fullName}`}
        >
          {/* AVATAR */}

          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-violet-600
              text-sm
              font-semibold
              text-white
            "
          >
            {avatarInitial}
          </div>

          {/* USER NAME */}

          {!isCollapsed && (
            <span
              className="
                min-w-0
                truncate
                text-sm
                font-medium
                text-neutral-200
              "
              title={fullName}
            >
              {fullName}
            </span>
          )}
        </button>

        {/* TOOLTIP */}

        {isCollapsed && (
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
            role="tooltip"
          >
            {fullName}
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarFooter;
