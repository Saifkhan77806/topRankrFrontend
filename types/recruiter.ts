export interface SearchJob {
  id: number
  status: string
  progress: number
  current_step: string
  created_at: string
}

export interface CandidateResult {
  rank: number
  candidate_id: number
  name: string | null
  email: string | null
  resume_path: string
  semantic_score: number | null
  ranking_score: number | null
  ai_reason: string | null
  explanation: Record<string, unknown> | null
}

export interface JobResultsResponse {
  job_id: number
  status: string
  progress: number
  results: CandidateResult[]
}

export interface FeedbackStats {
  shortlisted: number
  rejected: number
  interviewed: number
  hired: number
}
