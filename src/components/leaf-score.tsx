import { Leaf } from "lucide-react"
import { cn } from "@/lib/utils"
import LeafScoreDialog from "@/components/leaf-score-dialog"

interface LeafScoreProps {
  score: number
  size?: "sm" | "lg"
}

const LeafScore = ({ score, size = "sm" }: LeafScoreProps) => {
  const leafScore = Array.from({ length: 5 }, (_, index) => index < score)
  const color = leafScore.map((score) =>
    score ? "text-green-600" : "text-stone-300"
  )

  return (
    <div className="flex items-center justify-start relative gap-2">
      <div className="flex items-center gap-0.5">
        {leafScore.map((_, index) => (
          <Leaf
            key={index}
            className={cn(size === "sm" ? "size-4" : "size-5", color[index])}
            strokeWidth={3.5}
            fillOpacity={score >= index + 1 ? 0.5 : 0}
            fill={score >= index + 1 ? "green" : "none"}
          />
        ))}
      </div>
      {size === "lg" && <LeafScoreDialog />}
    </div>
  )
}

export default LeafScore
