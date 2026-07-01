import { ComingSoonChart } from "@/components/analytics/ComingSoonChart"

export function IndustryChart() {
  return (
    <ComingSoonChart
      title="Industry breakdown"
      explanation="Requires a backend aggregation endpoint — industry data lives inside each candidate's full profile, which isn't included in bulk search-results responses."
    />
  )
}
