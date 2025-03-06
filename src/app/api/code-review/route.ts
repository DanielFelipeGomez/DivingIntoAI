import { chatModel } from "@/app/models";
import { codeReviewSchema, codeReviewsSchema } from "@/lib/code-review-schema";
import { streamObject } from "ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { files } = await req.json();
  const firstFile = files[0].data;

  const result = streamObject({
    model: chatModel,
    messages: [
      {
        role: "system",
        content:
          "You are a software developer teacher. Your job is to take a document, and create a code review (with 4 fragments) based on the content of the document.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Create a code review based on this document.",
          },
          {
            type: "file",
            data: firstFile,
            mimeType: "application/pdf",
          },
        ],
      },
    ],
    schema: codeReviewSchema,
    output: "array",
    onFinish: ({ object }) => {
      const res = codeReviewsSchema.safeParse(object);
      console.log("____________res_______________", res);
      if (res.error) {
        throw new Error(res.error.errors.map((e) => e.message).join("\n"));
      }
    },
  });

  const resultado = result.toTextStreamResponse();
  console.log("____________resultado_______________", resultado);
  return resultado;
}
