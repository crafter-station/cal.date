"use client"

import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { GithubLogo } from "@/components/logos/github"
import { useEffect, useState } from "react"

export function Navbar() {
  const [githubStars, setGithubStars] = useState<number | null>(null)

  useEffect(() => {
    const fetchGithubStars = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/crafter-station/cal.date",
        )
        if (response.ok) {
          const data = await response.json()
          setGithubStars(data.stargazers_count)
        }
      } catch (error) {
        console.warn("Failed to fetch GitHub stars:", error)
      }
    }
    fetchGithubStars()
  }, [])

  return (
    <header className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
      <nav className="glass-card rounded-full px-4 py-2.5 flex items-center justify-between shadow-sm">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
            <Heart className="w-4 h-4 text-background fill-background" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">cal.date</span>
        </a>

        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
            How it works
          </a>
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/crafter-station/cal.date"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border hover:bg-muted transition-colors"
          >
            <GithubLogo className="w-4 h-4" variant="invertocat" />
            {githubStars !== null && (
              <span className="text-sm font-medium flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-yellow-500"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                {githubStars}
              </span>
            )}
          </a>
          <Button size="sm" className="rounded-full px-4 h-9 hidden sm:flex" asChild>
            <a href="mailto:hello@cal.date">Get Started</a>
          </Button>
        </div>
      </nav>
    </header>
  )
}
