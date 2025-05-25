"use client";

import { ChatType, Message, MessageDictionary } from "@/types/message";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Edge,
  Node,
  OnEdgesChange,
  OnNodesChange,
  useEdgesState,
  useNodesState,
} from "reactflow";
import { toast } from "sonner";

interface ChatContextProps {
  chats: ChatType[];
  setChats: Dispatch<SetStateAction<ChatType[]>>;
  setChatMessages: (chatId: string, messages: Message[]) => void;
  getChatMessagesById: (chatId: string) => Message[] | undefined;
  nodes: Node<Node[], string | undefined>[];
  edges: Edge<Edge[]>[];
  setNodes: React.Dispatch<
    React.SetStateAction<Node<Node[], string | undefined>[]>
  >;
  setEdges: React.Dispatch<React.SetStateAction<Edge<Edge[]>[]>>;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
}

interface ChatContextProviderProps {
  children: React.ReactNode;
}

export const ChatContext = React.createContext<ChatContextProps>({
  setChats: () => {},
  setChatMessages: () => {},
  getChatMessagesById: () => [],
  chats: [],
  edges: [],
  nodes: [],
  setNodes: () => {},
  setEdges: () => {},
  onNodesChange: () => {},
  onEdgesChange: () => {},
});

const ChatContextProvider = ({ children }: ChatContextProviderProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  const [chats, setChats] = useState<ChatType[]>([]);
  const [messagesDictionary, setMessagesDictionary] =
    useState<MessageDictionary>();

  const setChatMessages = useCallback(
    (chatId: string, newMessages: Message[]) => {
      setMessagesDictionary((prevDictionary) => {
        return {
          ...prevDictionary,
          [chatId]: newMessages,
        };
      });
    },
    [setMessagesDictionary]
  );

  const getChatMessagesById = useCallback(
    (chatId: string) => {
      return messagesDictionary?.[chatId];
    },
    [messagesDictionary]
  );

  const updateChats = useCallback(() => {
    setChats((prevChats) =>
      prevChats.map((chat) => ({
        ...chat,
        messages: messagesDictionary?.[chat.id],
      }))
    );
  }, [messagesDictionary, setChats]);

  useEffect(() => {
    updateChats();
  }, [messagesDictionary, updateChats]);

  useEffect(() => {
    if (!nodes.length && !chats.length) return;

    const data = {
      nodes,
      edges,
      chats,
      messagesDictionary,
    };
    localStorage.setItem("canvas-state", JSON.stringify(data));
  }, [nodes, edges, chats]);

  useEffect(() => {
    const storedCanvas = localStorage.getItem("canvas-state");
    if (!storedCanvas) return;

    console.log("storedCanvas", storedCanvas);

    try {
      const parsed = JSON.parse(storedCanvas);
      if (parsed.nodes) setNodes(parsed.nodes);
      if (parsed.edges) setEdges(parsed.edges);
      if (parsed.chats) setChats(parsed.chats);
      if (parsed.messagesDictionary)
        setMessagesDictionary(parsed.messagesDictionary);
    } catch (err) {
      console.error(err);
      toast.error("Failed to restore canvas state:");
    }
  }, []);

  const value = useMemo(
    () => ({
      chats,
      setChatMessages,
      setChats,
      getChatMessagesById,
      nodes,
      edges,
      setNodes,
      setEdges,
      onNodesChange,
      onEdgesChange,
    }),
    [
      chats,
      setChatMessages,
      setChats,
      getChatMessagesById,
      nodes,
      edges,
      setNodes,
      setEdges,
      onNodesChange,
      onEdgesChange,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContextProvider;
