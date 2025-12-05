"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useUser } from "@stackframe/stack"
import { Frown } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import SkeletonProductCards from "@/components/skeleton-product-cards"
import { useFavorites } from "@/hooks/use-favorites"
import { productType } from "@/types"

const Favorites = () => {
  const user = useUser()
  const { data: favoritesData, isLoading } = useFavorites(user?.id)
  const products = useMemo(() => {
    const unsortedProducts = favoritesData?.products || []
    return [...unsortedProducts].sort((a, b) => {
      return (
        (b.createdAt ?? new Date()).getTime() -
        (a.createdAt ?? new Date()).getTime()
      )
    })
  }, [favoritesData?.products])

  const favorites = favoritesData?.favorites || []
  const favoriteProductIds = new Set(
    favorites
      .map((f) => f.productId)
      .filter((id): id is string => id !== null && id !== undefined)
  )

  return (
    <>
      <div className="pb-4 text-sm h-12 flex items-center justify-start">
        {isLoading ? (
          <p>Loading favorites...</p>
        ) : (
          favorites.length > 0 && (
            <p>
              Your {favorites.length}{" "}
              {favorites.length > 1 ? "favorites" : "favorite"}
            </p>
          )
        )}
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
            <div className="space-y-4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="flex items-center gap-2">
                <p>No favorites found.</p>
                <Frown className="size-6" />
              </div>
              <Link href="/products">
                <Button>View Products</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Favorites
