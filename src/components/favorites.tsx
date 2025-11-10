"use client"
import { useEffect, useState, useRef } from "react"
import { useUser } from "@stackframe/stack"
import { getFavoritesByUserId } from "@/actions/favoriteAction"
import { getProductById } from "@/actions/productAction"
import ProductCard from "@/components/product-card"
import { favoriteType, productType } from "@/types"

const Favorites = () => {
  const [favorites, setFavorites] = useState<favoriteType[]>([])
  const [products, setProducts] = useState<productType[]>([])
  const [loading, setLoading] = useState(false)
  const isInitialMount = useRef(true)
  const user = useUser()

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
      setLoading(true)
      const products = await Promise.all(
        favorites.map(async (favorite) => {
          const product = await getProductById(favorite.productId)
          return product as productType
        })
      )
      setProducts(products)
      setLoading(false)
    }
    fetchProducts()
  }, [favorites])

  return (
    <div className="relative w-full gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-full">
      {products.length === 0 && !loading && (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] w-full absolute top-0 left-0 text-center">
          <p className="text-stone-700">No favorites found</p>
        </div>
      )}
      {products.length > 0 &&
        !loading &&
        products?.map((product) => {
          return (
            <div key={product.id}>
              <ProductCard product={product as productType} />
            </div>
          )
        })}
    </div>
  )
}

export default Favorites
