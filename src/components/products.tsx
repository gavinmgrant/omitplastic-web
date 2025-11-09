"use client"
import { FC, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { productType } from "@/types"
import ProductCard from "@/components/product-card"
import { searchProducts } from "@/actions/searchAction"

const Products: FC = () => {
  const [results, setResults] = useState<productType[]>([])
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const query = searchParams.get("q")

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      const results = await searchProducts(query || "")
      setResults(results as productType[])
      setLoading(false)
    }
    fetchResults()
  }, [query])

  return (
    <div className="relative w-full gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-full">
      {results?.map((product) => (
        <ProductCard key={product.id} product={product as productType} />
      ))}
      {results.length === 0 && !loading && (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] w-full absolute top-0 left-0 text-center">
          <p className="text-stone-700">
            No results found for &quot;
            <span className="font-semibold">{query}</span>&quot;, try again with
            a different query.
          </p>
        </div>
      )}
    </div>
  )
}

export default Products
