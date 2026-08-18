import { useEffect, useRef, useState } from "react";
import { X, Link2, Check, ExternalLink } from "lucide-react";

import { useChats } from "../../context/ChatContext";

const ShareChatPopup = () => {
  const { shareChat, showSharePopup, closeSharePopup } = useChats();

  const [copied, setCopied] = useState(false);

  const copyTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  if (!showSharePopup || !shareChat) {
    return null;
  }

  //----->>> SHARE ID

  const shareId = shareChat.shareId;

  //---->>> PUBLIC SHARE URL

  const shareLink = shareId ? `${window.location.origin}/share/${shareId}` : "";

  //---->>> COPY LINK

  const handleCopy = async () => {
    if (!shareLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(shareLink);

      setCopied(true);

      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }

      copyTimerRef.current = setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error("Copy share link failed:", error);
    }
  };

  //----->>> OPEN LINK

  const handleOpenLink = () => {
    if (!shareLink) {
      return;
    }

    window.open(shareLink, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="
          fixed
          inset-0
          z-[150]
          bg-black/70
          backdrop-blur-sm
        "
      />

      {/* Bottom Sheet */}
      <div
        className="
          fixed
          bottom-0
          left-1/2
          z-[160]

          w-[calc(100%-32px)]
          max-w-md

          -translate-x-1/2

          rounded-t-3xl

          border
          border-neutral-800

          bg-[#171717]

          shadow-[0_-20px_60px_rgba(0,0,0,0.6)]

          animate-[slideUp_.28s_ease-out]
        "
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div
          className="
            flex
            items-center
            justify-between

            border-b
            border-neutral-800

            px-5
            py-4
          "
        >
          <h2
            className="
              max-w-[80%]
              truncate

              text-lg
              font-semibold
              tracking-tight

              text-white
            "
          >
            {shareChat.title || "Shared conversation"}
          </h2>

          <button
            type="button"
            onClick={closeSharePopup}
            aria-label="Close share dialog"
            className="
              cursor-pointer

              rounded-lg

              p-2

              text-neutral-400

              transition-all
              duration-200

              hover:bg-white/5
              hover:text-white

              active:scale-95
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div
          className="
            px-5
            py-6
          "
        >
          {/* Preview */}
          <div
            className="
              rounded-xl

              border
              border-neutral-800

              bg-[#1d1d1d]

              p-4
            "
          >
            <p
              className="
                text-sm
                leading-6

                text-neutral-400
              "
            >
              Anyone with this link can view this conversation.
            </p>
          </div>

          {/* Copy Button */}
          <div
            className="
              mt-8

              flex
              flex-col
              items-center
            "
          >
            <button
              type="button"
              onClick={handleCopy}
              disabled={!shareLink}
              aria-label={copied ? "Link copied" : "Copy share link"}
              className="
                flex

                h-16
                w-16

                cursor-pointer

                items-center
                justify-center

                rounded-full

                bg-white

                text-black

                shadow-lg

                transition-all
                duration-200

                hover:scale-105
                hover:bg-neutral-200

                active:scale-95

                disabled:cursor-not-allowed
                disabled:opacity-40
                disabled:hover:scale-100
              "
            >
              {copied ? (
                <Check size={28} strokeWidth={3} />
              ) : (
                <Link2 size={28} />
              )}
            </button>

            <p
              className="
                mt-4

                text-sm
                font-medium

                text-white
              "
            >
              {copied ? "Copied" : "Copy Link"}
            </p>
          </div>

          {/* Open Shared Link */}
          <button
            type="button"
            onClick={handleOpenLink}
            disabled={!shareLink}
            className="
              mt-6

              flex
              w-full
              items-center
              justify-center
              gap-2

              rounded-xl

              border
              border-neutral-700

              bg-transparent

              px-4
              py-3

              text-sm
              font-medium
              text-neutral-200

              transition-all
              duration-200

              hover:bg-white/5
              hover:text-white

              active:scale-[0.99]

              disabled:cursor-not-allowed
              disabled:opacity-40
              cursor-pointer
            "
          >
            <ExternalLink size={17} />
            Open shared link
          </button>

          {/* Copy Status */}
          <p
            className="
              mt-3

              text-center
              text-xs

              text-neutral-500
            "
          >
            {copied
              ? "Link copied to clipboard."
              : "Anyone with the link can view this conversation."}
          </p>
        </div>
      </div>
    </>
  );
};

export default ShareChatPopup;
