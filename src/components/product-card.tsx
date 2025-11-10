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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import FavoriteButton from "@/components/favorite-button"
import { productType } from "@/types"
import { Button } from "./ui/button"

interface Props {
  product: productType
  isFavorite?: boolean
  onFavoriteChange?: (productId: string, isFavorite: boolean) => void
  isLoggedIn?: boolean
}

const ProductCard: FC<Props> = ({
  product,
  isFavorite = false,
  onFavoriteChange,
  isLoggedIn = false,
}) => {
  const { sources } = product

  return (
    <div className="relative h-full">
      <Link href={`/products/${product.slug}`}>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
          </CardHeader>
          <div className="flex flex-col justify-between h-full gap-6">
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
                  <Button key={source.id} className="">
                    {source.price && `$${source.price}`}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </Card>
      </Link>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="z-10 absolute bottom-6 left-6">
            <FavoriteButton
              productId={product.id}
              showText={false}
              isFavorite={isFavorite}
              onFavoriteChange={onFavoriteChange}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {isLoggedIn ? (
            <p>{isFavorite ? "Remove from favorites" : "Add to favorites"}</p>
          ) : (
            <p>Sign in to add to favorites</p>
          )}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export default ProductCard
