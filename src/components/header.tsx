import { Suspense } from "react"
import Link from "next/link"
import HeaderAuth from "@/components/header-auth"

const Header = () => {
  return (
    <header className="p-4 -mx-4 flex items-center justify-between gap-4 fixed top-0 left-4 right-4 z-50 backdrop-blur-md">
      <Link href="/" className="text-xl sm:text-2xl font-semibold">
        OmitPlastic
      </Link>
      <Suspense fallback={<div className="w-8 h-8"></div>}>
        <HeaderAuth />
      </Suspense>
    </header>
  )
}

export default Header
