"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react"

import { CatImage } from "@/components/cat-image"
import site from "@/data/site.json"

const { hero } = site

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* soft warm ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-10%] h-[420px] w-[820px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(224,122,60,0.18), rgba(138,117,168,0.10), transparent)",
        }}
      />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-16 md:grid-cols-2 md:px-8 md:pb-24 md:pt-24">
        {/* Left: copy */}
        <div className="relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {hero.badge}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 text-pretty text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl"
          >
            {hero.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#assistant"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              {hero.primaryCta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              {hero.secondaryCta}
            </a>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="mt-10 grid max-w-md grid-cols-3 gap-6"
          >
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-2xl font-semibold tracking-tight text-foreground">{stat.value}</dt>
                <dd className="mt-1 text-xs leading-snug text-muted-foreground">{stat.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Right: cat + floating UI */}
        <div className="relative z-10 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="animate-float-slow overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
              <CatImage
                variant="hero"
                alt="Лео Supportovich — кот-эксперт технической поддержки CatOps"
                priority
                width={560}
                height={560}
                className="relative h-auto w-[280px] md:w-[380px]"
              />
            </div>

            {/* floating status cards */}
            {hero.floatingCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.15 }}
                className={[
                  "absolute flex items-center gap-2 rounded-xl border border-border bg-card/95 px-3 py-2 shadow-sm backdrop-blur",
                  i === 0 ? "left-[-8px] top-6 md:left-[-24px]" : "",
                  i === 1 ? "right-[-8px] top-1/3 md:right-[-28px]" : "",
                  i === 2 ? "-bottom-4 left-8 md:-bottom-5 md:left-12" : "",
                ].join(" ")}
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                <div className="leading-tight">
                  <p className="text-xs font-medium text-foreground">{card.title}</p>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{card.meta}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
