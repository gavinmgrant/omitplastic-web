import BuyButton from "@/components/buy-button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { sourceType } from "@/types/sourceType"

interface Props {
  name: string
  description: string
  source: sourceType
}

const ProductDescriptionDialog = ({ name, description, source }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="inline-block font-semibold text-primary cursor-pointer hover:underline ml-1">
          Read more
        </p>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pr-2">{name} Product Description</DialogTitle>
        </DialogHeader>
        <DialogDescription>{description}</DialogDescription>
        <DialogFooter>
          <BuyButton source={source} justify="right" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ProductDescriptionDialog
