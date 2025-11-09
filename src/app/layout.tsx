import type { Metadata } from "next"
import Link from "next/link"
import { StackProvider, StackTheme } from "@stackframe/stack"
import { stackClientApp } from "@/stack/client"
import { Geist, Geist_Mono, Fredoka } from "next/font/google"
import { Button } from "@/components/ui/button"
import SearchInput from "@/components/search-input"
import { cn } from "@/lib/utils"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "OmitPlastic",
  description:
    "Find plastic free products and those with plastic free packaging",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} p-4 relative`}
      >
        <StackProvider app={stackClientApp}>
          <StackTheme>
            <header className="mb-4 flex items-center justify-between gap-4">
              <Link
                href="/"
                className={cn(
                  "text-xl sm:text-2xl font-semibold",
                  fredoka.className
                )}
              >
                OmitPlastic
              </Link>
              <div className="flex items-center gap-4 w-full sm:w-[400px] justify-end">
                <div className="w-full! sm:w-[300px]">
                  <SearchInput />
                </div>
                <Link href="/products" className="hidden md:block">
                  <Button variant="outline" size="sm">
                    All Products
                  </Button>
                </Link>
              </div>
            </header>
            <main className="min-h-[calc(100vh-80px)]">{children}</main>
          </StackTheme>
        </StackProvider>
        <footer className="text-center text-sm pt-6">
          <p className="bg-white px-2.5 py-1.5 rounded-md text-xs relative z-10 max-w-fit mx-auto">
            &copy; {new Date().getFullYear()}{" "}
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
        </footer>
      </body>
    </html>
  )
}
