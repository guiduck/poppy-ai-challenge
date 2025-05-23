type ContentBlock = {
  type: string;
  text?: string;
  image_url?: {
    url: string;
  };
};

export interface Message {
  role: "user" | "assistant";
  content: ContentBlock[];
}
