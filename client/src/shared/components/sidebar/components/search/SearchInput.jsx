import { Search } from "lucide-react";

const SearchInput = ({ value, onChange }) => {
  return (
    <div
      className="
        flex
        items-center
        gap-2

        rounded-xl

        border
        border-neutral-800

        bg-neutral-950

        px-3
        py-2.5

        transition-all
        duration-200

        focus-within:border-violet-500


        sm:gap-3
        sm:rounded-2xl
        sm:px-4
        sm:py-3
      "
    >
      {/* Search Icon */}
      <Search
        size={18}
        className="
          flex-shrink-0
          text-neutral-400

          sm:size-5
        "
      />

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search chats..."
        autoFocus
        className="
          min-w-0
          flex-1

          bg-transparent

          text-sm

          text-white

          outline-none

          placeholder:text-neutral-500
        "
      />

      {/* Shortcut */}
      <kbd
        className="
          hidden

          rounded-md

          border
          border-neutral-700

          bg-neutral-900

          px-2
          py-1

          text-[11px]

          font-medium

          text-neutral-400


          sm:block
        "
      >
        Ctrl + K
      </kbd>
    </div>
  );
};

export default SearchInput;
