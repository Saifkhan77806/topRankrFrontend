import { Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"

const RECOMMENDATION_STYLES: Record<string, string> = {
  "Excellent Match": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Strong Match": "bg-sky-100 text-sky-700 border-sky-200",
}

interface ReasonCardProps {
  recommendation: string | null
  aiReason: string | null
}

export function ReasonCard({ recommendation, aiReason }: ReasonCardProps) {
  return (
    <div className="flex flex-col gap-2">
      {recommendation && (
        <Badge
          variant="outline"
          className={RECOMMENDATION_STYLES[recommendation] ?? undefined}
        >
          {recommendation}
        </Badge>
      )}
      {aiReason && (
        <div className="flex items-start gap-2 rounded-lg bg-primary/5 p-2.5">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="text-sm text-foreground">{aiReason}</p>
        </div>
      )}
    </div>
  )
}
