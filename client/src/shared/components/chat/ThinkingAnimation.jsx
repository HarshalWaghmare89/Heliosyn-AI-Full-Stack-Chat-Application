const ThinkingAnimation = () => {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        py-3
        text-neutral-400
      "
      aria-label="AI is generating a response"
    >
      <div
        className="
          flex
          items-center
          gap-1.5
        "
      >
        <span
          className="
            h-2
            w-2
            rounded-full
            bg-neutral-400
            animate-bounce
            [animation-delay:-0.3s]
          "
        />

        <span
          className="
            h-2
            w-2
            rounded-full
            bg-neutral-400
            animate-bounce
            [animation-delay:-0.15s]
          "
        />

        <span
          className="
            h-2
            w-2
            rounded-full
            bg-neutral-400
            animate-bounce
          "
        />
      </div>

      <span className="text-sm">Thinking...</span>
    </div>
  );
};

export default ThinkingAnimation;
