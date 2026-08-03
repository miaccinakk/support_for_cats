"use client"

import { motion } from "framer-motion"
import {
  Award,
  Laptop,
  HeartHandshake,
  Compass,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react"

import site from "@/data/site.json"

const { features } = site

const ICONS: Record<string, LucideIcon> = {
  Award,
  Laptop,
  HeartHandshake,
  Compass,
  ShieldCheck,
  Sparkles,
}

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-primary">{features.eyebrow}</p>
        <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          {features.title}
        </h2>
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
          {features.subtitle}
        </p>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.items.map((item, i) => {
          const Icon = ICONS[item.icon] ?? Sparkles
          return (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.06 }}
              className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
