"use client"

import { useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Sparkles, Send, Loader2, Cat, Copy, Check, ShieldAlert, X, Info } from "lucide-react"

import site from "@/data/site.json"

const { assistant } = site
type Mode = (typeof assistant.modes)[number]["id"]

const MIN_LENGTH = 10

export function AiAssistant() {
  const [situation, setSituation] = useState("")
  const [mode, setMode] = useState<Mode>("advice")
  const [result, setResult] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [copied, setCopied] = useState(false)
  // Bot-protection + rate-limit related state
  const [honeypot, setHoneypot] = useState("") // hidden field; humans leave it empty
  const [remaining, setRemaining] = useState<number | null>(null)
  const [limitReached, setLimitReached] = useState(false)
  const mountedAt = useRef(Date.now())

  const trimmedLength = situation.trim().length
  const tooShort = trimmedLength > 0 && trimmedLength < MIN_LENGTH
  const canSubmit = trimmedLength >= MIN_LENGTH && status !== "loading"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return

    setStatus("loading")
    setErrorMsg("")
    setResult("")

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation,
          mode,
          website: honeypot, // honeypot — should always be empty for real users
          elapsed: Date.now() - mountedAt.current,
        }),
      })
      const data = await res.json()

      if (res.status === 429 || data?.limitReached) {
        setLimitReached(true)
        setRemaining(0)
        setStatus("idle")
        return
      }
      if (!res.ok) throw new Error(data?.error || "Что-то пошло не так.")

      setResult(data.text)
      if (typeof data.remaining === "number") setRemaining(data.remaining)
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

            {/* Honeypot: hidden from humans, catches naive bots that fill every field. */}
            <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden" tabIndex={-1}>
              <label htmlFor="website">Не заполняйте это поле</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
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
              maxLength={1000}
              aria-invalid={tooShort}
              className={[
                "mt-4 w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-ring/30",
                tooShort ? "border-primary/60 focus:border-primary" : "border-border focus:border-primary",
              ].join(" ")}
            />

            <div className="mt-1.5 flex items-center justify-between text-xs">
              <span className={tooShort ? "text-primary" : "text-muted-foreground"}>
                {tooShort
                  ? `Ещё минимум ${MIN_LENGTH - trimmedLength} симв. (нужно от ${MIN_LENGTH})`
                  : `Минимум ${MIN_LENGTH} символов`}
              </span>
              <span className="text-muted-foreground/70">{trimmedLength}/1000</span>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
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

            {/* Remaining attempts notice — appears after the first generation. */}
            <AnimatePresence>
              {remaining !== null && !limitReached && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 flex items-center justify-center gap-1.5 rounded-full bg-muted px-3 py-2 text-xs text-muted-foreground"
                >
                  <Info className="h-3.5 w-3.5 text-primary" />
                  {remaining > 0
                    ? `У вас осталось ${remaining} ${pluralAttempts(remaining)} на сегодня`
                    : "Это была ваша последняя попытка на сегодня"}
                </motion.p>
              )}
            </AnimatePresence>
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

      {/* Daily limit reached — friendly modal */}
      <AnimatePresence>
        {limitReached && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
            onClick={() => setLimitReached(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="limit-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-3xl border border-border bg-card p-7 text-center shadow-xl"
            >
              <button
                type="button"
                onClick={() => setLimitReached(false)}
                aria-label="Закрыть"
                className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>

              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShieldAlert className="h-7 w-7" />
              </span>
              <h3 id="limit-title" className="mt-5 text-xl font-semibold tracking-tight text-foreground">
                На сегодня лимит исчерпан
              </h3>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                Извините, вы уже использовали все {5} бесплатных генераций за сегодня. Загляните
                завтра — кот-эксперт снова будет готов помочь вашему коту.
              </p>
              <button
                type="button"
                onClick={() => setLimitReached(false)}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Хорошо, зайду завтра
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function pluralAttempts(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return "попытка"
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "попытки"
  return "попыток"
}
