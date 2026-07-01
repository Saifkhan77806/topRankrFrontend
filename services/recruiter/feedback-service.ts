import { apiClient, ApiError } from "@/lib/api-client"
import type { FeedbackRequest, FeedbackResponse } from "@/types/feedback"

export class RateLimitError extends ApiError {
  constructor(message: string) {
    super(message, 429)
    this.name = "RateLimitError"
  }
}

export const feedbackService = {
  submitFeedback: async (payload: FeedbackRequest): Promise<FeedbackResponse> => {
    try {
      return await apiClient.post<FeedbackResponse>("/recruiter/feedback", payload, {
        auth: true,
      })
    } catch (error) {
      if (error instanceof ApiError && error.status === 429) {
        throw new RateLimitError(
          "You've submitted too much feedback recently. Please try again later."
        )
      }
      throw error
    }
  },
}
