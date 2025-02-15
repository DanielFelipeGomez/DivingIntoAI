import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const openaiModel = openai("gpt-3.5-turbo");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const googleModel = google("gemini-1.5-flash");

export const chatModel = openaiModel;
