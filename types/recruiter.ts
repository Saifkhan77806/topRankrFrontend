export interface SearchJob {
  id: number
  status: string
  progress: number
  current_step: string
  created_at: string
}

export interface FeedbackStats {
  shortlisted: number
  rejected: number
  interviewed: number
  hired: number
}
