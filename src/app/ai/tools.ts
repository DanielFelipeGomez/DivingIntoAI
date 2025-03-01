import { tool as createTool } from "ai";
import { z } from "zod";
import { getCodeReviewData } from "./code-review-tools/code-review-tool";
import {
  getTitleForTicket,
  getDescriptionForTicket,
  getRequirementsForTicket,
  getReproductionStepsForTicket,
  getCodeForTicket,
  getLabelsForTicket,
  getLimitDateForTicket,
  getPriorityForTicket,
} from "./ticket-tools/ticket-generator-tool";
import { Tools } from "./tools.types";

export const stockTool = createTool({
  description: "Get price for a stock",
  parameters: z.object({
    symbol: z.string().describe("The stock symbol to get the price for"),
    price: z.number().describe("The price of the stock"),
  }),
  execute: async function ({ symbol, price }) {
    // Simulated API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return { symbol, price };
  },
});

// export const getDescriptionForTicket = createTool({
//   description:
//     "Generate specifically the description of the ticket, because the user request it",
//   parameters: z.object({
//     description: z.string().describe("The description of the ticket"),
//   }),
//   execute: async function ({ description }) {
//     return description;
//   },
// });

// export const getTitleForTicket = createTool({
//   description: "Generate specifically the title of the ticket",
//   parameters: z.object({
//     title: z.string().describe("The title of the ticket"),
//   }),
// });

// export const getRequirementsForTicket = createTool({
//   description: "Generate specifically the requirements of the ticket",
//   parameters: z.object({
//     requirements: z.string().describe("The requirements of the ticket"),
//   }),
// });

// export const getReproductionStepsForTicket = createTool({
//   description: "Generate specifically the reproduction steps of the ticket",
//   parameters: z.object({
//     reproductionSteps: z
//       .string()
//       .describe("The reproduction steps of the ticket"),
//   }),
// });

// export const getCodeForTicket = createTool({
//   description: "Generate specifically the code of the ticket",
//   parameters: z.object({
//     code: z.string().describe("The code of the ticket"),
//   }),
// });

// export const getLabelsForTicket = createTool({
//   description: "Generate specifically the labels of the ticket",
//   parameters: z.object({
//     labels: z.array(z.string()).describe("The labels of the ticket"),
//   }),
// });

// export const getLimitDateForTicket = createTool({
//   description: "Generate specifically the limit date of the ticket",
//   parameters: z.object({
//     limitDate: z.string().describe("The limit date of the ticket"),
//   }),
// });

// export const getPriorityForTicket = createTool({
//   description: "Generate specifically the priority of the ticket",
//   parameters: z.object({
//     priority: z
//       .enum(["Highest", "High", "Medium", "Low", "Lowest"])
//       .describe("The priority of the ticket"),
//   }),
// });

export const toolsList = {
  [Tools.getCodeReviewData]: getCodeReviewData,
  [Tools.getStockPrice]: stockTool,
  [Tools.getTitleForTicket]: getTitleForTicket,
  [Tools.getDescriptionForTicket]: getDescriptionForTicket,
  [Tools.getRequirementsForTicket]: getRequirementsForTicket,
  [Tools.getReproductionStepsForTicket]: getReproductionStepsForTicket,
  [Tools.getCodeForTicket]: getCodeForTicket,
  [Tools.getLabelsForTicket]: getLabelsForTicket,
  [Tools.getLimitDateForTicket]: getLimitDateForTicket,
  [Tools.getPriorityForTicket]: getPriorityForTicket,
};
