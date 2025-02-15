import { tools } from "@/app/ai/tools";
import { chatModel } from "@/app/models";
import { streamText } from "ai";

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = streamText({
    model: chatModel,
    system: "You are a friendly assistant!",
    messages,
    maxSteps: 5,
    tools,
  });

  console.log("Result de tools", result.toolCalls);
  return result.toDataStreamResponse();
}
