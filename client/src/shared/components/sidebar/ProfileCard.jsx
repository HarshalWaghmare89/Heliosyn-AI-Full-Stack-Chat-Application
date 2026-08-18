import { useState } from "react";

import { Settings, Sparkles, HelpCircle, LogOut, Keyboard } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import KeyboardShortcutsModal from "../shortcuts/KeyboardShortcutsModal";

const ProfileCard = ({ isOpen, onClose, onOpenSettings, onLogout }) => {
  //---->>> AUTH
  const { user } = useAuth();

  //--->>> LOCAL STATE

  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  //--->> USER DATA

  const fullName = user?.name?.trim() || "User";

  const firstName = fullName.split(/\s+/)[0] || "User";

  const avatarInitial = firstName.charAt(0).toUpperCase();

  //--->>> KEYBOARD SHORTCUTS

  const handleOpenShortcuts = () => {
    onClose();
    setIsShortcutsOpen(true);
  };

  const handleCloseShortcuts = () => {
    setIsShortcutsOpen(false);
  };

  //--->> DUMMY ACTIONS

  const handleHelp = () => {
    onClose();
  };

  //--->>> MENU ITEMS

  const menuItems = [
    {
      icon: <Sparkles size={18} />,
      label: "Try Plus free",
      action: () => {
        onClose();
      },
    },

    {
      icon: <Settings size={18} />,
      label: "Settings",
      action: () => {
        onClose();
        onOpenSettings?.();
      },
    },

    {
      icon: <Keyboard size={18} />,
      label: "Keyboard shortcuts",
      action: handleOpenShortcuts,
    },

    {
      icon: <HelpCircle size={18} />,
      label: "Help",
      action: handleHelp,
    },
  ];

  if (!isOpen && !isShortcutsOpen) {
    return null;
  }

  return (
    <>
      {/* PROFILE CARD */}

      {isOpen && (
        <>
          {/* OVERLAY */}

          <div
            onClick={onClose}
            className="
              fixed
              inset-0
              z-[90]
            "
            aria-hidden="true"
          />

          {/* PROFILE MENU */}

          <div
            className="
              fixed
              bottom-15
              left-3
              z-[100]

              w-[240px]
              max-w-[calc(100vw-24px)]

              rounded-xl
              border
              border-neutral-800

              bg-[#171717]

              p-1

              shadow-2xl
            "
            role="menu"
            aria-label="Profile menu"
          >
            {/* PROFILE HEADER */}

            <div
              className="
                flex
                w-full
                items-center
                gap-2.5

                rounded-lg

                px-2.5
                py-2
              "
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

              {/* USER INFORMATION */}

              <div className="min-w-0 flex-1">
                <div
                  className="
                    truncate

                    text-sm
                    font-medium
                    text-white
                  "
                  title={fullName}
                >
                  {fullName}
                </div>

                <div
                  className="
                    mt-0.5
                    text-xs
                    text-neutral-500
                  "
                >
                  Free plan
                </div>
              </div>
            </div>

            {/* DIVIDER */}

            <div
              className="
                mx-3
                my-1
                h-px
                bg-neutral-800
              "
            />

            {/* MENU ITEMS */}

            <div>
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.action}
                  className="
                    group

                    flex
                    h-9
                    w-full

                    cursor-pointer
                    items-center
                    gap-2.5

                    rounded-lg

                    px-2.5

                    text-sm
                    text-neutral-200

                    transition-all
                    duration-200

                    hover:bg-white/5
                    hover:text-white

                    active:scale-[0.99]
                  "
                >
                  {/* ICON */}

                  <span
                    className="
                      flex
                      h-5
                      w-5
                      shrink-0
                      items-center
                      justify-center

                      text-neutral-400

                      transition-colors
                      duration-200

                      group-hover:text-neutral-200
                    "
                  >
                    {item.icon}
                  </span>

                  {/* LABEL */}

                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>

            {/* DIVIDER */}

            <div
              className="
                mx-3
                my-1
                h-px
                bg-neutral-800
              "
            />

            {/* LOGOUT */}

            <button
              type="button"
              onClick={onLogout}
              className="
                group

                mt-1

                flex
                h-9
                w-full

                cursor-pointer
                items-center
                gap-2.5

                rounded-lg

                px-2.5

                text-sm
                text-red-400

                transition-all
                duration-200

                hover:bg-red-500/10
                hover:text-red-300

                active:scale-[0.99]
              "
            >
              <LogOut
                size={18}
                className="
                  transition-transform
                  duration-200

                  group-hover:translate-x-0.5
                "
              />

              <span>Log out</span>
            </button>
          </div>
        </>
      )}

      {/* KEYBOARD SHORTCUTS MODAL */}

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={handleCloseShortcuts}
      />
    </>
  );
};

export default ProfileCard;
