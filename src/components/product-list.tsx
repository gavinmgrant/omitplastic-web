import { searchProducts } from "@/actions/searchAction"
import ProductCard from "@/components/product-card"
import { productType } from "@/types"

interface ProductListProps {
  category: string
  limit?: number
}

export default async function ProductList({
  category,
  limit = 10,
}: ProductListProps) {
  const result = await searchProducts("", category, {
    limit,
    orderBy: "plasticScore",
    orderDirection: "desc",
  })

  const products = Array.isArray(result) ? result : result.data

  if (products.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-4">
        No products found in this category.
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

