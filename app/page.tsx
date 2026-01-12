import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Logos } from "@/components/logos"
import { HowItWorks } from "@/components/how-it-works"
import { WhyCalDate } from "@/components/why-cal-date"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"
import { OnboardingCheck } from "@/components/onboarding/onboarding-check"

export default function Home() {
  return (
    <OnboardingCheck>
      <main className="min-h-screen">
        <Navbar />
        <Hero />
        <Logos />
        <HowItWorks />
        <WhyCalDate />
        <CTA />
        <Footer />
      </main>
    </OnboardingCheck>
  )
}
