/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import { Message } from "@/types/message";
import { Loader2 } from "lucide-react";

type BlockType = {
  type: string;
  text?: string;
  image_url?: {
    url: string;
  };
};

export default function ChatMessage({
  role,
  content,
}: Readonly<{
  role: string;
  content: string | BlockType[];
}>) {
  const isUser = role === "user";

  function renderLinks(text: string) {
    const parts = text.split(/(https?:\/\/[^\s]+)/g);
    return parts.map((part, idx) => {
      if (!part.startsWith("http")) {
        return <span key={idx}>{part}</span>;
      }

      return (
        <a
          key={idx}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline break-words"
        >
          {part}
        </a>
      );
    });
  }

  const renderImagePreview = (block: BlockType, index: number) => {
    if (block.type !== "image_url") return;

    return (
      <img
        key={`img-${index}`}
        src={block.image_url?.url}
        alt="Uploaded"
        className="rounded-lg max-w-[160px] border shadow-sm"
      />
    );
  };

  const renderTextBlock = (block: BlockType, index: number) => {
    const text = block.text ?? "";
    const isHTML = /<a\s+href=/.test(text);

    if (isHTML) {
      return (
        <p
          key={`text-${index}`}
          className="whitespace-pre-wrap break-words"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      );
    }

    return (
      <p key={`text-${index}`} className="whitespace-pre-wrap break-words">
        {renderLinks(text)}
      </p>
    );
  };

  if ((content as Message["content"]) === "Loading...") {
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
