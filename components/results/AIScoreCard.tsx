import { Progress } from "@/components/ui/progress"

interface AIScoreCardProps {
  rankingScore: number | null
  semanticScore: number | null
}

function ScoreRow({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">
          {value !== null ? `${Math.round(value)}%` : "Not available"}
        </span>
      </div>
      <Progress value={value ?? 0} className={value === null ? "opacity-40" : undefined} />
    </div>
  )
}

export function AIScoreCard({ rankingScore, semanticScore }: AIScoreCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border/60 p-3">
      <ScoreRow label="Ranking score" value={rankingScore} />
      <ScoreRow label="Semantic match" value={semanticScore} />
    </div>
  )
}
