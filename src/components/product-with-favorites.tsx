"use client"
import { FC, useEffect, useState } from "react"
import { useUser } from "@stackframe/stack"
import { productType } from "@/types"
import Product from "@/components/product"
import { getFavoritesByUserId } from "@/actions/favoriteAction"

interface Props {
  product: productType
}

const ProductWithFavorites: FC<Props> = ({ product }) => {
  const [favoriteProductIds, setFavoriteProductIds] = useState<Set<string>>(new Set())
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
    <Product
      product={product}
      isFavorite={favoriteProductIds.has(product.id)}
      onFavoriteChange={handleFavoriteChange}
    />
  )
}

export default ProductWithFavorites

