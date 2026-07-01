export type FeedbackType = "shortlisted" | "rejected" | "interviewed" | "hired"

export interface FeedbackRequest {
  job_id: number
  candidate_id: number
  feedback: FeedbackType
}

export interface FeedbackResponse {
  success: true
  message: string
  feedback_id: number
}
