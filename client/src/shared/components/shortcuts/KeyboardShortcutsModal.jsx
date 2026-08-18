import { Keyboard, X } from "lucide-react";

const KeyboardShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  const shortcuts = [
    {
      section: "Navigation",
      items: [
        {
          keys: ["Ctrl", "/"],
          label: "Toggle sidebar",
        },
        {
          keys: ["Ctrl", "Shift", "O"],
          label: "New chat",
        },
        {
          keys: ["Ctrl", "K"],
          label: "Open search",
        },
        {
          keys: ["Esc"],
          label: "Close search",
        },
        {
          keys: ["Ctrl", "Shift", "A"],
          label: "Focus message input",
        },
      ],
    },
    {
      section: "Chat",
      items: [
        {
          keys: ["Enter"],
          label: "Send message",
        },
        {
          keys: ["Shift", "Enter"],
          label: "New line",
        },
      ],
    },
  ];

  return (
    <>
      {/* OVERLAY */}

      <div
        className="
          fixed
          inset-0
          z-[200]
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

          z-[201]

          flex
          h-auto
          max-h-[85dvh]

          w-[calc(100vw-24px)]
          max-w-[520px]

          -translate-x-1/2
          -translate-y-1/2

          flex-col

          overflow-hidden

          rounded-xl

          border
          border-neutral-800

          bg-[#171717]

          shadow-2xl

          sm:rounded-2xl
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="keyboard-shortcuts-title"
        onClick={(event) => event.stopPropagation()}
      >
        {/* CLOSE BUTTON */}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close keyboard shortcuts"
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

            text-neutral-400

            transition

            hover:bg-neutral-800
            hover:text-white

            active:scale-95

            sm:right-4
            sm:top-4

            sm:h-9
            sm:w-9
          "
        >
          <X size={18} />
        </button>

        {/* HEADER */}

        <div
          className="
            flex
            items-center
            gap-3

            border-b
            border-neutral-800

            bg-[#1a1a1a]

            px-4
            py-4

            sm:px-5
          "
        >
          {/* Icon */}

          <div
            className="
              flex
              h-9
              w-9
              shrink-0

              items-center
              justify-center

              rounded-lg

              bg-violet-500/10

              text-violet-400
            "
          >
            <Keyboard size={18} />
          </div>

          {/* Title */}

          <div className="min-w-0">
            <h2
              id="keyboard-shortcuts-title"
              className="
                text-sm
                font-semibold
                text-white
              "
            >
              Keyboard shortcuts
            </h2>

            <p
              className="
                mt-0.5
                text-xs
                text-neutral-500
              "
            >
              Navigate Heliosyn AI faster
            </p>
          </div>
        </div>

        {/* CONTENT */}

        <div
          className="
            custom-scrollbar
            flex-1
            overflow-y-auto

            px-4
            py-4

            sm:px-5
            sm:py-5
          "
        >
          {shortcuts.map((section) => (
            <div key={section.section} className="mb-5 last:mb-0">
              {/* SECTION TITLE */}

              <h3
                className="
                  mb-2

                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-wider

                  text-neutral-500
                "
              >
                {section.section}
              </h3>

              {/* SHORTCUT LIST */}

              <div
                className="
                  overflow-hidden

                  rounded-lg

                  border
                  border-neutral-800

                  bg-[#111]
                "
              >
                {section.items.map((shortcut, index) => (
                  <div
                    key={shortcut.label}
                    className={`
                      flex
                      min-h-11

                      items-center
                      justify-between

                      gap-4

                      px-3
                      py-2.5

                      sm:px-3.5

                      ${
                        index !== section.items.length - 1
                          ? "border-b border-neutral-800"
                          : ""
                      }
                    `}
                  >
                    {/* Label */}

                    <span
                      className="
                        min-w-0

                        text-sm

                        text-neutral-300
                      "
                    >
                      {shortcut.label}
                    </span>

                    {/* Keys */}

                    <div
                      className="
                        flex
                        shrink-0
                        items-center
                        gap-1
                      "
                    >
                      {shortcut.keys.map((key) => (
                        <kbd
                          key={key}
                          className="
                            min-w-[28px]

                            rounded-md

                            border
                            border-neutral-700

                            bg-[#1a1a1a]

                            px-2
                            py-1

                            text-center

                            text-[11px]
                            font-medium

                            text-neutral-300

                            shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]
                          "
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* MAC NOTE */}

          <div
            className="
              mt-5

              rounded-lg

              border
              border-neutral-800

              bg-[#1a1a1a]

              px-3.5
              py-3
            "
          >
            <p
              className="
                text-xs
                leading-5
                text-neutral-500
              "
            >
              <span className="font-medium text-neutral-300">Mac users:</span>{" "}
              use{" "}
              <kbd
                className="
                  rounded-md
                  border
                  border-neutral-700
                  bg-[#111]
                  px-1.5
                  py-0.5
                  text-[10px]
                  text-neutral-300
                "
              >
                ⌘
              </kbd>{" "}
              instead of{" "}
              <kbd
                className="
                  rounded-md
                  border
                  border-neutral-700
                  bg-[#111]
                  px-1.5
                  py-0.5
                  text-[10px]
                  text-neutral-300
                "
              >
                Ctrl
              </kbd>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default KeyboardShortcutsModal;
