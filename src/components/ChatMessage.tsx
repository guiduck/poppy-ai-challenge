import { cn } from "@/lib/utils";

type BlockType = {
  type: string;
  text?: string;
  source?: any;
};

export default function ChatMessage({
  role,
  content,
}: Readonly<{
  role: string;
  content: string | { type: string; text?: string; source?: any }[];
}>) {
  const isUser = role === "user";

  function parseLinks(text: string) {
    const parts = text.split(/(https?:\/\/[^\s]+)/g);
    return parts.map((part, idx) =>
      part.startsWith("http") ? (
        <a
          key={idx}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline break-words"
        >
          {part}
        </a>
      ) : (
        <span key={idx}>{part}</span>
      )
    );
  }

  const renderBlock = (block: BlockType, index: number) => {
    if (!block) {
      return undefined;
    }

    const { type, source } = block;

    if (type === "image" && source?.type === "base64") {
      return (
        <img
          key={index}
          src={`data:${block.source.media_type};base64,${block.source.data}`}
          alt=""
          className="my-2 rounded max-w-xs border"
        />
      );
    }

    if (type === "text") {
      return <p key={index}>{parseLinks(block.text ?? "")}</p>;
    }

    return (
      <p key={index} className="italic text-muted-foreground">
        [Unsupported block type: {block.type}]
      </p>
    );
  };

  return (
    <div
      className={cn(
        "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
        isUser ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"
      )}
    >
      {typeof content === "string" ? (
        <p>{content}</p>
      ) : (
        content.map((block, index) => renderBlock(block, index))
      )}
    </div>
  );
}
