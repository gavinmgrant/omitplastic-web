import { FC } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import FavoriteButton from "@/components/favorite-button"
import { productType } from "@/types"
import { Button } from "./ui/button"

interface Props {
  product: productType
  isFavorite?: boolean
  onFavoriteChange?: (productId: string, isFavorite: boolean) => void
}

const ProductCard: FC<Props> = ({ product, isFavorite = false, onFavoriteChange }) => {
  const { sources } = product

  return (
    <div className="relative">
      <Link href={`/products/${product.slug}`}>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-start gap-6">
            <div className="relative min-w-40 h-40 rounded-lg overflow-hidden">
              <Image
                src={product.imageUrl || ""}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="eager"
                className="object-contain"
              />
            </div>
            <CardDescription className="line-clamp-5">
              {product.description}
            </CardDescription>
          </CardContent>

          {sources && sources.length > 0 && (
            <div className="flex items-center gap-2 justify-end px-6">
              {sources.map((source) => (
                <Button key={source.id} className="w-full sm:w-auto">
                  {source.price && `$${source.price}`}
                </Button>
              ))}
            </div>
          )}
        </Card>
      </Link>
      <div className="z-10 absolute bottom-6 left-6">
        <FavoriteButton 
          productId={product.id} 
          showText={false} 
          isFavorite={isFavorite}
          onFavoriteChange={onFavoriteChange}
        />
      </div>
    </div>
  )
}

export default ProductCard
