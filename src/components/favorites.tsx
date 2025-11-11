"use client"
import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { useUser } from "@stackframe/stack"
import { Frown } from "lucide-react"
import { getFavoritesByUserId } from "@/actions/favoriteAction"
import { getProductsByIds } from "@/actions/productAction"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { favoriteType, productType } from "@/types"

const Favorites = () => {
  const [favorites, setFavorites] = useState<favoriteType[]>([])
  const [products, setProducts] = useState<productType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const user = useUser()

  const favoriteProductIds = useMemo(() => {
    return new Set(favorites.map((f) => f.productId))
  }, [favorites])

  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true)

      if (!user?.id) {
        setFavorites([])
        setProducts([])
        setIsLoading(false)
        return
      }

      try {
        const favoritesData = await getFavoritesByUserId(user.id)
        setFavorites(favoritesData as favoriteType[])

        if (favoritesData.length > 0) {
          const productIds = favoritesData
            .map((f) => f.productId)
            .filter((id): id is string => id !== null && id !== undefined)
          const productsData = await getProductsByIds(productIds)
          setProducts(productsData)
        } else {
          setProducts([])
        }
      } catch (error) {
        console.error("Error loading favorites:", error)
        setFavorites([])
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    loadFavorites()
  }, [user?.id])

  const handleFavoriteChange = (productId: string, isFavorite: boolean) => {
    if (!isFavorite) {
      setFavorites((prev) => prev.filter((f) => f.productId !== productId))
      setProducts((prev) => prev.filter((p) => p.id !== productId))
    }
  }

  return (
    <>
      <div className="pb-4 text-sm">
        {isLoading ? (
          <p>Loading favorites...</p>
        ) : (
          <p>
            Your {products.length}{" "}
            {favorites.length > 1 ? "favorites" : "favorite"}
          </p>
        )}
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] w-full absolute top-0 left-0 text-center"></div>
      ) : (
        <div className="relative w-full gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-full">
          {products.length === 0 && (
            <div className="flex items-center justify-center min-h-[calc(100vh-80px)] w-full absolute top-0 left-0 text-center">
              <div className="space-y-4">
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
          {products.length > 0 &&
            products?.map((product) => {
              return (
                <div key={product.id}>
                  <ProductCard
                    product={product as productType}
                    isFavorite={favoriteProductIds.has(product.id)}
                    onFavoriteChange={handleFavoriteChange}
                  />
                </div>
              )
            })}
        </div>
      )}
    </>
  )
}

export default Favorites
