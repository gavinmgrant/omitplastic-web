import Link from "next/link"
import { Button } from "@/components/ui/button"
import { sourceType } from "@/types/sourceType"
import { cn } from "@/lib/utils"

interface Props {
  source: sourceType
  justify?: "left" | "right"
}

const BuyButton = ({ source, justify = "left" }: Props) => {
  return (
    <div className="w-full sm:w-auto">
      <div
        className={cn(
          "flex flex-col gap-2 items-center",
          justify === "right" ? "sm:items-end" : "sm:items-start"
        )}
      >
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
        <p className="text-sm text-muted-foreground">{source.availability}</p>
      </div>
      {source.sourceName === "Amazon" && (
        <p
          className={cn(
            "text-xs text-muted-foreground mt-1 text-center",
            justify === "right" ? "sm:text-right" : "sm:text-left"
          )}
        >
          When you buy this product using our links, we may earn an affiliate
          commission.
        </p>
      )}
    </div>
  )
}

export default BuyButton
