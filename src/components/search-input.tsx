"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchInputProps {
  expanded?: boolean
  disableExpand?: boolean
  placeholder?: string
  padding?: string
}

const SearchInput = ({
  expanded = false,
  disableExpand = false,
  placeholder = "Search",
  padding = "px-4 py-3.5",
}: SearchInputProps) => {
  const [isExpanded, setIsExpanded] = useState(expanded)
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSearch = () => {
    if (!query.trim() && !disableExpand) {
      setIsExpanded(!isExpanded)
    } else {
      const params = new URLSearchParams(searchParams.toString())
      params.set("q", query)
      // Preserve category param if it exists
      router.push(`/products?${params.toString()}`)
    }
  }

  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus()
    }
  }, [isExpanded])

  useEffect(() => {
    setTimeout(() => {
      if (!searchParams.get("q")) {
        setQuery("")
      }
    }, 0)
  }, [searchParams])

  return (
    <form
      className="relative"
      id="search-form"
      onSubmit={(e) => {
        e.preventDefault()
        handleSearch()
      }}
    >
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={cn(isExpanded ? "block" : "hidden", padding)}
      />
      <Search
        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5 cursor-pointer"
        onClick={handleSearch}
      />
    </form>
  )
}

export default SearchInput
