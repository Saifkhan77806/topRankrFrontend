import { UserX } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FeedbackStats } from "@/types/recruiter"

interface HiringFunnelProps {
  stats: FeedbackStats
}

const STAGE_COLORS = ["bg-violet-500", "bg-amber-500", "bg-emerald-500"]

export function HiringFunnel({ stats }: HiringFunnelProps) {
  const stages = [
    { label: "Shortlisted", value: stats.shortlisted },
    { label: "Interviewed", value: stats.interviewed },
    { label: "Hired", value: stats.hired },
  ]

  const maxValue = Math.max(1, ...stages.map((stage) => stage.value))

  return (
    <Card className="rounded-xl border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Hiring funnel</CardTitle>
        <p className="text-xs text-muted-foreground">
          Global, all-time counts across every recruiter — not scoped to your account.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-4">
          {stages.map((stage, index) => {
            const widthPercent = Math.max(8, (stage.value / maxValue) * 100)
            return (
              <div key={stage.label} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{stage.label}</span>
                  <span className="tabular-nums text-muted-foreground">{stage.value}</span>
                </div>
                <div className="h-3 w-full rounded-full bg-muted">
                  <div
                    className={`h-3 rounded-full ${STAGE_COLORS[index]} transition-all`}
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-dashed border-rose-200 bg-rose-50 px-3 py-2.5">
          <UserX className="size-4 shrink-0 text-rose-600" />
          <div className="flex flex-1 items-center justify-between text-sm">
            <span className="text-rose-700">Rejected (dropped off)</span>
            <span className="font-medium tabular-nums text-rose-700">{stats.rejected}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
