import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { QueryProvider } from "@/components/providers/query-provider"
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
        url: "https://cal.date/og.png",
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
    images: ["https://cal.date/og-twitter.png"],
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
            "bg-[#e85a77] hover:bg-[#d14a67] text-white shadow-none",
          card: "shadow-lg border border-neutral-200",
          headerTitle: "font-semibold",
          headerSubtitle: "text-neutral-500",
          socialButtonsBlockButton:
            "border border-neutral-200 hover:bg-neutral-50",
          formFieldInput:
            "border-neutral-200 focus:border-[#e85a77] focus:ring-[#e85a77]/20",
          footerActionLink: "text-[#e85a77] hover:text-[#d14a67]",
          identityPreviewEditButton: "text-[#e85a77]",
          userButtonPopoverActionButton: "hover:bg-neutral-100",
          userButtonPopoverActionButtonText: "text-neutral-700",
          userButtonPopoverFooter: "hidden",
        },
      }}
    >
      <html lang="en">
        <body className={`${inter.variable} font-sans antialiased`}>
          <header className="fixed top-4 right-4 z-50">
            <SignedOut>
              <SignInButton mode="modal" />
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
