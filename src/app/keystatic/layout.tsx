import { notFound } from "next/navigation"

import KeystaticApp from "./keystatic"

export default function KeystaticLayout() {
  if (process.env.NODE_ENV === "production") {
    notFound()
  }

  return <KeystaticApp />
}

