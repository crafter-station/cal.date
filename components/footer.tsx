import { Heart } from "lucide-react"

const links = {
  product: [
    { label: "How it works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
  ],
  company: [
    { label: "Contact", href: "mailto:hello@cal.date" },
    { label: "Privacy", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="py-12 sm:py-16 px-4 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-8 sm:gap-12 grid-cols-2 md:grid-cols-4">
          <div className="col-span-2 space-y-3 sm:space-y-4">
            <a href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-foreground flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-background fill-background" />
              </div>
              <span className="font-display text-base sm:text-lg font-semibold tracking-tight">cal.date</span>
            </a>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xs">
              Making dating introductions delightful, one link at a time.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-xs sm:text-sm font-semibold">Product</h4>
            <ul className="space-y-2 sm:space-y-3">
              {links.product.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-xs sm:text-sm font-semibold">Company</h4>
            <ul className="space-y-2 sm:space-y-3">
              {links.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
          <p className="text-xs sm:text-sm text-muted-foreground">
            © {new Date().getFullYear()} cal.date. All rights reserved.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Built with love for meaningful connections
          </p>
        </div>
      </div>
    </footer>
  )
}
