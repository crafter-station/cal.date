"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-[90vh] sm:min-h-[85vh] flex items-center justify-center px-4 pt-20 sm:pt-24 pb-8 sm:pb-12 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--love-pink-light)_0%,_transparent_50%)] opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_var(--love-pink-light)_0%,_transparent_40%)] opacity-30" />
      
      <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 relative z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-semibold tracking-tight text-balance leading-[1.1] animate-fade-in opacity-0 px-2">
          Make Dating Fun Again
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in stagger-1 opacity-0 px-2">
          A fully customizable dating platform for connecting people through direct calendar booking. 
          No more awkward introductions or endless messaging.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 sm:pt-4 animate-fade-in stagger-2 opacity-0 px-4">
          <Button size="lg" className="rounded-full px-6 h-11 sm:h-12 text-sm sm:text-base gap-2 group w-full sm:w-auto" asChild>
            <a href="mailto:hello@cal.date">
              Get Your Page
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-6 h-11 sm:h-12 text-sm sm:text-base bg-transparent w-full sm:w-auto" asChild>
            <a href="#how-it-works">See How It Works</a>
          </Button>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground pt-2 animate-fade-in stagger-3 opacity-0">
          Currently in early access with friends and early adopters
        </p>
      </div>
    </section>
  )
}
