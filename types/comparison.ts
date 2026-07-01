export interface CompareRequest {
  job_id: number
  candidate_ids: number[]
}

export interface ComparisonCandidate {
  candidate_id: number
  name: string
  experience: number
  industry: string
  seniority: string
  skills: string[]
  leadership: string[]
  semantic_score: number
  ranking_score: number
  ai_reason: string
}

export interface ComparisonWinner {
  winner: number
  reason: string
}

export interface ComparisonResponse {
  job_id: number
  comparison: ComparisonCandidate[]
  winner: ComparisonWinner
}
