import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { CoachProfile } from "@/components/coach-profile"
import { AiAssistant } from "@/components/ai-assistant"
import { SummitForm } from "@/components/summit-form"
import { SiteFooter } from "@/components/site-footer"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <CoachProfile />
        <AiAssistant />
        <SummitForm />
      </main>
      <SiteFooter />
    </>
  )
}
