import { NextResponse } from "next/server"

import { generateAssistantResponse } from "@/lib/ai"
import type { AssistantMode } from "@/lib/ai/types"

const VALID_MODES: AssistantMode[] = ["advice", "message", "post", "strategy"]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const situation = typeof body?.situation === "string" ? body.situation.slice(0, 1000) : ""
    const mode: AssistantMode = VALID_MODES.includes(body?.mode) ? body.mode : "advice"

    if (!situation.trim()) {
      return NextResponse.json({ error: "Опишите ситуацию вашего кота." }, { status: 400 })
    }

    const result = await generateAssistantResponse({ situation, mode })
    return NextResponse.json(result)
  } catch (error) {
    console.log("[v0] /api/assistant error:", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "Кот-эксперт временно отошёл к миске. Попробуйте ещё раз." }, { status: 500 })
  }
}
