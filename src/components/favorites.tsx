"use client"
import { useEffect, useState, useRef, useMemo } from "react"
import Link from "next/link"
import { useUser } from "@stackframe/stack"
import { HeartCrack } from "lucide-react"
import { getFavoritesByUserId } from "@/actions/favoriteAction"
import { getProductsByIds } from "@/actions/productAction"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { favoriteType, productType } from "@/types"

const Favorites = () => {
  const [favorites, setFavorites] = useState<favoriteType[]>([])
  const [products, setProducts] = useState<productType[]>([])
  const [loading, setLoading] = useState(false)
  const isInitialMount = useRef(true)
  const user = useUser()

  const favoriteProductIds = useMemo(() => {
    return new Set(favorites.map((f) => f.productId))
  }, [favorites])

  useEffect(() => {
    const fetchFavorites = async () => {
      isInitialMount.current = false
      setLoading(true)
      const results = await getFavoritesByUserId(user?.id || "")
      setFavorites(results as favoriteType[])
      setLoading(false)
    }
    if (user?.id && isInitialMount.current) fetchFavorites()
  }, [user?.id, favorites.length])

  useEffect(() => {
    const fetchProducts = async () => {
      if (favorites.length === 0) {
        setProducts([])
        setLoading(false)
        return
      }

      setLoading(true)
      const productIds = favorites.map((favorite) => favorite.productId)
      const products = await getProductsByIds(productIds)
      setProducts(products)
      setLoading(false)
    }

    fetchProducts()
  }, [favorites])

  const handleFavoriteChange = (productId: string, isFavorite: boolean) => {
    if (!isFavorite) {
      setFavorites((prev) => prev.filter((f) => f.productId !== productId))
      setProducts((prev) => prev.filter((p) => p.id !== productId))
    }
  }

  return (
    <div className="relative w-full gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-full">
      {products.length === 0 && !loading && (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] w-full absolute top-0 left-0 text-center">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <p className="text-red-700">No favorites found.</p>
              <HeartCrack className="size-5 text-red-700" />
            </div>
            <Link href="/products">
              <Button>View Products</Button>
            </Link>
          </div>
        </div>
      )}
      {products.length > 0 &&
        !loading &&
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
  )
}

export default Favorites
