import { useEffect, useRef, useState } from "react";
import { ArrowUp, ChevronDown, Mic, Plus, Sparkles } from "lucide-react";

import { useChats } from "../../shared/context/ChatContext";

const ChatInput = ({ onSend, disabled = false }) => {
  const { models = [], selectedModel, setSelectedModel } = useChats();

  const [message, setMessage] = useState("");
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);

  const textareaRef = useRef(null);
  const modelMenuRef = useRef(null);
  const submittingRef = useRef(false);

  //----->>> AUTO RESIZE TEXTAREA

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";

    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [message]);

  // GLOBAL KEYBOARD SHORTCUT
  // Ctrl + Shift + A

  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "a") {
        const activeElement = document.activeElement;

        const isTypingInAnotherField =
          activeElement &&
          activeElement !== textareaRef.current &&
          (activeElement.tagName === "INPUT" ||
            activeElement.tagName === "TEXTAREA" ||
            activeElement.tagName === "SELECT" ||
            activeElement.isContentEditable);

        if (isTypingInAnotherField) {
          return;
        }

        event.preventDefault();

        textareaRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  //----->>> CLOSE MODEL MENU

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modelMenuRef.current &&
        !modelMenuRef.current.contains(event.target)
      ) {
        setIsModelMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //----->>> SEND MESSAGE

  const handleSubmit = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || disabled || submittingRef.current) {
      return;
    }

    submittingRef.current = true;

    try {
      //--->> Clear input immediately
      setMessage("");

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      const success = await onSend({
        message: trimmedMessage,
        model: selectedModel,
      });

      //---->>>> Keep focus inside textarea
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });

      return success;
    } finally {
      submittingRef.current = false;
    }
  };

  //---->>> KEYBOARD HANDLER

  const handleKeyDown = (event) => {
    /*
     * ENTER
     * -----
     * Enter without Shift = send
     *
     * SHIFT + ENTER
     * -------------
     * Shift + Enter = new line
     */

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      handleSubmit();
    }
  };

  //----->>>> MODEL SELECT

  const handleModelSelect = (model) => {
    setSelectedModel(model.name);

    setIsModelMenuOpen(false);
  };

  //---->>> SEND BUTTON STATE

  const hasMessage = message.trim().length > 0;

  const canSend = hasMessage && !disabled;

  //----->>>> RENDER

  return (
    <div className="group relative w-full min-w-0">
      {/* ANIMATED OUTER BORDER GLOW */}

      <div
        className="
          pointer-events-none
          absolute
          -inset-[2px]
          overflow-hidden
          rounded-[18px]
          opacity-90
          blur-[3px]
        "
      >
        <div
          className="
            absolute
            -left-[50%]
            -top-[100%]
            h-[300%]
            w-[200%]
            animate-[spin_7s_linear_infinite]
            bg-[conic-gradient(from_0deg,transparent_0deg,transparent_40deg,rgba(99,102,241,0.8)_80deg,rgba(139,92,246,0.95)_120deg,rgba(59,130,246,0.75)_160deg,transparent_210deg,transparent_360deg)]
          "
        />
      </div>

      {/*------>>>>> MAIN INPUT CONTAINER */}

      <div
        className="
          relative
          w-full
          min-w-0
          overflow-visible
          rounded-2xl
          border
          border-indigo-500/50
          bg-[#0d1018]
          shadow-[0_0_0_1px_rgba(99,102,241,0.08),0_8px_35px_rgba(0,0,0,0.45)]
          transition-all
          duration-300
          ease-out
          hover:border-violet-500/60
          hover:shadow-[0_0_0_1px_rgba(139,92,246,0.12),0_10px_40px_rgba(0,0,0,0.5)]
          focus-within:border-violet-400/70
          focus-within:shadow-[0_0_0_1px_rgba(139,92,246,0.18),0_0_30px_rgba(99,102,241,0.12),0_10px_40px_rgba(0,0,0,0.5)]
        "
      >
        {/*----->>>>> MESSAGE AREA */}

        <div className="flex min-w-0 items-end px-3 pt-3 sm:px-4">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything, analyze code, or optimize your prompt..."
            rows={1}
            disabled={false}
            wrap="soft"
            className="
              custom-scrollbar
              box-border
              block
              max-h-[120px]
              min-h-[30px]
              min-w-0
              w-full
              resize-none
              overflow-x-hidden
              overflow-y-auto
              whitespace-pre-wrap
              break-words
              bg-transparent
              px-1
              py-1
              text-sm
              leading-6
              text-white
              outline-none
              placeholder:text-neutral-500
              transition-colors
              duration-200

              [scrollbar-width:thin]
              [&::-webkit-scrollbar]:w-[3px]
            "
          />
        </div>

        {/*----->>>> BOTTOM TOOLBAR */}

        <div
          className="
            flex
            min-w-0
            items-center
            justify-between
            gap-2
            px-2
            pb-2
            pt-2
            sm:px-3
          "
        >
          {/*---->>>> LEFT CONTROLS */}

          <div
            className="
              flex
              min-w-0
              max-w-full
              items-center
              gap-1.5
              sm:gap-2
            "
          >
            {/*------>>>>> PLUS BUTTON */}

            <button
              type="button"
              disabled={false}
              aria-label="Add attachment"
              className="
                relative
                flex
                h-9
                w-9
                flex-shrink-0
                cursor-pointer
                items-center
                justify-center
                overflow-hidden
                rounded-xl
                border
                border-neutral-800
                bg-[#171b25]
                text-neutral-400
                transition-all
                duration-300
                ease-out
                hover:border-indigo-500/40
                hover:bg-[#1c2130]
                hover:text-indigo-300
                hover:shadow-[0_0_18px_rgba(99,102,241,0.18)]
                active:scale-95
              "
            >
              <span
                className="
                  pointer-events-none
                  absolute
                  -inset-[1px]
                  rounded-xl
                  bg-gradient-to-r
                  from-blue-500/0
                  via-violet-500/50
                  to-indigo-500/0
                  opacity-0
                  blur-[2px]
                  transition-opacity
                  duration-300
                  hover:opacity-100
                "
              />

              <Plus
                size={18}
                strokeWidth={2}
                className="
                  relative
                  z-10
                  transition-transform
                  duration-300
                  group-hover:rotate-90
                "
              />
            </button>

            {/*----->>>> MODEL SELECTOR */}

            <div
              ref={modelMenuRef}
              className="
                relative
                min-w-0
                max-w-[calc(100vw-150px)]
                sm:max-w-[220px]
              "
            >
              <button
                type="button"
                onClick={() => {
                  setIsModelMenuOpen((prev) => !prev);
                }}
                disabled={false}
                aria-label="Select AI model"
                aria-expanded={isModelMenuOpen}
                className={`
                  group
                  relative
                  flex
                  h-9
                  min-w-0
                  max-w-full
                  cursor-pointer
                  items-center
                  gap-1.5
                  overflow-hidden
                  rounded-xl
                  border
                  px-2.5
                  text-xs
                  font-medium
                  transition-all
                  duration-300
                  ease-out
                  sm:gap-2
                  sm:px-3

                  ${
                    isModelMenuOpen
                      ? "border-violet-500/50 bg-violet-500/10 text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                      : "border-neutral-800 bg-[#171b25] text-neutral-400 hover:border-indigo-500/40 hover:bg-[#1c2130] hover:text-neutral-200 hover:shadow-[0_0_18px_rgba(99,102,241,0.14)]"
                  }

                  active:scale-[0.98]
                `}
              >
                <span
                  className={`
                    pointer-events-none
                    absolute
                    -inset-[1px]
                    rounded-xl
                    bg-gradient-to-r
                    from-blue-500/0
                    via-violet-500/40
                    to-indigo-500/0
                    opacity-0
                    blur-[2px]
                    transition-opacity
                    duration-300

                    ${
                      isModelMenuOpen
                        ? "opacity-100"
                        : "group-hover:opacity-100"
                    }
                  `}
                />

                <Sparkles
                  size={14}
                  className={`
                    relative
                    z-10
                    flex-shrink-0
                    transition-transform
                    duration-300

                    ${isModelMenuOpen ? "scale-110 text-violet-400" : ""}
                  `}
                />

                <span
                  className="
                    relative
                    z-10
                    min-w-0
                    flex-1
                    truncate
                    text-left
                  "
                >
                  {selectedModel || "Select model"}
                </span>

                <ChevronDown
                  size={13}
                  className={`
                    relative
                    z-10
                    flex-shrink-0
                    transition-all
                    duration-300

                    ${
                      isModelMenuOpen
                        ? "rotate-180 text-violet-400"
                        : "rotate-0 text-neutral-500"
                    }
                  `}
                />
              </button>

              {/*------>>>> MODEL MENU */}

              {isModelMenuOpen && (
                <div
                  className="
                    absolute
                    bottom-11
                    left-0
                    z-50
                    w-[min(16rem,calc(100vw-2rem))]
                    max-w-[calc(100vw-2rem)]
                    origin-bottom-left
                    overflow-hidden
                    rounded-xl
                    border
                    border-neutral-800
                    bg-[#11141c]
                    p-1.5
                    shadow-[0_15px_50px_rgba(0,0,0,0.65)]
                    animate-in
                    fade-in
                    slide-in-from-bottom-2
                    duration-200
                  "
                >
                  {models.length > 0 ? (
                    models.map((model) => {
                      const isSelected = selectedModel === model.name;

                      return (
                        <button
                          key={model.id}
                          type="button"
                          onClick={() => {
                            handleModelSelect(model);
                          }}
                          className={`
                            group
                            relative
                            flex
                            w-full
                            min-w-0
                            flex-col
                            items-start
                            overflow-hidden
                            rounded-lg
                            border
                            px-3
                            py-2.5
                            text-left
                            transition-all
                            duration-200
                            cursor-pointer
                            ${
                              isSelected
                                ? "border-violet-500/20 bg-violet-500/10"
                                : "border-transparent hover:border-neutral-800 hover:bg-neutral-800/70"
                            }
                          `}
                        >
                          <span
                            className="
                              pointer-events-none
                              absolute
                              -inset-[1px]
                              rounded-lg
                              bg-gradient-to-r
                              from-blue-500/0
                              via-violet-500/20
                              to-indigo-500/0
                              opacity-0
                              blur-[2px]
                              transition-opacity
                              duration-300
                              group-hover:opacity-100
                            "
                          />

                          <span
                            className={`
                              relative
                              z-10
                              w-full
                              truncate
                              text-xs
                              font-medium
                              transition-colors
                              duration-200

                              ${
                                isSelected
                                  ? "text-violet-300"
                                  : "text-neutral-200"
                              }
                            `}
                          >
                            {model.name}
                          </span>

                          <span
                            className="
                              relative
                              z-10
                              mt-0.5
                              w-full
                              truncate
                              text-[11px]
                              text-neutral-500
                            "
                          >
                            {model.description}
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-3 py-3 text-xs text-neutral-500">
                      No models available
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/*------>>>> RIGHT CONTROLS */}

          <div
            className="
              flex
              flex-shrink-0
              items-center
              gap-1.5
              sm:gap-2
            "
          >
            {/*--->>> VOICE BUTTON */}

            <button
              type="button"
              disabled={false}
              aria-label="Voice input"
              className="
                relative
                flex
                h-9
                w-9
                flex-shrink-0
                cursor-pointer
                items-center
                justify-center
                overflow-hidden
                rounded-xl
                border
                border-neutral-800
                bg-[#171b25]
                text-neutral-400
                transition-all
                duration-300
                ease-out
                hover:border-indigo-500/40
                hover:bg-[#1c2130]
                hover:text-indigo-300
                hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]
                active:scale-95
              "
            >
              <span
                className="
                  pointer-events-none
                  absolute
                  -inset-[1px]
                  rounded-xl
                  bg-gradient-to-r
                  from-blue-500/0
                  via-violet-500/50
                  to-indigo-500/0
                  opacity-0
                  blur-[2px]
                  transition-opacity
                  duration-300
                  hover:opacity-100
                "
              />

              <Mic
                size={18}
                strokeWidth={2}
                className="
                  relative
                  z-10
                  transition-transform
                  duration-300
                  hover:scale-110
                "
              />
            </button>

            {/*---->>> SEND BUTTON */}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSend}
              aria-label="Send message"
              className={`
                relative
                flex
                h-10
                w-10
                flex-shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-full
                transition-all
                duration-300
                ease-out

                ${
                  canSend
                    ? "cursor-pointer bg-gradient-to-br from-indigo-500 via-violet-500 to-blue-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:scale-105 hover:shadow-[0_0_28px_rgba(139,92,246,0.5)] active:scale-95"
                    : "cursor-not-allowed bg-neutral-800 text-neutral-600"
                }
              `}
            >
              {canSend && (
                <span
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    rounded-full
                    bg-gradient-to-r
                    from-transparent
                    via-white/20
                    to-transparent
                    opacity-0
                    transition-opacity
                    duration-300
                    hover:opacity-100
                  "
                />
              )}

              <ArrowUp
                size={18}
                strokeWidth={2.5}
                className={`
                  relative
                  z-10
                  transition-transform

                  ${canSend ? "group-hover:-translate-y-0.5" : ""}
                `}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
