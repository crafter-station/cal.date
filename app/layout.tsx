import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { QueryProvider } from "@/components/providers/query-provider"
import { Button } from "@/components/ui/button"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://cal.date"),
  title: "cal.date | Make Dating Fun Again",
  description:
    "A fully customizable dating platform for connecting people through direct calendar booking. No more awkward intros.",
  openGraph: {
    title: "cal.date | Make Dating Fun Again",
    description: "A fully customizable dating platform for connecting people through direct calendar booking.",
    url: "https://cal.date",
    siteName: "cal.date",
    images: [
      {
        url: "https://www.cal.date/og.png",
        width: 1200,
        height: 630,
        alt: "cal.date - Make Dating Fun Again",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "cal.date | Make Dating Fun Again",
    description: "A fully customizable dating platform for connecting people through direct calendar booking.",
    images: ["https://www.cal.date/og-twitter.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#e85a77",
          colorText: "#1a1a1a",
          colorTextSecondary: "#6b7280",
          colorBackground: "#fafafa",
          colorInputBackground: "#ffffff",
          colorInputText: "#1a1a1a",
          borderRadius: "0.75rem",
          fontFamily: "Inter, system-ui, sans-serif",
        },
        elements: {
          formButtonPrimary:
            "bg-stone-900 hover:bg-stone-800 text-white shadow-sm hover:shadow-md rounded-full transition-all",
          card: "shadow-lg border border-stone-200/60 rounded-2xl",
          headerTitle: "font-display font-semibold text-stone-900",
          headerSubtitle: "text-stone-500",
          socialButtonsBlockButton:
            "border border-stone-200 hover:bg-stone-50 rounded-lg transition-all",
          formFieldInput:
            "border-stone-200 focus:border-stone-800 focus:ring-stone-800/20 rounded-lg",
          footerActionLink: "text-stone-900 hover:text-stone-700",
          identityPreviewEditButton: "text-stone-900 hover:text-stone-700",
          userButtonPopoverActionButton: "hover:bg-stone-100 rounded-lg",
          userButtonPopoverActionButtonText: "text-stone-700",
          userButtonPopoverFooter: "hidden",
          button: "bg-stone-900 hover:bg-stone-800 text-white rounded-full",
        },
      }}
    >
      <html lang="en">
        <body className={`${inter.variable} font-sans antialiased`}>
          <header className="fixed top-4 right-4 z-50">
            <SignedOut>
              <SignInButton mode="modal">
                <Button className="rounded-full bg-stone-900 text-white hover:bg-stone-800 shadow-sm hover:shadow-md transition-all">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          <QueryProvider>{children}</QueryProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
