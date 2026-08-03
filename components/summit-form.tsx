"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CalendarDays, PartyPopper, Check } from "lucide-react"

import site from "@/data/site.json"

const { summit } = site

export function SummitForm() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ catName: "", humanName: "", email: "", problem: "" })

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Mock submit — no database. Persist-ready shape for a future CMS/API.
    console.log("[v0] Summit lead submitted:", form)
    setSubmitted(true)
  }

  return (
    <section id="summit" className="border-t border-border bg-foreground text-background">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2 md:px-8 md:py-28">
        {/* Left: pitch */}
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-background/20 px-3 py-1 text-xs font-medium text-background/70">
            <CalendarDays className="h-3.5 w-3.5" />
            {summit.eyebrow}
          </p>
          <h2 className="mt-5 text-balance font-serif text-4xl leading-[1.05] md:text-5xl">
            {summit.title}
          </h2>
          <p className="mt-5 max-w-md text-pretty leading-relaxed text-background/70">
            {summit.subtitle}
          </p>

          <ul className="mt-8 space-y-3">
            {summit.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3 text-sm text-background/80">
                <PartyPopper className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {h}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: form */}
        <div className="rounded-3xl bg-card p-6 text-card-foreground md:p-8">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex h-full min-h-[360px] flex-col items-center justify-center text-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Check className="h-7 w-7" />
              </span>
              <h3 className="mt-5 text-xl font-semibold tracking-tight">Заявка принята!</h3>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                Мы отправили приглашение на CatOps Summit 2026. Проверьте миску... то есть почту.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false)
                  setForm({ catName: "", humanName: "", email: "", problem: "" })
                }}
                className="mt-6 text-sm font-medium text-primary hover:underline"
              >
                Записать ещё одного кота
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-semibold tracking-tight">Забронировать место кота</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Имя кота"
                  id="catName"
                  value={form.catName}
                  onChange={(v) => update("catName", v)}
                  placeholder="Барсик"
                  required
                />
                <Field
                  label="Имя человека"
                  id="humanName"
                  value={form.humanName}
                  onChange={(v) => update("humanName", v)}
                  placeholder="Алекс"
                  required
                />
              </div>
              <Field
                label="Email человека"
                id="email"
                type="email"
                value={form.email}
                onChange={(v) => update("email", v)}
                placeholder="human@example.com"
                required
              />
              <div>
                <label htmlFor="problem" className="mb-1.5 block text-sm font-medium">
                  Проблема кота
                </label>
                <textarea
                  id="problem"
                  value={form.problem}
                  onChange={(e) => update("problem", e.target.value)}
                  rows={3}
                  placeholder="Ноутбук остыл, человек грустит, требуется помощь..."
                  className="w-full resize-none rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Отправить заявку
              </button>
              <p className="text-center text-xs text-muted-foreground">
                Без спама. Только тёплые приглашения и иногда фото котов.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string
  id: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-ring/30"
      />
    </div>
  )
}
