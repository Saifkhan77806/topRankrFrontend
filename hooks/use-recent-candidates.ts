import { useAllSearchResults } from "@/hooks/use-all-search-results"
import type { SearchResultItem } from "@/types/search-results"

const JOBS_TO_SCAN = 5
const CANDIDATES_TO_SHOW = 5

export interface RecentCandidate extends SearchResultItem {
  jobId: number
}

export function useRecentCandidates() {
  const { jobResults, isPending, isError, error } = useAllSearchResults(JOBS_TO_SCAN)

  const candidates: RecentCandidate[] = jobResults
    .flatMap((jobResult) =>
      jobResult.results.map((result) => ({
        ...result,
        jobId: jobResult.job_id,
      }))
    )
    .sort((a, b) => (b.ranking_score ?? 0) - (a.ranking_score ?? 0))
    .slice(0, CANDIDATES_TO_SHOW)

  return {
    data: candidates,
    isPending,
    isError,
    error,
  }
}
