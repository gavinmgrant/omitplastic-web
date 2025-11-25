import ProductList from "@/components/product-list"

export function useMDXComponents(components: Record<string, unknown>) {
  return {
    ...(components as Record<string, unknown>),
    ProductList,
  }
}

