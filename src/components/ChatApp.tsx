/* eslint-disable @typescript-eslint/no-explicit-any*/
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
import { toast } from "sonner";
import { fetchClaudeResponse, fetchWebSearch } from "@/services/chat";

export default function ChatApp() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  async function handleWebSearch() {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    const loadingMsg = {
      role: "assistant",
      content: "Loading...",
      loading: true,
    };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setLoading(true);

    try {
      const data = await fetchWebSearch(input);
      const resultsText = data
        .map(
          (r: any) =>
            `${r.title}\n<a href="${r.url}" target="_blank" class="text-blue-400 underline">${r.url}</a>\n${r.snippet}`
        )
        .join("\n\n");

      const aiMsg = {
        role: "assistant",
        content: [
          {
            type: "text",
            text: `Here are the top search results:\n\n${resultsText}`,
          },
        ],
      };

      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = aiMsg;
        return copy;
      });

      setInput("");
    } catch (err) {
      toast.error("Web search failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!input.trim()) return;

    setLoading(true);

    const userMsg = {
      role: "user",
      content: imageBase64
        ? [
            { type: "text", text: input },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/png",
                data: imageBase64,
              },
            },
          ]
        : input,
    };

    const loadingMsg = {
      role: "assistant",
      content: "Loading...",
      loading: true,
    };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);

    try {
      const data = await fetchClaudeResponse(
        [...messages, userMsg],
        imageBase64
      );

      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: data.content };
        return copy;
      });

      setInput("");
      setImageBase64(null);
    } catch (err: any) {
      const res = await err.json?.();
      toast.error(res?.message ?? "Something went wrong.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!chatBottomRef.current) return;
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Card className="w-full max-w-2xl mx-auto mt-10">
      <CardHeader className="flex flex-row items-center">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">Claude AI</p>
            <p className="text-sm text-muted-foreground">claude@getpoppy.ai</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 min-h-[400px] max-h-[50vh] overflow-y-auto scrollbar-hide">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} role={msg.role} content={msg.content} />
        ))}
        <div ref={chatBottomRef} />
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2">
          <div className="flex gap-4">
            <textarea
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
              className="flex-1 w-full min-w-80 resize-y rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 max-h-32 overflow-y-auto"
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
