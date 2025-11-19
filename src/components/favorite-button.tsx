import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Heart } from "lucide-react"
import { useUser } from "@stackframe/stack"
import { Spinner } from "@/components/ui/spinner"
import { addFavorite, removeFavorite } from "@/actions/favoriteAction"

interface Props {
  productId: string
  showText?: boolean
  isFavorite?: boolean
  onFavoriteChange?: (productId: string, isFavorite: boolean) => void
}

const FavoriteButton = ({
  productId,
  showText = true,
  isFavorite: initialIsFavorite = false,
  onFavoriteChange,
}: Props) => {
  const [isSaving, setIsSaving] = useState(false)
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)

  const user = useUser()

  useEffect(() => {
    if (!isSaving) {
      setIsFavorite(initialIsFavorite)
    }
  }, [initialIsFavorite, isSaving])

  const handleFavorite = async () => {
    if (!user?.id) return

    const newFavoriteState = !isFavorite
    setIsSaving(true)
    setIsFavorite(newFavoriteState)

    try {
      if (newFavoriteState) {
        await addFavorite(user.id, productId)
      } else {
        await removeFavorite(user.id, productId)
      }

      onFavoriteChange?.(productId, newFavoriteState)
    } catch (error) {
      setIsFavorite(!newFavoriteState)
      console.error("Error updating favorite:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleFavorite}
      disabled={!user?.id}
      className="flex items-center justify-center gap-2 h-9 w-full sm:w-auto"
    >
      {isSaving ? (
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
