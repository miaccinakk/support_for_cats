/**
 * =============================================================================
 *  AI INTEGRATION POINT
 * =============================================================================
 *
 *  Single place where the app talks to a language model. It uses the Vercel AI
 *  SDK with the OpenAI provider. The API key is read automatically from the
 *  `OPENAI_API_KEY` environment variable, and the model can be overridden with
 *  `OPENAI_MODEL` (defaults to "gpt-4o-mini").
 *
 *  If no API key is configured (e.g. in a preview), the service transparently
 *  falls back to a local, deterministic response so the UI keeps working. This
 *  makes it trivial to swap or extend the provider later — everything else in
 *  the app only depends on `generateAssistantResponse`.
 * =============================================================================
 */

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

import { buildAssistantPrompt, SYSTEM_PROMPT } from "./prompts"
import { getFallbackResponse } from "./fallback"
import type { AssistantInput, AssistantResult } from "./types"

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini"

export async function generateAssistantResponse(input: AssistantInput): Promise<AssistantResult> {
  // No key configured — return a helpful local response instead of crashing.
  if (!process.env.OPENAI_API_KEY) {
    return { text: getFallbackResponse(input), source: "fallback" }
  }

  try {
    const { text } = await generateText({
      model: openai(MODEL),
      system: SYSTEM_PROMPT,
      prompt: buildAssistantPrompt(input),
      temperature: 0.8,
    })

    return { text: text.trim(), source: "model" }
  } catch (error) {
    console.log("[v0] AI generation failed, using fallback:", error instanceof Error ? error.message : error)
    return { text: getFallbackResponse(input), source: "fallback" }
  }
}
