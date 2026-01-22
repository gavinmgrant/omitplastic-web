"use server"
import { ilike, or, inArray, sql, asc, desc, eq, and, SQL } from "drizzle-orm"
import { db } from "@/db/drizzle"
import { products, sources } from "@/db/schema"
import { productType, sourceType } from "@/types"
import { categories } from "@/config/categories"
import { unstable_cache } from "next/cache"

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

// Cache search results for 10 minutes (600 seconds)
const CACHE_REVALIDATE = 600

const getSearchProductsCount = async (
  query: string,
  categorySlug: string | undefined
): Promise<number> => {
  return unstable_cache(
    async () => {
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
    },
    [`search-count-${query}-${categorySlug || "all"}`],
    {
      revalidate: CACHE_REVALIDATE,
      tags: ["products", "search"],
    }
  )()
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
    const cacheKey = `search-all-${query}-${categorySlug || "all"}`
    return unstable_cache(
      async () => {
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
      },
      [cacheKey],
      {
        revalidate: CACHE_REVALIDATE,
        tags: ["products", "search"],
      }
    )()
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

  // Create cache key based on search parameters
  const cacheKey = `search-${query}-${categorySlug || "all"}-${page}-${limit}-${orderBy}-${orderDirection}`

  return unstable_cache(
    async () => {
      const data = await db
        .select()
        .from(products)
        .where(searchCondition as unknown as SQL<SearchConditions>)
        .orderBy(
          orderFn(orderByColumn) as unknown as SQL<SearchConditions>,
          asc(products.id)
        )
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
    },
    [cacheKey],
    {
      revalidate: CACHE_REVALIDATE,
      tags: ["products", "search"],
    }
  )()
}
