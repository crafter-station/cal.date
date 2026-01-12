"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Heart } from "lucide-react"

export function CTA() {
  return (
    <section className="py-16 sm:py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-foreground" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_var(--love-pink)_0%,_transparent_50%)] opacity-20" />
      
      <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 relative z-10 px-2">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-background/10 mx-auto flex items-center justify-center">
          <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-background fill-background/20" />
        </div>
        
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-balance leading-tight text-background">
          Ready to revolutionize how you connect people?
        </h2>

        <p className="text-base sm:text-lg text-background/70 max-w-2xl mx-auto leading-relaxed">
          We're building this out right now. If you're interested in getting a cal.date page for yourself or someone you know, let us know.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 sm:pt-4">
          <Button size="lg" variant="secondary" className="rounded-full px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base group w-full sm:w-auto" asChild>
            <a href="mailto:hello@cal.date">
              Request Early Access
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </Button>
        </div>

        <p className="text-xs sm:text-sm text-background/50 pt-2 sm:pt-4">Currently working with friends and early adopters</p>
      </div>
    </section>
  )
}
