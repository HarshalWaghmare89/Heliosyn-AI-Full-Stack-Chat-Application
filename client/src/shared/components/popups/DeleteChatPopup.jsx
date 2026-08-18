import { useChats } from "../../context/ChatContext";

const DeleteChatPopup = () => {
  const {
    selectedDeleteChat,
    showDeletePopup,
    closeDeletePopup,
    deleteSelectedChat,
  } = useChats();

  if (!showDeletePopup || !selectedDeleteChat) {
    return null;
  }

  return (
    <>
      {/* OVERLAY */}

      <div
        className="
          fixed
          inset-0
          z-[150]
          bg-black/60
          backdrop-blur-[2px]
        "
        aria-hidden="true"
      />

      {/* MODAL */}

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-chat-title"
        className="
          fixed
          left-1/2
          top-1/2
          z-[160]

          w-[calc(100%-32px)]
          max-w-[420px]

          -translate-x-1/2
          -translate-y-1/2

          rounded-2xl

          border
          border-neutral-800

          bg-[#212121]

          p-6

          shadow-[0_25px_80px_rgba(0,0,0,0.65)]

          animate-in
          fade-in
          zoom-in-95
          duration-200
        "
      >
        {/* HEADER */}

        <div>
          <h2
            id="delete-chat-title"
            className="
              text-lg
              font-semibold
              tracking-tight
              text-white
            "
          >
            Delete chat?
          </h2>

          <p
            className="
              mt-3
              text-sm
              leading-6
              text-neutral-400
            "
          >
            Are you sure you want to delete this conversation? This action
            cannot be undone.
          </p>
        </div>

        {/* CHAT PREVIEW */}

        <div
          className="
            mt-4
            rounded-xl
            border
            border-neutral-800
            bg-[#181818]
            px-4
            py-3
          "
        >
          <p
            className="
              truncate
              text-sm
              font-medium
              text-neutral-200
            "
          >
            {selectedDeleteChat.title}
          </p>
        </div>

        {/* ACTIONS */}

        <div
          className="
            mt-6
            flex
            justify-end
            gap-3
          "
        >
          {/* Cancel */}

          <button
            type="button"
            onClick={closeDeletePopup}
            className="
              cursor-pointer

              rounded-xl

              border
              border-neutral-700

              bg-transparent

              px-4
              py-2.5

              text-sm
              font-medium
              text-neutral-300

              transition-all
              duration-200

              hover:border-neutral-600
              hover:bg-neutral-800
              hover:text-white

              active:scale-95
            "
          >
            Cancel
          </button>

          {/* Delete */}

          <button
            type="button"
            onClick={deleteSelectedChat}
            className="
              cursor-pointer

              rounded-xl

              border
              border-red-500/30

              bg-red-600/90

              px-4
              py-2.5

              text-sm
              font-medium
              text-white

              shadow-[0_8px_25px_rgba(239,68,68,0.15)]

              transition-all
              duration-200

              hover:border-red-400/50
              hover:bg-red-500
              hover:shadow-[0_8px_30px_rgba(239,68,68,0.3)]

              active:scale-95
            "
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteChatPopup;
