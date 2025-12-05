"use client"

import { Button } from "./ui/button"
import { Heart } from "lucide-react"
import { useUser } from "@stackframe/stack"
import { Spinner } from "@/components/ui/spinner"
import { useToggleFavorite } from "@/hooks/use-favorites"

interface Props {
  productId: string
  showText?: boolean
  isFavorite?: boolean
}

const FavoriteButton = ({
  productId,
  showText = true,
  isFavorite = false,
}: Props) => {
  const user = useUser()
  const toggleFavorite = useToggleFavorite()

  const handleFavorite = () => {
    if (!user?.id) return

    const newFavoriteState = !isFavorite
    
    toggleFavorite.mutate({
      userId: user.id,
      productId,
      isFavorite: newFavoriteState,
    })
  }

  const isPending = toggleFavorite.isPending

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleFavorite}
      disabled={!user?.id || isPending}
      className="flex items-center justify-center gap-2 h-9 w-full sm:w-auto"
    >
      {isPending ? (
        <Spinner className="size-4 text-red-700" />
      ) : (
        <Heart
          className="size-4"
          fill={isFavorite ? "red" : "none"}
          stroke="red"
          fillOpacity={isFavorite ? 0.5 : 0}
          strokeWidth={3.5}
        />
      )}
      {showText &&
        user?.id &&
        (isFavorite ? "Remove from favorites" : "Add to favorites")}
      {showText && !user?.id && "Sign in to add to favorites"}
    </Button>
  )
}

export default FavoriteButton
