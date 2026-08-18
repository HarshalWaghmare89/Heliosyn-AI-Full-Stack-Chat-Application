export const detectLanguage = (className = "") => {
  if (!className) {
    return "text";
  }

  const match = className.match(/language-([a-zA-Z0-9+#.-]+)/);

  return match ? match[1].toLowerCase() : "text";
};

export const normalizeCode = (code = "") => {
  if (Array.isArray(code)) {
    code = code.join("");
  }

  return String(code)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n$/, "");
};

export const copyCode = async (code = "") => {
  try {
    const text = String(code);

    /*
     * Modern Clipboard API
     */
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    /*
     * Fallback for localhost / older browsers
     */
    const textarea = document.createElement("textarea");

    textarea.value = text;

    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    const successful = document.execCommand("copy");

    document.body.removeChild(textarea);

    return successful;
  } catch (error) {
    console.error("Failed to copy code:", error);

    return false;
  }
};
