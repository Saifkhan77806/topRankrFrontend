import { Progress } from "@/components/ui/progress"

interface SimilarityCardProps {
  semanticScore: number | null
}

export function SimilarityCard({ semanticScore }: SimilarityCardProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Similarity to job description</span>
        <span className="font-medium text-foreground">
          {semanticScore !== null ? `${Math.round(semanticScore)}%` : "Not available"}
        </span>
      </div>
      <Progress
        value={semanticScore ?? 0}
        className={semanticScore === null ? "opacity-40" : undefined}
      />
    </div>
  )
}
