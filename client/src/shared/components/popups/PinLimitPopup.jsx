import { AlertTriangle } from "lucide-react";
import { useChats } from "../../context/ChatContext";

const PinLimitPopup = () => {
  const { showPinLimitPopup, setShowPinLimitPopup } = useChats();

  if (!showPinLimitPopup) return null;

  const handleClose = () => {
    setShowPinLimitPopup(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="
          fixed
          inset-0
          z-[150]
          bg-black/50
          backdrop-blur-sm
        "
      />

      {/* Popup */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pin-limit-title"
        className="
          fixed
          left-1/2
          top-1/2
          z-[160]

          w-[calc(100%-32px)]
          max-w-[370px]

          -translate-x-1/2
          -translate-y-1/2

          rounded-2xl

          border
          border-neutral-800

          bg-[#171717]

          shadow-[0_20px_70px_rgba(0,0,0,0.55)]

          animate-in
          fade-in
          zoom-in-95
          duration-200
        "
      >
        <div className="p-5">
          {/* Icon + Title */}
          <div className="mb-4 flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center

                rounded-full

                bg-yellow-500/10

                border
                border-yellow-500/20
              "
            >
              <AlertTriangle size={20} className="text-yellow-400" />
            </div>

            <h2
              id="pin-limit-title"
              className="
                text-lg
                font-semibold
                tracking-tight
                text-white
              "
            >
              Pin limit reached
            </h2>
          </div>

          {/* Message */}
          <p
            className="
              text-center
              text-sm
              leading-6
              text-neutral-400
            "
          >
            You can pin up to{" "}
            <span className="font-medium text-white">10 chats</span>
            .
            <br />
            Unpin an existing chat before pinning a new one.
          </p>

          {/* Button */}
          <button
            type="button"
            onClick={handleClose}
            className="
              mt-5

              w-full

              cursor-pointer

              rounded-xl

              border
              border-neutral-700

              bg-white

              py-2.5

              text-sm
              font-medium

              text-black

              transition-all
              duration-200

              hover:bg-neutral-200

              active:scale-95
            "
          >
            OK
          </button>
        </div>
      </div>
    </>
  );
};

export default PinLimitPopup;
