import MarkdownRenderer from "./MarkdownRenderer";
import MessageBubble from "./MessageBubble";

const MessageRenderer = ({ message }) => {
  if (!message) return null;

  return (
    <MessageBubble
      role={message.role}
      content={message.content || ""}
      timestamp={
        message.createdAt ||
        message.created_at ||
        message.timestamp ||
        message.createdAtTime
      }
    >
      <MarkdownRenderer content={message.content || ""} />
    </MessageBubble>
  );
};

export default MessageRenderer;
