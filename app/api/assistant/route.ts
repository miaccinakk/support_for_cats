import { NextResponse } from "next/server"

import { generateAssistantResponse } from "@/lib/ai"
import type { AssistantMode } from "@/lib/ai/types"
import { consumeRateLimit, getClientKey, DAILY_LIMIT } from "@/lib/rate-limit"

const VALID_MODES: AssistantMode[] = ["advice", "message", "post", "strategy"]

const MIN_LENGTH = 10
// A real human needs at least a moment to read + type; anything faster than
// this after the form mounted is almost certainly an automated bot.
const MIN_ELAPSED_MS = 1500

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // --- Bot protection (no third-party services) -------------------------
    // 1) Honeypot: a hidden field humans never see. If it's filled, it's a bot.
    if (typeof body?.website === "string" && body.website.trim() !== "") {
      return NextResponse.json({ error: "Похоже, это бот. Запрос отклонён." }, { status: 400 })
    }
    // 2) Timing trap: submitting almost instantly means it wasn't typed by hand.
    const elapsed = typeof body?.elapsed === "number" ? body.elapsed : 0
    if (elapsed > 0 && elapsed < MIN_ELAPSED_MS) {
      return NextResponse.json(
        { error: "Слишком быстро. Опишите ситуацию своими словами." },
        { status: 400 },
      )
    }

    const situation = typeof body?.situation === "string" ? body.situation.slice(0, 1000) : ""
    const mode: AssistantMode = VALID_MODES.includes(body?.mode) ? body.mode : "advice"

    // --- Input validation --------------------------------------------------
    if (situation.trim().length < MIN_LENGTH) {
      return NextResponse.json(
        { error: `Опишите ситуацию подробнее — минимум ${MIN_LENGTH} символов.` },
        { status: 400 },
      )
    }

    // --- Daily rate limit (5 generations per client per day) --------------
    const rate = consumeRateLimit(getClientKey(request))
    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: "Вы использовали все попытки на сегодня. Попробуйте завтра.",
          limitReached: true,
          remaining: 0,
          limit: DAILY_LIMIT,
        },
        { status: 429 },
      )
    }

    const result = await generateAssistantResponse({ situation, mode })
    return NextResponse.json({ ...result, remaining: rate.remaining, limit: DAILY_LIMIT })
  } catch (error) {
    console.log("[v0] /api/assistant error:", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "Кот-эксперт временно отошёл к миске. Попробуйте ещё раз." }, { status: 500 })
  }
}
