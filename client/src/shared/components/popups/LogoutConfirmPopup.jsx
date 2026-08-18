import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const LogoutConfirmPopup = ({ isOpen, onClose }) => {
  const { logout } = useAuth();

  //------>>> LOCK BODY SCROLL

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  //----->>> LOGOUT

  const handleLogout = () => {
    logout();
    onClose();
  };

  //------>>> DO NOT RENDER

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[200]
        flex
        items-center
        justify-center
        bg-black/70
        px-4
        backdrop-blur-md
      "
    >
      {/* DIALOG */}

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-title"
        className="
          w-full
          max-w-[360px]
          rounded-2xl
          border
          border-neutral-800
          bg-[#171717]
          p-6
          shadow-[0_20px_60px_rgba(0,0,0,0.55)]
          sm:p-7
        "
      >
        {/* TITLE */}

        <h2
          id="logout-title"
          className="
            text-center
            text-xl
            font-semibold
            tracking-tight
            text-white
          "
        >
          Are you sure you want to log out?
        </h2>

        {/* DESCRIPTION */}

        <p
          className="
            mt-3
            text-center
            text-sm
            leading-6
            text-neutral-400
          "
        >
          You'll need to sign in again to access Heliosyn AI.
        </p>

        {/* ACTIONS */}

        <div className="mt-7 space-y-3">
          {/* LOGOUT BUTTON */}

          <button
            type="button"
            onClick={handleLogout}
            className="
              flex
              h-11
              w-full
              cursor-pointer
              items-center
              justify-center
              rounded-xl
              bg-white
              text-sm
              font-semibold
              text-black
              transition-all
              duration-200
              hover:bg-neutral-200
              active:scale-[0.98]
            "
          >
            Log out
          </button>

          {/* CANCEL BUTTON */}

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-11
              w-full
              cursor-pointer
              items-center
              justify-center
              rounded-xl
              border
              border-neutral-800
              bg-transparent
              text-sm
              font-medium
              text-neutral-300
              transition-all
              duration-200
              hover:bg-white/5
              hover:text-white
              active:scale-[0.98]
            "
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmPopup;
