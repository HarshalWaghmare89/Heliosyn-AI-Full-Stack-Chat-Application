import { Archive, RotateCcw } from "lucide-react";
import { useChats } from "../../../../../context/ChatContext";

const ArchivedChatsSettings = () => {
  const { archivedChats, unarchiveChat } = useChats();

  return (
    <div>
      {/* Heading */}
      <div>
        <h2 className="text-xl font-semibold text-white">Archived Chats</h2>

        <p className="mt-1 text-sm text-neutral-400">
          Chats that you've archived appear here.
        </p>
      </div>

      {/* List */}
      <div className="mt-5">
        {archivedChats.length === 0 ? (
          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              py-16
              text-center
            "
          >
            <Archive size={36} className="mb-3 text-neutral-600" />

            <h3 className="text-base font-medium text-neutral-300">
              No archived chats
            </h3>

            <p className="mt-1 max-w-sm text-sm text-neutral-500">
              Chats that you archive will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {archivedChats.map((chat) => (
              <div
                key={chat.id}
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  rounded-lg
                  border
                  border-neutral-800
                  bg-neutral-900
                  px-3
                  py-2.5
                  transition
                  hover:border-neutral-700
                "
              >
                {/* Chat Info */}
                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                  "
                >
                  <Archive
                    size={17}
                    className="
                      flex-shrink-0
                      text-neutral-500
                    "
                  />

                  <span
                    className="
                      truncate
                      text-sm
                      text-white
                    "
                  >
                    {chat.title}
                  </span>
                </div>

                {/* Unarchive Button */}
                <button
                  onClick={() => unarchiveChat(chat.id)}
                  className="
                    flex
                    flex-shrink-0
                    items-center
                    gap-2
                    rounded-lg
                    px-2.5
                    py-1.5
                    text-xs
                    text-neutral-300
                    transition
                    hover:bg-neutral-800
                    hover:text-white
                    cursor-pointer
                  "
                >
                  <RotateCcw size={14} />

                  <span>Unarchive</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivedChatsSettings;
