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
import LeafScore from "@/components/leaf-score"

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
          <DialogTitle>
            <div className="flex items-center gap-3">
              How the Leaf Score Works{" "}
              <span className="hidden sm:inline">
                {" "}
                <LeafScore score={5} />
              </span>
            </div>
            <div className="block sm:hidden mt-2">
              <LeafScore score={5} />
            </div>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="space-y-2">
          <span className="block">
            The Leaf Score (1–5) helps you quickly understand how plastic-free
            and eco-friendly a product is. Each product is evaluated across five
            sustainability factors:
          </span>
          <span className="block">
            1. <u>Materials</u> (0–2 points) Products made from natural or fully
            plastic-free materials earn the highest points. Partial plastic
            components reduce the score.{" "}
          </span>
          <span className="block">
            2. <u>Packaging</u> (0–1 point) Products that ship in plastic-free
            packaging—like paper, cardboard, or compostables—receive an
            additional point.{" "}
          </span>
          <span className="block">
            3. <u>Reusability</u> (0–1 point) Items designed to replace
            single-use plastics or last for years earn points for reducing
            long-term waste.{" "}
          </span>
          <span className="block">
            4. <u>Plastic Replacement Impact</u> (0–1 point) If the product
            directly replaces a plastic-heavy item (like plastic bags, bottles,
            or wrap), it earns another point.{" "}
          </span>
          <span className="block">
            5. <u>End-of-Life</u> (0–1 point) Products that are recyclable,
            compostable, or biodegradable get a final point for being gentle on
            the planet when you&apos;re done using them.{" "}
          </span>
          <span className="text-lg font-semibold block">Score Range</span>
          <span className="flex items-center gap-3 leading-4">
            <LeafScore score={5} /> Excellent: fully plastic-free with high
            sustainability impact{" "}
          </span>
          <span className="flex items-center gap-3 leading-4">
            <LeafScore score={4} /> Great: very low plastic and meaningful waste
            reduction
          </span>
          <span className="flex items-center gap-3 leading-4">
            <LeafScore score={3} /> Good: reduces plastic, but includes minor
            compromises
          </span>
          <span className="flex items-center gap-3 leading-4">
            <LeafScore score={2} /> Fair: Some plastic reduction, but limited
            overall impact
          </span>
          <span className="flex items-center gap-3 leading-4">
            <LeafScore score={1} /> Poor: Little plastic reduction, no real
            impact
          </span>
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
