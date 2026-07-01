import { apiClient } from "@/lib/api-client"
import type { SearchResultsResponse } from "@/types/search-results"

export const resultsService = {
  getResults: (jobId: number) =>
    apiClient.get<SearchResultsResponse>(`/recruiter/search/${jobId}/results`, {
      auth: true,
    }),
}
