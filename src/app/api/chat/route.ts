import { tools } from "@/app/ai/tools";
import { chatModel } from "@/app/models";
import { streamText } from "ai";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!chatModel) {
      throw new Error("Modelo de chat no configurado correctamente");
    }

    const result = streamText({
      model: chatModel,
      system: "You are a friendly assistant!",
      messages,
      maxSteps: 5,
      tools,
    });

    if (!result) {
      throw new Error("No se pudo generar una respuesta del modelo");
    }

    const response = result.toDataStreamResponse();
    return response;
  } catch (error) {
    console.error("Error detallado en el servidor:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido en el servidor",
        details: error instanceof Error ? error.stack : undefined,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
