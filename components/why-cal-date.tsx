import { Zap, Shield, Lightbulb, Calendar, Sparkles, MessageCircle, Check } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Zero Friction",
    description: 'No "are you free next Tuesday?" Just click, book, done.',
  },
  {
    icon: Shield,
    title: "Less Awkward",
    description: "Share a link. They decide everything. No pressure.",
  },
  {
    icon: Lightbulb,
    title: "Memorable First Impression",
    description: "Stand out with a personalized page, not a boring bio.",
  },
]

const highlights = [
  { icon: Calendar, text: "Direct calendar integration" },
  { icon: Sparkles, text: "Personalized landing pages" },
  { icon: MessageCircle, text: "No endless messaging" },
]

export function WhyCalDate() {
  return (
    <section id="features" className="py-16 sm:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-start lg:items-center">
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">Why cal.date</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-balance">
                Dating introductions, reimagined
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                The current way of setting people up is broken. We built something better.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="flex gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-foreground flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-background" />
                    </div>
                    <div className="space-y-0.5 sm:space-y-1">
                      <h3 className="font-semibold text-sm sm:text-base">{feature.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-6 sm:space-y-8">
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold">Everything you need</h3>
              
              <div className="space-y-3 sm:space-y-4">
                {highlights.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div key={index} className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-foreground/10 flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground/70" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium">{item.text}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="border-t border-border pt-4 sm:pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {["Professional presentation", "Easy sharing", "Instant confirmation", "Privacy focused"].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs sm:text-sm">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
