/**
 * Shared types for the AI cat-assistant service layer.
 * Keeping these separate makes it trivial to swap or extend the provider later.
 */

export type AssistantMode = "advice" | "message" | "post" | "strategy"

export interface AssistantInput {
  /** The cat's situation described by the user. */
  situation: string
  /** What kind of output the user wants. */
  mode: AssistantMode
}

export interface AssistantResult {
  text: string
  /** Whether the response came from the real model or the local fallback. */
  source: "model" | "fallback"
}
