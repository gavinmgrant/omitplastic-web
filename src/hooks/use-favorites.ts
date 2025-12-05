"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getFavoritesByUserId,
  addFavorite,
  removeFavorite,
} from "@/actions/favoriteAction"
import { getProductsByIds } from "@/actions/productAction"
import { productType } from "@/types"

export function useFavorites(userId: string | undefined) {
  return useQuery({
    queryKey: ["favorites", userId],
    queryFn: async () => {
      if (!userId) return { favorites: [], products: [] }

      const favorites = await getFavoritesByUserId(userId)
      const productIds = favorites
        .map((f) => f.productId)
        .filter((id): id is string => id !== null && id !== undefined)

      const products =
        productIds.length > 0 ? await getProductsByIds(productIds) : []

      return { favorites, products }
    },
    enabled: !!userId,
  })
}

export function useToggleFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      productId,
      isFavorite,
    }: {
      userId: string
      productId: string
      isFavorite: boolean
    }) => {
      if (isFavorite) {
        await addFavorite(userId, productId)
      } else {
        await removeFavorite(userId, productId)
      }
      return { productId, isFavorite }
    },
    onMutate: async ({ userId, productId, isFavorite }) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ["favorites", userId] })

      // Snapshot the previous value
      const previousFavorites = queryClient.getQueryData(["favorites", userId])

      // Optimistically update the cache
      queryClient.setQueryData(
        ["favorites", userId],
        (
          old:
            | { favorites: Array<{ productId: string }>; products: unknown[] }
            | undefined
        ) => {
          if (!old) return old

          if (isFavorite) {
            // Add favorite
            const newFavorite = { productId, userId }
            return {
              ...old,
              favorites: [...old.favorites, newFavorite],
            }
          } else {
            // Remove favorite
            return {
              ...old,
              favorites: old.favorites.filter((f) => f.productId !== productId),
              products: old.products.filter(
                (p) => (p as productType).id !== productId
              ),
            }
          }
        }
      )

      // Return context with snapshot for rollback
      return { previousFavorites }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousFavorites) {
        queryClient.setQueryData(
          ["favorites", variables.userId],
          context.previousFavorites
        )
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate to ensure we have the latest data
      queryClient.invalidateQueries({
        queryKey: ["favorites", variables.userId],
      })
      // Invalidate product search queries to update favorite status
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}
