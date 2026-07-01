import { apiClient } from "@/lib/api-client"
import type {
  FeedbackStats,
  JobResultsResponse,
  SearchJob,
} from "@/types/recruiter"

export const recruiterService = {
  getJobs: () => apiClient.get<SearchJob[]>("/recruiter/jobs", { auth: true }),

  getJobResults: (jobId: number) =>
    apiClient.get<JobResultsResponse>(`/recruiter/search/${jobId}/results`, {
      auth: true,
    }),

  getFeedbackStats: () =>
    apiClient.get<FeedbackStats>("/recruiter/feedback/stats", { auth: true }),
}
