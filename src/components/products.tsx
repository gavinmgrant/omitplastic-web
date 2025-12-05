"use client"
import { FC, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useUser } from "@stackframe/stack"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { categoryOptions } from "@/config/categories"
import SkeletonProductCards from "@/components/skeleton-product-cards"
import SearchInput from "@/components/search-input"
import { useSearchProducts } from "@/hooks/use-products"
import { useFavorites } from "@/hooks/use-favorites"
import { productType } from "@/types"

const Products: FC = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q")
  const categorySlug = searchParams.get("category")
  const user = useUser()
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useSearchProducts(query || "", categorySlug || undefined)
  const { data: favoritesData } = useFavorites(user?.id)

  const products = data?.pages.flatMap((page) => page.data) || []
  const totalResults = data?.pages[0]?.pagination.total || 0
  const favoriteProductIds = new Set(
    favoritesData?.favorites
      .map((f) => f.productId)
      .filter((id): id is string => id !== null && id !== undefined) || []
  )

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === "all") {
      params.delete("category")
      params.delete("q")
      router.push("/products")
    } else {
      params.set("category", value)
    }

    params.delete("page")

    router.push(`/products?${params.toString()}`)
  }

  // Infinite scroll with Intersection Observer
  useEffect(() => {
    const sentinel = document.getElementById("scroll-sentinel")
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { rootMargin: "200px" } // start loading before hitting bottom
    )

    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <>
      <div className="pb-4 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-0 sm:gap-2">
        {products.length > 0 && !isLoading ? (
          <div>
            {query && categorySlug && categorySlug !== "all" ? (
              <p>
                Showing {totalResults} results for &quot;
                <span className="font-semibold">{query}</span>&quot; in{" "}
                <span className="font-semibold">
                  {categoryOptions.find((c) => c.value === categorySlug)?.label}
                </span>
              </p>
            ) : query ? (
              <p>
                Showing {totalResults} results for &quot;
                <span className="font-semibold">{query}</span>&quot;
              </p>
            ) : categorySlug && categorySlug !== "all" ? (
              <p>
                Showing {totalResults} products in{" "}
                <span className="font-semibold">
                  {categoryOptions.find((c) => c.value === categorySlug)?.label}
                </span>
              </p>
            ) : (
              <p>Showing all {totalResults} products</p>
            )}
          </div>
        ) : (
          <div className="h-5">{isLoading && "Loading products..."}</div>
        )}

        <div className="block sm:hidden py-2 w-full">
          <SearchInput expanded />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <p className="hidden sm:block">Category:</p>
          <Select
            value={categorySlug || "all"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-full sm:w-[188px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={2}>
              {categoryOptions.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="relative w-full gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 h-full">
        {isLoading ? (
          <SkeletonProductCards />
        ) : (
          products?.map((product) => (
            <ProductCard
              key={product.id}
              product={product as productType}
              isFavorite={favoriteProductIds.has(product.id)}
              isLoggedIn={user?.id ? true : false}
            />
          ))
        )}
        {products.length === 0 && !isLoading && (
          <div className="flex items-center justify-center min-h-[calc(100vh-128px)] w-full absolute top-0 left-0 text-center">
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 space-y-4">
              <p className="text-muted-foreground">
                {query && categorySlug && categorySlug !== "all" ? (
                  <>
                    No results found for &quot;
                    <span className="font-semibold">{query}</span>&quot; in{" "}
                    <span className="font-semibold">
                      {
                        categoryOptions.find((c) => c.value === categorySlug)
                          ?.label
                      }
                    </span>
                    . Try a different query or category.
                  </>
                ) : query ? (
                  <>
                    No results found for &quot;
                    <span className="font-semibold">{query}</span>&quot;. Try
                    again with a different query.
                  </>
                ) : categorySlug && categorySlug !== "all" ? (
                  <>
                    No products found in{" "}
                    <span className="font-semibold">
                      {
                        categoryOptions.find((c) => c.value === categorySlug)
                          ?.label
                      }
                    </span>
                    . Try selecting a different category.
                  </>
                ) : (
                  "No products found."
                )}
              </p>
              <Link href="/products">
                <Button>View All Products</Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {hasNextPage && <div id="scroll-sentinel" className="h-10"></div>}
      {isFetchingNextPage && (
        <div className="h-10 flex items-center justify-center">
          <div className="flex items-center justify-center gap-2">
            <Spinner className="w-6 h-6" />
            <p>Loading more products...</p>
          </div>
        </div>
      )}
    </>
  )
}

export default Products
