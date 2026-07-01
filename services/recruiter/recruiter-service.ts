import { apiClient } from "@/lib/api-client"
import type { FeedbackStats, SearchJob } from "@/types/recruiter"
import type { SearchResultsResponse } from "@/types/search-results"

export const recruiterService = {
  getJobs: () => apiClient.get<SearchJob[]>("/recruiter/jobs", { auth: true }),

  getJobResults: (jobId: number) =>
    apiClient.get<SearchResultsResponse>(`/recruiter/search/${jobId}/results`, {
      auth: true,
    }),

  getFeedbackStats: () =>
    apiClient.get<FeedbackStats>("/recruiter/feedback/stats", { auth: true }),
}
