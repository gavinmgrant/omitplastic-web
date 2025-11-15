import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { sourceType } from "@/types/sourceType"

const BuyButton = ({ source }: { source: sourceType }) => {
  return (
    <div className="w-full sm:w-auto">
      <div className="flex sm:flex-row flex-col items-center gap-4">
        <Link
          href={source.sourceUrl || ""}
          className="w-full sm:w-auto"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="w-full sm:w-auto">
            Buy from {source.sourceName} {source.price && `$${source.price}`}
          </Button>
        </Link>
        <Badge variant="outline">{source.availability}</Badge>
      </div>
      {source.sourceName === "Amazon" && (
        <p className="text-sm text-stone-700 mt-4">
          When you buy this product using our links, we may earn an affiliate
          commission.
        </p>
      )}
    </div>
  )
}

export default BuyButton
