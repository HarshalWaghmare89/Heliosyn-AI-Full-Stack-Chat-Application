import { MessageSquare } from "lucide-react";

//--->>> CLEAN MARKDOWN FROM SEARCH PREVIEW

const cleanPreviewText = (text = "") => {
  return (
    text
      // Bold: **text** or __text__
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/__(.*?)__/g, "$1")

      // Italic: *text* or _text_
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/_(.*?)_/g, "$1")

      // Inline code: `code`
      .replace(/`([^`]+)`/g, "$1")

      // Headings: # Heading
      .replace(/^#{1,6}\s+/gm, "")

      // Links: [text](url) -> text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")

      // Blockquotes: > text
      .replace(/^>\s?/gm, "")

      // Unordered lists: - item / * item / + item
      .replace(/^[-*+]\s+/gm, "")

      // Numbered lists: 1. item
      .replace(/^\d+\.\s+/gm, "")

      // Remove excessive spaces/newlines
      .replace(/\s+/g, " ")

      .trim()
  );
};

const SearchChatItem = ({ chat, onClick }) => {
  if (!chat) return null;

  const preview = cleanPreviewText(chat.preview);

  return (
    <button
      onClick={onClick}
      className="
        flex
        w-full

        cursor-pointer

        items-start

        gap-3

        border-b
        border-neutral-800

        px-3
        py-3

        text-left

        transition-all
        duration-200

        hover:bg-neutral-900

        active:bg-neutral-800

        sm:gap-4
        sm:px-4
        sm:py-4
      "
    >
      {/* Icon */}

      <div
        className="
          flex

          h-9
          w-9

          flex-shrink-0

          items-center
          justify-center

          rounded-full

          bg-neutral-800

          sm:h-10
          sm:w-10
        "
      >
        <MessageSquare
          size={17}
          className="
            text-neutral-300

            sm:size-[18px]
          "
        />
      </div>

      {/* Content */}

      <div
        className="
          min-w-0
          flex-1
        "
      >
        {/* Title */}

        <h3
          className="
            truncate

            text-sm

            font-medium

            text-white
          "
        >
          {chat.title}
        </h3>

        {/* Preview */}

        <p
          className="
            mt-1

            line-clamp-2

            text-xs

            leading-relaxed

            text-neutral-400

            sm:text-sm
          "
        >
          {preview || "No messages in this chat yet."}
        </p>
      </div>
    </button>
  );
};

export default SearchChatItem;
