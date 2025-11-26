"use client"
import { FC } from "react"
import { productType } from "@/types"
import Image from "next/image"
import BuyButton from "@/components/buy-button"
import FavoriteButton from "@/components/favorite-button"
import LeafScore from "@/components/leaf-score"
import ProductDescriptionDialog from "@/components/product-description-dialog"
import { sourceType } from "@/types/sourceType"

const DESCRIPTION_MAX_LENGTH = 480

interface Props {
  product: productType
  isFavorite?: boolean
  onFavoriteChange?: (productId: string, isFavorite: boolean) => void
}

const Product: FC<Props> = ({
  product,
  isFavorite = false,
  onFavoriteChange,
}) => {
  const { id, sources, name, description, imageUrl, plasticScore } = product
  const isShortDescription =
    description && description.length < DESCRIPTION_MAX_LENGTH

  const truncateDescription = (description: string) => {
    const shortenedDescription = description
      .trim()
      .slice(0, DESCRIPTION_MAX_LENGTH)
    const lastSpaceIndex = shortenedDescription.lastIndexOf(" ")
    if (lastSpaceIndex !== -1) {
      return shortenedDescription.slice(0, lastSpaceIndex) + "..."
    }
    return shortenedDescription + "..."
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
      <div className="w-full space-y-4 lg:space-y-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold block lg:hidden leading-tight">
          {name}
        </h1>
        <div className="block lg:hidden">
          <LeafScore score={plasticScore ?? 1} size="lg" productName={name} />
        </div>
        <div className="w-full flex flex-col lg:flex-row items-center gap-0 lg:gap-14 relative">
          {imageUrl && (
            <div className="h-82 sm:h-108 sm:w-108 w-full shrink-0">
              <div className="relative w-full h-82 sm:h-108 sm:w-108 aspect-square rounded-lg overflow-hidden">
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={name}
                    width={432}
                    height={432}
                    loading="eager"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-6 lg:mt-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold hidden lg:block leading-tight">
                {name}
              </h1>
              <div className="hidden lg:block">
                <LeafScore score={plasticScore ?? 1} size="lg" productName={name} />
              </div>
            </div>
            {description ? (
              <p className="text-muted-foreground">
                {isShortDescription
                  ? description
                  : truncateDescription(description)}

                {!isShortDescription && (
                  <ProductDescriptionDialog
                    name={name}
                    description={description}
                    source={sources?.[0] ?? ({} as sourceType)}
                  />
                )}
              </p>
            ) : (
              <p className="text-muted-foreground">
                Product description coming soon.
              </p>
            )}
            {sources && sources.length > 0 && (
              <div className="flex items-center gap-2">
                {sources.map((source) => (
                  <BuyButton key={source.id} source={source} />
                ))}
              </div>
            )}
            <div className="flex items-center justify-start">
              <FavoriteButton
                productId={id}
                isFavorite={isFavorite}
                onFavoriteChange={onFavoriteChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Product
