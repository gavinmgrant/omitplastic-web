"use client"
import { FC, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useUser } from "@stackframe/stack"
import { productType } from "@/types"
import ProductCard from "@/components/product-card"
import { searchProducts, type PaginatedResult } from "@/actions/searchAction"
import { getFavoritesByUserId } from "@/actions/favoriteAction"
import { Spinner } from "@/components/ui/spinner"
import SkeletonProductCards from "@/components/skeleton-product-cards"

const PRODUCTS_PER_PAGE = 12

const Products: FC = () => {
  const [results, setResults] = useState<productType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
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
      setIsLoading(true)
      setCurrentPage(1)
      const result = await searchProducts(query || "", {
        page: 1,
        limit: PRODUCTS_PER_PAGE,
      })

      if (result && "pagination" in result) {
        const paginatedResult = result as PaginatedResult<productType>
        setResults(paginatedResult.data)
        setHasMore(paginatedResult.pagination.hasMore)
        setTotalResults(paginatedResult.pagination.total)
      } else {
        setResults(result as productType[])
        setHasMore(false)
        setTotalResults(result.length)
      }
      setIsLoading(false)
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

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return

    setIsLoadingMore(true)
    const nextPage = currentPage + 1
    const result = await searchProducts(query || "", {
      page: nextPage,
      limit: PRODUCTS_PER_PAGE,
    })

    if (result && "pagination" in result) {
      const paginatedResult = result as PaginatedResult<productType>
      setResults((prev) => [...prev, ...paginatedResult.data])
      setHasMore(paginatedResult.pagination.hasMore)
      setCurrentPage(nextPage)
    }
    setIsLoadingMore(false)
  }

  useEffect(() => {
    const sentinel = document.getElementById("scroll-sentinel")
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting && hasMore && !isLoadingMore) {
          handleLoadMore()
        }
      },
      { rootMargin: "200px" } // start loading before hitting bottom
    )

    observer.observe(sentinel)

    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, isLoadingMore])

  return (
    <>
      <div className="pb-4 text-sm">
        {results.length > 0 && !isLoading ? (
          <div>
            {query ? (
              <p>
                Showing {totalResults} results for &quot;
                <span className="font-semibold">{query}</span>&quot;
              </p>
            ) : (
              <p>Showing all {totalResults} products</p>
            )}
          </div>
        ) : (
          <div className="h-5">{isLoading && "Loading products..."}</div>
        )}
      </div>
      <div className="relative w-full gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-full">
        {isLoading ? (
          <SkeletonProductCards />
        ) : (
          results?.map((product) => (
            <ProductCard
              key={product.id}
              product={product as productType}
              isFavorite={favoriteProductIds.has(product.id)}
              onFavoriteChange={handleFavoriteChange}
              isLoggedIn={user?.id ? true : false}
            />
          ))
        )}
        {results.length === 0 && !isLoading && (
          <div className="flex items-center justify-center min-h-[calc(100vh-120px)] w-full absolute top-0 left-0 text-center">
            <p className="text-stone-700">
              No results found for &quot;
              <span className="font-semibold">{query}</span>&quot;, try again
              with a different query.
            </p>
          </div>
        )}
      </div>
      {hasMore && <div id="scroll-sentinel" className="h-10"></div>}
      {isLoadingMore && (
        <div className="h-10 flex items-center justify-center">
          <div className="flex items-center justify-center gap-2">
            <Spinner className="w-6 h-6" />
            <p>Loading...</p>
          </div>
        </div>
      )}
    </>
  )
}

export default Products
