"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchInputProps {
  expanded?: boolean
  placeholder?: string
  padding?: string
}

const SearchInput = ({
  expanded = false,
  placeholder = "Search...",
  padding = "p-4",
}: SearchInputProps) => {
  const [isExpanded, setIsExpanded] = useState(expanded)
  const [query, setQuery] = useState("")

  const router = useRouter()

  const handleSearch = () => {
    if (!query.trim()) {
      setIsExpanded(!isExpanded)
    } else {
      router.push(`/products?q=${query}`)
    }
  }

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
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={cn(isExpanded ? "block" : "hidden", padding)}
      />
      <Search
        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer"
        onClick={handleSearch}
      />
    </form>
  )
}

export default SearchInput
