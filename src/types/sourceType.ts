export type sourceType = {
  id: string
  productId?: string | null
  sourceName: string | null
  sourceUrl: string | null
  affiliateTag: string | null
  price: number | string | null
  currency: string | null
  availability: string | null
  lastSynced: Date | null
}