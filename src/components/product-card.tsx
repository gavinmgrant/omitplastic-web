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
import BuyButton from "@/components/buy-button"
import { productType } from "@/types"
import { Button } from "./ui/button"

interface Props {
  product: productType
}

const ProductCard: FC<Props> = ({ product }) => {
  const { sources } = product

  return (
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
  )
}

export default ProductCard
