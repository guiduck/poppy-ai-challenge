import { ChatContext } from "@/app/context/ChatContext";
import { useContext } from "react";

const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatContextProvider");
  }
  return context;
};

export default useChat;
