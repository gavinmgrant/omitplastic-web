import { Info } from "lucide-react"
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
import { Button } from "@/components/ui/button"

const LeafScoreDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          <Info className="size-4.5 text-muted-foreground" strokeWidth={3} />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How the Leaf Score Works</DialogTitle>
        </DialogHeader>
        <DialogDescription className="space-y-2">
          <p>
            The Leaf Score (1–5) helps you quickly understand how plastic-free
            and eco-friendly a product is. Each product is evaluated across five
            sustainability factors:
          </p>
          <p>
            1. <u>Materials</u> (0–2 points) Products made from natural or fully
            plastic-free materials earn the highest points. Partial plastic
            components reduce the score.{" "}
          </p>
          <p>
            2. <u>Packaging</u> (0–1 point) Products that ship in plastic-free
            packaging—like paper, cardboard, or compostables—receive an
            additional point.{" "}
          </p>
          <p>
            3. <u>Reusability</u> (0–1 point) Items designed to replace
            single-use plastics or last for years earn points for reducing
            long-term waste.{" "}
          </p>
          <p>
            4. <u>Plastic Replacement Impact</u> (0–1 point) If the product
            directly replaces a plastic-heavy item (like plastic bags, bottles,
            or wrap), it earns another point.{" "}
          </p>
          <p>
            5. <u>End-of-Life</u> (0–1 point) Products that are recyclable,
            compostable, or biodegradable get a final point for being gentle on
            the planet when you&apos;re done using them.{" "}
          </p>

          <p className="text-lg font-semibold">Score Range</p>
          <p>
            5 Leaves — Excellent: fully plastic-free with high sustainability
            impact{" "}
          </p>
          <p>
            4 Leaves — Great: very low plastic and meaningful waste reduction
          </p>
          <p>3 Leaves — Good: reduces plastic but includes minor compromises</p>
          <p>1–2 Leaves — Some plastic reduction, but limited overall impact</p>
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default LeafScoreDialog
