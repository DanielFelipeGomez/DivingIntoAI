import { toolsList } from "@/app/ai/tools";
import { chatModel } from "@/app/models";
import { streamText } from "ai";

export const resultState = "result";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!chatModel) {
      throw new Error("Modelo de chat no configurado correctamente");
    }

    const result = streamText({
      system: `
      You are a expert in ticket management and code review.
      For tickets:
      - Use createCompleteTicket when the user wants to create a new ticket, probably if you use this tool, you don't need to use other tools.
      - Use getTitleForTicket only when the user wants to modify the title
      - Use getDescriptionForTicket only when the user wants to modify the description
      - Use getRequirementsForTicket when the user wants to modify the requirements
      - Use getReproductionStepsForTicket when the user wants to modify the reproduction steps
      - Use getCodeForTicket when the user wants to modify the code
      - Use getLabelsForTicket when the user wants to modify the labels
      - Use getLimitDateForTicket when the user wants to modify the limit date
      - Use getPriorityForTicket when the user wants to modify the priority
   
      For code review:
      - Use getCodeReviewData when the user requests a code review
   
      If you use a tool, don't send a message to the user, just return the result of the tool.
      `,
      messages,
      maxSteps: 10,
      tools: toolsList,
      model: chatModel,
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
