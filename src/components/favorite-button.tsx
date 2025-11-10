import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Heart } from "lucide-react"
import { useUser } from "@stackframe/stack"
import {
  addFavorite,
  checkIfFavorite,
  removeFavorite,
} from "@/actions/favoriteAction"

interface Props {
  productId: string
  showText?: boolean
}

const FavoriteButton = ({ productId, showText = true }: Props) => {
  const [isFavorite, setIsFavorite] = useState(false)

  const user = useUser()

  const handleFavorite = async () => {
    if (!user?.id) return
    const isFav = await checkIfFavorite(user?.id || "", productId)
    if (isFav) {
      await removeFavorite(user.id, productId)
      setIsFavorite(false)
    } else {
      await addFavorite(user.id, productId)
      setIsFavorite(true)
    }
  }

  useEffect(() => {
    const fetchIsFavorite = async () => {
      const isFav = await checkIfFavorite(user?.id || "", productId)
      setIsFavorite(isFav)
    }
    fetchIsFavorite()
  }, [user?.id, productId])

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleFavorite}
      disabled={!user?.id}
      className="flex items-center justify-center gap-2"
    >
      <Heart
        className="size-4"
        fill={isFavorite ? "red" : "none"}
        stroke="red"
      />
      {showText &&
        user?.id &&
        (isFavorite ? "Remove from favorites" : "Add to favorites")}
      {showText && !user?.id && "Sign in to add to favorites"}
    </Button>
  )
}

export default FavoriteButton
