"use server"
import { and, eq } from "drizzle-orm"
import { db } from "@/db/drizzle"
import { favorites } from "@/db/schema"

export const getFavoritesByUserId = async (userId: string) => {
  const data = await db
    .select()
    .from(favorites)
    .where(eq(favorites.userId, userId))
  return data
}

export const checkIfFavorite = async (userId: string, productId: string) => {
  const data = await db
    .select()
    .from(favorites)
    .where(
      and(eq(favorites.userId, userId), eq(favorites.productId, productId))
    )
  return data.length > 0
}

export const addFavorite = async (userId: string, productId: string) => {
  await db.insert(favorites).values({ userId, productId })
}

export const removeFavorite = async (userId: string, productId: string) => {
  await db
    .delete(favorites)
    .where(
      and(eq(favorites.userId, userId), eq(favorites.productId, productId))
    )
}
