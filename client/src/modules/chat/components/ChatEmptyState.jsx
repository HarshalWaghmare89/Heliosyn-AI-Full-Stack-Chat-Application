const ChatEmptyState = () => {
  return (
    <div
      className="
        flex
        min-h-0
        w-full
        flex-1
        items-center
        justify-center
        px-4
        py-10
      "
    >
      <div
        className="
          flex
          w-full
          max-w-2xl
          flex-col
          items-center
          text-center
        "
      >
        {/*-------------->>>> Main Heading */}
        <h1
          className="
            text-2xl
            font-semibold
            tracking-tight
            text-white

            sm:text-3xl
          "
        >
          How can I help you today?
        </h1>

        {/*----->>>>> Description */}
        <p
          className="
            mt-3
            max-w-lg
            text-sm
            leading-6
            text-neutral-500

            sm:text-base
          "
        >
          Start a new conversation or select a chat from your history.
        </p>
      </div>
    </div>
  );
};

export default ChatEmptyState;
