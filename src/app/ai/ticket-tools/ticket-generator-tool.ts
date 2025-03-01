import { tool as createTool } from "ai";
import { z } from "zod";

export const ticketSchema = z.object({
  title: z
    .string()
    .describe("The title of the ticket based on the initial information given"),
  description: z
    .string()
    .describe(
      "Description of the ticket in base to the initial information given"
    ),
  requirements: z
    .string()
    .describe(
      "List of the requirements of the ticket in base to the initial information given"
    ),
  reproductionSteps: z
    .string()
    .describe(
      "List of the reproduction steps of the ticket in base to the initial information given"
    ),
  limitDate: z
    .string()
    .describe(
      "Limit date of the ticket in base to the initial information given (format: YYYY-MM-DD)"
    ),
  priority: z
    .enum(["Highest", "High", "Medium", "Low", "Lowest"])
    .describe(
      "Priority of the ticket in base to the initial information given"
    ),
  code: z
    .string()
    .describe("Code reference of the ticket if the user has provided it"),
  labels: z
    .array(z.string())
    .describe("Labels of the ticket in base to the initial information given"),
});

export type TicketData = z.infer<typeof ticketSchema>;

export const getTicketData = createTool({
  description:
    "Generate the target data for a table based on a description given from the user",
  parameters: ticketSchema,
  execute: async function (ticketData: TicketData) {
    return ticketData;
  },
});
