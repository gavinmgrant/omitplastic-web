import Products from "@/components/products"

// Revalidate products page every 10 minutes
export const revalidate = 600

export default async function ProductsPage() {
  return <Products />
}
