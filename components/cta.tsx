"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Heart } from "lucide-react"

export function CTA() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-foreground" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_var(--love-pink)_0%,_transparent_50%)] opacity-20" />
      
      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-background/10 mx-auto flex items-center justify-center">
          <Heart className="w-8 h-8 text-background fill-background/20" />
        </div>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-balance leading-tight text-background">
          Ready to revolutionize how you connect people?
        </h2>

        <p className="text-lg text-background/70 max-w-2xl mx-auto leading-relaxed">
          We're building this out right now. If you're interested in getting a cal.date page for yourself or someone you know, let us know.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button size="lg" variant="secondary" className="rounded-full px-8 h-12 text-base group" asChild>
            <a href="mailto:hello@cal.date">
              Request Early Access
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </Button>
        </div>

        <p className="text-sm text-background/50 pt-4">Currently working with friends and early adopters</p>
      </div>
    </section>
  )
}
