/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

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
  content: string | BlockType[];
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

  const renderImagePreview = (block: BlockType, index: number) => {
    if (block.type === "image" && block.source?.type === "base64") {
      return (
        <img
          key={`img-${index}`}
          src={`data:${block.source.media_type};base64,${block.source.data}`}
          alt="Uploaded"
          className="rounded-lg max-w-[160px] border shadow-sm"
        />
      );
    }
    return null;
  };

  const renderTextBlock = (block: BlockType, index: number) => {
    if (block.type === "text") {
      return <p key={`text-${index}`}>{parseLinks(block.text ?? "")}</p>;
    }
    return null;
  };

  if ((content as any) === "Loading...") {
    return (
      <div
        className={cn("italic text-muted-foreground", isUser ? "ml-auto" : "")}
      >
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Thinking...
        </span>
      </div>
    );
  }

  const blocks = Array.isArray(content)
    ? content
    : [{ type: "text", text: content }];

  return (
    <div
      className={cn(
        "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
        isUser ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"
      )}
    >
      <div className="flex flex-wrap gap-2">
        {blocks.map((block, i) => renderImagePreview(block, i))}
      </div>
      {blocks.map((block, i) => renderTextBlock(block, i))}
    </div>
  );
}
