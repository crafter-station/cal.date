import { Calendar, Link2, Sparkles, Users } from "lucide-react"

const steps = [
  {
    icon: Users,
    number: "01",
    title: "We Create Your Page",
    description:
      "Tell us about someone interesting. We'll craft a beautiful, personalized landing page for them.",
  },
  {
    icon: Link2,
    number: "02",
    title: "Share the Link",
    description: 'No awkward intros. Just share: "Check out this person - name.date"',
  },
  {
    icon: Calendar,
    number: "03",
    title: "Direct Calendar Booking",
    description: "They browse, get interested, and book directly through integrated scheduling.",
  },
  {
    icon: Sparkles,
    number: "04",
    title: "Magic Happens",
    description: "The date is booked automatically. They meet. Something special might begin.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/50 to-transparent" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-16 px-2">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">How It Works</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-balance">
            Effortless connection in four steps
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            We've simplified the dating introduction process to its essentials.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div 
                key={index} 
                className="glass-card rounded-xl sm:rounded-2xl p-5 sm:p-6 space-y-3 sm:space-y-4 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-foreground/5 flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-foreground/70" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground/60">{step.number}</span>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <h3 className="font-semibold text-base sm:text-lg">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
