import { useQueries } from "@tanstack/react-query"
import { recruiterService } from "@/services/recruiter/recruiter-service"
import { useAuthStore } from "@/store/auth-store"
import { useJobs } from "@/hooks/use-jobs"

const DEFAULT_JOBS_TO_SCAN = 5

export function useAllSearchResults(jobsToScan = DEFAULT_JOBS_TO_SCAN) {
  const token = useAuthStore((state) => state.token)
  const jobsQuery = useJobs()

  const completedJobIds = (jobsQuery.data ?? [])
    .filter((job) => job.status === "completed")
    .slice(0, jobsToScan)
    .map((job) => job.id)

  const resultsQueries = useQueries({
    queries: completedJobIds.map((jobId) => ({
      queryKey: ["recruiter", "job-results", jobId],
      queryFn: () => recruiterService.getJobResults(jobId),
      enabled: !!token && !!jobId,
    })),
  })

  const isPending =
    jobsQuery.isPending || (completedJobIds.length > 0 && resultsQueries.some((q) => q.isPending))
  const isError = jobsQuery.isError || resultsQueries.some((q) => q.isError)
  const error = jobsQuery.error ?? resultsQueries.find((q) => q.error)?.error ?? null

  return {
    jobResults: resultsQueries.map((q) => q.data).filter((data) => !!data),
    isPending,
    isError,
    error,
    hasCompletedJobs: completedJobIds.length > 0,
  }
}
