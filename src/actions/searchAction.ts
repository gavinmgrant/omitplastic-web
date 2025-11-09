"use server"
import { ilike, or } from "drizzle-orm"
import { db } from "@/db/drizzle"
import { products, sources } from "@/db/schema"
import { productType, sourceType } from "@/types"

export const searchProducts = async (query: string) => {
  const data = await db
    .select()
    .from(products)
    .where(
      or(
        ilike(products.name, `%${query}%`),
        ilike(products.description, `%${query}%`)
      )
    )

  const sourcesData = await db.select().from(sources)

  data.forEach((product: productType) => {
    product.sources = sourcesData.filter(
      (source: sourceType) => source.productId === product.id
    )
  })

  data.sort((a, b) => {
    const categoryA = a.categoryId || ""
    const categoryB = b.categoryId || ""
    return categoryA.localeCompare(categoryB)
  })
  return data as productType[]
}
