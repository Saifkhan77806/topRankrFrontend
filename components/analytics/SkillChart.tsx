import { ComingSoonChart } from "@/components/analytics/ComingSoonChart"

export function SkillChart() {
  return (
    <ComingSoonChart
      title="Top skills"
      explanation="Requires a backend aggregation endpoint — skill data lives inside each candidate's full profile, which isn't included in bulk search-results responses."
    />
  )
}
