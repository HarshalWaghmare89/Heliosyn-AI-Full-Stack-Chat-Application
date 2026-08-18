import { useState } from "react";
import { X } from "lucide-react";

import SettingsSidebar from "./SettingsSidebar";
import SettingsContent from "./SettingsContent";

const SettingsModal = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState("general");

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* OVERLAY */}

      <div
        className="
          fixed
          inset-0
          z-50
          bg-black/50
          backdrop-blur-sm
        "
        aria-hidden="true"
      />

      {/* MODAL */}

      <div
        className="
          fixed
          left-1/2
          top-1/2
          z-[60]

          flex
          h-[85dvh]
          w-[calc(100vw-24px)]
          max-w-[720px]

          -translate-x-1/2
          -translate-y-1/2

          flex-col
          overflow-hidden

          rounded-xl
          border
          border-neutral-800

          bg-[#171717]

          shadow-[0_20px_70px_rgba(0,0,0,0.55)]

          md:h-[78vh]
          md:flex-row
          md:rounded-2xl
        "
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        onClick={(event) => event.stopPropagation()}
      >
        {/* CLOSE BUTTON */}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close settings"
          className="
            absolute
            right-3
            top-3
            z-20

            flex
            h-8
            w-8

            cursor-pointer
            items-center
            justify-center

            rounded-lg

            text-neutral-500

            transition-all
            duration-200

            hover:bg-neutral-800
            hover:text-white

            active:scale-95

            sm:right-4
            sm:top-4
          "
        >
          <X size={17} strokeWidth={2} />
        </button>

        {/* SETTINGS SIDEBAR */}

        <div
          className="
            flex-shrink-0

            border-b
            border-neutral-800

            bg-[#191919]

            md:w-[180px]
            md:border-b-0
            md:border-r
          "
        >
          <SettingsSidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        </div>

        {/* SETTINGS CONTENT */}

        <div
          className="
            min-w-0
            flex-1
            overflow-hidden
            bg-[#171717]
          "
        >
          <div
            className="
              custom-scrollbar
              h-full
              overflow-y-auto

              p-4
              sm:p-5
            "
          >
            <SettingsContent activeSection={activeSection} />
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsModal;
