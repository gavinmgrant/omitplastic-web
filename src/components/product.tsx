"use client"
import { FC } from "react"
import { productType } from "@/types"
import Image from "next/image"
import BuyButton from "@/components/buy-button"
import FavoriteButton from "@/components/favorite-button"

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
  const { sources } = product

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="w-full space-y-4 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold block lg:hidden">{product.name}</h1>
        <div className="w-full flex flex-col lg:flex-row items-center gap-12">
          {product.imageUrl && (
            <div className="h-72 sm:h-96 sm:w-96 w-full">
              <div className="relative w-full h-72 sm:h-96 sm:w-96 aspect-square rounded-lg overflow-hidden">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={384}
                  height={384}
                  loading="eager"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold hidden lg:block">
              {product.name}
            </h1>
            {product.description && (
              <p className="text-lg text-stone-700">{product.description}</p>
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
                productId={product.id}
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
