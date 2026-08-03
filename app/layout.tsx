import type { Metadata } from "next"
import { Geist, Instrument_Serif } from "next/font/google"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
})

export const metadata: Metadata = {
  title: "CatOps — AI-поддержка для котов в эпоху IT-перемен",
  description:
    "Первый AI-powered саппорт для котов, чьи IT-хозяева переживают увольнения, выгорание и смену работы. Найдите нового человека, сохраните текущего или просто переживите тяжёлые времена.",
  keywords: ["коты", "IT", "поддержка", "AI", "CatOps", "стартап"],
  openGraph: {
    title: "CatOps — AI-поддержка для котов",
    description: "Опытный кот-эксперт помогает пушистым пользователям пережить цифровую трансформацию.",
    type: "website",
  },
}

export const viewport = {
  themeColor: "#faf9f6",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${geist.variable} ${instrumentSerif.variable} bg-background`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
