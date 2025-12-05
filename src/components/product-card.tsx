import { FC } from "react"
import Link from "next/link"
import Image from "next/image"
import { Gift } from "lucide-react"
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
import LeafScore from "./leaf-score"

interface Props {
  product: productType
  isFavorite?: boolean
  isLoggedIn?: boolean
  hideFavoriteButton?: boolean
}

const ProductCard: FC<Props> = ({
  product,
  isFavorite = false,
  isLoggedIn = false,
  hideFavoriteButton = false,
}) => {
  const { id, sources, slug, imageUrl, name, description, plasticScore } =
    product

  return (
    <div className="relative h-full">
      <Link href={`/products/${slug}`} className="no-underline">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>{name}</CardTitle>
            <LeafScore score={plasticScore ?? 1} />
          </CardHeader>
          <div className="flex flex-col justify-between h-full gap-6">
            <CardContent className="flex items-start gap-6 h-full">
              <div className="relative min-w-32 aspect-square rounded-lg overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading="eager"
                    className="object-contain p-0! m-0!"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                    <Gift className="size-20 text-stone-300" />
                  </div>
                )}
              </div>
              <CardDescription className="line-clamp-5">
                {description ?? "Product description coming soon."}
              </CardDescription>
            </CardContent>

            {sources && sources.length > 0 && (
              <div className="flex items-center gap-2 justify-end px-6">
                {sources.map((source) => (
                  <Button key={source.id} className="">
                    {source.price
                      ? `$${source.price}`
                      : `Buy from ${source.sourceName}`}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </Card>
      </Link>

      {!hideFavoriteButton && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="z-10 absolute bottom-6 left-6">
              <FavoriteButton
                productId={id}
                showText={false}
                isFavorite={isFavorite}
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
      )}
    </div>
  )
}

export default ProductCard
