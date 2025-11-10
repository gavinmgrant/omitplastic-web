"use server"
import { eq, inArray } from "drizzle-orm"
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

export const getProductsByIds = async (
  ids: string[]
): Promise<productType[]> => {
  if (!ids || ids.length === 0) return []

  const productData = await db
    .select()
    .from(products)
    .where(inArray(products.id, ids))

  if (productData.length === 0) return []

  const productIds = productData.map((p) => p.id)
  const sourcesData = await db
    .select()
    .from(sources)
    .where(inArray(sources.productId, productIds))

  const productsWithSources: productType[] = productData.map((product) => {
    const productSources = sourcesData.filter(
      (source) => source.productId === product.id
    )
    return {
      ...product,
      sources: productSources as sourceType[],
    } as productType
  })

  return productsWithSources
}
