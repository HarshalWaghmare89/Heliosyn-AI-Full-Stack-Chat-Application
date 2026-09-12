import { Check, Copy } from "lucide-react";
import { useState } from "react";

const CopyMessageButton = ({ text = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };

  if (!text) return null;

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? "Copied" : "Copy message"}
      aria-label={copied ? "Message copied" : "Copy message"}
      className="
  inline-flex
  h-7
  items-center
  gap-1.5
  rounded-md
  px-2
  text-[11px]
  text-neutral-500
  opacity-100
  transition-all
  duration-150
  hover:bg-neutral-800
  hover:text-neutral-200
  focus:outline-none
  focus:ring-1
  focus:ring-neutral-600
  cursor-pointer
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
        </>
      )}
    </button>
  );
};

export default CopyMessageButton;
