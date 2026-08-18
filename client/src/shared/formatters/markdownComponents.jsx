import CodeBlock from "../components/chat/CodeBlock";
import TableRenderer from "../components/chat/TableRenderer";

export const markdownComponents = {
  pre({ children }) {
    return children;
  },

  /*
   * Inline code:
   * `someCode`
   *
   * Fenced code:
   * ```java
   * ...
   * ```
   */
  code({ className, children, ...props }) {
    const isCodeBlock =
      typeof className === "string" && className.startsWith("language-");

    if (!isCodeBlock) {
      return (
        <code
          {...props}
          className="
            rounded-md
            bg-neutral-800
            px-1.5
            py-0.5
            font-mono
            text-[0.9em]
            text-pink-400
          "
        >
          {children}
        </code>
      );
    }

    return <CodeBlock className={className}>{children}</CodeBlock>;
  },

  /*
   * Markdown / GFM tables
   */
  table({ children }) {
    return <TableRenderer>{children}</TableRenderer>;
  },

  /*
   * Table cells
   */
  th({ children, ...props }) {
    return (
      <th
        {...props}
        className="
          whitespace-nowrap
          border-b
          border-neutral-700
          bg-neutral-800/80
          px-4
          py-3
          text-left
          text-sm
          font-semibold
          text-white
        "
      >
        {children}
      </th>
    );
  },

  td({ children, ...props }) {
    return (
      <td
        {...props}
        className="
          border-b
          border-neutral-800
          px-4
          py-3
          text-sm
          leading-6
          text-neutral-300
        "
      >
        {children}
      </td>
    );
  },

  tr({ children, ...props }) {
    return (
      <tr
        {...props}
        className="
          transition-colors
          duration-150
          hover:bg-white/[0.03]
        "
      >
        {children}
      </tr>
    );
  },

  p({ children, ...props }) {
    return (
      <p
        {...props}
        className="
          mb-5
          leading-8
          text-[16px]
          text-neutral-200
        "
      >
        {children}
      </p>
    );
  },

  h1({ children, ...props }) {
    return (
      <h1
        {...props}
        className="
          mb-5
          mt-8
          text-3xl
          font-bold
          text-white
        "
      >
        {children}
      </h1>
    );
  },

  h2({ children, ...props }) {
    return (
      <h2
        {...props}
        className="
          mb-4
          mt-7
          text-2xl
          font-bold
          text-white
        "
      >
        {children}
      </h2>
    );
  },

  h3({ children, ...props }) {
    return (
      <h3
        {...props}
        className="
          mb-3
          mt-6
          text-xl
          font-semibold
          text-white
        "
      >
        {children}
      </h3>
    );
  },

  ul({ children, ...props }) {
    return (
      <ul
        {...props}
        className="
          mb-5
          list-disc
          space-y-2
          pl-6
          text-neutral-200
        "
      >
        {children}
      </ul>
    );
  },

  ol({ children, ...props }) {
    return (
      <ol
        {...props}
        className="
          mb-5
          list-decimal
          space-y-2
          pl-6
          text-neutral-200
        "
      >
        {children}
      </ol>
    );
  },

  li({ children, ...props }) {
    return (
      <li
        {...props}
        className="
          leading-8
          text-neutral-200
        "
      >
        {children}
      </li>
    );
  },

  strong({ children, ...props }) {
    return (
      <strong {...props} className="font-semibold text-white">
        {children}
      </strong>
    );
  },

  blockquote({ children, ...props }) {
    return (
      <blockquote
        {...props}
        className="
          my-5
          border-l-4
          border-violet-500
          bg-neutral-800/40
          px-4
          py-3
          text-neutral-300
        "
      >
        {children}
      </blockquote>
    );
  },

  hr() {
    return <hr className="my-6 border-neutral-800" />;
  },
};
