import { eq } from "drizzle-orm"
import { db } from "@/db/drizzle"
import { products, sources } from "@/db/schema"
import { productType, sourceType } from "@/types"

export const getProducts = async () => {
  const data = await db.select().from(products)

  const sourcesData = await db.select().from(sources)

  data.forEach((product: productType) => {
    product.sources = sourcesData.filter(
      (source: sourceType) => source.productId === product.id
    )
  })

  return data as productType[]
}

export const getProductBySlug = async (slug: string | undefined) => {
  if (!slug) return null

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
}
