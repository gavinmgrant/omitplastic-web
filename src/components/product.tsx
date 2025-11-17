"use client"
import { FC, useState } from "react"
import { productType } from "@/types"
import Image from "next/image"
import BuyButton from "@/components/buy-button"
import FavoriteButton from "@/components/favorite-button"
import { Button } from "@/components/ui/button"

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
  const { id, sources, name, description, imageUrl } = product
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)
  const isShortDescription =
    description && description.length < DESCRIPTION_MAX_LENGTH

  const truncateDescription = (description: string) => {
    const shortenedDescription = description
      .trim()
      .slice(0, DESCRIPTION_MAX_LENGTH)
    const lastSpaceIndex = shortenedDescription.lastIndexOf(" ")
    if (lastSpaceIndex !== -1) {
      return shortenedDescription.slice(0, lastSpaceIndex) + " ..."
    }
    return shortenedDescription + " ..."
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
      <div className="w-full space-y-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold block lg:hidden">{name}</h1>
        <div className="w-full flex flex-col lg:flex-row items-center gap-6 lg:gap-16 relative">
          {imageUrl && (
            <div className="h-72 sm:h-96 sm:w-96 w-full">
              <div className="relative w-full h-72 sm:h-96 sm:w-96 aspect-square rounded-lg overflow-hidden">
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={name}
                    width={384}
                    height={384}
                    loading="eager"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-6 lg:mt-4">
            <h1 className="text-4xl font-bold hidden lg:block">{name}</h1>
            {description ? (
              <p className="text-lg text-stone-700">
                {descriptionExpanded || isShortDescription
                  ? description.trim()
                  : truncateDescription(description)}
                {!isShortDescription && (
                  <Button
                    className="ml-2"
                    variant="link"
                    size="sm"
                    onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                  >
                    {descriptionExpanded ? "Read less" : "Read more"}
                  </Button>
                )}
              </p>
            ) : (
              <p className="text-lg text-stone-700">
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
            <div className="w-full sm:w-52 flex items-center justify-start">
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
