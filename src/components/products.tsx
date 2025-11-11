"use client"
import { FC, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useUser } from "@stackframe/stack"
import { productType } from "@/types"
import ProductCard from "@/components/product-card"
import { searchProducts } from "@/actions/searchAction"
import { getFavoritesByUserId } from "@/actions/favoriteAction"

const Products: FC = () => {
  const [results, setResults] = useState<productType[]>([])
  const [loading, setLoading] = useState(false)
  const [favoriteProductIds, setFavoriteProductIds] = useState<Set<string>>(
    new Set()
  )
  const searchParams = useSearchParams()
  const query = searchParams.get("q")
  const user = useUser()

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.id) {
        setFavoriteProductIds(new Set())
        return
      }

      const favorites = await getFavoritesByUserId(user.id)
      const favoriteIds = new Set(
        favorites
          .map((f) => f.productId)
          .filter((id): id is string => id !== null && id !== undefined)
      )
      setFavoriteProductIds(favoriteIds)
    }

    fetchFavorites()
  }, [user?.id])

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      const results = await searchProducts(query || "")
      setResults(results as productType[])
      setLoading(false)
    }
    fetchResults()
  }, [query])

  const handleFavoriteChange = (productId: string, isFavorite: boolean) => {
    setFavoriteProductIds((prev) => {
      const newSet = new Set(prev)
      if (isFavorite) {
        newSet.add(productId)
      } else {
        newSet.delete(productId)
      }
      return newSet
    })
  }

  return (
    <>
      <div className="pb-4 text-sm">
        {results.length > 0 && !loading ? (
          <div>
            {query ? (
              <p>
                {results.length} results found for &quot;
                <span className="font-semibold">{query}</span>&quot;
              </p>
            ) : (
              <p>All {results.length} products</p>
            )}
          </div>
        ) : (
          <div className="h-5">
            {results.length > 0 && "Searching for products..."}
          </div>
        )}
      </div>
      <div className="relative w-full gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-full">
        {results?.map((product) => (
          <ProductCard
            key={product.id}
            product={product as productType}
            isFavorite={favoriteProductIds.has(product.id)}
            onFavoriteChange={handleFavoriteChange}
            isLoggedIn={user?.id ? true : false}
          />
        ))}
        {results.length === 0 && !loading && (
          <div className="flex items-center justify-center min-h-[calc(100vh-80px)] w-full absolute top-0 left-0 text-center">
            <p className="text-stone-700">
              No results found for &quot;
              <span className="font-semibold">{query}</span>&quot;, try again
              with a different query.
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default Products
