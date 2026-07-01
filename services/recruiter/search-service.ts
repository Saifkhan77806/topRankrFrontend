import { apiClient, ApiError } from "@/lib/api-client"
import type { SearchRequest, SearchSubmitResponse } from "@/types/search"

export class RateLimitError extends ApiError {
  constructor(message: string) {
    super(message, 429)
    this.name = "RateLimitError"
  }
}

export const searchService = {
  submitSearch: async (data: SearchRequest): Promise<SearchSubmitResponse> => {
    try {
      return await apiClient.post<SearchSubmitResponse>("/recruiter/search", data, {
        auth: true,
      })
    } catch (error) {
      if (error instanceof ApiError && error.status === 429) {
        throw new RateLimitError(
          "You're searching too fast. Please wait a moment and try again."
        )
      }
      throw error
    }
  },
}
