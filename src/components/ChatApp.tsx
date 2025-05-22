"use client";

import { useState } from "react";
import { Send } from "lucide-react";
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

  async function handleWebSearch() {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);

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

      setMessages((prev) => [...prev, aiMsg]);
      setInput("");
    } catch (err) {
      toast.error("Web search failed. Please try again.");
      console.error(err);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const data = await fetchClaudeResponse(
        [...messages, userMsg],
        imageBase64
      );
      const aiMsg = { role: "assistant", content: data.content };
      setMessages((prev) => [...prev, aiMsg]);
      setInput("");
      setImageBase64(null);
    } catch (err) {
      toast.error("Failed to get AI response. Try again later.");
      console.error(err);
    }
  }

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
              disabled={!input.trim()}
            >
              <Send className="h-4 w-4" />
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
