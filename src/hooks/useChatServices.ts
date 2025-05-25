/* eslint-disable @typescript-eslint/no-explicit-any*/
"use client";

import { toast } from "sonner";
import { fetchGptResponse, fetchWebSearch } from "@/services/chat";
import { getLink } from "@/utils/formatLinks";
import { useMemo, useState } from "react";
import type { Message } from "@/types/message";
import useChat from "./useChat";

function useChatServices(
  chatId: string,
  imageBase64: string | null,
  setImageBase64: (v: string | null) => void,
  input: string,
  setInput: (v: string) => void
) {
  const [loading, setLoading] = useState(false);

  const { chats, setChatMessages, getChatMessagesById } = useChat();

  const messages = useMemo(
    () => getChatMessagesById(chatId) ?? [],
    [chatId, getChatMessagesById]
  );

  const nodesMessages = useMemo(() => {
    const chat = chats.find((chat) => chat.id === chatId);
    return chat?.nodes.map(getChatMessagesById).flat() ?? [];
  }, [chatId, chats, getChatMessagesById]);

  const handleWebSearch = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input };
    const loadingMsg: Message = { role: "assistant", content: "Loading..." };

    setChatMessages(chatId, [...messages, userMsg, loadingMsg]);
    setLoading(true);

    try {
      const data = await fetchWebSearch(input);
      const resultsText = data
        .map(({ title, url }: { title: string; url: string }) =>
          getLink(title, url)
        )
        .join("\n\n");

      const aiMsg: Message = {
        role: "assistant",
        content: [
          {
            type: "text",
            text: `Here are the top search results:\n\n${resultsText}`,
          },
        ],
      };

      setChatMessages(chatId, [...messages, userMsg, aiMsg]);
      setInput("");
    } catch (error: any) {
      toast.error(error.message ?? "Failed fetching web results.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim()) return;

    setLoading(true);

    const content: Message["content"] = [{ type: "text", text: input }];

    if (imageBase64) {
      content.push({
        type: "image_url",
        image_url: { url: `data:image/png;base64,${imageBase64}` },
      });
    }

    const userMsg: Message = {
      role: "user",
      content,
    };

    const loadingMsg: Message = {
      role: "assistant",
      content: "Loading...",
    };

    setChatMessages(chatId, [...messages, userMsg, loadingMsg]);

    try {
      const allMsgsFromContext = [...nodesMessages, ...messages, userMsg];
      const cleanMessages = allMsgsFromContext.filter(
        (msg) => msg?.content !== "Loading..." && msg?.content !== undefined
      );

      console.log("data being sent:", cleanMessages);

      const data = await fetchGptResponse([...cleanMessages, userMsg]);

      console.log("data recieved", data);

      const newMessages: Message[] = [
        ...messages,
        {
          role: "user",
          content,
        },
        {
          role: "assistant",
          content: data.result,
        },
      ];
      setChatMessages(chatId, newMessages);
      setInput("");
      setImageBase64(null);
    } catch (err: any) {
      const res = await err.json?.();
      toast.error(res?.message ?? "Something went wrong.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, handleWebSearch, messages, loading };
}

export default useChatServices;
