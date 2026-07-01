export interface CandidateExplanation {
  candidate_id: number
  score: number
  reasons: string[]
}

export interface SearchResultItem {
  rank: number
  candidate_id: number
  name: string | null
  email: string | null
  resume_path: string
  semantic_score: number | null
  ranking_score: number | null
  ai_reason: string | null
  explanation: CandidateExplanation | null
  recommendation: string | null
}

export interface SearchResultsResponse {
  job_id: number
  status: string
  progress: number
  results: SearchResultItem[]
}
