import { AlertTriangle, X } from "lucide-react";

const HeaderAlert = ({ error, onClear }) => {
  if (!error) {
    return null;
  }

  return (
    <div
      className="
        pointer-events-none
        absolute
        inset-x-0
        top-0
        z-[200]
        flex
        justify-center
        px-3
        pt-3

        sm:px-4
        sm:pt-4
      "
    >
      <div
        className="
          pointer-events-auto
          flex
          w-full
          max-w-4xl
          items-center
          gap-3
          rounded-lg
          border
          border-red-500/30
          bg-red-600
          px-3
          py-2.5
          text-white
          shadow-[0_8px_30px_rgba(0,0,0,0.35)]
          animate-in
          fade-in
          slide-in-from-top-2
          duration-200

          sm:px-4
          sm:py-3
        "
      >
        {/* ICON */}

        <AlertTriangle size={16} strokeWidth={2} className="shrink-0" />

        {/* MESSAGE */}

        <p
          className="
            min-w-0
            flex-1
            text-xs
            font-medium
            leading-5

            sm:text-sm
          "
        >
          {error.message}
        </p>

        {/* CLOSE */}

        {onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Dismiss error"
            title="Dismiss"
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-md
              text-white/80
              transition-colors
              duration-150
              hover:bg-white/10
              hover:text-white
              focus:outline-none
              focus:ring-1
              focus:ring-white/40
            "
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default HeaderAlert;
