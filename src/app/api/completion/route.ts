import { tools } from "@/app/ai/tools";
import { openai } from "@ai-sdk/openai";
import { generateObject, streamText } from "ai";
import { z } from "zod";

const model = openai("gpt-3.5-turbo");

const responseSchema = z
  .object({
    type: z.enum(["text", "table"]).describe("Response type: text or table"),
    content: z.string().optional().describe("Content for text responses"),
    headers: z
      .array(z.string().min(1))
      .optional()
      .describe("Column headers for table responses"),
    rows: z
      .array(z.record(z.string(), z.string().min(1)))
      .max(15)
      .optional()
      .describe("Table data rows, maximum 15 rows"),
  })
  .refine(
    (data) => {
      if (data.type === "text") {
        return data.content !== undefined;
      } else {
        return data.headers !== undefined && data.rows !== undefined;
      }
    },
    {
      message: "Invalid data structure for the specified type",
    }
  );

async function obtenerRespuesta(prompt: string) {
  try {
    const { object } = await generateObject({
      model,
      prompt,
      schema: responseSchema,
      system: `
        Eres un asistente que responde preguntas de manera concisa. 
        Si la pregunta requiere una respuesta breve, devuelve texto; 
        si se solicita información estructurada, responde en forma de tabla.
        
        Importante:
        - Para tablas, limita la respuesta a máximo 15 filas
        - Asegúrate de que todos los datos estén completos
        - No cortes la información a la mitad

        Ejemplo de respuesta en formato texto:
        {
          "type": "text",
          "content": "Python es un lenguaje de programación versátil."
        }

        Ejemplo de respuesta en formato tabla:
        {
          "type": "table",
          "headers": ["Lenguaje", "Usos"],
          "rows": [
            { "Lenguaje": "Python", "Usos": "Web, IA" },
            { "Lenguaje": "Java", "Usos": "Empresarial" }
          ]
        }
      `,
      maxTokens: 1000, // Increased token limit
      temperature: 0.3, // Reduced temperature for more consistent outputs
    });

    // Validate the response structure
    const parsed = responseSchema.safeParse(object);
    if (!parsed.success) {
      throw new Error("Respuesta invalida del modelo");
    }

    return parsed.data;
  } catch (error) {
    console.error("Error al generar la respuesta:", error);
    throw new Error("No se pudo generar una respuesta válida.");
  }
}

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const { prompt } = body;

//     if (!prompt || typeof prompt !== "string") {
//       return new Response(
//         JSON.stringify({ error: "Se requiere un prompt válido" }),
//         { status: 400 }
//       );
//     }

//     const response = await obtenerRespuesta(prompt);
//     console.log("Verificando respuesta:", response);
//     return new Response(JSON.stringify(response), {
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("Error en el endpoint:", error);
//     return new Response(
//       JSON.stringify({
//         type: "text",
//         content: "Hubo un error al procesar la solicitud.",
//       }),
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = streamText({
    model: openai("gpt-4o"),
    system: "You are a friendly assistant!",
    messages,
    maxSteps: 5,
    tools,
  });

  return result.toDataStreamResponse();
}
