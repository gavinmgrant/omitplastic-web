"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { searchProducts, type PaginatedResult } from "@/actions/searchAction"
import { productType } from "@/types"

const PRODUCTS_PER_PAGE = 24

export function useSearchProducts(
  query: string,
  categorySlug: string | undefined,
  enabled = true
) {
  return useInfiniteQuery({
    queryKey: ["products", "search", query, categorySlug],
    queryFn: ({ pageParam = 1 }) =>
      searchProducts(query || "", categorySlug, {
        page: pageParam,
        limit: PRODUCTS_PER_PAGE,
      }) as Promise<PaginatedResult<productType>>,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasMore) {
        return lastPage.pagination.page + 1
      }
      return undefined
    },
    enabled,
    initialPageParam: 1,
  })
}
