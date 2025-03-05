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

// export const getTicketData = createTool({
//   description:
//     "Generate the target data for a table based on a description given from the user",
//   parameters: ticketSchema,
//   execute: async function (ticketData: TicketData) {
//     return ticketData;
//   },
// });

// Individual parts of the ticket

export const getTitleForTicket = createTool({
  // description: `Generate a new title for the ticket based on the user's request, ONLY USE THIS TOOL IF THE USER ASKS FOR ${Tools.getTitleForTicket}`,
  description:
    "Generate a new title for the ticket based on the user's request, only use this tool if the user request modify only the title description",
  parameters: z.object({
    title: z.string().describe("The title of the ticket"),
  }),
  execute: async function (titleData: { title: string }) {
    return titleData;
  },
});

export const getDescriptionForTicket = createTool({
  // description: `Generate a new description for the ticket based on the user's request, ONLY USE THIS TOOL IF THE USER ASKS FOR ${Tools.getDescriptionForTicket}`,
  description:
    "Generate a new description for the ticket based on the user's request, only use this tool if the user request modify only the description",
  parameters: z.object({
    description: z.string().describe("The description of the ticket"),
  }),
  execute: async function (descriptionData: { description: string }) {
    return descriptionData;
  },
});

export const getRequirementsForTicket = createTool({
  // description: `Generate a new requirements for the ticket based on the user's request, ONLY USE THIS TOOL IF THE USER ASKS FOR ${Tools.getRequirementsForTicket}`,
  description:
    "Generate a new requirements for the ticket based on the user's request, only use this tool if the user request modify only the requirements",
  parameters: z.object({
    requirements: z.string().describe("The requirements of the ticket"),
  }),
  execute: async function (requirementsData: { requirements: string }) {
    return requirementsData;
  },
});

export const getReproductionStepsForTicket = createTool({
  // description: `Generate a new reproduction steps for the ticket based on the user's request, ONLY USE THIS TOOL IF THE USER ASKS FOR ${Tools.getReproductionStepsForTicket}`,
  description:
    "Generate a new reproduction steps for the ticket based on the user's request, only use this tool if the user request modify only the reproduction steps",
  parameters: z.object({
    reproductionSteps: z
      .string()
      .describe("The reproduction steps of the ticket"),
  }),
  execute: async function (reproductionStepsData: {
    reproductionSteps: string;
  }) {
    return reproductionStepsData;
  },
});

export const getCodeForTicket = createTool({
  // description: `Generate a new code for the ticket based on the user's request, ONLY USE THIS TOOL IF THE USER ASKS FOR ${Tools.getCodeForTicket}`,
  description:
    "Generate a new code for the ticket based on the user's request, only use this tool if the user request modify only the code",
  parameters: z.object({
    code: z.string().describe("The code of the ticket"),
  }),
  execute: async function (codeData: { code: string }) {
    return codeData;
  },
});

export const getLabelsForTicket = createTool({
  // description: `Generate a new labels for the ticket based on the user's request, ONLY USE THIS TOOL IF THE USER ASKS FOR ${Tools.getLabelsForTicket}`,
  description:
    "Generate a new labels for the ticket based on the user's request, only use this tool if the user request modify only the labels",
  parameters: z.object({
    labels: z.array(z.string()).describe("The labels of the ticket"),
  }),
  execute: async function (labelsData: { labels: string[] }) {
    return labelsData;
  },
});

export const getLimitDateForTicket = createTool({
  // description: `Generate a new limit date for the ticket based on the user's request, ONLY USE THIS TOOL IF THE USER ASKS FOR ${Tools.getLimitDateForTicket}`,
  description:
    "Generate a new limit date on format YYYY-MM-DD for the ticket based on the user's request, only use this tool if the user request modify only the limit date",
  parameters: z.object({
    limitDate: z.string().describe("The limit date of the ticket"),
  }),
  execute: async function (limitDateData: { limitDate: string }) {
    return limitDateData;
  },
});

export const getPriorityForTicket = createTool({
  // description: `Generate a new priority for the ticket based on the user's request, ONLY USE THIS TOOL IF THE USER ASKS FOR ${Tools.getPriorityForTicket}`,
  description:
    "Generate a new priority for the ticket based on the user's request, only use this tool if the user request modify only the priority",
  parameters: z.object({
    priority: z.string().describe("The priority of the ticket"),
  }),
  execute: async function (priorityData: { priority: string }) {
    return priorityData;
  },
});

export const createCompleteTicket = createTool({
  description:
    "Create a complete ticket with all its components based on the user's description. Use this tool when the user requests to create a new ticket or when they provide information for a complete ticket.",
  parameters: ticketSchema,
  execute: async function (ticketData: TicketData) {
    return ticketData;
  },
});
