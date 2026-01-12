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
    <footer className="py-16 px-4 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2 space-y-4">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                <Heart className="w-4 h-4 text-background fill-background" />
              </div>
              <span className="font-display text-lg font-semibold tracking-tight">cal.date</span>
            </a>
            <p className="text-sm text-muted-foreground max-w-xs">
              Making dating introductions delightful, one link at a time.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} cal.date. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with love for meaningful connections
          </p>
        </div>
      </div>
    </footer>
  )
}
