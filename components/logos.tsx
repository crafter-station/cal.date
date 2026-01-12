const logos = [
  { name: "Crafter Station", url: "https://crafterstation.com" },
  { name: "Moraleja", url: "https://moraleja.co" },
  { name: "Kebo", url: "https://kebo.app" },
]

export function Logos() {
  return (
    <section className="py-12 px-4 border-y border-border bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Trusted by teams building the future
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {logos.map((logo) => (
            <a
              key={logo.name}
              href={logo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              <span className="text-lg md:text-xl font-semibold tracking-tight">{logo.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
