"use server"
import { eq } from "drizzle-orm"
import { db } from "@/db/drizzle"
import { products, sources } from "@/db/schema"
import { productType, sourceType } from "@/types"

export const getProductById = async (id: string) => {
  if (!id) return null

  const productData = await db
    .select()
    .from(products)
    .where(eq(products.id, id))

  if (!productData[0]) return null

  const product = productData[0] as productType

  const sourcesData = await db
    .select()
    .from(sources)
    .where(eq(sources.productId, product.id))

  return {
    ...product,
    sources: sourcesData as sourceType[],
  } as productType
}
