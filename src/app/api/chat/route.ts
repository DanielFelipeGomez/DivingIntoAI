import { tools } from "@/app/ai/tools";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = streamText({
    model: openai("gpt-3.5-turbo"),
    system: "You are a friendly assistant!",
    messages,
    maxSteps: 5,
    tools,
  });

  console.log("Result de tools", result.toolCalls);
  return result.toDataStreamResponse();
}
