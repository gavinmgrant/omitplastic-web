import { eq } from "drizzle-orm"
import { db } from "@/db/drizzle"
import { favorites } from "@/db/schema"

export const getFavoritesByUserId = async (userId: string) => {
  const data = await db
    .select()
    .from(favorites)
    .where(eq(favorites.userId, userId))
  return data
}
