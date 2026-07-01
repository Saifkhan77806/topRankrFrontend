import { apiClient, ApiError } from "@/lib/api-client"
import type { CompareRequest, ComparisonResponse } from "@/types/comparison"

export class RateLimitError extends ApiError {
  constructor(message: string) {
    super(message, 429)
    this.name = "RateLimitError"
  }
}

export const comparisonService = {
  compareCandidates: async (payload: CompareRequest): Promise<ComparisonResponse> => {
    try {
      return await apiClient.post<ComparisonResponse>("/recruiter/compare", payload, {
        auth: true,
      })
    } catch (error) {
      if (error instanceof ApiError && error.status === 429) {
        throw new RateLimitError(
          "Too many comparisons — please wait a moment and try again."
        )
      }
      throw error
    }
  },
}
