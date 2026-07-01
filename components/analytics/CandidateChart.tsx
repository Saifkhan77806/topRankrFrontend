import { ComingSoonChart } from "@/components/analytics/ComingSoonChart"

export function CandidateChart() {
  return (
    <ComingSoonChart
      title="Candidates over time"
      explanation="Requires a backend aggregation endpoint over search history — not available yet."
    />
  )
}
