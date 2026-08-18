import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import CopyButton from "./CopyButton";

import {
  detectLanguage,
  normalizeCode,
  copyCode,
} from "../../formatters/syntaxHighlight";

const CodeBlock = ({ className = "", children }) => {
  /*
   * React-Markdown gives code content through `children`.
   *
   * Convert it to a real string before passing it to
   * SyntaxHighlighter. This prevents `[object Object]`
   * from appearing inside code blocks.
   */
  const rawCode = Array.isArray(children)
    ? children
        .map((child) =>
          typeof child === "string" ? child : (child?.props?.children ?? ""),
        )
        .join("")
    : typeof children === "string"
      ? children
      : "";

  const code = normalizeCode(String(rawCode));

  const language = detectLanguage(className);

  return (
    <div
      className="
        my-6
        w-full
        overflow-hidden
        rounded-xl
        border
        border-neutral-800
        bg-[#0d1117]
      "
    >
      {/*--->>> CODE HEADER */}
      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-neutral-800
          bg-[#161b22]
          px-4
          py-2
        "
      >
        <span
          className="
            text-xs
            font-medium
            uppercase
            tracking-wide
            text-neutral-400
          "
        >
          {language}
        </span>

        <CopyButton onCopy={() => copyCode(code)} />
      </div>

      {/* CODE */}
      <div className="w-full overflow-x-auto">
        <SyntaxHighlighter
          language={language === "text" ? "text" : language}
          style={oneDark}
          PreTag="pre"
          customStyle={{
            margin: 0,
            padding: "18px",
            background: "#0d1117",
            fontSize: "15px",
            lineHeight: "1.65",
            borderRadius: 0,
            minWidth: "100%",
          }}
          codeTagProps={{
            style: {
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            },
          }}
          wrapLongLines={false}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;
