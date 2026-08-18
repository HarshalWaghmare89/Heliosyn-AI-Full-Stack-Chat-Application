import { Info, RotateCcw } from "lucide-react";

const ChatErrorMessage = ({ error, onClear }) => {
  if (!error) {
    return null;
  }

  const isRateLimit = error.type === "RATE_LIMIT";
  const isDailyLimit = error.type === "DAILY_LIMIT";
  const isGlobalLimit = error.type === "GLOBAL_LIMIT";

  return (
    <div
      className="
        mt-4
        w-full
        animate-in
        fade-in
        slide-in-from-bottom-2
        duration-200
      "
    >
      <div
        className="
          flex
          w-full
          items-center
          gap-3
          rounded-2xl
          border
          border-red-500/20
          bg-[#11141c]
          px-4
          py-3
          shadow-[0_8px_30px_rgba(0,0,0,0.25)]
        "
      >
        {/* ICON */}

        <div
          className="
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-red-500/10
            text-red-400
          "
        >
          <Info size={15} />
        </div>

        {/* CONTENT */}

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-red-300">
            {isRateLimit
              ? "You've reached your request limit."
              : isDailyLimit
                ? "You've reached your daily message limit."
                : isGlobalLimit
                  ? "You've reached the service limit."
                  : "Unable to send message"}
          </p>

          <p className="mt-1 text-xs leading-5 text-neutral-400 sm:text-sm">
            {error.message}
          </p>

          {/* RATE LIMIT COUNTDOWN */}

          {isRateLimit && error.retryAfterSeconds != null && (
            <p className="mt-1.5 text-xs text-neutral-500">
              Please try again in{" "}
              <span className="font-medium text-neutral-300">
                {error.retryAfterSeconds}
              </span>{" "}
              seconds.
            </p>
          )}
        </div>

        {/* RETRY / DISMISS */}

        {onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Dismiss error"
            title="Dismiss"
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-neutral-500
              transition-colors
              duration-150
              hover:bg-neutral-800
              hover:text-neutral-300
              focus:outline-none
              focus:ring-1
              focus:ring-neutral-700
            "
          >
            <RotateCcw size={15} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatErrorMessage;
