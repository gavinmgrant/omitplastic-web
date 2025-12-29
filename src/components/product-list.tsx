"use client"

import { useQuery } from "@tanstack/react-query"
import { getProductsByIds } from "@/actions/productAction"
import { useSearchProducts } from "@/hooks/use-products"
import ProductCard from "@/components/product-card"
import { productType } from "@/types"
import { Spinner } from "@/components/ui/spinner"

interface ProductListProps {
  category?: string
  productIds?: string[]
  limit?: number
}

export default function ProductList({
  category,
  productIds,
  limit = 10,
}: ProductListProps) {
  const { data: productsByIds, isLoading: isLoadingByIds } = useQuery({
    queryKey: ["products", "byIds", productIds],
    queryFn: () => getProductsByIds(productIds || []),
    enabled: !!productIds && productIds.length > 0,
  })

  const { data: categoryData, isLoading: isLoadingCategory } = useSearchProducts(
    "",
    category,
    !!category && (!productIds || productIds.length === 0)
  )

  const isLoading = isLoadingByIds || isLoadingCategory

  let products: productType[] = []

  if (productIds && productIds.length > 0) {
    products = productsByIds || []
  } else if (category && categoryData?.pages) {
    const allProducts = categoryData.pages.flatMap((page) => page.data)
    products = allProducts.slice(0, limit)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner className="w-6 h-6" />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-4">
        No products found.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product as productType}
          isFavorite={false}
          isLoggedIn={false}
          hideFavoriteButton={true}
        />
      ))}
    </div>
  )
}

