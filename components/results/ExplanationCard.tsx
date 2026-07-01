import { Sparkles, SparklesIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { CandidateExplanation } from "@/types/search-results"

interface ExplanationCardProps {
  aiReason: string | null
  explanation: CandidateExplanation | null
}

export function ExplanationCard({ aiReason, explanation }: ExplanationCardProps) {
  if (!aiReason && !explanation) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border p-4 text-center">
        <SparklesIcon className="size-5 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">
          AI explanation unavailable for this candidate
        </p>
        <p className="text-xs text-muted-foreground">
          This candidate wasn&apos;t included in the AI re-ranking step, so no
          detailed reasoning was generated.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border/60 p-4">
      {aiReason && (
        <div className="flex items-start gap-2 rounded-lg bg-primary/5 p-2.5">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="text-sm font-medium text-foreground">{aiReason}</p>
        </div>
      )}

      {explanation && explanation.reasons.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {explanation.reasons.map((reason, index) => (
            <Badge key={index} variant="secondary">
              {reason}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
