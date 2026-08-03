import { Cat } from "lucide-react"
import site from "@/data/site.json"

const { footer, brand } = site

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
                <Cat className="h-5 w-5" />
              </span>
              <span className="text-lg font-semibold tracking-tight">{brand.name}</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {footer.description}
            </p>
            <a
              href={`mailto:${brand.email}`}
              className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
            >
              {brand.email}
            </a>
          </div>

          {footer.columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-foreground">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">{footer.copyright}</p>
          <div className="flex gap-5">
            <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              Политика мурлыканья
            </a>
            <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              Условия обнимашек
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
