import { z } from "zod";

export const codeReviewSchema = z.object({
  codeBefore: z
    .string()
    .describe("A fragment of the code before the proposed changes"),
  codeAfter: z.string().describe("A fragment of the code proposed"),
  explanation: z.string().describe("The explanation of the proposed changes"),
  reference: z.object({
    text: z.string().describe("The text of the reference"),
    url: z.string().describe("The URL of the reference"),
  }),
});

export type CodeReview = z.infer<typeof codeReviewSchema>;

export const codeReviewsSchema = z.array(codeReviewSchema).length(4);
