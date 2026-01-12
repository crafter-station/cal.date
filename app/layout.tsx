import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
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
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
