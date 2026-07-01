import { useAllSearchResults } from "@/hooks/use-all-search-results"
import type { RecommendedCandidate } from "@/types/recommendation"

const RECOMMENDED_LABELS = new Set(["Excellent Match", "Strong Match"])

export function useRecommendations() {
  const { jobResults, isPending, isError, error, hasCompletedJobs } = useAllSearchResults()

  const byId = new Map<number, RecommendedCandidate>()

  for (const jobResult of jobResults) {
    for (const result of jobResult.results) {
      if (!result.recommendation || !RECOMMENDED_LABELS.has(result.recommendation)) continue

      const candidate: RecommendedCandidate = {
        ...result,
        source_job_id: jobResult.job_id,
      }

      const existing = byId.get(candidate.candidate_id)
      if (!existing || (candidate.ranking_score ?? 0) > (existing.ranking_score ?? 0)) {
        byId.set(candidate.candidate_id, candidate)
      }
    }
  }

  const recommendations = Array.from(byId.values()).sort(
    (a, b) => (b.ranking_score ?? 0) - (a.ranking_score ?? 0)
  )

  return {
    data: recommendations,
    isPending,
    isError,
    error,
    hasCompletedJobs,
  }
}
