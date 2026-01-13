"use client"

import { Button } from "@/components/ui/button"
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { Heart, Menu, X, Settings } from "lucide-react"
import { GithubLogo } from "@/components/logos/github"
import { useEffect, useState } from "react"
import Link from "next/link"

export function Navbar() {
  const [githubStars, setGithubStars] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
    <header className="fixed top-2 sm:top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1rem)] sm:w-full max-w-4xl px-0 sm:px-4">
      <nav className="glass-card rounded-2xl sm:rounded-full px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between shadow-sm">
        <a href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-foreground flex items-center justify-center">
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-background fill-background" />
          </div>
          <span className="font-display text-base sm:text-lg font-semibold tracking-tight">cal.date</span>
        </a>

        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
            How it works
          </a>
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <a
            href="https://github.com/crafter-station/cal.date"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full border border-border hover:bg-muted transition-colors"
          >
            <GithubLogo className="w-3.5 h-3.5 sm:w-4 sm:h-4" variant="invertocat" />
            {githubStars !== null && (
              <span className="text-xs sm:text-sm font-medium flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-yellow-500 sm:w-3 sm:h-3"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                {githubStars}
              </span>
            )}
          </a>
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="sm" className="rounded-full px-3 sm:px-4 h-8 sm:h-9 text-xs sm:text-sm hidden sm:flex">
                Get Started
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Button size="sm" className="rounded-full px-3 sm:px-4 h-8 sm:h-9 text-xs sm:text-sm hidden sm:flex gap-1.5" asChild>
              <Link href="/settings">
                <Settings className="w-3.5 h-3.5" />
                Settings
              </Link>
            </Button>
          </SignedIn>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden glass-card rounded-2xl mt-2 p-4 shadow-lg">
          <div className="flex flex-col gap-3">
            <a 
              href="#how-it-works" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it works
            </a>
            <a 
              href="#features" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <SignedOut>
              <SignInButton mode="modal">
                <Button size="sm" className="rounded-full w-full mt-2">
                  Get Started
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button size="sm" className="rounded-full w-full mt-2 gap-1.5" asChild>
                <Link href="/settings" onClick={() => setMobileMenuOpen(false)}>
                  <Settings className="w-3.5 h-3.5" />
                  Settings
                </Link>
              </Button>
            </SignedIn>
          </div>
        </div>
      )}
    </header>
  )
}
