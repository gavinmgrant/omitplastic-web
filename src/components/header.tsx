"use client"
import { useUser } from "@stackframe/stack"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Fredoka } from "next/font/google"
import { UserRound, LogOut, Heart, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import SearchInput from "@/components/search-input"

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

const Header = () => {
  const user = useUser()

  return (
    <header className="mb-4 flex items-center justify-between gap-4">
      <Link
        href="/"
        className={cn("text-xl sm:text-2xl font-semibold", fredoka.className)}
      >
        OmitPlastic
      </Link>
      <div className="flex items-center gap-2 w-full sm:w-[400px] justify-end">
        <div className="w-full! sm:w-[300px]">
          <SearchInput />
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/products" className="hidden md:block">
              <Button variant="outline" size="sm">
                <Layers className="size-4" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>All Products</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={user?.id ? "/handler/account-settings" : "/handler/sign-in"}
            >
              <Button variant="outline" size="sm">
                <UserRound className="size-4" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>{user?.id ? "Account Settings" : "Sign In"}</p>
          </TooltipContent>
        </Tooltip>

        {user?.id && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/favorites">
                  <Button variant="outline" size="sm">
                    <Heart className="size-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Favorites</p>
              </TooltipContent>
            </Tooltip>

            <div className="hidden sm:block">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/handler/sign-out">
                    <Button variant="outline" size="sm">
                      <LogOut className="size-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sign Out</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </>
        )}
      </div>
    </header>
  )
}

export default Header
