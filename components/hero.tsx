"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-4 pt-24 pb-12 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--love-pink-light)_0%,_transparent_50%)] opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_var(--love-pink-light)_0%,_transparent_40%)] opacity-30" />
      
      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-semibold tracking-tight text-balance leading-[1.1] animate-fade-in opacity-0">
          Make Dating Fun Again
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in stagger-1 opacity-0">
          A fully customizable dating platform for connecting people through direct calendar booking. 
          No more awkward introductions or endless back-and-forth messaging.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 animate-fade-in stagger-2 opacity-0">
          <Button size="lg" className="rounded-full px-6 h-12 text-base gap-2 group" asChild>
            <a href="mailto:hello@cal.date">
              Get Your Page
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-6 h-12 text-base bg-transparent" asChild>
            <a href="#how-it-works">See How It Works</a>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground pt-2 animate-fade-in stagger-3 opacity-0">
          Currently in early access with friends and early adopters
        </p>
      </div>
    </section>
  )
}
