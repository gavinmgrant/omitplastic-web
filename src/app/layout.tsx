import { Suspense } from "react"
import type { Metadata } from "next"
import { StackProvider, StackTheme } from "@stackframe/stack"
import { stackClientApp } from "@/stack/client"
import { Geist, Geist_Mono } from "next/font/google"
import Header from "@/components/header"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
            <Suspense fallback={<div className="h-8 w-full mb-4"></div>}>
              <Header />
            </Suspense>
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
