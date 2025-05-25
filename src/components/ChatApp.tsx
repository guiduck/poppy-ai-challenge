"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import ImageInput from "@/components/ImageInput";
import ChatMessage from "@/components/ChatMessage";
import { Input } from "./ui/input";
import useChatServices from "@/hooks/useChatServices";

interface IChatAppProps {
  id: string;
}

export default function ChatApp({ id }: Readonly<IChatAppProps>) {
  const [input, setInput] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const { handleSubmit, handleWebSearch, messages, loading } = useChatServices(
    id,
    imageBase64,
    setImageBase64,
    input,
    setInput
  );

  useEffect(() => {
    if (!chatBottomRef.current) return;
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const renderHeader = () => {
    const chatTitle = id
      .split("-")
      .map((word, index) => (index === 0 ? word : Number(word) + 1))
      .join(" ");

    return (
      <CardHeader className="flex flex-row items-center">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/favicon.png" alt="Avatar" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">GPT {chatTitle}</p>
            <p className="text-sm text-muted-foreground">gpt@getpoppy.ai</p>
          </div>
        </div>
      </CardHeader>
    );
  };

  const renderMessages = () => {
    if (!messages.length) {
      return (
        <p className="text-lg text-muted-foreground mt-auto">
          No messages in history...
        </p>
      );
    }

    return messages.map((msg, idx) => (
      <ChatMessage key={`${idx + 1}`} role={msg.role} content={msg.content} />
    ));
  };

  return (
    <Card
      className="w-[550px] mx-auto mt-10 border-zinc-400 bg-black"
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      {renderHeader()}
      <CardContent className="space-y-4 min-h-[400px] max-h-[50vh] overflow-y-auto scrollbar-hide scrollable">
        {renderMessages()}
        <div ref={chatBottomRef} />
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2">
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="scrollbar-hide flex-1 w-full min-w-80 h-16 resize-none rounded-md border border-input bg-background px-3 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 overflow-y-auto"
            />
            <Button
              className="w-12 h-auto max-h-32"
              type="submit"
              size="icon"
              disabled={!input.trim() || loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-blue-950" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">Send</span>
            </Button>
          </div>
          <ImageInput onImage={setImageBase64} hasImage={!!imageBase64} />
          <Button
            type="button"
            variant="secondary"
            className="text-xs"
            onClick={handleWebSearch}
          >
            Search Web
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
