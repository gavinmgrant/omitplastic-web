"use client"

import { useUser } from "@stackframe/stack"
import Link from "next/link"
import { UserRound, LogOut, Heart, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import SearchInput from "@/components/search-input"

const Header = () => {
  const user = useUser()

  return (
    <header className="p-4 -mx-4 flex items-center justify-between gap-4 fixed top-0 left-4 right-4 z-50 backdrop-blur-md">
      <Link href="/" className="text-xl sm:text-2xl font-semibold">
        OmitPlastic
      </Link>
      <div className="flex items-center gap-2 sm:gap-3 w-full md:w-[400px] justify-end">
        <div className="hidden sm:block w-full md:w-[300px]">
          <SearchInput />
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/products">
              <Button variant="outline" size="sm">
                <Layers className="size-4" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Products</p>
          </TooltipContent>
        </Tooltip>

        {user?.id && (
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
        )}

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
        )}
      </div>
    </header>
  )
}

export default Header
