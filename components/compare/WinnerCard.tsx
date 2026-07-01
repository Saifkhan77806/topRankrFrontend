import { Trophy } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import type { ComparisonResponse } from "@/types/comparison"

interface WinnerCardProps {
  comparison: ComparisonResponse
}

export function WinnerCard({ comparison }: WinnerCardProps) {
  const winnerCandidate = comparison.comparison.find(
    (candidate) => candidate.candidate_id === comparison.winner.winner
  )

  return (
    <Card className="relative overflow-hidden rounded-2xl border-none bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(255,255,255,0.25),transparent_50%)]"
      />
      <CardContent className="relative flex items-start gap-4 px-6 py-6">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
          <Trophy className="size-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">
            Recommended candidate
          </p>
          <h2 className="mt-0.5 text-lg font-semibold text-white">
            {winnerCandidate?.name ?? `Candidate #${comparison.winner.winner}`}
          </h2>
          <p className="mt-1.5 text-sm text-white/85">{comparison.winner.reason}</p>
        </div>
      </CardContent>
    </Card>
  )
}
