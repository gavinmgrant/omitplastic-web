"use server"
import { and, eq } from "drizzle-orm"
import { db } from "@/db/drizzle"
import { favorites } from "@/db/schema"

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
