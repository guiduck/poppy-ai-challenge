import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      max_tokens: 1000,
    });

    console.log("completion", completion);

    return NextResponse.json({ result: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI error:", error);
    return NextResponse.json(
      { error, message: "Failed to get response from GPT-4o." },
      { status: 500 }
    );
  }
}
