import { Check, Copy } from "lucide-react";
import { useState } from "react";

const CopyButton = ({ onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const result = await onCopy();

      if (!result) {
        return;
      }

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Code copied" : "Copy code"}
      className="
        flex
        items-center
        gap-1.5
        rounded-md
        px-2.5
        py-1.5
        font-medium
        text-xs
        text-neutral-300
        transition
        hover:bg-neutral-700
        hover:text-white
        active:scale-95
      "
    >
      {copied ? (
        <>
          <Check size={14} />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Copy size={14} />
          <span>Copy</span>
        </>
      )}
    </button>
  );
};

export default CopyButton;
