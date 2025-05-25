/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import ChatApp from "./ChatApp";

interface IChatNodeProps {
  id: string;
  data: { x?: number; y?: number };
  selected?: boolean;
}

export default function ChatNode({
  id,
  data,
  selected,
}: Readonly<IChatNodeProps>) {
  const { setNodes } = useReactFlow();
  const [position, setPosition] = useState({
    x: data.x ?? 100,
    y: data.y ?? 100,
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPressingRef = useRef(false);

  const handleMouseUp = useCallback(() => {
    isPressingRef.current = false;

    if (isDragging) {
      setIsDragging(false);

      setNodes((nodes: any[]) =>
        nodes.map((node) => {
          if (!node.id || node.id !== id) {
            return node;
          }

          return {
            ...node,
            position: { x: position.x, y: position.y },
          };
        })
      );
    }

    if (!dragTimeoutRef.current) return;

    clearTimeout(dragTimeoutRef.current);
    dragTimeoutRef.current = null;
  }, [id, position, setNodes, isDragging]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragStartPos.current.x;
      const newY = e.clientY - dragStartPos.current.y;

      setPosition({ x: newX, y: newY });
    },
    [isDragging]
  );

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={nodeRef}
      className="w-auto p-3 border-2 border-[#333] shadow-md rounded-lg bg-[#111]"
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        boxShadow: selected ? "0 0 0 2px #4f46e5" : "0 1px 4px rgba(0,0,0,0.3)",
      }}
      onMouseEnter={() => (nodeRef.current!.style.transform = "scale(1.01)")}
      onMouseLeave={() => (nodeRef.current!.style.transform = "scale(1.0)")}
    >
      <Handle
        className="!w-4 !h-4 !bg-[--accent] hover:!bg-blue-400 border-white border-4 rounded-full"
        type="target"
        position={Position.Top}
      />
      <ChatApp id={id} />
      <Handle
        className="!w-4 !h-4 !bg-red-400 hover:!bg-red-200 border-white border-4 rounded-full"
        type="source"
        position={Position.Bottom}
      />
    </div>
  );
}
