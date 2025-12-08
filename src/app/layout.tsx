import { Suspense } from "react"
import Link from "next/link"
import type { Metadata } from "next"
import { GoogleAnalytics } from "@next/third-parties/google"
import { StackProvider, StackTheme } from "@stackframe/stack"
import { QueryProvider } from "@/providers/query-provider"
import { stackClientApp } from "@/stack/client"
import { Lexend } from "next/font/google"
import Header from "@/components/header"
import { cn } from "@/lib/utils"
import "./globals.css"

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "OmitPlastic - Buying less plastic means less plastic waste",
  description:
    "Buying less plastic means less plastic waste. Find products that use less or no plastic. Search by keyword or select a category to get started.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="overscroll-none">
      <body
        className={cn("relative w-screen overflow-x-hidden", lexend.className)}
      >
        <QueryProvider>
          <StackProvider app={stackClientApp}>
            <StackTheme>
              <Suspense
                fallback={
                  <div className="h-12 w-full mb-4 fixed top-0 left-4 right-4"></div>
                }
              >
                <Header />
              </Suspense>
              <main className="min-h-dvh px-4 pb-4 pt-16">{children}</main>
            </StackTheme>
          </StackProvider>
        </QueryProvider>
        <footer className="py-6 px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <Link
            href="/guides"
            className="text-primary hover:border-b border-primary"
          >
            Guides
          </Link>
          <div className="flex flex-col justify-end items-end gap-1">
            <p>
              &copy; {new Date().getFullYear()}{" "}
              <Link
                href="/"
                className="text-primary hover:border-b border-primary"
              >
                OmitPlastic
              </Link>{" "}
              by{" "}
              <a
                href="https://gavingrant.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:border-b border-primary"
              >
                Gavin Grant
              </a>
              . All rights reserved.
            </p>
            <div className="flex items-center gap-2 h-4">
              <Link
                href="/privacy"
                className="text-primary hover:border-b border-primary h-4"
              >
                Privacy Policy
              </Link>
              <span className="text-primary">|</span>
              <Link
                href="/terms"
                className="text-primary hover:border-b border-primary h-4"
              >
                Terms of Service
              </Link>
              <span className="text-primary">|</span>
              <Link
                href="/cookies"
                className="text-primary hover:border-b border-primary h-4"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </footer>
      </body>
      <GoogleAnalytics
        gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ""}
      />
    </html>
  )
}
