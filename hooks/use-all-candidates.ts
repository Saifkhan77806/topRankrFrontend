import { useAllSearchResults } from "@/hooks/use-all-search-results"
import type { SearchResultItem } from "@/types/search-results"

export interface AggregatedCandidate extends SearchResultItem {
  jobId: number
}

const MAX_JOBS_TO_SCAN = 50

export function useAllCandidates() {
  const { jobResults, isPending, isError, error, hasCompletedJobs } =
    useAllSearchResults(MAX_JOBS_TO_SCAN)

  const byId = new Map<number, AggregatedCandidate>()

  for (const jobResult of jobResults) {
    for (const result of jobResult.results) {
      const existing = byId.get(result.candidate_id)
      if (!existing || (result.ranking_score ?? 0) > (existing.ranking_score ?? 0)) {
        byId.set(result.candidate_id, { ...result, jobId: jobResult.job_id })
      }
    }
  }

  const candidates = Array.from(byId.values()).sort((a, b) =>
    (a.name ?? "").localeCompare(b.name ?? "")
  )

  return {
    data: candidates,
    isPending,
    isError,
    error,
    hasCompletedJobs,
  }
}
