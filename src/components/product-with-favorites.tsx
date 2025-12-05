"use client"

import { FC } from "react"
import { useUser } from "@stackframe/stack"
import { productType } from "@/types"
import Product from "@/components/product"
import { useFavorites } from "@/hooks/use-favorites"

interface Props {
  product: productType
}

const ProductWithFavorites: FC<Props> = ({ product }) => {
  const user = useUser()
  const { data: favoritesData } = useFavorites(user?.id)
  const favorites = favoritesData?.favorites || []
  const favoriteProductIds = new Set(
    favorites
      .map((f) => f.productId)
      .filter((id): id is string => id !== null && id !== undefined)
  )

  return (
    <Product
      product={product}
      isFavorite={favoriteProductIds.has(product.id)}
    />
  )
}

export default ProductWithFavorites
