import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const openaiModel = openai("gpt-3.5-turbo");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const googleModel = google("gemini-1.5-flash");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const anthropicModel = anthropic("claude-3-5-sonnet-20240620");

export const chatModel = openaiModel;
