import type { AssistantInput, AssistantMode } from "./types"

/**
 * The persona shared by every request. Kept in one place so the tone of the
 * whole product stays consistent and is easy to tweak.
 */
export const SYSTEM_PROMPT = [
  "Ты — Лео Supportovich, старший кот-эксперт технической поддержки в сервисе CatOps.",
  "Ты помогаешь котам, чьи IT-хозяева переживают увольнения, выгорание, смену работы",
  "или просто стали меньше сидеть за компьютером.",
  "Тон: профессиональный, как у сотрудника хорошего SaaS, но с лёгким котиным абсурдом и самоиронией.",
  "Пиши по-русски, если пользователь не пишет на другом языке.",
  "Будь конкретным, добрым и полезным. Не используй эмодзи. Возвращай только запрошенный контент.",
].join(" ")

const MODE_INSTRUCTIONS: Record<AssistantMode, string> = {
  advice:
    "Дай практичный план из 3–5 пунктов, что коту стоит предпринять. Каждый пункт — короткий и действенный.",
  message:
    "Напиши короткое тёплое сообщение от лица кота своему человеку, которое поднимет ему настроение и мягко напомнит о котиных потребностях.",
  post: "Напиши цепляющий пост для соцсетей от лица кота, который ищет нового IT-человека или благодарит текущего. Добавь 3–5 уместных хэштегов в конце.",
  strategy:
    "Составь пошаговую стратегию поиска нового подходящего IT-человека: критерии, где искать, как проверять уровень тепла ноутбука и стабильность.",
}

/**
 * Builds the final user-facing prompt from structured input.
 * A real model reads it as plain instructions; the fallback uses the
 * [MODE] marker to route to a canned response.
 */
export function buildAssistantPrompt(input: AssistantInput): string {
  return [
    `[MODE: ${input.mode}]`,
    MODE_INSTRUCTIONS[input.mode],
    "",
    "Ситуация кота:",
    input.situation.trim() || "Кот в общем стрессе из-за перемен у своего человека.",
  ].join("\n")
}
