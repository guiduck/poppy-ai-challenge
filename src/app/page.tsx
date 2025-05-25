"use client";

import React, { useCallback, useEffect } from "react";
import ReactFlow, {
  addEdge,
  Background,
  ReactFlowProvider,
  Node,
  Edge,
  Connection,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "@/components/ui/button";
import ChatNode from "@/components/ChatNode";
import useChat from "@/hooks/useChat";

let id = 0;
const getId = () => `chat-${id++}`;

const nodeTypes = { chat: ChatNode };

export default function ChatCanvas() {
  const {
    setChats,
    onNodesChange,
    onEdgesChange,
    setNodes,
    setEdges,
    nodes,
    edges,
  } = useChat();

  const retrieveLastSession = () => {
    if (!nodes.length) {
      return;
    }

    const lastExistingId = nodes[nodes.length - 1]?.id?.split("-")[1];
    id = Math.max(id, Number(lastExistingId) + 1);
  };

  useEffect(() => {
    retrieveLastSession();
  }, [nodes]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            style: { strokeWidth: 3, stroke: "#4f46e5" },
            animated: true,
          },
          eds
        )
      );

      setChats((prev) =>
        prev.map((chat) => {
          const { source, target } = params;
          if (!source || !target) return chat;

          const isTarget = chat.id === target;
          const isSource = chat.id === source;

          if (isSource && !chat.nodes.includes(target)) {
            return { ...chat, nodes: [...chat.nodes, target] };
          }
          if (isTarget && !chat.nodes.includes(source)) {
            return { ...chat, nodes: [...chat.nodes, source] };
          }

          return chat;
        })
      );
    },
    [setEdges, setChats, nodes, edges]
  );

  const addChatbot = () => {
    const count = nodes.length;
    const chatId = getId();
    const newNode: Node = {
      id: chatId,
      type: "chat",
      position: {
        x: 100 + count * 50,
        y: 100 + count * 50,
      },
      data: {},
      draggable: true,
    };
    const newChat = {
      id: chatId,
      messages: [],
      nodes: [],
    };
    setChats((chats) => [...chats, newChat]);
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <ReactFlowProvider>
      <div className="w-screen h-screen">
        <Button className="absolute z-10 top-4 left-4" onClick={addChatbot}>
          + Add Chatbot
        </Button>
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          edges={edges.map((e) => ({
            ...e,
            style: {
              strokeWidth: 3,
              stroke: "#4f46e5",
            },
            animated: true,
          }))}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          elementsSelectable={false}
          panOnDrag={true}
          onConnect={onConnect}
          fitView
        >
          <Background variant={"dots" as BackgroundVariant} gap={20} size={1} />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
