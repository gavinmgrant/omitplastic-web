"use server"
import { ilike, or, inArray, sql, asc, desc } from "drizzle-orm"
import { db } from "@/db/drizzle"
import { products, sources } from "@/db/schema"
import { productType, sourceType } from "@/types"

export interface SearchPaginationOptions {
  page?: number
  limit?: number
  orderBy?: "categoryId" | "name" | "createdAt"
  orderDirection?: "asc" | "desc"
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}

const getSearchProductsCount = async (query: string): Promise<number> => {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(
      or(
        ilike(products.name, `%${query}%`),
        ilike(products.description, `%${query}%`)
      )
    )
  return Number(result[0]?.count || 0)
}

export const searchProducts = async (
  query: string,
  options?: SearchPaginationOptions
): Promise<productType[] | PaginatedResult<productType>> => {
  const {
    page = 1,
    limit,
    orderBy = "categoryId",
    orderDirection = "asc",
  } = options || {}

  const searchCondition = or(
    ilike(products.name, `%${query}%`),
    ilike(products.description, `%${query}%`)
  )

  if (!limit) {
    const data = await db.select().from(products).where(searchCondition)

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

  const offset = (page - 1) * limit

  const orderByColumn =
    orderBy === "name"
      ? products.name
      : orderBy === "createdAt"
      ? products.createdAt
      : products.categoryId

  const orderFn = orderDirection === "desc" ? desc : asc

  const data = await db
    .select()
    .from(products)
    .where(searchCondition)
    .orderBy(orderFn(orderByColumn))
    .limit(limit)
    .offset(offset)

  if (data.length === 0) {
    const total = await getSearchProductsCount(query)
    return {
      data: [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: false,
      },
    }
  }

  const productIds = data.map((p) => p.id)
  const sourcesData = await db
    .select()
    .from(sources)
    .where(inArray(sources.productId, productIds))

  const productsWithSources: productType[] = data.map((product) => ({
    ...product,
    sources: sourcesData.filter(
      (source: sourceType) => source.productId === product.id
    ),
  })) as productType[]

  const total = await getSearchProductsCount(query)

  return {
    data: productsWithSources,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: offset + limit < total,
    },
  }
}
