import { openai } from "@ai-sdk/openai";
import { tool as createTool, generateText } from "ai";
import { z } from "zod";

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

// export const codeLintTool = createTool({
//   description: "Analyze code and return recommended rule corrections",
//   parameters: z.object({
//     code: z.string().describe("The source code to analyze"),
//   }),
//   execute: async function ({ code }) {
//     const prompt = `
//         Analyze the following JavaScript code and check it against these predefined rules:
//         ${rules
//           .map((rule) => `Rule: ${rule.id} - ${rule.description}`)
//           .join("\n")}

//         Code to analyze:
//         \`\`\`js
//         ${code}
//         \`\`\`

//         Provide a detailed JSON response with:
//         - The rule ID that was violated
//         - Line number of the issue
//         - Content of the problematic line
//         - Suggested fix based on the predefined rules
//         `;

//     const model = openai("gpt-3.5-turbo");

//     const schema = z.object({
//       ruleId: z.string().describe("The ID of the rule that was violated"),
//       lineNumber: z
//         .number()
//         .describe("The line number where the issue occurred"),
//       lineContent: z.string().describe("The content of the problematic line"),
//       suggestedFix: z
//         .string()
//         .describe("The suggested fix based on the predefined rules"),
//     });

//     const { object } = await generateObject({
//       model,
//       prompt,
//       schema,
//     });

//     return object;
//   },
// });

export const getMockTableData = createTool({
  description: "Generate mock data for a table based on a description",
  parameters: z.object({
    description: z
      .string()
      .describe("Description of the table and its columns"),
    numRows: z
      .number()
      .optional()
      .describe("Number of rows to generate (default: 10)"),
  }),
  execute: async function ({ description, numRows = 10 }) {
    const prompt = `
        Generate mock data for a table based on the following description:
        ${description}
The table should have ${numRows} rows.
        Provide the mock data in JSON format with column names as keys and arrays of values as values.
        example:
        {
          "id": [1, 2, 3, 4, 5],
          "name": ["John", "Jane", "Bob", "Alice", "Tom"],
          "age": [25, 30, 40, 50, 60]
        }
        `;

    const model = openai("gpt-3.5-turbo");

    const { text } = await generateText({
      model,
      prompt,
      maxTokens: 500,
      maxRetries: 2,
    });

    return JSON.parse(text);
  },
});

export const getTargetData = createTool({
  description:
    "Generate the target data for a table based on a description given from the user",
  parameters: z.object({
    title: z
      .string()
      .describe(
        "The title of the ticket based on the initial information given"
      ),
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
      .describe(
        "Labels of the ticket in base to the initial information given"
      ),
  }),
  execute: async function ({
    title,
    description,
    requirements,
    reproductionSteps,
    limitDate,
    priority,
    labels,
  }) {
    return {
      title,
      description,
      requirements,
      reproductionSteps,
      limitDate,
      priority,
      labels,
    };
  },
});

export const getCodeReviewData = createTool({
  description: "Receive a code review and return the data",
  parameters: z.object({
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
  }),
  // parameters: z.object({
  //   codeBefore: z.string().describe("The code before the proposed changes"),
  //   codeAfter: z.string().describe("The code proposed"),
  //   explanation: z.string().describe("The explanation of the proposed changes"),
  //   reference: z.object({
  //     text: z.string().describe("The text of the reference"),
  //     url: z.string().describe("The URL of the reference"),
  //   }),
  // }),
  execute: async function (codeReview) {
    console.log("HEYYYYYYYYYYYY QUE CODIGo", codeReview);
    return codeReview.codeReview;
  },
});

// export const getCodeReviewData = createTool({
//   description: "Generate a code review in base to the code given",
//   parameters: z.object({
//     codeBefore: z.string().describe("The code before the proposed changes"),
//     codeAfter: z.string().describe("The code proposed"),
//     explanation: z.string().describe("The explanation of the proposed changes"),
//     reference: z.object({
//       text: z.string().describe("The text of the reference"),
//       url: z.string().describe("The URL of the reference"),
//     }),
//   }),
//   execute: async function ({ codeBefore, codeAfter, explanation, reference }) {
//     console.log("code", codeBefore, codeAfter, explanation, reference);
//     return { codeBefore, codeAfter, explanation, reference };
//   },
// });

export const tools = {
  getCodeReviewData,
  getStockPrice: stockTool,
  // codeLint: codeLintTool,
  getTargetData,
};
