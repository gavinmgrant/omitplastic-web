"use server"
import { ilike, or, inArray, sql, asc, desc, eq, and, SQL } from "drizzle-orm"
import { db } from "@/db/drizzle"
import { products, sources } from "@/db/schema"
import { productType, sourceType } from "@/types"
import { categories } from "@/config/categories"

export interface SearchPaginationOptions {
  page?: number
  limit?: number
  orderBy?: "plasticScore" | "categoryId" | "name" | "createdAt"
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

export interface SearchConditions {
  query: string
  categorySlug: string | undefined
}

const getSearchProductsCount = async (
  query: string,
  categorySlug: string | undefined
): Promise<number> => {
  const conditions = []

  // Add query condition if query exists
  if (query && query.trim()) {
    conditions.push(
      or(
        ilike(products.name, `%${query}%`),
        ilike(products.description, `%${query}%`)
      )
    )
  }

  // Add category condition if category exists and is not "all"
  if (categorySlug && categorySlug !== "all") {
    conditions.push(
      eq(
        products.categoryId,
        categories[categorySlug as keyof typeof categories] as string
      )
    )
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(whereClause as unknown as SQL<SearchConditions>)

  return Number(result[0]?.count || 0)
}

export const searchProducts = async (
  query: string,
  categorySlug: string | undefined,
  options?: SearchPaginationOptions
): Promise<productType[] | PaginatedResult<productType>> => {
  const {
    page = 1,
    limit,
    orderBy = "plasticScore",
    orderDirection = "desc",
  } = options || {}

  // Build search conditions dynamically
  const conditions = []

  // Add query condition if query exists
  if (query && query.trim()) {
    conditions.push(
      or(
        ilike(products.name, `%${query}%`),
        ilike(products.description, `%${query}%`)
      )
    )
  }

  // Add category condition if category exists and is not "all"
  if (categorySlug && categorySlug !== "all") {
    conditions.push(
      eq(
        products.categoryId,
        categories[categorySlug as keyof typeof categories] as string
      )
    )
  }

  const searchCondition =
    conditions.length > 0
      ? (and(...conditions) as unknown as SQL<SearchConditions>)
      : undefined

  if (!limit) {
    const data = (await db
      .select()
      .from(products)
      .where(
        searchCondition as unknown as SQL<SearchConditions>
      )) as productType[]
    const sourcesData = await db
      .select()
      .from(sources)
      .where(
        inArray(
          sources.productId,
          data.map((p) => p.id)
        )
      )

    data.forEach((product: productType) => {
      product.sources = sourcesData.filter(
        (source: sourceType) => source.productId === product.id
      )
    })
    return data as productType[]
  }

  const offset = (page - 1) * limit

  const orderByColumn =
    orderBy === "plasticScore"
      ? products.plasticScore
      : orderBy === "name"
      ? products.name
      : orderBy === "createdAt"
      ? products.createdAt
      : products.categoryId

  const orderFn = orderDirection === "desc" ? desc : asc

  const data = await db
    .select()
    .from(products)
    .where(searchCondition as unknown as SQL<SearchConditions>)
    .orderBy(orderFn(orderByColumn) as unknown as SQL<SearchConditions>)
    .limit(limit as number)
    .offset(offset)

  if (data.length === 0) {
    const total = await getSearchProductsCount(query, categorySlug)
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

  const total = await getSearchProductsCount(query, categorySlug)

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
