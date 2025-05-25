type ChatType = {
  id: string;
  nodes: string[];
};

type MessageDictionary = {
  [key: string]: Message[];
};

type ContentBlock = {
  type: string;
  text?: string;
  image_url?: {
    url: string;
  };
};

type Message = {
  role: "user" | "assistant";
  content: ContentBlock[] | string;
};

export type { ContentBlock, Message, MessageDictionary, ChatType };
