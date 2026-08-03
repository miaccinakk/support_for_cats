"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Send, Loader2, Cat, Copy, Check } from "lucide-react"

import site from "@/data/site.json"

const { assistant } = site
type Mode = (typeof assistant.modes)[number]["id"]

export function AiAssistant() {
  const [situation, setSituation] = useState("")
  const [mode, setMode] = useState<Mode>("advice")
  const [result, setResult] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!situation.trim() || status === "loading") return

    setStatus("loading")
    setErrorMsg("")
    setResult("")

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation, mode }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Что-то пошло не так.")
      setResult(data.text)
      setStatus("done")
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Кот-эксперт временно недоступен.")
      setStatus("error")
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <section id="assistant" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="inline-flex items-center gap-2 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" />
          {assistant.eyebrow}
        </p>
        <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          {assistant.title}
        </h2>
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
          {assistant.subtitle}
        </p>
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        {/* Input panel */}
        <div className="rounded-3xl border border-border bg-card p-5 md:p-7">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap gap-2">
              {assistant.modes.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id as Mode)}
                  className={[
                    "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                    mode === m.id
                      ? "bg-foreground text-background"
                      : "border border-border bg-background text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <label htmlFor="situation" className="sr-only">
              Опишите ситуацию вашего кота
            </label>
            <textarea
              id="situation"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder={assistant.placeholder}
              rows={5}
              className="mt-4 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-ring/30"
            />

            <button
              type="submit"
              disabled={!situation.trim() || status === "loading"}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Кот думает...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Сгенерировать план
                </>
              )}
            </button>
          </form>

          <div className="mt-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Примеры запросов
            </p>
            <div className="flex flex-col gap-2">
              {assistant.examples.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setSituation(ex)}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-left text-xs leading-snug text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result panel */}
        <div className="flex min-h-[360px] flex-col rounded-3xl border border-border bg-muted/40 p-5 md:p-7">
          <div className="mb-4 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background">
                <Cat className="h-4 w-4" />
              </span>
              Ответ кота-эксперта
            </span>
            {status === "done" && result && (
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Скопировано" : "Копировать"}
              </button>
            )}
          </div>

          <div className="flex-1">
            {status === "idle" && (
              <div className="flex h-full min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-border px-6 text-center">
                <p className="text-sm text-muted-foreground">{assistant.emptyState}</p>
              </div>
            )}

            {status === "loading" && (
              <div className="space-y-3" aria-live="polite">
                {[90, 78, 84, 66, 72].map((w, i) => (
                  <div
                    key={i}
                    className="h-3.5 animate-pulse rounded-full bg-border"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
            )}

            {status === "error" && (
              <div className="flex h-full min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-primary/40 px-6 text-center">
                <p className="text-sm text-primary">{errorMsg}</p>
              </div>
            )}

            {status === "done" && (
              <motion.pre
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground"
              >
                {result}
              </motion.pre>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
