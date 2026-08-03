"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CalendarDays, PartyPopper, Clock } from "lucide-react"

import { CatImage } from "@/components/cat-image"
import site from "@/data/site.json"

const { summit } = site

export function SummitForm() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ catName: "", email: "" })

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Template only — the event is not live yet, so any submit shows a notice.
    setSubmitted(true)
  }

  return (
    <section id="summit" className="border-t border-border bg-foreground text-background">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:px-8 md:py-28">
        {/* Left: pitch + photo collage */}
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-background/20 px-3 py-1 text-xs font-medium text-background/70">
            <CalendarDays className="h-3.5 w-3.5" />
            {summit.eyebrow}
          </p>
          <h2 className="mt-5 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            {summit.title}
          </h2>
          <p className="mt-4 max-w-md text-pretty leading-relaxed text-background/70">
            {summit.subtitle}
          </p>

          <ul className="mt-6 space-y-2.5">
            {summit.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3 text-sm text-background/80">
                <PartyPopper className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {h}
              </li>
            ))}
          </ul>

          {/* company photos */}
          <div className="mt-8 flex items-end gap-3">
            <PhotoCard variant="notepad" alt="Кот-консультант CatOps с блокнотом" className="w-28 md:w-32" rotate="-6deg" />
            <PhotoCard variant="heroCoach" alt="Кот-коуч CatOps в костюме" className="w-32 md:w-40" rotate="3deg" />
            <PhotoCard variant="coach" alt="Кот-эксперт CatOps в очках" className="w-24 md:w-28" rotate="8deg" />
          </div>
        </div>

        {/* Right: template form */}
        <div className="rounded-3xl bg-card p-6 text-card-foreground md:p-8">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex h-full min-h-[320px] flex-col items-center justify-center text-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Clock className="h-7 w-7" />
              </span>
              <h3 className="mt-5 text-xl font-semibold tracking-tight">{summit.noticeTitle}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {summit.noticeBody}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false)
                  setForm({ catName: "", email: "" })
                }}
                className="mt-6 text-sm font-medium text-primary hover:underline"
              >
                Понятно
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-semibold tracking-tight">Записать кота в лист ожидания</h3>
              <p className="text-sm text-muted-foreground">Оставьте контакт — сообщим, когда откроем запись.</p>
              <Field
                label="Имя кота"
                id="catName"
                value={form.catName}
                onChange={(v) => update("catName", v)}
                placeholder="Барсик"
              />
              <Field
                label="Email человека"
                id="email"
                type="email"
                value={form.email}
                onChange={(v) => update("email", v)}
                placeholder="human@example.com"
              />
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                В лист ожидания
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function PhotoCard({
  variant,
  alt,
  className,
  rotate,
}: {
  variant: "notepad" | "heroCoach" | "coach"
  alt: string
  className?: string
  rotate?: string
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-background/10 bg-background shadow-lg ${className ?? ""}`}
      style={{ transform: `rotate(${rotate ?? "0deg"})` }}
    >
      <CatImage variant={variant} alt={alt} width={320} height={320} className="aspect-square h-auto w-full object-cover" />
    </div>
  )
}

function Field({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string
  id: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
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
        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-ring/30"
      />
    </div>
  )
}
