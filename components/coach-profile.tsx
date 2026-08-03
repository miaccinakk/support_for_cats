"use client"

import { motion } from "framer-motion"
import { BadgeCheck, Trophy, Wrench } from "lucide-react"

import { CatImage } from "@/components/cat-image"
import site from "@/data/site.json"

const { coach } = site

export function CoachProfile() {
  return (
    <section id="coach" className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          {/* Profile card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-border bg-card p-6 md:p-8"
          >
            <div className="flex items-center gap-4">
              <CatImage
                variant="coach"
                alt={`Портрет кота-эксперта ${coach.name}`}
                width={112}
                height={112}
                className="h-20 w-20 rounded-2xl object-cover md:h-24 md:w-24"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xl font-semibold tracking-tight">{coach.name}</h3>
                  <BadgeCheck className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">{coach.role}</p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{coach.bio}</p>

            <dl className="mt-6 grid grid-cols-3 gap-3">
              {coach.metrics.map((m) => (
                <div key={m.label} className="rounded-xl bg-muted p-3 text-center">
                  <dt className="text-lg font-semibold tracking-tight text-foreground">{m.value}</dt>
                  <dd className="mt-1 text-[11px] leading-tight text-muted-foreground">{m.label}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6">
              <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <Wrench className="h-3.5 w-3.5" /> Любимые инструменты
              </p>
              <div className="flex flex-wrap gap-2">
                {coach.tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Achievements + certificates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-sm font-medium text-primary">{coach.eyebrow}</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              Не просто кот. Специалист с историей.
            </h2>

            <ul className="mt-8 space-y-4">
              {coach.achievements.map((a) => (
                <li key={a} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Trophy className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm leading-relaxed text-foreground">{a}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Сертификаты
              </p>
              <div className="flex flex-wrap gap-2">
                {coach.certificates.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground"
                  >
                    <BadgeCheck className="h-3.5 w-3.5 text-accent" />
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
