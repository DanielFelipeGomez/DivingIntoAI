import { openai } from "@ai-sdk/openai";
import { tool as createTool, generateObject, generateText } from "ai";
import { z } from "zod";

import rules from "./rules.json";

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

export const codeLintTool = createTool({
  description: "Analyze code and return recommended rule corrections",
  parameters: z.object({
    code: z.string().describe("The source code to analyze"),
  }),
  execute: async function ({ code }) {
    const prompt = `
        Analyze the following JavaScript code and check it against these predefined rules:
        ${rules
          .map((rule) => `Rule: ${rule.id} - ${rule.description}`)
          .join("\n")}
        
        Code to analyze:
        \`\`\`js
        ${code}
        \`\`\`
        
        Provide a detailed JSON response with:
        - The rule ID that was violated
        - Line number of the issue
        - Content of the problematic line
        - Suggested fix based on the predefined rules
        `;

    const model = openai("gpt-3.5-turbo");

    const schema = z.object({
      ruleId: z.string().describe("The ID of the rule that was violated"),
      lineNumber: z
        .number()
        .describe("The line number where the issue occurred"),
      lineContent: z.string().describe("The content of the problematic line"),
      suggestedFix: z
        .string()
        .describe("The suggested fix based on the predefined rules"),
    });

    const { object } = await generateObject({
      model,
      prompt,
      schema,
    });

    return object;
  },
});

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

    console.log(text);

    return JSON.parse(text);
  },
});

export const tools = {
  getStockPrice: stockTool,
  codeLint: codeLintTool,
  getMockTableData,
};
