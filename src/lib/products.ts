import { eq } from "drizzle-orm"
import { db } from "@/db/drizzle"
import { products, sources } from "@/db/schema"
import { productType, sourceType } from "@/types"
import { unstable_cache } from "next/cache"

// Cache products for 10 minutes (600 seconds)
const CACHE_REVALIDATE = 600

export const getProducts = async () => {
  return unstable_cache(
    async () => {
      const data = await db.select().from(products)

      const sourcesData = await db.select().from(sources)

      data.forEach((product: productType) => {
        product.sources = sourcesData.filter(
          (source: sourceType) => source.productId === product.id
        )
      })

      return data as productType[]
    },
    ["all-products"],
    {
      revalidate: CACHE_REVALIDATE,
      tags: ["products"],
    }
  )()
}

export const getProductBySlug = async (slug: string | undefined) => {
  if (!slug) return null

  return unstable_cache(
    async () => {
      const productData = await db
        .select()
        .from(products)
        .where(eq(products.slug, slug))
        .limit(1)

      if (!productData[0]) return null

      const product = productData[0] as productType

      const sourcesData = await db
        .select()
        .from(sources)
        .where(eq(sources.productId, product.id))

      return {
        ...product,
        sources: sourcesData,
      }
    },
    [`product-${slug}`],
    {
      revalidate: CACHE_REVALIDATE,
      tags: ["products", `product-${slug}`],
    }
  )()
}
