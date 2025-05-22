/* eslint-disable @typescript-eslint/no-explicit-any*/
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages, imageBase64 } = await req.json();

    const content = messages.map((msg: any) => {
      if (
        msg.role === "user" &&
        msg === messages[messages.length - 1] &&
        imageBase64
      ) {
        const baseContent =
          typeof msg.content === "string"
            ? [{ type: "text", text: msg.content }]
            : msg.content;

        return {
          role: msg.role,
          content: [
            ...baseContent,
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/png",
                data: imageBase64,
              },
            },
          ],
        };
      }

      return {
        role: msg.role,
        content: msg.content,
      };
    });

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "poppy-ai-challenge",
        },
        body: JSON.stringify({
          model: "anthropic/claude-3-haiku",
          messages: content,
        }),
      }
    );

    const data = await response.json();
    const contentBlocks = data.choices?.[0]?.message?.content;

    return new Response(JSON.stringify({ content: contentBlocks }));
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Failed to fetch from Claude API.", error }),
      { status: 500 }
    );
  }
}
