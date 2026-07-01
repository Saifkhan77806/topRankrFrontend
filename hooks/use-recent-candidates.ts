import { useQueries } from "@tanstack/react-query"
import { recruiterService } from "@/services/recruiter/recruiter-service"
import { useAuthStore } from "@/store/auth-store"
import { useJobs } from "@/hooks/use-jobs"
import type { CandidateResult } from "@/types/recruiter"

const JOBS_TO_SCAN = 5
const CANDIDATES_TO_SHOW = 5

export interface RecentCandidate extends CandidateResult {
  jobId: number
}

export function useRecentCandidates() {
  const token = useAuthStore((state) => state.token)
  const jobsQuery = useJobs()

  const completedJobIds = (jobsQuery.data ?? [])
    .filter((job) => job.status === "completed")
    .slice(0, JOBS_TO_SCAN)
    .map((job) => job.id)

  const resultsQueries = useQueries({
    queries: completedJobIds.map((jobId) => ({
      queryKey: ["recruiter", "job-results", jobId],
      queryFn: () => recruiterService.getJobResults(jobId),
      enabled: !!token && !!jobId,
    })),
  })

  const isLoading =
    jobsQuery.isPending || (completedJobIds.length > 0 && resultsQueries.some((q) => q.isPending))
  const isError = jobsQuery.isError || resultsQueries.some((q) => q.isError)
  const error = jobsQuery.error ?? resultsQueries.find((q) => q.error)?.error ?? null

  const candidates: RecentCandidate[] = resultsQueries
    .flatMap((q) =>
      (q.data?.results ?? []).map((result) => ({
        ...result,
        jobId: q.data!.job_id,
      }))
    )
    .sort((a, b) => (b.ranking_score ?? 0) - (a.ranking_score ?? 0))
    .slice(0, CANDIDATES_TO_SHOW)

  return {
    data: candidates,
    isPending: isLoading,
    isError,
    error,
  }
}
