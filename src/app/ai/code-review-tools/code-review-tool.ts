import { tool as createTool } from "ai";
import { z } from "zod";

export const codeReviewSchema = z.object({
  codeReview: z.array(
    z.object({
      codeBefore: z
        .string()
        .describe("A fragment of the code before the proposed changes"),
      codeAfter: z.string().describe("A fragment of the code proposed"),
      explanation: z
        .string()
        .describe("The explanation of the proposed changes"),
      reference: z.object({
        text: z.string().describe("The text of the reference"),
        url: z.string().describe("The URL of the reference"),
      }),
    })
  ),
});

export type CodeReviewData = z.infer<typeof codeReviewSchema>;
export type CodeReviewFragment = CodeReviewData["codeReview"][0];

export const getCodeReviewData = createTool({
  description: "Receive a code review and return the data",
  parameters: codeReviewSchema,
  execute: async function (codeReview) {
    return codeReview.codeReview;
  },
});
