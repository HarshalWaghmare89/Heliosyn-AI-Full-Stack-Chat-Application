import ReactMarkdown from "react-markdown";

import { formatChatResponse } from "../../formatters/chatFormatter";
import { markdownComponents } from "../../formatters/markdownComponents";
import { remarkPlugins, rehypePlugins } from "../../formatters/markdownPlugins";

const MarkdownRenderer = ({ content = "" }) => {
  const formattedContent = formatChatResponse(content);

  return (
    <div className="markdown-content w-full min-w-0">
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={markdownComponents}
      >
        {formattedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
