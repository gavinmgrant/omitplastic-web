import { searchProducts } from "@/actions/searchAction"
import { getProductsByIds } from "@/actions/productAction"
import ProductCard from "@/components/product-card"
import { productType } from "@/types"

interface ProductListProps {
  category?: string
  productIds?: string[]
  limit?: number
}

export default async function ProductList({
  category,
  productIds,
  limit = 10,
}: ProductListProps) {
  let products: productType[]

  if (productIds && productIds.length > 0) {
    // Fetch products by IDs
    products = await getProductsByIds(productIds)
  } else if (category) {
    // Fetch products by category
    const result = await searchProducts("", category, {
      limit,
      orderBy: "plasticScore",
      orderDirection: "desc",
    })
    products = Array.isArray(result) ? result : result.data
  } else {
    products = []
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

