import { sourceType } from "./sourceType"

export type productType = {
  id: string
  name: string
  slug: string
  barcode: string | null
  description?: string | null
  imageUrl?: string | null
  categoryId?: string | null
  plasticScore?: number | null
  sources?: sourceType[]
  createdAt?: Date | null
  updatedAt?: Date | null
}
